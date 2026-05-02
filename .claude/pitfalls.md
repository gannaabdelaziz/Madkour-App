# Pitfalls, Hard-Won Lessons & Deferred Features

---

## Known Pitfalls

### 1. Row 3 Circular Reference — Deferred SUM Write

**Problem:** Row 3 holds column-total SUM formulas. Writing them with a hardcoded large range (e.g., `SUM(C5:C500)`) before data rows exist causes Excel to flag circular references, and the range is wrong anyway.

**Rule:** Always defer Row 3 formula writes until after all data rows are written. Use the actual last row number:

```javascript
// After all data rows are written and lastDataRow is known:
ws[`C3`] = { t: 'n', f: `=SUM(C5:C${lastDataRow})` };
```

---

### 2. Parent Row Inclusion — Category Mapping Bug

**Problem:** Budget rows include parent/grouping rows with `Budget Category = '#'`. If included in processing, they get incorrectly mapped to a group (often the first group) and double-count values.

**Rule:** Filter `budgetCat !== '#'` at the point of reading the Budget file, before any group mapping or value accumulation. See `.claude/input-files.md`.

---

### 3. JSZip Is Blocked — Do Not Use

**Problem:** JSZip is needed for raw OpenXML manipulation (e.g., chart injection). It was tried via CDN and as an inline bundle. Both failed on Ganna's network security.

**Rule:** Do not use JSZip for any purpose. Do not reintroduce it. If a feature requires JSZip, it stays deferred until a network-safe alternative is found.

---

### 4. Cross-Sheet Formula — Missing Single Quotes

**Problem:** Excel formulas referencing sheets with spaces in their names crash on open if the sheet name isn't wrapped in single quotes.

**Rule:**
```javascript
// Correct
{ f: "'USD Cash In'!C15" }

// Wrong
{ f: "USD Cash In!C15" }
```

Always wrap sheet names in single quotes inside formula strings, regardless of whether you think it's needed.

---

### 5. Intra-Group Blank Rows — Must Not Exist

**Problem:** Earlier versions added blank separator rows between budget items within a Cash Out group for visual spacing. These were removed after comparison with ND10.

**Rule:** No blank rows between items within a group. The EUR sheet compact layout is the visual standard. If blank rows appear, they are a bug.

---

### 6. Empty Groups Must Still Render

**Problem:** Tempting to skip a Cash Out group if it has no data for that currency. This breaks layout consistency across sheets.

**Rule:** All six Cash Out groups always render on every currency sheet. Empty groups show their header row and a zero total row. Never skip or hide a group.

---

### 7. xlsx-js-style vs plain xlsx

**Problem:** Using `XLSX.write()` without `cellStyles: true` drops all styling silently — no error, just unstyled output.

**Rule:** Always pass `cellStyles: true` in the write options:
```javascript
XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
```

---

## Deferred Features

### S-Curve Charts

Each Cashflow sheet should display an S-curve chart of cumulative Cash In vs cumulative Cash Out over the project timeline. This is a visible gap vs the ND10 reference.

**Why deferred:** Requires either JSZip (blocked) or an image-based approach.

**Recommended path when implementing:**
1. Use the browser's Canvas API to render the chart as a PNG
2. Convert to base64
3. Embed as an image in the sheet using SheetJS's image embedding API
4. This avoids JSZip entirely and should work within network constraints

Validate the Canvas → base64 → SheetJS image embed approach on Ganna's network before committing to it.
