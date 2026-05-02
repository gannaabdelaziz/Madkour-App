# Input Files

Three Excel files are uploaded by the user. All are parsed in the browser using SheetJS (`XLSX.read`).

---

## BOQ File — Cash In Source

Drives the Cash In section of each currency sheet.

### Structure
- Hierarchical breakdown of contract income items
- **4-level hierarchy:** Trade → BOQ Category → Sub-category → Task
- Each Task row has milestone columns (milestone name + % split)
- Currency is embedded in the data and detected dynamically

### Parsing Rules
- Detect hierarchy level by indent depth or dedicated level column (varies by project — inspect actual file structure before assuming)
- **Only leaf-level Task rows** produce data rows in the output
- Milestone columns are identified by their header names; values are percentages
- Rows with no value in the amount column are skipped

---

## Budget File — Cash Out Source

Drives the Cash Out section of each currency sheet.

### Structure
- Budget line items organized by category
- Each row: item description, budget category, currency, period values

### Parent vs Child Rows — CRITICAL

| Row type | Budget Category value | Action |
|---|---|---|
| Parent (grouping header) | `'#'` | **Skip — exclude from all data processing** |
| Child (data row) | Actual category string | Include |

**Always filter:** `budgetCat !== '#'` before any processing. Parent rows have no meaningful category and will be incorrectly mapped if included. This is the single most common source of grouping bugs.

### Budget Category → Cash Out Group Mapping

| Budget Category | Cash Out Group |
|---|---|
| MATERIAL | Material Supply |
| S/C | S/C |
| SERVICES | SERVICES-EQ-LABOUR |
| EQ | SERVICES-EQ-LABOUR |
| LABOUR | SERVICES-EQ-LABOUR |
| INDIRECT COST | INDIRECT COST |
| PROJECT OVERHEADS | PROJECT OVERHEADS |
| RISKS & CONTINGENCIES | RISKS & CONTINGENCIES |

---

## Assumptions / PS3 File — Payment Terms & Special Values

### Payment Terms
- Start at cell **B45**
- Organized by currency × budget category combination
- Each combination maps to a payment lag (in months/periods)
- Used to determine which period a payment falls in relative to the work period

### Exchange Rates
- Stored in a defined location in the sheet (verify exact cells against ND10 reference)
- Applied on the Summary and EQU sheets

### Special Section Values
Extracted for three special Cash Out sections:

| Section | Currency scope | Notes |
|---|---|---|
| Indirect Cost | EGP only | Line-item breakdown — multiple rows |
| Project Overheads | Per currency | Single lump value per currency |
| Risks & Contingencies | Per currency | Single lump value per currency |

### Parsing Approach
Use a **state machine**: scan rows top to bottom, detect known section header strings, then extract the cells that follow. Do not rely on fixed row numbers — the sheet structure uses labeled sections whose row positions may vary between projects.
