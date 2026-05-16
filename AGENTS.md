# AGENTS.md — Cashflow Workbook Generator

## What This Project Is

A single-file HTML web app that accepts three uploaded Excel files and generates a multi-tab Excel cashflow workbook. Built for Ganna, a Cost Control Engineer at Maddkour, to automate workbooks she previously built manually per project.

**The non-negotiable standard:** Every sheet name, row grouping, formula, column width, color, and font must exactly replicate the **ND10 Substation Cash Flow Baseline** reference workbook. Approximations are rejected. When in doubt, check `/reference/ND10_Baseline.xlsx`.

**Current version:** v2.7

---

## Working Style — Read This First

- **Confirm before implementing.** State your understanding of a requested change before writing any code. Wait for confirmation.
- **One issue per iteration.** Fix one confirmed problem at a time unless explicitly grouped.
- **Diagnose before fixing.** Explain root cause, show relevant code, propose fix — then implement after confirmation.
- **Deliver complete files.** Each version is a full self-contained HTML file. No build steps, no npm.

---

## Spec Files

Detailed logic and rules live in `.Codex/`. Read the relevant file before touching that area of the code.

| File | When to read it |
|---|---|
| `.Codex/architecture.md` | Tool structure, CDN constraints, library usage |
| `.Codex/input-files.md` | Parsing BOQ, Budget, Assumptions input files |
| `.Codex/cash-in-logic.md` | Cash In hierarchy, BETA.DIST distribution, column layout |
| `.Codex/cash-out-logic.md` | Cash Out groups, milestone sub-rows, special sections |
| `.Codex/output-structure.md` | Sheet list, Cashflow sheets, Summary, EQU |
| `.Codex/styling.md` | Colors, fonts, borders, number formats |
| `.Codex/pitfalls.md` | Known bugs, hard-won lessons, deferred features |

---

## Quick-Reference Constants

```javascript
// Only CDN confirmed to work on Ganna's network
const SHEETJS_CDN = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';

// Cash Out groups — always all six, always this order
const CASH_OUT_GROUPS = [
  'Material Supply',
  'S/C',
  'SERVICES-EQ-LABOUR',
  'INDIRECT COST',
  'PROJECT OVERHEADS',
  'RISKS & CONTINGENCIES'
];

// Budget category → group mapping
const CATEGORY_TO_GROUP = {
  'MATERIAL':              'Material Supply',
  'S/C':                   'S/C',
  'SERVICES':              'SERVICES-EQ-LABOUR',
  'EQ':                    'SERVICES-EQ-LABOUR',
  'LABOUR':                'SERVICES-EQ-LABOUR',
  'INDIRECT COST':         'INDIRECT COST',
  'PROJECT OVERHEADS':     'PROJECT OVERHEADS',
  'RISKS & CONTINGENCIES': 'RISKS & CONTINGENCIES'
};

const PARENT_ROW_SENTINEL = '#';      // Budget rows with this category are headers — exclude from data
const PAYMENT_TERMS_START  = 'B45';   // Assumptions sheet: payment terms start here
const CURRENCIES           = ['USD', 'EGP', 'EUR'];
const FONT_NAME            = 'Century Gothic';
```

---

## Repo Structure

```
/
├── AGENTS.md
├── index.html                 ← the tool (single-file HTML app)
├── reference/
│   └── ND10_Baseline.xlsx     ← authoritative reference workbook
└── .Codex/
    ├── architecture.md
    ├── input-files.md
    ├── cash-in-logic.md
    ├── cash-out-logic.md
    ├── output-structure.md
    ├── styling.md
    └── pitfalls.md
```
