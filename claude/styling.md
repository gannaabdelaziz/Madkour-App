# Styling

**Primary reference:** Always verify against `/reference/ND10_Baseline.xlsx`. The values below reflect the best known state — the file is authoritative over this document.

---

## Colors

| Element | Hex | Used on |
|---|---|---|
| Dark charcoal | `#404040` | Group headers, sheet-level headers |
| Mid-gray | `#808080` | Group total rows, section totals |
| Blue | `#1F4E79` | Summary sheet headers |
| Gold | `#C9A84C` | Net cashflow rows, cumulative rows |
| White text | `#FFFFFF` | Text on dark/blue/gold backgrounds |
| Black text | `#000000` | Standard body rows |

Verify these hex values against ND10 — extract fill colors directly from reference cells if any value looks off.

---

## Fonts

- **Font family:** Century Gothic — applied to every cell in every sheet
- **Header rows:** Bold, Century Gothic
- **Data rows:** Regular weight, Century Gothic
- **Size:** 10pt for data rows; 11–12pt for major sheet headers (match ND10)

If Century Gothic is unavailable on the user's machine, Excel falls back to a substitute. This is expected behavior — do not try to embed the font.

---

## Number Formatting

| Content | Format string |
|---|---|
| Financial values | `#,##0` — whole numbers, thousands separator, no decimals |
| Percentages | `0%` or `0.0%` — match ND10 for each context |
| Zero values | Display as `0`, not blank (unless ND10 shows blank — check reference) |

Apply via the cell's `numFmt` style property, not by pre-formatting the value string.

---

## Column Widths

Set via `ws['!cols']` as an array of `{ wch: N }` objects (character width units).

| Column | Approx width | Notes |
|---|---|---|
| A (description) | 45–50 wch | Wide enough for longest item names |
| B (code/ref) | 12–15 wch | |
| Period columns | 10–12 wch | Uniform; sized to fit `#,##0` 5-digit numbers |
| Total column | 14–16 wch | Slightly wider than period columns |

Match ND10 exactly — measure from the reference file if in doubt.

---

## Row Heights

Set via `ws['!rows']` as an array of `{ hpt: N }` objects (height in points).

- Standard data rows: match ND10 (typically 15–18pt)
- Header rows: slightly taller (match ND10)
- Do not leave row heights unset for header rows — Excel default height is too short for the bold Century Gothic headers

---

## Borders

- Thin borders (`style: 'thin'`) on all data cells
- Medium or thick borders (`style: 'medium'`) on group total rows bottom edge
- Column A description cells: check ND10 — some row types have no left border

---

## Cell Merges

Header rows in column A typically merge across the full width of the sheet (column A through last period column + total columns). Use `ws['!merges']` with `{ s: { r, c }, e: { r, c } }` objects (zero-indexed).

---

## Tab Colors

Set on each worksheet object before appending to workbook:

```javascript
ws['!tabColor'] = { rgb: 'RRGGBB' }; // no # prefix
```

Exact colors per tab — check ND10 reference file.
