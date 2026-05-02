# Cash In Logic

## Row Hierarchy

Each currency Cash In sheet renders the full BOQ hierarchy:

```
Trade                               ← bold, dark charcoal header row
  BOQ Category                      ← sub-header row
    Sub-category                    ← sub-header row
      Task                          ← data row (period values here)
        Milestone 1 sub-row         ← indented under task
        Milestone 2 sub-row
        ...
    Sub-category Total
  BOQ Category Total
Trade Total
─────────────────────────────────
Grand Total Cash In                 ← gold/highlighted, full-width
Cumulative Cash In                  ← gold/highlighted, running sum
```

Only **leaf-level Task rows** carry actual values. Intermediate levels (Trade, BOQ Category, Sub-category) show SUM formulas referencing the rows below them.

---

## Column Layout

| Column | Content |
|---|---|
| A | Item description / hierarchy label |
| B | Item code or BOQ reference number |
| C → N (or further) | Period columns — one per month, headers show Mon-YY |
| Second-to-last | Row Total |
| Last | Cumulative Total |

Period column count is dynamic — derived from the project timeline in the input files.

---

## Payment Distribution — BETA.DIST

Payments are **not spread uniformly**. They follow a beta distribution curve, producing an S-curve payment profile across periods.

Each milestone payment is distributed using Excel's `BETA.DIST` function:

```
=BETA.DIST(x, alpha, beta, TRUE)
```

Where:
- `x` = period position as a fraction of the total timeline (0 to 1)
- `alpha`, `beta` = shape parameters derived from milestone characteristics
- `TRUE` = cumulative distribution

The **difference** between consecutive cumulative values gives the payment in each period.

### Implementation Note
These are written as **Excel formula strings** in the cell's `f` property — not pre-calculated values. Excel evaluates them when the file is opened. This is intentional: it keeps the workbook live and recalculable.

```javascript
// Correct — written as formula
ws[cellAddr] = { t: 'n', f: `=BETA.DIST(${x},${alpha},${beta},TRUE)` };

// Wrong — pre-calculated, loses recalculability
ws[cellAddr] = { v: preCalculatedValue, t: 'n' };
```

---

## Row 3 — Column Totals (Deferred Write)

Row 3 contains SUM formulas that total each period column across all data rows. 

**CRITICAL:** Do not write Row 3 formulas until after all data rows have been written. The actual last row number must be known before writing the range.

```javascript
// Wrong — hardcoded large range, causes circular reference issues
ws['C3'] = { t: 'n', f: '=SUM(C5:C500)' };

// Correct — use actual last row, written after all data rows are done
ws['C3'] = { t: 'n', f: `=SUM(C5:C${lastDataRow})` };
```
