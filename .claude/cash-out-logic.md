# Cash Out Logic

## The Six Groups

All currency Cash Out sheets always display **exactly these six groups, in this exact order**, regardless of whether that currency has data in each group:

1. Material Supply
2. S/C
3. SERVICES-EQ-LABOUR
4. INDIRECT COST
5. PROJECT OVERHEADS
6. RISKS & CONTINGENCIES

**Empty groups are never hidden or skipped.** A group with no items still renders its header row and a zero total row. This ensures consistent layout across all currency sheets.

---

## Row Structure per Group

```
Group Header row                    ← dark charcoal bg, white text, bold
  Budget Item description           ← data row
    Milestone sub-row 1             ← indented, shows period payment
    Milestone sub-row 2
    ...
  Budget Item 2
    Milestone sub-row 1
    ...
Group Total row                     ← mid-gray bg, SUM of all items above
```

**No blank separator rows between items within a group.** The EUR sheet compact layout is the visual standard — compact, no intra-group gaps. Earlier versions had these blank rows; they were removed and must not return.

---

## Milestone Sub-rows

Each budget item splits into milestone sub-rows. Each sub-row = one payment event.

- Milestone names and % splits come from the Assumptions file (B45 onward)
- Mapped by **currency × budget category** combination
- The payment period for each milestone is offset from the work period by the payment lag from Assumptions

A budget item with 3 milestones generates 3 sub-rows beneath it. The item row itself shows a total/label; the sub-rows carry the period values.

---

## Special Sections

### INDIRECT COST — EGP Only

- On the **EGP Cash Out sheet**: shows a full line-item breakdown (multiple rows, one per indirect cost line from Assumptions)
- On **USD and EUR Cash Out sheets**: shows a single aggregated Indirect Cost row (no line-item detail)
- Values sourced from the Assumptions sheet special section

### PROJECT OVERHEADS

- Single lump value per currency, sourced from Assumptions
- No milestone sub-rows
- Appears in all currency sheets

### RISKS & CONTINGENCIES

- Same treatment as Project Overheads — single lump value per currency from Assumptions
- Appears in all currency sheets

---

## Budget Category → Group Mapping

See `.claude/input-files.md` for the full mapping table. Key rule: always use **child rows only** (`budgetCat !== '#'`). Parent rows must be excluded before group mapping — they carry `'#'` as their category value and have no valid mapping.
