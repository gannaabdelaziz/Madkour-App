# Output Workbook Structure

## Sheet List

Sheets appear in this exact order:

| # | Sheet Name | Purpose |
|---|---|---|
| 1 | Summary | High-level cashflow summary across all currencies |
| 2 | USD Cash In | USD income by BOQ hierarchy |
| 3 | USD Cash Out | USD expenditure by budget group |
| 4 | USD Cashflow | USD net cashflow |
| 5 | EGP Cash In | EGP income |
| 6 | EGP Cash Out | EGP expenditure |
| 7 | EGP Cashflow | EGP net cashflow |
| 8 | EUR Cash In | EUR income |
| 9 | EUR Cash Out | EUR expenditure |
| 10 | EUR Cashflow | EUR net cashflow |
| 11 | EQU | Equivalent/consolidated view (all currencies in USD equivalent) |

**All sheets are always generated.** Currency detection is dynamic from input files, but even if EUR has no data, EUR sheets are still present (empty with correct structure).

Tab colors must match ND10 reference exactly — check `/reference/ND10_Baseline.xlsx`.

---

## Cashflow Sheets (per currency)

Each `{CCY} Cashflow` sheet contains:

| Row | Content | Style |
|---|---|---|
| Cash In | Period values referencing `{CCY} Cash In` sheet | Standard |
| Cash Out | Period values referencing `{CCY} Cash Out` sheet | Standard |
| Net Cashflow | Cash In minus Cash Out per period | Gold highlight |
| Cumulative Net | Running sum of Net Cashflow | Gold highlight |

All values are **cross-sheet Excel formulas**, not pre-calculated:

```javascript
// Example — USD Cashflow sheet referencing USD Cash In
{ t: 'n', f: "'USD Cash In'!C{grandTotalRow}" }
```

Always wrap sheet names containing spaces in single quotes inside formula strings.

---

## Summary Sheet

- Aggregates all three currencies
- Shows exchange rates (from Assumptions file)
- Converts EGP and EUR values to USD equivalent
- Grand total rows across all currencies
- All values via cross-sheet formulas referencing the three Cashflow sheets
- **Styling:** Blue header background (`#1F4E79`), white text — distinct from the currency sheets

---

## EQU Sheet

- Consolidated equivalent view
- Shows all currency streams converted to a common base (USD)
- Structure mirrors the Cashflow sheets but combines all currencies
- Verify exact layout against ND10 reference
