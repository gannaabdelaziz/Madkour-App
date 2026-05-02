# Architecture

## Tool Structure

Single-file HTML web application. Everything — HTML, CSS, JavaScript — lives in `index.html`. No build step, no framework, no npm. The user opens it in a browser, uploads files, clicks generate, and downloads the Excel output.

**Do not split into multiple files or introduce a build pipeline.** The single-file constraint is intentional — it makes the tool portable and requires no installation.

---

## Libraries

### SheetJS / xlsx-js-style (REQUIRED)

```html
<script src="https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js"></script>
```

This is the **only external library** in use. It handles all Excel workbook generation including cell styles, formulas, merges, column widths, and row heights.

Use `xlsx-js-style` (not plain `xlsx`) — it extends SheetJS with cell-level styling support via the `s` property on cell objects.

### Network Constraints — CRITICAL

Ganna's workplace runs strict content filtering. **Only the jsdelivr CDN above is confirmed to work.** All other CDNs have been untested or blocked.

**JSZip is blocked entirely** — both CDN and inline-bundled versions were tried and failed. Do not use JSZip for any purpose. Do not reintroduce it.

Before adding any new external dependency, ask Ganna to confirm it loads on her network. When in doubt, inline the library source or avoid it altogether.

---

## Excel Generation Pattern

```javascript
// 1. Create workbook
const wb = XLSX.utils.book_new();

// 2. Build each sheet as an array of arrays, then convert
const ws = XLSX.utils.aoa_to_sheet(data);

// 3. Apply cell styles directly on the sheet object
ws['C5'] = { v: 12345, t: 'n', s: { font: { name: 'Century Gothic', sz: 10 }, numFmt: '#,##0' } };

// 4. Set column widths
ws['!cols'] = [{ wch: 45 }, { wch: 12 }, ...];

// 5. Set row heights
ws['!rows'] = [{ hpt: 20 }, ...];

// 6. Merge cells
ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

// 7. Append sheet
XLSX.utils.book_append_sheet(wb, ws, 'Sheet Name');

// 8. Write and trigger download
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
const blob = new Blob([wbout], { type: 'application/octet-stream' });
```

### Cell Object Format

```javascript
{
  v: 12345,            // raw value (number, string)
  t: 'n',              // type: 'n'=number, 's'=string, 'b'=boolean
  f: '=SUM(C5:C20)',   // formula string — omit v when using f
  s: {
    font: {
      name: 'Century Gothic',
      sz: 10,
      bold: true,
      color: { rgb: 'FFFFFF' }
    },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: '404040' }
    },
    alignment: {
      horizontal: 'right',   // 'left', 'center', 'right'
      vertical: 'center',
      wrapText: false
    },
    border: {
      top:    { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left:   { style: 'thin', color: { rgb: '000000' } },
      right:  { style: 'thin', color: { rgb: '000000' } }
    },
    numFmt: '#,##0'
  }
}
```

### Cross-Sheet Formula Syntax

Sheet names with spaces must be wrapped in single quotes inside formula strings:

```javascript
// Correct
{ f: "'USD Cash In'!C15" }

// Wrong — Excel errors on open
{ f: "USD Cash In!C15" }
```
