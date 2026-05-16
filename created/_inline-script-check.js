
// ============================================================
// FILE HANDLING
// ============================================================
const data = { boq: null, budget: null, assumptions: null };
const ISO_CURRENCIES = [
  'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BOV','BRL','BSD','BTN','BWP','BYN','BZD',
  'CAD','CDF','CHE','CHF','CHW','CLF','CLP','CNY','COP','COU','CRC','CUC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','FKP',
  'GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF',
  'KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRU','MUR','MVR','MWK','MXN','MXV','MYR',
  'MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK',
  'SGD','SHP','SLE','SLL','SOS','SRD','SSP','STN','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','USN','UYI',
  'UYU','UYW','UZS','VED','VES','VND','VUV','WST','XAF','XAG','XAU','XBA','XBB','XBC','XBD','XCD','XDR','XOF','XPD','XPF','XPT','XSU','XTS','XUA','XXX',
  'YER','ZAR','ZMW','ZWG'
];
const selectedTemplateCurrencies = ['USD', 'EGP', 'EUR'];

function initializeCurrencySelector() {
  const options = document.getElementById('currencyOptions');
  if (options) {
    options.innerHTML = ISO_CURRENCIES.map(cur => '<option value="' + cur + '"></option>').join('');
  }
  renderCurrencyChips();
}

function getTemplateCurrencies() {
  return sortCurrencies(selectedTemplateCurrencies);
}

function handleCurrencyKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addCurrencyFromInput();
  }
}

function addCurrencyFromInput() {
  const input = document.getElementById('currencyInput');
  const cur = normalizeCurrency(input && input.value);
  if (!cur || !ISO_CURRENCIES.includes(cur)) {
    if (input) input.value = '';
    return;
  }
  if (!selectedTemplateCurrencies.includes(cur)) selectedTemplateCurrencies.push(cur);
  if (input) input.value = '';
  renderCurrencyChips();
}

function removeTemplateCurrency(cur) {
  if (cur === 'EGP') return;
  const idx = selectedTemplateCurrencies.indexOf(cur);
  if (idx >= 0) selectedTemplateCurrencies.splice(idx, 1);
  renderCurrencyChips();
}

function renderCurrencyChips() {
  const el = document.getElementById('currencyChips');
  if (!el) return;
  el.innerHTML = getTemplateCurrencies().map(cur => {
    const fixed = cur === 'EGP';
    return '<span class="currency-chip ' + (fixed ? 'fixed' : '') + '">' + cur + (fixed ? '' : '<button type="button" aria-label="Remove ' + cur + '" onclick="removeTemplateCurrency(\\'' + cur + '\\')">x</button>') + '</span>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', initializeCurrencySelector);

function handleFile(input, type) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    data[type] = XLSX.read(e.target.result, { type: 'array', cellDates: true });
    const card = input.parentElement;
    card.classList.add('loaded');
    card.querySelector('.status').textContent = file.name;
    checkReady();
  };
  reader.readAsArrayBuffer(file);
}

function checkReady() {
  document.getElementById('generateBtn').disabled = !(data.boq && data.budget && data.assumptions);
}

// ============================================================
// DOWNLOADABLE INPUT TEMPLATES
// ============================================================
const TEMPLATE_STYLE = {
  title: { font:{bold:true,sz:16,name:'Century Gothic',color:{rgb:'0A1F44'}}, fill:{fgColor:{rgb:'DDEBF7'}}, alignment:{horizontal:'center',vertical:'center'}, border:{bottom:{style:'thin',color:{rgb:'A6A6A6'}}} },
  note: { font:{italic:true,sz:10,name:'Century Gothic',color:{rgb:'4A5678'}}, fill:{fgColor:{rgb:'F6F6FB'}}, alignment:{wrapText:true,vertical:'top'} },
  header: { font:{bold:true,sz:10,name:'Century Gothic',color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'0A1F44'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:{top:{style:'thin',color:{rgb:'A6A6A6'}},bottom:{style:'thin',color:{rgb:'A6A6A6'}},left:{style:'thin',color:{rgb:'A6A6A6'}},right:{style:'thin',color:{rgb:'A6A6A6'}}} },
  section: { font:{bold:true,sz:11,name:'Century Gothic',color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1E3FE5'}}, alignment:{vertical:'center'}, border:{top:{style:'thin',color:{rgb:'A6A6A6'}},bottom:{style:'thin',color:{rgb:'A6A6A6'}},left:{style:'thin',color:{rgb:'A6A6A6'}},right:{style:'thin',color:{rgb:'A6A6A6'}}} },
  data: { font:{sz:10,name:'Century Gothic',color:{rgb:'000000'}}, border:{top:{style:'thin',color:{rgb:'D9D9D9'}},bottom:{style:'thin',color:{rgb:'D9D9D9'}},left:{style:'thin',color:{rgb:'D9D9D9'}},right:{style:'thin',color:{rgb:'D9D9D9'}}} },
  example: { font:{sz:10,name:'Century Gothic',color:{rgb:'000000'}}, fill:{fgColor:{rgb:'FFF2CC'}}, border:{top:{style:'thin',color:{rgb:'D9D9D9'}},bottom:{style:'thin',color:{rgb:'D9D9D9'}},left:{style:'thin',color:{rgb:'D9D9D9'}},right:{style:'thin',color:{rgb:'D9D9D9'}}} },
  pct: { font:{sz:10,name:'Century Gothic',color:{rgb:'000000'}}, numFmt:'0%', border:{top:{style:'thin',color:{rgb:'D9D9D9'}},bottom:{style:'thin',color:{rgb:'D9D9D9'}},left:{style:'thin',color:{rgb:'D9D9D9'}},right:{style:'thin',color:{rgb:'D9D9D9'}}} },
  money: { font:{sz:10,name:'Century Gothic',color:{rgb:'000000'}}, numFmt:'#,##0', border:{top:{style:'thin',color:{rgb:'D9D9D9'}},bottom:{style:'thin',color:{rgb:'D9D9D9'}},left:{style:'thin',color:{rgb:'D9D9D9'}},right:{style:'thin',color:{rgb:'D9D9D9'}}} },
  date: { font:{sz:10,name:'Century Gothic',color:{rgb:'000000'}}, numFmt:'dd-mmm-yyyy', border:{top:{style:'thin',color:{rgb:'D9D9D9'}},bottom:{style:'thin',color:{rgb:'D9D9D9'}},left:{style:'thin',color:{rgb:'D9D9D9'}},right:{style:'thin',color:{rgb:'D9D9D9'}}} }
};

const TEMPLATE_BORDER = {
  top:{style:'thin',color:{rgb:'D9D9D9'}},
  bottom:{style:'thin',color:{rgb:'D9D9D9'}},
  left:{style:'thin',color:{rgb:'D9D9D9'}},
  right:{style:'thin',color:{rgb:'D9D9D9'}}
};
const BOQ_STYLE = {
  headerLeft: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'4472C4'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  headerCenter: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'4472C4'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  totalText: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FFFFFF'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  totalNum: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'000000'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, numFmt:'#,##0', border:TEMPLATE_BORDER },
  bandDark: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'5B9BD5'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  bandNavy: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'2F5496'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  bandLight: { font:{name:'Arial',sz:7,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'D9EAF7'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  bandLightRed: { font:{name:'Arial',sz:7,bold:true,color:{rgb:'FF0000'}}, fill:{fgColor:{rgb:'D9EAF7'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  data: { font:{name:'Arial',sz:7,color:{rgb:'000000'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  dataCenter: { font:{name:'Arial',sz:7,color:{rgb:'000000'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  money: { font:{name:'Arial',sz:7,color:{rgb:'000000'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, numFmt:'#,##0', border:TEMPLATE_BORDER }
};
const BUDGET_STYLE = {
  headerLeft: { font:{name:'Aptos Narrow',sz:11,bold:true,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'44B3D8'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  headerCenter: { font:{name:'Aptos Narrow',sz:11,bold:true,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'44B3D8'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER, numFmt:'_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)' },
  headerBlank: { font:{name:'Aptos Narrow',sz:11,bold:true,color:{rgb:'000000'}}, alignment:{horizontal:'left',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  band: { font:{name:'Aptos Narrow',sz:11,bold:true,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'44B3D8'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  parent: { font:{name:'Aptos Narrow',sz:11,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'D9D9D9'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  parentMoney: { font:{name:'Aptos Narrow',sz:11,color:{rgb:'000000'}}, fill:{fgColor:{rgb:'D9D9D9'}}, alignment:{horizontal:'right',vertical:'center'}, numFmt:'#,##0', border:TEMPLATE_BORDER },
  data: { font:{name:'Aptos Narrow',sz:11,color:{rgb:'000000'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  dataSmall: { font:{name:'Aptos Narrow',sz:10,color:{rgb:'000000'}}, alignment:{horizontal:'left',vertical:'center'}, border:TEMPLATE_BORDER },
  money: { font:{name:'Aptos Narrow',sz:11,color:{rgb:'000000'}}, alignment:{horizontal:'right',vertical:'center'}, numFmt:'#,##0', border:TEMPLATE_BORDER },
  spacer: { border:{left:{style:'thick',color:{rgb:'000000'}},right:{style:'thick',color:{rgb:'000000'}}} }
};
const ASSUMPTION_STYLE = {
  section: { font:{name:'Arial',sz:11,bold:true,color:{rgb:'2F5496'}} },
  header: { font:{name:'Arial',sz:12,bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'2F5496'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:TEMPLATE_BORDER },
  label: { font:{name:'Arial',sz:10,color:{rgb:'000000'}}, alignment:{vertical:'center'}, border:TEMPLATE_BORDER },
  subSection: { font:{name:'Arial',sz:10,bold:true,color:{rgb:'2F5496'}}, border:TEMPLATE_BORDER },
  input: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, border:TEMPLATE_BORDER },
  note: { font:{name:'Arial',sz:9,color:{rgb:'808080'}}, border:TEMPLATE_BORDER },
  pct: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'0%', border:TEMPLATE_BORDER },
  pct2: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'0.00%', border:TEMPLATE_BORDER },
  money: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'#,##0', border:TEMPLATE_BORDER },
  usd: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'[$USD] #,##0', border:TEMPLATE_BORDER },
  eur: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'[$EUR] #,##0', border:TEMPLATE_BORDER },
  egp: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'[$EGP] #,##0', border:TEMPLATE_BORDER },
  date: { font:{name:'Arial',sz:10,color:{rgb:'0000FF'}}, fill:{fgColor:{rgb:'FFF2CC'}}, alignment:{horizontal:'center',vertical:'center'}, numFmt:'[$-409]d-mmm-yyyy;@', border:TEMPLATE_BORDER }
};

function downloadTemplate(event, type) {
  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  addCurrencyFromInput();

  const builders = {
    boq: buildBOQTemplate,
    budget: buildBudgetTemplate,
    assumptions: buildAssumptionsTemplate
  };
  const built = builders[type]();
  XLSX.writeFile(built.workbook, built.filename, { cellStyles: true });
}

function putCell(ws, row, col, value, style, type) {
  const cell = { v: value, t: type || (typeof value === 'number' ? 'n' : 's') };
  if (style) cell.s = style;
  ws[XLSX.utils.encode_cell({ r: row - 1, c: col - 1 })] = cell;
}

function setRangeStyle(ws, row, startCol, endCol, style) {
  for (let col = startCol; col <= endCol; col++) {
    const addr = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 });
    if (!ws[addr]) ws[addr] = { v: '', t: 's' };
    ws[addr].s = style;
  }
}

function setTemplateCommon(ws, ref, freezePane) {
  ws['!ref'] = ref;
  if (freezePane) ws['!freeze'] = freezePane;
}

function withBudgetBorder(style, sides) {
  const copy = JSON.parse(JSON.stringify(style));
  copy.border = copy.border || {};
  sides.forEach(side => copy.border[side] = { style:'thick', color:{rgb:'000000'} });
  return copy;
}

function buildBOQTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = {};
  const currencies = getTemplateCurrencies();

  const headers = ['Trade', 'BOQ', 'Category', 'Task Number', 'Description'].concat(currencies.map(cur => 'Total Price\n(' + cur + ')'));
  headers.forEach((header, i) => putCell(ws, 4, i + 2, header, i >= 3 ? BOQ_STYLE.headerCenter : BOQ_STYLE.headerLeft));
  for (let col = 2; col <= 6; col++) putCell(ws, 5, col, '', col === 5 ? BOQ_STYLE.headerCenter : BOQ_STYLE.totalText);
  currencies.forEach((cur, idx) => putCell(ws, 5, 7 + idx, defaultTemplateAmount(cur, idx), BOQ_STYLE.totalNum));

  const rows = [
    ['Main BOQ', 'Main BOQ', '', '', '', 'bandDark'],
    ['GIS - 220KV - (Annex I)', 'GIS - 220KV - (Annex I)', '', 1, 'Lump sum price for design, fabrication, factory testing, training and site delivery of 220 kV GIS switchgear', 'bandNavy'],
    ['ELECTRICAL WORKS', 'Main BOQ', 'GIS - 220KV', '1.Main', '220 kV GIS switchgear', 'bandLight'],
    ['ELECTRICAL WORKS', 'Main BOQ', 'GIS - 220KV', 1.1, 'Supply 220 kV GIS switchgear', 'data'],
    ['CIVIL WORKS', 'Main BOQ', 'Foundations', '2.Main', 'Concrete foundations and earthing works', 'data'],
    ['MECHANICAL WORKS', 'Main BOQ', 'Fire Fighting System', '3.Main', 'Fire fighting system supply and installation', 'data']
  ];
  rows.forEach((row, rIdx) => {
    const rowType = row[5];
    const values = row.slice(0, 5).concat(currencies.map((cur, idx) => (rowType === 'data' && idx === rIdx - 3) ? defaultTemplateAmount(cur, idx) : ''));
    values.forEach((value, cIdx) => {
    let style = BOQ_STYLE.data;
    if (rowType === 'bandDark') style = cIdx >= 5 ? {...BOQ_STYLE.bandDark, numFmt:'#,##0'} : BOQ_STYLE.bandDark;
    else if (rowType === 'bandNavy') style = cIdx >= 5 ? {...BOQ_STYLE.bandNavy, numFmt:'#,##0'} : BOQ_STYLE.bandNavy;
    else if (rowType === 'bandLight') style = cIdx === 3 || cIdx === 4 ? BOQ_STYLE.bandLightRed : (cIdx >= 5 ? {...BOQ_STYLE.bandLight, numFmt:'#,##0', alignment:{horizontal:'center',vertical:'center',wrapText:true}} : BOQ_STYLE.bandLight);
    else if (cIdx === 3 || cIdx >= 5) style = cIdx >= 5 ? BOQ_STYLE.money : BOQ_STYLE.dataCenter;
    putCell(ws, rIdx + 6, cIdx + 2, value, style);
    });
  });

  ws['!cols'] = [{ wch: 2.33 }, { wch: 18.22 }, { wch: 13 }, { wch: 15.11 }, { wch: 7.89 }, { wch: 60.11 }];
  currencies.forEach((cur, idx) => { ws['!cols'][6 + idx] = { wch: 14 }; });
  ws['!rows'] = [null, null, null, { hpt: 33 }, null, { hpt: 14.4 }, { hpt: 17.4 }, { hpt: 10.8 }, { hpt: 21 }];
  const lastCol = colLetter(6 + currencies.length);
  ws['!autofilter'] = { ref:'A4:' + lastCol + '80' };
  setTemplateCommon(ws, 'A1:' + lastCol + '80');
  XLSX.utils.book_append_sheet(wb, ws, 'BOQ');
  return { workbook: wb, filename: 'BOQ_Input_Template.xlsx' };
}

function defaultTemplateAmount(cur, idx) {
  if (cur === 'USD') return 250000;
  if (cur === 'EGP') return 1800000;
  if (cur === 'EUR') return 0;
  return idx === 0 ? 250000 : 0;
}

function defaultExchangeRate(cur) {
  if (cur === 'USD') return 48.4;
  if (cur === 'EUR') return 53.0;
  if (cur === 'EGP') return 1;
  return '';
}

function buildBudgetTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = {};
  const currencies = getTemplateCurrencies();

  const headers = ['Trade ', 'BOQ', 'CATEGORY / PACKAGE', 'Parent Task', 'Task Number', 'Budget Catergory', 'Description', 'Unit ', 'Currency', '', 'Budget Amount', ''];
  headers.forEach((header, i) => {
    const col = i + 1;
    let style = (col >= 4 && col <= 6) || col === 11 ? BUDGET_STYLE.headerCenter : BUDGET_STYLE.headerLeft;
    if (col === 10 || col === 12) style = BUDGET_STYLE.headerBlank;
    if (col <= 9 || col === 11) style = withBudgetBorder(style, ['top','bottom']);
    if (col === 10 || col === 12) style = withBudgetBorder(style, ['left','right']);
    putCell(ws, 3, col, header, style);
  });
  for (let col = 1; col <= 12; col++) {
    let style = col <= 9 || col === 11 ? BUDGET_STYLE.headerBlank : BUDGET_STYLE.spacer;
    if (col === 10 || col === 12) style = withBudgetBorder(BUDGET_STYLE.headerBlank, ['left','right']);
    putCell(ws, 4, col, '', style);
  }
  for (let col = 1; col <= 12; col++) {
    let style = col <= 9 || col === 11 ? BUDGET_STYLE.band : BUDGET_STYLE.spacer;
    if (col === 10 || col === 12) style = withBudgetBorder(BUDGET_STYLE.headerBlank, ['left','right']);
    putCell(ws, 5, col, '', style);
  }

  const rows = [
    ['ELECTRICAL WORKS', 'Main BOQ', 'GIS - 220KV', '1.Main', '1.Main', '#', '220 kV GIS switchgear', 'EA', currencies[0], '', 2850000],
    ['ELECTRICAL WORKS', 'Main BOQ', 'GIS - 220KV', '1.Main', '1.Main.1', 'MATERIAL', 'Supply 220 kV GIS switchgear', 'EA', currencies[0], '', 2500000],
    ['ELECTRICAL WORKS', 'Main BOQ', 'GIS - 220KV', '1.Main', '1.Main.2', 'SERVICES', 'Custom duties and clearance', 'LS', currencies[0], '', 350000],
    ['CIVIL WORKS', 'Main BOQ', 'Foundations', '2.Main', '2.Main.1', 'S/C', 'Civil subcontractor installation works', 'LS', currencies.includes('EGP') ? 'EGP' : currencies[0], '', 1800000],
    ['PROJECT', 'Main BOQ', 'Project Controls', '3.Main', '3.Main.1', 'LABOUR', 'Planning and control labour', 'LS', currencies.includes('EGP') ? 'EGP' : currencies[0], '', 500000]
  ];
  rows.forEach((row, rIdx) => row.forEach((value, cIdx) => {
    const isParent = row[5] === '#';
    let style = isParent ? BUDGET_STYLE.parent : BUDGET_STYLE.data;
    if (cIdx === 5 && value === 'SERVICES') style = BUDGET_STYLE.dataSmall;
    if (cIdx === 10) style = isParent ? BUDGET_STYLE.parentMoney : BUDGET_STYLE.money;
    putCell(ws, rIdx + 6, cIdx + 1, value, style);
  }));
  rows.forEach((row, rIdx) => {
    const rowNum = rIdx + 6;
    putCell(ws, rowNum, 10, '', withBudgetBorder(BUDGET_STYLE.headerBlank, ['left','right']));
    putCell(ws, rowNum, 12, '', withBudgetBorder(BUDGET_STYLE.headerBlank, ['left','right']));
  });

  ws['!cols'] = [{ wch: 17.55 }, { wch: 16.33 }, { wch: 24.78 }, { wch: 9.78 }, { wch: 11.89 }, { wch: 12 }, { wch: 43.89 }, { wch: 9 }, { wch: 12.44 }, { wch: 2.55 }, { wch: 19.33 }, { wch: 2.66 }];
  ws['!rows'] = [null, null, { hpt: 54 }, { hpt: 15 }];
  ws['!autofilter'] = { ref:'A3:L100' };
  setTemplateCommon(ws, 'A1:L100');
  XLSX.utils.book_append_sheet(wb, ws, 'Break Down');
  appendCurrencyListSheet(wb, currencies);
  return { workbook: wb, filename: 'Budget_Input_Template.xlsx' };
}

function appendCurrencyListSheet(wb, currencies) {
  const ws = {};
  putCell(ws, 1, 1, 'Active Currency', ASSUMPTION_STYLE.header);
  putCell(ws, 1, 2, 'Exchange Rate to EGP', ASSUMPTION_STYLE.header);
  currencies.forEach((cur, idx) => {
    putCell(ws, idx + 2, 1, cur, ASSUMPTION_STYLE.label);
    putCell(ws, idx + 2, 2, cur === 'EGP' ? 1 : '', ASSUMPTION_STYLE.input, cur === 'EGP' ? 'n' : 's');
  });
  ws['!cols'] = [{ wch: 18 }, { wch: 22 }];
  setTemplateCommon(ws, 'A1:B' + (currencies.length + 1));
  XLSX.utils.book_append_sheet(wb, ws, 'Currencies');
}

function buildAssumptionsTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = {};
  const currencies = getTemplateCurrencies();
  const nonEgpCurrencies = currencies.filter(cur => cur !== 'EGP');

  putCell(ws, 2, 2, 'PROJECT INFORMATION', ASSUMPTION_STYLE.section);
  putCell(ws, 3, 2, 'Parameter', ASSUMPTION_STYLE.header);
  putCell(ws, 3, 3, 'Value', ASSUMPTION_STYLE.header);
  putCell(ws, 3, 4, 'Notes', ASSUMPTION_STYLE.header);
  const projectInfo = [
    ['Project Name', 'Sample Project', 'Workbook file name and sheet titles'],
    ['Project Start Date', dateSerial(2026, 1, 1), 'First month in the cashflow timeline'],
    ['Number of Months', 12, 'Timeline duration']
  ].concat(nonEgpCurrencies.map(cur => [cur + ' to EGP Exchange Rate', defaultExchangeRate(cur), 'For equivalent conversion']));
  projectInfo.forEach((row, i) => {
    putCell(ws, i + 4, 2, row[0], ASSUMPTION_STYLE.label);
    putCell(ws, i + 4, 3, row[1], row[0].includes('Date') ? ASSUMPTION_STYLE.date : ASSUMPTION_STYLE.input);
    putCell(ws, i + 4, 4, row[2], ASSUMPTION_STYLE.note);
  });

  const contractRow = Math.max(11, projectInfo.length + 7);
  putCell(ws, contractRow, 2, 'CONTRACT VALUE', ASSUMPTION_STYLE.section);
  currencies.forEach((cur, idx) => {
    putCell(ws, contractRow + 1, 2 + idx, '(' + cur + ')', ASSUMPTION_STYLE.header);
    putCell(ws, contractRow + 2, 2 + idx, defaultTemplateAmount(cur, idx), ASSUMPTION_STYLE.money);
  });

  const cashInStart = contractRow + 6;
  const cashInSections = currencies.map(cur => [
    'Material ' + cur,
    [['Advanced Payment', 0.20, 45], ['Site Delivery ' + cur, 0.70, 45], ['Retention', 0.10, 45]]
  ]).concat([
    ['Services ' + (currencies.includes('EGP') ? 'EGP' : currencies[0]), [['Advanced Payment', 0.20, 45], ['Progress', 0.70, 45], ['Retention', 0.10, 45]]]
  ]);
  const cashOutStart = writePaymentTerms(ws, cashInStart, 'CASH IN - PAYMENT TERMS', 'Currency / Category', cashInSections) + 3;
  const cashOutSections = currencies.map(cur => [
    'Material ' + cur,
    [['Advanced Payment PO ' + cur, 0.10, 0], ['Shipping MAT ' + cur, 0.40, 15], ['Delivery MAT ' + cur, 0.40, 30], ['CCC', 0.10, 0]]
  ]).concat([
    ['S/C', [['Advanced Payment Installation', 0.05, 0], ['Installation Progress', 0.85, 30], ['Subcontractor Retention', 0.10, 0]]],
    ['SERVICES-EQ-LABOUR', [['Advanced Payment Installation', 0.10, 0], ['Progress', 0.90, 30]]]
  ]);
  const deductionsStart = writePaymentTerms(ws, cashOutStart, 'CASH OUT - PAYMENT TERMS', 'Currency / Budget Catergory', cashOutSections) + 3;

  putCell(ws, deductionsStart, 2, 'CASH IN SUMMARY - DEDUCTIONS', ASSUMPTION_STYLE.section);
  putCell(ws, deductionsStart + 1, 2, 'Deduction Type', ASSUMPTION_STYLE.header);
  putCell(ws, deductionsStart + 1, 3, 'Percentage (%)', ASSUMPTION_STYLE.header);
  putCell(ws, deductionsStart + 1, 4, 'Notes', ASSUMPTION_STYLE.header);
  [
    ['VAT', 0, 'Applied on gross invoicing'],
    ['Advanced Payment Deduction (AP)', 0, 'Deducted from each invoice'],
    ['Stamp Duties & Additional Stamp Duties', 0, 'On net before VAT'],
    ['Governmental Deductions', 0.009, ''],
    ['Viva Egypt', 0, '']
  ].forEach((row, i) => {
    putCell(ws, deductionsStart + 2 + i, 2, row[0], ASSUMPTION_STYLE.label);
    putCell(ws, deductionsStart + 2 + i, 3, row[1], ASSUMPTION_STYLE.pct);
    putCell(ws, deductionsStart + 2 + i, 4, row[2], ASSUMPTION_STYLE.note);
  });

  const indirectStart = deductionsStart + 9;
  putCell(ws, indirectStart, 2, 'CASH OUT - INDIRECT COSTS', ASSUMPTION_STYLE.section);
  putCell(ws, indirectStart + 1, 2, 'These are fixed-value line items in the Cash Out sheet. Enter the total budget for each.', ASSUMPTION_STYLE.note);
  putCell(ws, indirectStart + 2, 2, 'Indirect Cost Item', ASSUMPTION_STYLE.header);
  putCell(ws, indirectStart + 2, 3, 'Total Budget (EGP)', ASSUMPTION_STYLE.header);
  putCell(ws, indirectStart + 2, 4, 'Notes', ASSUMPTION_STYLE.header);
  [
    ['1. STAFF SALARIES AND WAGES', 250000, ''],
    ['2. EMPLOYER AND/OR ENGINEER REQUIREMENTS', 50000, ''],
    ['3. CONTRACTOR OFFICES AND SITE FACILITIES', 75000, '']
  ].forEach((row, i) => {
    putCell(ws, indirectStart + 3 + i, 2, row[0], ASSUMPTION_STYLE.label);
    putCell(ws, indirectStart + 3 + i, 3, row[1], ASSUMPTION_STYLE.money);
    putCell(ws, indirectStart + 3 + i, 4, row[2], ASSUMPTION_STYLE.note);
  });

  const overheadStart = indirectStart + 16;
  putCell(ws, overheadStart, 2, 'CASH OUT - PROJECT OVERHEADS', ASSUMPTION_STYLE.section);
  putCell(ws, overheadStart + 1, 2, 'Percentage-based costs applied on total contract value, distributed across project timeline.', ASSUMPTION_STYLE.note);
  putCell(ws, overheadStart + 2, 2, 'Overhead Type', ASSUMPTION_STYLE.header);
  putCell(ws, overheadStart + 2, 3, 'Percentage (%)', ASSUMPTION_STYLE.header);
  putCell(ws, overheadStart + 2, 4, 'Applied On', ASSUMPTION_STYLE.header);
  currencies.forEach((cur, idx) => putCell(ws, overheadStart + 2, 5 + idx, '(' + cur + ')', ASSUMPTION_STYLE.header));
  [
    ['INSURANCE POLICIES', 0.005, 'Total contract value'],
    ['PERFORMANCE BOND COST', 0.0026, 'Total contract value'],
    ['GOVERNMENTAL DEDUCTIONS 0.9%', 0.009, 'Total contract value']
  ].forEach((row, i) => {
    const rr = overheadStart + 3 + i;
    putCell(ws, rr, 2, row[0], ASSUMPTION_STYLE.label);
    putCell(ws, rr, 3, row[1], ASSUMPTION_STYLE.pct2);
    putCell(ws, rr, 4, row[2], ASSUMPTION_STYLE.note);
    currencies.forEach((cur, idx) => putCell(ws, rr, 5 + idx, 0, ASSUMPTION_STYLE.money));
  });

  const risksStart = overheadStart + 14;
  putCell(ws, risksStart, 2, 'CASH OUT - RISKS & CONTINGENCIES', ASSUMPTION_STYLE.section);
  putCell(ws, risksStart + 1, 2, 'Fixed-value items for project risk reserves and company overheads.', ASSUMPTION_STYLE.note);
  putCell(ws, risksStart + 2, 2, 'Item', ASSUMPTION_STYLE.header);
  putCell(ws, risksStart + 2, 3, 'Total Budget', ASSUMPTION_STYLE.header);
  putCell(ws, risksStart + 2, 4, 'Notes', ASSUMPTION_STYLE.header);
  currencies.forEach((cur, idx) => putCell(ws, risksStart + 2, 5 + idx, '(' + cur + ')', ASSUMPTION_STYLE.header));
  [
    ['RISKS & CONTINGENCIES', 0.02, 'Project risk reserve'],
    ['COMPANY OVERHEADS', 0.04, 'Corporate overhead allocation']
  ].forEach((row, i) => {
    const rr = risksStart + 3 + i;
    putCell(ws, rr, 2, row[0], ASSUMPTION_STYLE.label);
    putCell(ws, rr, 3, row[1], ASSUMPTION_STYLE.pct2);
    putCell(ws, rr, 4, row[2], ASSUMPTION_STYLE.note);
    currencies.forEach((cur, idx) => putCell(ws, rr, 5 + idx, 0, ASSUMPTION_STYLE.money));
  });

  const lastCol = colLetter(Math.max(7, 4 + currencies.length));
  const lastRow = risksStart + 5;
  ws['!cols'] = [{ wch: 5 }, { wch: 22.11 }, { wch: 29.44 }, { wch: 22 }, { wch: 24.89 }];
  currencies.forEach((cur, idx) => { ws['!cols'][4 + idx] = { wch: 18 }; });
  ws['!rows'] = [];
  [2, contractRow, cashInStart, cashOutStart, deductionsStart, indirectStart, overheadStart, risksStart].forEach(row => { ws['!rows'][row - 1] = { hpt: 15.6 }; });
  setTemplateCommon(ws, 'A1:' + lastCol + lastRow);
  XLSX.utils.book_append_sheet(wb, ws, 'Assumptions');
  appendCurrencyListSheet(wb, currencies);
  return { workbook: wb, filename: 'Assumptions_Input_Template.xlsx' };
}

function writePaymentTerms(ws, startRow, title, categoryHeader, sections) {
  putCell(ws, startRow, 2, title, ASSUMPTION_STYLE.section);
  putCell(ws, startRow + 1, 2, categoryHeader, ASSUMPTION_STYLE.header);
  putCell(ws, startRow + 1, 3, 'Milestone', ASSUMPTION_STYLE.header);
  putCell(ws, startRow + 1, 4, 'Percentage (%)', ASSUMPTION_STYLE.header);
  putCell(ws, startRow + 1, 5, 'Cash Duration (Days)', ASSUMPTION_STYLE.header);
  let row = startRow + 2;
  sections.forEach(section => {
    putCell(ws, row, 2, section[0], ASSUMPTION_STYLE.subSection);
    row++;
    section[1].forEach(term => {
      putCell(ws, row, 3, term[0], ASSUMPTION_STYLE.label);
      putCell(ws, row, 4, term[1], ASSUMPTION_STYLE.pct);
      putCell(ws, row, 5, term[2], ASSUMPTION_STYLE.input);
      row++;
    });
    row++;
  });
  return row;
}

function log(msg, cls) {
  const el = document.getElementById('log');
  el.style.display = 'block';
  el.innerHTML += '<div class="entry ' + (cls||'') + '">› ' + msg + '</div>';
  el.scrollTop = el.scrollHeight;
}

function setProgress(pct) {
  document.getElementById('progressBar').style.width = pct + '%';
}

// ============================================================
// HELPERS
// ============================================================
function safeSheetName(name) {
  let safe = name.replace(/[:\\\\/\\?\*\[\]]/g, '-');
  if (safe.length > 31) safe = safe.substring(0, 31).trimEnd();
  return safe;
}

function safeSheetNameWithSuffix(projName, suffix) {
  let safeProjName = projName.replace(/[:\\\\/\\?\*\[\]]/g, '-');
  const maxProjLen = 31 - suffix.length;
  if (maxProjLen < 1) return suffix.substring(0, 31);
  if (safeProjName.length > maxProjLen) safeProjName = safeProjName.substring(0, maxProjLen).trimEnd();
  return safeProjName + suffix;
}

function colLetter(n) {
  let s = '';
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}

function xmlEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xmlUnescape(value) {
  return String(value == null ? '' : value)
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

function sheetRefName(sheetName) {
  return "'" + String(sheetName).replace(/'/g, "''") + "'";
}

function nextPartNumber(paths, prefix, suffix) {
  let max = 0;
  paths.forEach(path => {
    const match = path.match(new RegExp('^' + prefix.replace(/\//g, '\\/') + '(\\d+)' + suffix.replace('.', '\\.') + '$'));
    if (match) max = Math.max(max, Number(match[1]));
  });
  return max + 1;
}

function nextRelationshipId(relsXml) {
  let max = 0;
  relsXml.replace(/Id="rId(\d+)"/g, function(_, id) {
    max = Math.max(max, Number(id));
    return _;
  });
  return 'rId' + (max + 1);
}

function addContentTypeOverride(contentTypesXml, partName, contentType) {
  if (contentTypesXml.indexOf('PartName="' + partName + '"') !== -1) return contentTypesXml;
  const override = '<Override PartName="' + partName + '" ContentType="' + contentType + '"/>';
  return contentTypesXml.replace('</Types>', override + '</Types>');
}

function addWorksheetDrawing(worksheetXml, drawingRelId) {
  let xml = worksheetXml;
  if (xml.indexOf('xmlns:r=') === -1) {
    xml = xml.replace('<worksheet ', '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
  }
  xml = xml.replace(/<drawing r:id="[^"]+"\/>/g, '');
  const drawing = '<drawing r:id="' + drawingRelId + '"/>';
  if (xml.indexOf('<legacyDrawing') !== -1) return xml.replace('<legacyDrawing', drawing + '<legacyDrawing');
  if (xml.indexOf('<pageMargins') !== -1) return xml.replace('<pageMargins', drawing + '<pageMargins');
  return xml.replace('</worksheet>', drawing + '</worksheet>');
}

function addWorksheetRelationship(relsXml, drawingRelId, drawingPartName) {
  const rel = '<Relationship Id="' + drawingRelId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/' + drawingPartName + '"/>';
  if (!relsXml) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + rel + '</Relationships>';
  }
  return relsXml.replace('</Relationships>', rel + '</Relationships>');
}

function buildCashflowDrawingXml(chartRelId, N) {
  const toCol = Math.max(2 + N, 15);
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
    '<xdr:twoCellAnchor>' +
    '<xdr:from><xdr:col>1</xdr:col><xdr:colOff>90000</xdr:colOff><xdr:row>1</xdr:row><xdr:rowOff>60000</xdr:rowOff></xdr:from>' +
    '<xdr:to><xdr:col>' + toCol + '</xdr:col><xdr:colOff>60000</xdr:colOff><xdr:row>29</xdr:row><xdr:rowOff>100000</xdr:rowOff></xdr:to>' +
    '<xdr:graphicFrame macro="">' +
    '<xdr:nvGraphicFramePr><xdr:cNvPr id="2" name="Cashflow Chart"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr>' +
    '<xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm>' +
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">' +
    '<c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="' + chartRelId + '"/>' +
    '</a:graphicData></a:graphic>' +
    '</xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>';
}

function buildDrawingChartRelsXml(chartPartName) {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/' + chartPartName + '"/>' +
    '</Relationships>';
}

function buildCashflowChartXml(sheetName, cur, N) {
  const sheet = sheetRefName(sheetName);
  const lastCol = colLetter(2 + N);
  const catRange = sheet + '!$C$36:$' + lastCol + '$36';
  const series = [
    { labelRow: 38, valueRow: 38, type: 'bar', color: '5B9BD5' },
    { labelRow: 41, valueRow: 41, type: 'bar', color: 'ED7D31' },
    { labelRow: 39, valueRow: 39, type: 'line', color: '0070C0' },
    { labelRow: 42, valueRow: 42, type: 'line', color: '70AD47' }
  ];
  const barSer = series.filter(s => s.type === 'bar').map((s, idx) => chartSeriesXml(sheet, catRange, s, idx, idx, N)).join('');
  const lineSer = series.filter(s => s.type === 'line').map((s, idx) => chartSeriesXml(sheet, catRange, s, idx + 2, idx + 2, N)).join('');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<c:date1904 val="0"/><c:lang val="en-US"/><c:roundedCorners val="0"/>' +
    '<c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" sz="1400" b="1"><a:latin typeface="Century Gothic"/></a:rPr><a:t>' + xmlEscape('Cash Flow ' + cur) + '</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title>' +
    '<c:plotArea><c:layout/>' +
    '<c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="0"/>' + barSer + '<c:gapWidth val="150"/><c:axId val="208811320"/><c:axId val="208811712"/></c:barChart>' +
    '<c:lineChart><c:grouping val="standard"/><c:varyColors val="0"/>' + lineSer + '<c:marker val="1"/><c:smooth val="0"/><c:axId val="208811320"/><c:axId val="208811712"/></c:lineChart>' +
    '<c:catAx><c:axId val="208811320"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:numFmt formatCode="mmm\\-yy" sourceLinked="0"/><c:majorTickMark val="out"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:txPr><a:bodyPr rot="-5400000"/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="900"><a:latin typeface="Century Gothic"/></a:defRPr></a:pPr></a:p></c:txPr><c:crossAx val="208811712"/><c:crosses val="autoZero"/><c:auto val="0"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/></c:catAx>' +
    '<c:valAx><c:axId val="208811712"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines/><c:numFmt formatCode="#,##0" sourceLinked="0"/><c:majorTickMark val="out"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="900"><a:latin typeface="Century Gothic"/></a:defRPr></a:pPr></a:p></c:txPr><c:crossAx val="208811320"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx>' +
    '</c:plotArea><c:legend><c:legendPos val="r"/><c:overlay val="0"/><c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1000" b="1"><a:latin typeface="Century Gothic"/></a:defRPr></a:pPr></a:p></c:txPr></c:legend><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart>' +
    '<c:spPr><a:solidFill><a:schemeClr val="bg1"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="D9E2F3"/></a:solidFill></a:ln></c:spPr>' +
    '</c:chartSpace>';
}

function chartSeriesXml(sheet, catRange, s, idx, order, N) {
  const valueRange = sheet + '!$C$' + s.valueRow + ':$' + colLetter(2 + N) + '$' + s.valueRow;
  const lineXml = s.type === 'line'
    ? '<c:spPr><a:ln w="28575" cap="rnd"><a:solidFill><a:srgbClr val="' + s.color + '"/></a:solidFill><a:round/></a:ln></c:spPr><c:marker><c:symbol val="none"/></c:marker>'
    : '<c:spPr><a:solidFill><a:srgbClr val="' + s.color + '"/></a:solidFill><a:ln><a:noFill/></a:ln></c:spPr><c:invertIfNegative val="0"/>';
  return '<c:ser><c:idx val="' + idx + '"/><c:order val="' + order + '"/>' +
    '<c:tx><c:strRef><c:f>' + xmlEscape(sheet + '!$B$' + s.labelRow) + '</c:f></c:strRef></c:tx>' +
    lineXml +
    '<c:cat><c:numRef><c:f>' + xmlEscape(catRange) + '</c:f></c:numRef></c:cat>' +
    '<c:val><c:numRef><c:f>' + xmlEscape(valueRange) + '</c:f></c:numRef></c:val>' +
    (s.type === 'line' ? '<c:smooth val="0"/>' : '') +
    '</c:ser>';
}

async function writeWorkbookWithCashflowCharts(wb, filename, chartSheetNames, N) {
  if (!window.JSZip) throw new Error('JSZip did not load, so native Excel charts cannot be generated.');
  const workbookArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const zip = await JSZip.loadAsync(workbookArray);
  const allPaths = Object.keys(zip.files);
  const workbookXml = await zip.file('xl/workbook.xml').async('string');
  const workbookRelsXml = await zip.file('xl/_rels/workbook.xml.rels').async('string');
  const sheetTargets = getWorksheetTargets(workbookXml, workbookRelsXml);
  let contentTypesXml = await zip.file('[Content_Types].xml').async('string');
  let drawingNo = nextPartNumber(allPaths, 'xl/drawings/drawing', '.xml');
  let chartNo = nextPartNumber(allPaths, 'xl/charts/chart', '.xml');

  for (const sheetName of chartSheetNames) {
    const worksheetPath = sheetTargets[sheetName];
    if (!worksheetPath || !zip.file(worksheetPath)) continue;

    const drawingName = 'drawing' + drawingNo + '.xml';
    const chartName = 'chart' + chartNo + '.xml';
    const worksheetDir = worksheetPath.substring(0, worksheetPath.lastIndexOf('/'));
    const worksheetFile = worksheetPath.substring(worksheetPath.lastIndexOf('/') + 1);
    const worksheetRelsPath = worksheetDir + '/_rels/' + worksheetFile + '.rels';
    const existingRels = zip.file(worksheetRelsPath) ? await zip.file(worksheetRelsPath).async('string') : '';
    const drawingRelId = nextRelationshipId(existingRels);

    const worksheetXml = await zip.file(worksheetPath).async('string');
    zip.file(worksheetPath, addWorksheetDrawing(worksheetXml, drawingRelId));
    zip.file(worksheetRelsPath, addWorksheetRelationship(existingRels, drawingRelId, drawingName));
    zip.file('xl/drawings/' + drawingName, buildCashflowDrawingXml('rId1', N));
    zip.file('xl/drawings/_rels/' + drawingName + '.rels', buildDrawingChartRelsXml(chartName));
    zip.file('xl/charts/' + chartName, buildCashflowChartXml(sheetName, sheetName.replace(/^Cashflow\s+/i, ''), N));

    contentTypesXml = addContentTypeOverride(contentTypesXml, '/xl/drawings/' + drawingName, 'application/vnd.openxmlformats-officedocument.drawing+xml');
    contentTypesXml = addContentTypeOverride(contentTypesXml, '/xl/charts/' + chartName, 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml');
    drawingNo++;
    chartNo++;
  }

  zip.file('[Content_Types].xml', contentTypesXml);
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, filename);
}

function getWorksheetTargets(workbookXml, workbookRelsXml) {
  const relTargets = {};
  workbookRelsXml.replace(/<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*>/g, function(_, id, target) {
    const cleanTarget = target.replace(/^\//, '');
    relTargets[id] = cleanTarget.indexOf('xl/') === 0 ? cleanTarget : 'xl/' + cleanTarget;
    return _;
  });
  const sheetTargets = {};
  workbookXml.replace(/<sheet\b[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"[^>]*\/>/g, function(_, name, relId) {
    sheetTargets[xmlUnescape(name)] = relTargets[relId];
    return _;
  });
  return sheetTargets;
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
}

function normalizeCurrency(value) {
  const cur = String(value || '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(cur) ? cur : '';
}

function currencyCodesFromText(value) {
  const text = String(value || '').toUpperCase();
  const codes = [];
  let match;
  const parenthetical = /\(([A-Z]{3})\)/g;
  while ((match = parenthetical.exec(text)) !== null) codes.push(match[1]);
  const toEgp = /\b([A-Z]{3})\s+TO\s+EGP\b/g;
  while ((match = toEgp.exec(text)) !== null) codes.push(match[1]);
  const ignored = { AND: true, THE: true, FOR: true, VAT: true };
  if (codes.length === 0) {
    const tokens = text.match(/\b[A-Z]{3}\b/g) || [];
    tokens.forEach(token => { if (!ignored[token]) codes.push(token); });
  }
  return Array.from(new Set(codes.map(normalizeCurrency).filter(Boolean)));
}

function firstCurrencyCode(value) {
  return currencyCodesFromText(value)[0] || '';
}

function getCurrencyAmount(item, cur) {
  return (item && item.amountsByCurrency && item.amountsByCurrency[cur]) || 0;
}

function sortCurrencies(currencies) {
  const unique = Array.from(new Set(currencies.map(normalizeCurrency).filter(Boolean)));
  const referenceOrder = ['USD', 'EGP', 'EUR'];
  const ordered = referenceOrder.filter(cur => unique.includes(cur));
  return ordered.concat(unique.filter(cur => !referenceOrder.includes(cur)).sort());
}

function detectCurrencyColumnsFromRow(row) {
  const columns = {};
  (row || []).forEach((value, idx) => {
    const cur = firstCurrencyCode(value);
    if (cur) columns[idx] = cur;
  });
  return columns;
}

function dateSerial(year, month, day) {
  const d = new Date(year, month - 1, day || 1);
  const epoch = new Date(1899, 11, 30);
  return Math.round((d - epoch) / 86400000);
}

function monthEnd(year, month) {
  return new Date(year, month, 0).getDate();
}

function generateDates(startDate, numMonths) {
  const dates = [];
  let year, month;
  if (startDate instanceof Date) {
    year = startDate.getFullYear();
    month = startDate.getMonth() + 1;
  } else if (typeof startDate === 'number') {
    const d = XLSX.SSF.parse_date_code(startDate);
    year = d.y; month = d.m;
  } else {
    year = 2024; month = 10;
  }

  for (let i = 0; i < numMonths; i++) {
    const m = ((month - 1 + i) % 12) + 1;
    const y = year + Math.floor((month - 1 + i) / 12);
    const day = monthEnd(y, m);
    dates.push({ year: y, month: m, day, serial: dateSerial(y, m, day) });
  }
  return dates;
}

// ============================================================
// PARSE ASSUMPTIONS
// ============================================================
function parseAssumptions(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);
  const vals = {};
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (ws[addr]) vals[r + '_' + c] = ws[addr].v;
    }
  }

  const a = {
    projectName: '', startDate: null, numMonths: 24,
    usdToEgp: 48.4, eurToEgp: 53.0,
    exchangeRates: { EGP: 1, USD: 48.4, EUR: 53.0 },
    cashInTerms: {}, cashOutTerms: {},
    deductions: {}, overheads: {},
    indirectCost: {}, indirectCostItems: [],
    projectOverheads: [], risksContingencies: [],
    _indirectCostCur: 'EGP'
  };

  const currencySheet = wb.Sheets['Currencies'];
  if (currencySheet) {
    const currencyRows = XLSX.utils.sheet_to_json(currencySheet, { header: 1, defval: null });
    currencyRows.slice(1).forEach(row => {
      const cur = normalizeCurrency(row && row[0]);
      const rate = Number(row && row[1]);
      if (cur && (cur === 'EGP' || rate > 0)) {
        a.exchangeRates[cur] = cur === 'EGP' ? 1 : rate;
        if (cur === 'USD') a.usdToEgp = rate;
        if (cur === 'EUR') a.eurToEgp = rate;
      }
    });
  }

  for (let r = range.s.r; r <= range.e.r; r++) {
    const b = vals[r + '_1'], c = vals[r + '_2'], d = vals[r + '_3'];
    if (typeof b === 'string') {
      const lb = b.trim().toLowerCase();
      if (lb === 'project name' && c !== undefined) a.projectName = c;
      if (lb === 'project start date' && c !== undefined) a.startDate = c;
      if (lb === 'number of months' && c !== undefined) a.numMonths = Number(c) || 24;
      const rateMatch = b.trim().toUpperCase().match(/\b([A-Z]{3})\s+TO\s+EGP\b/);
      if (rateMatch && c !== undefined) {
        const rateCur = normalizeCurrency(rateMatch[1]);
        const rate = Number(c);
        if (rateCur && rate > 0) {
          a.exchangeRates[rateCur] = rate;
          if (rateCur === 'USD') a.usdToEgp = rate;
          if (rateCur === 'EUR') a.eurToEgp = rate;
        }
      }
    }
  }

  let section = '', subsection = '';
  let sectionCurrencyColumns = {};
  for (let r = range.s.r; r <= range.e.r; r++) {
    const b = vals[r + '_1'], c = vals[r + '_2'], d = vals[r + '_3'], e = vals[r + '_4'];
    const rowValues = [];
    for (let cc = range.s.c; cc <= range.e.c; cc++) rowValues[cc] = vals[r + '_' + cc];

    if (typeof b === 'string') {
      const lb = b.trim().toUpperCase();
      const priorSection = section;
      if (lb.includes('INDIRECT') && lb.includes('COST')) section = 'indirectCost';
      else if (lb.includes('PROJECT') && lb.includes('OVERHEAD')) section = 'projectOverheads';
      else if (lb.includes('RISK') && lb.includes('CONTINGENC')) section = 'risksContingencies';
      else if (lb.includes('CASH IN') && lb.includes('PAYMENT')) section = 'cashIn';
      else if (lb.includes('CASH OUT') && lb.includes('PAYMENT')) section = 'cashOut';
      else if (lb.includes('CASH IN') && lb.includes('DEDUCTION')) section = 'deductions';
      if (section !== priorSection) sectionCurrencyColumns = {};
    }

    if (section === 'indirectCost' || section === 'projectOverheads' || section === 'risksContingencies') {
      const detectedColumns = detectCurrencyColumnsFromRow(rowValues);
      if (Object.keys(detectedColumns).length > 0) {
        sectionCurrencyColumns = detectedColumns;
        if (section === 'indirectCost') {
          const firstCol = Object.keys(detectedColumns)[0];
          a._indirectCostCur = detectedColumns[firstCol] || a._indirectCostCur;
        }
      }
    }

    if (typeof b === 'string' && b.trim() && !c && !d && (section === 'cashIn' || section === 'cashOut')) {
      subsection = normalizeAssumptionCategory(b.trim());
    }
    if (typeof b === 'string' && b.trim() && typeof c !== 'number' && typeof d !== 'number') {
      const lbl = b.trim();
      if ((section === 'cashIn' || section === 'cashOut') && lbl.match(/material|installation|services|civil|custom|S\/C|LABOUR|EQ/i)) {
        subsection = normalizeAssumptionCategory(lbl);
      }
    }

    if ((section === 'cashIn' || section === 'cashOut') && typeof c === 'string' && c.trim()) {
      if (typeof d === 'number' && typeof e === 'number') {
        const target = section === 'cashIn' ? a.cashInTerms : a.cashOutTerms;
        if (!target[subsection]) target[subsection] = [];
        target[subsection].push({ name: c.trim(), pct: d, days: e });
      }
    }

    if (section === 'deductions' && typeof b === 'string' && typeof c === 'number') {
      a.deductions[b.trim()] = c;
    }

    if (section === 'indirectCost' && typeof b === 'string' && b.trim()) {
      const label = b.trim().toUpperCase();
      const labelCur = firstCurrencyCode(label);
      if (labelCur && typeof c !== 'number') a._indirectCostCur = labelCur;

      if (typeof c === 'number' && c > 0) {
        const cur = labelCur || a._indirectCostCur || 'EGP';
        a.indirectCostItems.push({ name: b.trim(), value: c, currency: cur });
        a.indirectCost[cur] = (a.indirectCost[cur] || 0) + c;
      }
    }

    if (section === 'projectOverheads' && typeof b === 'string' && b.trim()) {
      const label = b.trim(), lu = label.toUpperCase();
      if (!(lu.includes('PROJECT') && lu.includes('OVERHEAD')) && !lu.includes('PERCENTAGE-BASED') && !lu.includes('OVERHEAD TYPE')) {
        const amountsByCurrency = {};
        Object.entries(sectionCurrencyColumns).forEach(([colIdx, cur]) => {
          const value = vals[r + '_' + colIdx];
          amountsByCurrency[cur] = typeof value === 'number' ? value : 0;
        });
        if (typeof c === 'number' || Object.values(amountsByCurrency).some(value => value > 0)) {
          const item = { name: label, pct: typeof c === 'number' ? c : 0, amountsByCurrency };
          Object.entries(amountsByCurrency).forEach(([cur, value]) => { item[cur] = value; });
          a.projectOverheads.push(item);
        }
      }
    }

    if (section === 'risksContingencies' && typeof b === 'string' && b.trim()) {
      const label = b.trim();
      const amountsByCurrency = {};
      Object.entries(sectionCurrencyColumns).forEach(([colIdx, cur]) => {
        const value = vals[r + '_' + colIdx];
        amountsByCurrency[cur] = typeof value === 'number' ? value : 0;
      });
      if (typeof c === 'number' || Object.values(amountsByCurrency).some(value => value > 0)) {
        const item = { name: label, pct: typeof c === 'number' ? c : 0, amountsByCurrency };
        Object.entries(amountsByCurrency).forEach(([cur, value]) => { item[cur] = value; });
        a.risksContingencies.push(item);
      }
    }
  }

  return a;
}

function normalizeAssumptionCategory(label) {
  const text = String(label || '').trim();
  const upper = text.toUpperCase();
  if (upper.includes('SERVICES') && upper.includes('EQ') && upper.includes('LABOUR')) return 'SERVICES-EQ-LABOUR';
  return text;
}

// ============================================================
// PARSE BOQ (Cash In source)
// ============================================================
function parseBOQ(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, range: 3 });
  const items = [];
  const headerRow = rows[0] || [];
  let currencyColumns = detectCurrencyColumnsFromRow(headerRow);
  if (Object.keys(currencyColumns).length === 0) {
    currencyColumns = { 6: 'USD', 7: 'EUR', 8: 'EGP' };
  }
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const trade = r[1], boq = r[2], cat = r[3], taskNum = r[4], desc = r[5];
    const amountsByCurrency = {};
    Object.entries(currencyColumns).forEach(([colIdx, cur]) => {
      const value = r[Number(colIdx)];
      amountsByCurrency[cur] = (typeof value === 'number' && value !== 0) ? value : 0;
    });
    if (!desc && !taskNum) continue;
    const item = {
      trade: trade || '', boq: boq || '', category: cat || '',
      taskNum: taskNum || '', description: desc || '',
      amountsByCurrency,
      isHeader: !taskNum && !Object.values(amountsByCurrency).some(value => value > 0)
    };
    Object.entries(amountsByCurrency).forEach(([cur, value]) => { item[cur] = value; });
    items.push(item);
  }
  return items;
}

// ============================================================
// PARSE BUDGET (Cash Out source)
// ============================================================
function parseBudget(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, range: 2 });
  const items = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const trade = r[0], boq = r[1], cat = r[2], parent = r[3], taskNum = r[4];
    const budgetCat = r[5], desc = r[6], unit = r[7], currency = r[8], amount = r[10];
    if (!desc && !taskNum) continue;
    const cur = (typeof currency === 'string') ? currency.trim().toUpperCase() : '';
    items.push({
      trade: trade || '', boq: boq || '', category: cat || '',
      parentTask: parent || '', taskNum: taskNum || '',
      budgetCat: budgetCat || '', description: desc || '',
      unit: unit || '', currency: cur,
      amount: (typeof amount === 'number') ? amount : 0,
      isParent: budgetCat === '#'
    });
  }
  return items;
}

function detectCurrencies(boqItems, budgetItems, assumptions) {
  const currencies = new Set();
  boqItems.forEach(item => {
    Object.entries(item.amountsByCurrency || {}).forEach(([cur, value]) => {
      if (value > 0) currencies.add(cur);
    });
  });
  budgetItems.forEach(item => { if (item.currency && item.amount > 0) currencies.add(item.currency); });
  if (assumptions) {
    (assumptions.indirectCostItems || []).forEach(item => { if (item.currency && item.value > 0) currencies.add(item.currency); });
    (assumptions.projectOverheads || []).forEach(item => {
      Object.entries(item.amountsByCurrency || {}).forEach(([cur, value]) => { if (value > 0) currencies.add(cur); });
    });
    (assumptions.risksContingencies || []).forEach(item => {
      Object.entries(item.amountsByCurrency || {}).forEach(([cur, value]) => { if (value > 0) currencies.add(cur); });
    });
  }
  return sortCurrencies(Array.from(currencies));
}

// ============================================================
// STYLE DEFINITIONS - ND10 Reference Matching
// ============================================================
const border = { top:{style:'thin',color:{rgb:'A6A6A6'}}, bottom:{style:'thin',color:{rgb:'A6A6A6'}}, left:{style:'thin',color:{rgb:'A6A6A6'}}, right:{style:'thin',color:{rgb:'A6A6A6'}} };
const borderMedium = { top:{style:'medium',color:{rgb:'808080'}}, bottom:{style:'medium',color:{rgb:'808080'}}, left:{style:'thin',color:{rgb:'A6A6A6'}}, right:{style:'thin',color:{rgb:'A6A6A6'}} };

// ND10 uses: theme2 tint -0.75 for headers (≈ dark gray-blue #333F4F),
//            theme2 tint -0.50 for section totals (≈ #536270),
//            theme2 tint -0.25 for BOQ categories (≈ #8496A7),
//            theme4 tint -0.25 for summary headers (≈ #2F75B5),
//            theme4 tint +0.80 for summary data (≈ #D6E4F0),
//            theme7 tint +0.80 for cumulative rows in cashflow (≈ #FFF2CC / light gold)
// Tab colors: USD = FFFF00 (yellow), EGP = theme4 dark (blue), EQU = theme0 dark (gray), Cashflow = C00000 (dark red)

const S = {
  // === CASH IN / CASH OUT HEADERS ===
  header:     { fill:{fgColor:{rgb:'3A3838'}}, font:{bold:true,color:{rgb:'FFFFFF'},sz:14,name:'Calibri'}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border },
  subHeader:  { fill:{fgColor:{rgb:'3A3838'}}, font:{bold:true,color:{rgb:'FFFFFF'},sz:14,name:'Calibri'}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border },
  // Trade total
  trade:      { fill:{fgColor:{rgb:'757171'}}, font:{bold:true,sz:14,name:'Calibri',color:{rgb:'FFFFFF'}}, border, numFmt:'#,##0' },
  // BOQ category header
  boqCat:     { fill:{fgColor:{rgb:'AEAAAA'}}, font:{bold:true,sz:13,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  // Total row at top (same as header)
  totalRow:   { fill:{fgColor:{rgb:'3A3838'}}, font:{bold:true,sz:14,name:'Calibri',color:{rgb:'FFFFFF'}}, border, numFmt:'#,##0' },
  // Sub-category / task heading
  section:    { fill:{fgColor:{rgb:'BFBFBF'}}, font:{bold:true,sz:10,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  // Item header (last breakdown before milestones)
  itemHeader: { fill:{fgColor:{rgb:'D9D9D9'}}, font:{bold:true,sz:10,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  // Data rows (no fill, black font)
  data:       { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border },
  num:        { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  pct:        { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'0%' },
  date:       { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border, numFmt:'MMM-YY', alignment:{horizontal:'center'} },
  dateBold:   { fill:{fgColor:{rgb:'3A3838'}}, font:{bold:true,sz:14,name:'Calibri',color:{rgb:'FFFFFF'}}, border, numFmt:'MMM-YY', alignment:{horizontal:'center'} },
  // === CASHFLOW TAB (Century Gothic, ND10 look) ===
  cfTitle:    { font:{bold:true,sz:16,name:'Century Gothic',color:{rgb:'1F4E79'}} },
  cfLabel:    { font:{sz:11,name:'Times New Roman'}, border },
  cfCashIn:   { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'CCFFCC'}}, numFmt:'#,##0' },
  cfCashOut:  { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'CCFFCC'}}, numFmt:'#,##0' },
  cfNet:      { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'FFF2CC'}}, numFmt:'#,##0' },
  cfCum:      { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'FFF2CC'}}, numFmt:'#,##0' },
  cfPct:      { font:{sz:9,name:'Times New Roman'}, border, numFmt:'0.0%' },
  cfDateHdr:  { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'CCFFCC'}}, numFmt:'MMM-YY', alignment:{horizontal:'center'} },
  cfMonthNum: { font:{bold:true,sz:11,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'CCFFCC'}}, alignment:{horizontal:'center'} },
  cfOverall:  { font:{bold:true,sz:18,name:'Times New Roman',color:{rgb:'000000'}}, border, fill:{fgColor:{rgb:'CCFFCC'}} },
  cfAssumpH:  { font:{bold:true,sz:14,name:'Calibri'} },
  cfAssumpT:  { font:{bold:true,sz:11,name:'Calibri'} },
  // === CASHFLOW HEADER BLOCK ===
  cfBanner:   { fill:{fgColor:{rgb:'1F4E79'}}, font:{bold:true,sz:15,name:'Century Gothic',color:{rgb:'FFFFFF'}}, alignment:{horizontal:'center',vertical:'center'}, border },
  cfProjName: { fill:{fgColor:{rgb:'2E75B6'}}, font:{bold:true,sz:13,name:'Century Gothic',color:{rgb:'FFFFFF'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border },
  cfInfoLbl:  { fill:{fgColor:{rgb:'D6E4F0'}}, font:{sz:10,name:'Century Gothic',color:{rgb:'1F4E79'}}, alignment:{horizontal:'left',vertical:'center'}, border },
  cfInfoVal:  { fill:{fgColor:{rgb:'DEEAF1'}}, font:{bold:true,sz:10,name:'Century Gothic',color:{rgb:'1F4E79'}}, alignment:{horizontal:'left',vertical:'center'}, border },
  // === METRICS BOX ===
  cfMboxLbl:  { fill:{fgColor:{rgb:'1F4E79'}}, font:{bold:true,sz:11,name:'Century Gothic',color:{rgb:'FFFFFF'}}, alignment:{horizontal:'left',vertical:'center'}, border },
  cfMboxNeg:  { fill:{fgColor:{rgb:'FCE4D6'}}, font:{bold:true,sz:11,name:'Century Gothic',color:{rgb:'C00000'}}, border, numFmt:'"("#,##0")"', alignment:{horizontal:'right',vertical:'center'} },
  cfMboxPos:  { fill:{fgColor:{rgb:'E2EFDA'}}, font:{bold:true,sz:11,name:'Century Gothic',color:{rgb:'375623'}}, border, numFmt:'#,##0', alignment:{horizontal:'right',vertical:'center'} },
  cfMboxVal:  { fill:{fgColor:{rgb:'FFF2CC'}}, font:{bold:true,sz:11,name:'Century Gothic',color:{rgb:'7F6000'}}, border, numFmt:'#,##0', alignment:{horizontal:'right',vertical:'center'} },
  // === SUMMARY TABS ===
  sumHeader:  { fill:{fgColor:{rgb:'2F75B5'}}, font:{bold:true,color:{rgb:'FFFFFF'},sz:12,name:'Times New Roman'}, alignment:{horizontal:'center',vertical:'center'}, border },
  sumTotal:   { fill:{fgColor:{rgb:'DDEBF7'}}, font:{bold:true,sz:10,name:'Times New Roman',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  sumDeduct:  { fill:{fgColor:{rgb:'DDEBF7'}}, font:{bold:true,sz:10,name:'Times New Roman',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  sumNet:     { fill:{fgColor:{rgb:'DDEBF7'}}, font:{bold:true,sz:12,name:'Times New Roman',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  sumItem:    { fill:{fgColor:{rgb:'DDEBF7'}}, font:{bold:true,sz:10,name:'Times New Roman',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
  sumLabel:   { fill:{fgColor:{rgb:'DDEBF7'}}, font:{bold:true,sz:10,name:'Times New Roman',color:{rgb:'000000'}}, border },
  sumSection: { fill:{fgColor:{rgb:'2F75B5'}}, font:{bold:true,sz:12,name:'Times New Roman',color:{rgb:'FFFFFF'}}, border },
  // Column D header style (dark blue like section headers, but with numFmt for value cells)
  sumColD:    { fill:{fgColor:{rgb:'2F75B5'}}, font:{bold:true,sz:12,name:'Times New Roman',color:{rgb:'FFFFFF'}}, border },
  sumColDNum: { fill:{fgColor:{rgb:'2F75B5'}}, font:{bold:true,sz:12,name:'Times New Roman',color:{rgb:'FFFFFF'}}, border, numFmt:'#,##0' },
  // Column E Total style (medium blue)
  sumColE:    { fill:{fgColor:{rgb:'9BC2E6'}}, font:{bold:true,sz:12,name:'Times New Roman',color:{rgb:'000000'}}, border, numFmt:'#,##0' },
};

// Tab color constants
const TAB_COLORS = {
  USD: 'FFFF00',
  EGP: '2F75B5',
  EUR: '00B050',
  EQU: '808080',
  CF_USD: 'C00000',
  CF_EGP: 'C00000',
  CF_EUR: 'C00000',
  CF_EQU: '00B050'
};

// ============================================================
// MAIN GENERATE FUNCTION
// ============================================================
async function generate() {
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('log').innerHTML = '';
  setProgress(5);

  try {
    log('Parsing Assumptions...');
    const assumptions = parseAssumptions(data.assumptions);
    log('  Project: ' + (assumptions.projectName || 'Unnamed'), 'ok');
    log('  Months: ' + assumptions.numMonths + ', exchange rates: ' + Object.entries(assumptions.exchangeRates || {}).map(function(e){return e[0] + '/EGP=' + e[1]}).join(', '));
    log('  Cash In terms: ' + Object.keys(assumptions.cashInTerms).length + ' categories');
    log('  Cash Out terms: ' + Object.keys(assumptions.cashOutTerms).length + ' categories');
    log('  Indirect Cost items: ' + (assumptions.indirectCostItems || []).length + ' (' + Object.entries(assumptions.indirectCost).map(function(e){return e[0]+':'+e[1]}).join(', ') + ')');
    log('  Project Overheads: ' + assumptions.projectOverheads.length + ' items' + (assumptions.projectOverheads.length > 0 ? ' (' + assumptions.projectOverheads.map(function(o){return o.name+':'+(o.pct*100).toFixed(1)+'%'}).join(', ') + ')' : ''));
    log('  Risks & Contingencies: ' + assumptions.risksContingencies.length + ' items' + (assumptions.risksContingencies.length > 0 ? ' (' + assumptions.risksContingencies.map(function(r){return r.name+':'+(r.pct*100).toFixed(1)+'%'}).join(', ') + ')' : ''));
    setProgress(10);

    log('Parsing BOQ...');
    const boqItems = parseBOQ(data.boq);
    log('  Found ' + boqItems.length + ' items', 'ok');
    setProgress(15);

    log('Parsing Budget...');
    const budgetItems = parseBudget(data.budget);
    const budgetDataItems = budgetItems.filter(item => !item.isParent && item.amount > 0);
    log('  Found ' + budgetDataItems.length + ' usable data items (' + budgetItems.length + ' rows parsed)', 'ok');
    setProgress(20);

    const currencies = detectCurrencies(boqItems, budgetItems, assumptions);
    if (currencies.length === 0) throw new Error('No active currencies found in BOQ or Budget input files.');
    const missingRates = currencies.filter(cur => cur !== 'EGP' && !(assumptions.exchangeRates && assumptions.exchangeRates[cur] > 0));
    if (missingRates.length > 0) {
      throw new Error('Missing exchange rate(s) in Assumptions: ' + missingRates.map(cur => cur + ' to EGP Exchange Rate').join(', '));
    }
    log('Active currencies: ' + currencies.join(', '), 'info');

    const dates = generateDates(assumptions.startDate, assumptions.numMonths);
    log('Timeline: ' + dates[0].month + '/' + dates[0].year + ' to ' + dates[dates.length-1].month + '/' + dates[dates.length-1].year);
    setProgress(30);

    const wb = XLSX.utils.book_new();
    const N = assumptions.numMonths;
    const projName = assumptions.projectName || 'Project';
    const chartSheetNames = [];

    let progress = 30;
    const progressPerCurrency = 55 / currencies.length;

    for (const cur of currencies) {
      log('Building ' + cur + ' tabs...', 'info');

      const boqCur = boqItems.filter(item => getCurrencyAmount(item, cur) > 0 || item.isHeader);
      const budgetCur = budgetItems.filter(item => item.currency === cur);

      const ciTabName = safeSheetNameWithSuffix(projName, ' Cash in ' + cur);
      const ciSumTabName = safeSheetName('Cash In Summary ' + cur);
      const coTabName = safeSheetNameWithSuffix(projName, ' Cash out ' + cur);
      const coSumTabName = safeSheetName('Cash out Summary ' + cur);
      const cfTabName = safeSheetName('Cashflow ' + cur);

      // TAB 1: Cash In
      log('  Creating Cash In ' + cur + '...');
      const ciSheet = buildCashInSheet(boqCur, cur, dates, assumptions, projName, ciTabName);
      XLSX.utils.book_append_sheet(wb, ciSheet.ws, ciTabName);
      setTabColor(wb, ciTabName, TAB_COLORS[cur] || 'FFFF00');
      progress += progressPerCurrency * 0.25;
      setProgress(progress);

      // TAB 2: Cash In Summary
      log('  Creating Cash In Summary ' + cur + '...');
      const ciSumSheet = buildCashInSummarySheet(cur, dates, assumptions, projName, ciSheet.lastRow, ciSheet.milestoneNames, ciTabName, ciSumTabName, ciSheet.valStartCol);
      XLSX.utils.book_append_sheet(wb, ciSumSheet, ciSumTabName);
      setTabColor(wb, ciSumTabName, TAB_COLORS[cur] || 'FFFF00');
      progress += progressPerCurrency * 0.15;
      setProgress(progress);

      // TAB 3: Cash Out
      log('  Creating Cash Out ' + cur + '...');
      const coSheet = buildCashOutSheet(budgetCur, cur, dates, assumptions, projName, coTabName, ciTabName, ciSheet.lastRow);
      XLSX.utils.book_append_sheet(wb, coSheet.ws, coTabName);
      setTabColor(wb, coTabName, TAB_COLORS[cur] || 'FFFF00');
      progress += progressPerCurrency * 0.25;
      setProgress(progress);

      // TAB 4: Cash Out Summary
      log('  Creating Cash Out Summary ' + cur + '...');
      const coSumSheet = buildCashOutSummarySheet(cur, dates, assumptions, projName, coSheet.lastRow, coSheet.milestoneNames, coTabName, coSumTabName, ciSumTabName, coSheet.valStartCol, coSheet.groupHeaderRows);
      XLSX.utils.book_append_sheet(wb, coSumSheet, coSumTabName);
      setTabColor(wb, coSumTabName, TAB_COLORS[cur] || 'FFFF00');
      progress += progressPerCurrency * 0.15;
      setProgress(progress);

      // TAB 5: Cashflow
      log('  Creating Cashflow ' + cur + '...');
      const cfSheet = buildCashflowSheet(cur, dates, assumptions, projName, ciSumTabName, coSumTabName, N);
      XLSX.utils.book_append_sheet(wb, cfSheet, cfTabName);
      setTabColor(wb, cfTabName, TAB_COLORS['CF_' + cur] || 'C00000');
      chartSheetNames.push(cfTabName);
      progress += progressPerCurrency * 0.2;
      setProgress(progress);
    }

    // Cashflow EQU
    if (currencies.length > 1 || currencies.some(cur => cur !== 'EGP')) {
      log('Building Cashflow EQU...', 'info');
      const equSheet = buildCashflowEQUSheet(currencies, dates, assumptions);
      XLSX.utils.book_append_sheet(wb, equSheet, 'Cashflow EQU');
      setTabColor(wb, 'Cashflow EQU', TAB_COLORS.CF_EQU);
      chartSheetNames.push('Cashflow EQU');
    }
    setProgress(90);

    // Assumptions tab
    log('Adding Assumptions tab...');
    const aSheet = buildAssumptionsSheet(assumptions);
    XLSX.utils.book_append_sheet(wb, aSheet, 'Assumptions');
    setProgress(92);

    // Download
    log('Generating Excel file with native charts...', 'info');
    const filename = (projName.replace(/[:\\\\/\\?\*\[\]]/g, '-')) + '_Cashflow_Baseline.xlsx';
    await writeWorkbookWithCashflowCharts(wb, filename, chartSheetNames, N);
    setProgress(100);
    log('✓ Download complete: ' + filename, 'ok');

  } catch (err) {
    log('ERROR: ' + err.message, 'err');
    console.error(err);
  }
}

// ============================================================
// TAB COLOR HELPER
// ============================================================
function setTabColor(wb, sheetName, colorHex) {
  const idx = wb.SheetNames.indexOf(sheetName);
  if (idx < 0) return;
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Sheets) wb.Workbook.Sheets = [];
  while (wb.Workbook.Sheets.length <= idx) wb.Workbook.Sheets.push({});
  wb.Workbook.Sheets[idx].tabColor = { rgb: colorHex };
}

// ============================================================
// BUILD CASH IN SHEET
// ============================================================
// Helper: fill all empty cells in a row with a given style
function fillRow(ws, rowIdx, lastCol, style) {
  for (let c = 0; c <= lastCol; c++) {
    const addr = XLSX.utils.encode_cell({r: rowIdx, c: c});
    if (!ws[addr]) ws[addr] = {v: '', t:'s', s: style};
  }
}

function buildCashInSheet(boqItems, cur, dates, assumptions, projName, tabName) {
  const ws = {};
  const N = dates.length;

  let milestones = [];
  for (const [cat, terms] of Object.entries(assumptions.cashInTerms)) {
    if (cat.toUpperCase().includes(cur)) { milestones = terms; break; }
  }
  if (milestones.length === 0 && cur === 'EGP') {
    for (const [cat, terms] of Object.entries(assumptions.cashInTerms)) {
      if (cat.toUpperCase().includes('EGP')) { milestones = terms; break; }
    }
  }
  if (milestones.length === 0) {
    milestones = [{ name: 'Progress', pct: 0.9, days: 45 }, { name: 'Retention', pct: 0.1, days: 45 }];
  }
  const milestoneNames = milestones.map(m => m.name);

  const actualStartCol = 10;
  const actualEndCol = actualStartCol + N - 1;
  const ahCol = actualEndCol + 1;
  const aiCol = ahCol + 1;
  const ajCol = aiCol + 1;
  const akCol = ajCol + 1;
  const alCol = akCol + 1;
  const amCol = alCol + 1;
  const anCol = amCol + 1;
  const gapCol = anCol + 1;
  const betaStartCol = gapCol + 1;
  const betaEndCol = betaStartCol + N - 1;
  const bnCol = betaEndCol + 1;
  const valStartCol = bnCol + 1;
  const valEndCol = valStartCol + N - 1;
  const cmCol = valEndCol + 1;

  ws[XLSX.utils.encode_cell({r:0,c:6})] = {v: 'Dry Cost ' + cur, t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:7})] = {v: 'W/O AP (' + cur + ')', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:8})] = {v: 'W AP (' + cur + ')', t:'s', s: S.header};
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:0,c:actualStartCol-1+i})] = {v: 'Actual Cash IN', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:ahCol-1})] = {v: 'Actual Cash in\n to date', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:aiCol-1})] = {v: 'Cash flow \nEstimate to Completion', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:ajCol-1})] = {v: 'Progress Dates', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:amCol-1})] = {v: 'Cash in Dates', t:'s', s: S.header};

  ws['A2'] = {v: 'Parent Task', t:'s', s: S.subHeader};
  ws['B2'] = {v: 'Sub Task', t:'s', s: S.subHeader};
  ws['C2'] = {v: 'Start ID', t:'s', s: S.subHeader};
  ws['D2'] = {v: 'Finish ID', t:'s', s: S.subHeader};
  ws['E2'] = {v: '%', t:'s', s: S.subHeader};
  ws['F2'] = {v: 'Item Description', t:'s', s: S.subHeader};

  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:actualStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:ajCol-1})] = {v: 'Start ', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:akCol-1})] = {v: 'End', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:amCol-1})] = {v: 2, t:'n', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:anCol-1})] = {v: 2, t:'n', s: S.subHeader};

  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:betaStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:bnCol-1})] = {v: 'TOTAL', t:'s', s: S.subHeader};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:valStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:cmCol-1})] = {v: 'Total', t:'s', s: S.subHeader};

  // Fill ALL columns in rows 1-2 with header/subHeader style for empty cells
  const lastCol = cmCol; // 0-indexed last column
  for (let c = 0; c <= lastCol; c++) {
    const addr0 = XLSX.utils.encode_cell({r:0,c:c});
    if (!ws[addr0]) ws[addr0] = {v: '', t:'s', s: S.header};
    const addr1 = XLSX.utils.encode_cell({r:1,c:c});
    if (!ws[addr1]) ws[addr1] = {v: '', t:'s', s: S.subHeader};
  }

  const AH = colLetter(ahCol), AI = colLetter(aiCol);
  const AJ = colLetter(ajCol), AK = colLetter(akCol), AL = colLetter(alCol);
  const AM = colLetter(amCol), AN = colLetter(anCol);
  const BN = colLetter(bnCol), CM = colLetter(cmCol);

  let row = 3;
  const r0 = row - 1;
  ws[XLSX.utils.encode_cell({r:r0,c:0})] = {v: (cur === 'USD' ? 'Electrical Material Supply' : 'Material Supply'), t:'s', s: S.totalRow};

  for (let i = 0; i < N; i++) {
    const bc = colLetter(betaStartCol + i);
    ws[XLSX.utils.encode_cell({r:r0,c:betaStartCol-1+i})] = {f: 'IFERROR(_xlfn.BETA.DIST(DATE(YEAR(' + bc + '$2),MONTH(' + bc + '$2),15),$' + AM + '$2,$' + AN + '$2,FALSE,DATE(YEAR($' + AM + '3),MONTH($' + AM + '3),1),DATE(YEAR($' + AN + '3),MONTH($' + AN + '3),28)),0)', t:'n', s: S.totalRow};
  }
  ws[XLSX.utils.encode_cell({r:r0,c:bnCol-1})] = {f: 'SUM(' + colLetter(betaStartCol) + '3:' + colLetter(betaEndCol) + '3)', t:'n', s: S.totalRow};

  for (let i = 0; i < N; i++) {
    const ac = colLetter(actualStartCol + i);
    const bc = colLetter(betaStartCol + i);
    ws[XLSX.utils.encode_cell({r:r0,c:valStartCol-1+i})] = {f: 'IF(' + ac + '3<>0,' + ac + '3,IF($' + BN + '3=0,0,' + bc + '3/$' + BN + '3*$' + AI + '3))', t:'n', s: S.totalRow};
  }
  ws[XLSX.utils.encode_cell({r:r0,c:cmCol-1})] = {f: 'SUM(' + colLetter(valStartCol) + '3:' + colLetter(valEndCol) + '3)', t:'n', s: S.totalRow};

  row = 4;
  const allItems = boqItems.filter(item => !item.isHeader);
  if (!ws['!rows']) ws['!rows'] = [];

  const tradeOrder = [];
  const tradeMap = {};
  for (const item of allItems) {
    const t = item.trade || 'Other';
    if (!tradeMap[t]) { tradeMap[t] = {}; tradeOrder.push(t); }
    const b = item.boq || 'Other';
    if (!tradeMap[t][b]) tradeMap[t][b] = {};
    const c = item.category || 'Other';
    if (!tradeMap[t][b][c]) tradeMap[t][b][c] = [];
    tradeMap[t][b][c].push(item);
  }

  function writeBetaAndValues(ws, ri, excelRow) {
    for (let i = 0; i < N; i++) {
      const bc = colLetter(betaStartCol + i);
      ws[XLSX.utils.encode_cell({r:ri,c:betaStartCol-1+i})] = {f: 'IFERROR(_xlfn.BETA.DIST(DATE(YEAR(' + bc + '$2),MONTH(' + bc + '$2),15),$' + AM + '$2,$' + AN + '$2,FALSE,DATE(YEAR($' + AM + excelRow + '),MONTH($' + AM + excelRow + '),1),DATE(YEAR($' + AN + excelRow + '),MONTH($' + AN + excelRow + '),28)),0)', t:'n', s: S.num};
    }
    ws[XLSX.utils.encode_cell({r:ri,c:bnCol-1})] = {f: 'SUM(' + colLetter(betaStartCol) + excelRow + ':' + colLetter(betaEndCol) + excelRow + ')', t:'n', s: S.num};
    for (let i = 0; i < N; i++) {
      const ac = colLetter(actualStartCol + i);
      const bc = colLetter(betaStartCol + i);
      ws[XLSX.utils.encode_cell({r:ri,c:valStartCol-1+i})] = {f: 'IF(' + ac + excelRow + '<>0,' + ac + excelRow + ',IF($' + BN + excelRow + '=0,0,' + bc + excelRow + '/$' + BN + excelRow + '*$' + AI + excelRow + '))', t:'n', s: S.num};
    }
    ws[XLSX.utils.encode_cell({r:ri,c:cmCol-1})] = {f: 'SUM(' + colLetter(valStartCol) + excelRow + ':' + colLetter(valEndCol) + excelRow + ')', t:'n', s: S.num};
  }

  const tradeRows = []; // track trade header rows for total row G column
  for (const tradeName of tradeOrder) {
    const boqMap = tradeMap[tradeName];
    const tradeHeaderRow = row;
    const tri = row - 1;
    ws[XLSX.utils.encode_cell({r:tri,c:0})] = {v: tradeName, t:'s', s: S.trade};
    fillRow(ws, tri, cmCol, S.trade);
    const tradeStartRow = row + 1;
    const boqCatRows = []; // track BOQ category rows for trade G column
    tradeRows.push(row); // track trade rows for total row G column
    row++;

    for (const boqName of Object.keys(boqMap)) {
      const catMap = boqMap[boqName];
      const bri = row - 1;
      boqCatRows.push(row); // record this BOQ category's Excel row number
      ws[XLSX.utils.encode_cell({r:bri,c:4})] = {v: boqName, t:'s', s: S.boqCat};
      fillRow(ws, bri, cmCol, S.boqCat);
      if (!ws['!rows'][bri]) ws['!rows'][bri] = {};
      ws['!rows'][bri].level = 1;
      const boqStartRow = row + 1;
      const sectionRows = []; // track sub-category header rows for G column
      row++;

      for (const catName of Object.keys(catMap)) {
        const items = catMap[catName];
        const cri = row - 1;
        sectionRows.push(row); // record this section's Excel row number
        ws[XLSX.utils.encode_cell({r:cri,c:5})] = {v: catName, t:'s', s: S.section};
        const catDryCost = items.reduce((s, it) => s + getCurrencyAmount(it, cur), 0);
        ws[XLSX.utils.encode_cell({r:cri,c:6})] = {v: catDryCost, t:'n', s: S.section};
        fillRow(ws, cri, cmCol, S.section);
        if (!ws['!rows'][cri]) ws['!rows'][cri] = {};
        ws['!rows'][cri].level = 2;
        row++;

        for (const item of items) {
          const itemAmount = getCurrencyAmount(item, cur);
          if (!itemAmount) continue;
          const itemHeaderRow = row;
          const iri = row - 1;

          ws[XLSX.utils.encode_cell({r:iri,c:0})] = {v: item.taskNum || '', t:'s', s: S.itemHeader};
          ws[XLSX.utils.encode_cell({r:iri,c:4})] = {v: item.taskNum || '', t:'s', s: S.itemHeader};
          ws[XLSX.utils.encode_cell({r:iri,c:5})] = {v: item.description || '', t:'s', s: S.itemHeader};
          ws[XLSX.utils.encode_cell({r:iri,c:6})] = {v: itemAmount, t:'n', s: S.itemHeader};
          writeBetaAndValues(ws, iri, row);
          fillRow(ws, iri, cmCol, S.itemHeader);
          if (!ws['!rows'][iri]) ws['!rows'][iri] = {};
          ws['!rows'][iri].level = 3;
          row++;

          for (const ms of milestones) {
            const mri = row - 1;
            ws[XLSX.utils.encode_cell({r:mri,c:0})] = {v: item.taskNum || '', t:'s', s: S.data};
            ws[XLSX.utils.encode_cell({r:mri,c:4})] = {f: 'IFERROR(_xlfn.XLOOKUP(F' + row + ',Assumptions!B:B,Assumptions!C:C),0)', t:'n', s: S.pct};
            ws[XLSX.utils.encode_cell({r:mri,c:5})] = {v: ms.name, t:'s', s: S.data};
            ws[XLSX.utils.encode_cell({r:mri,c:7})] = {f: 'G' + itemHeaderRow + '*E' + row, t:'n', s: S.num};
            ws[XLSX.utils.encode_cell({r:mri,c:8})] = {f: 'H' + row + '*(1-0)', t:'n', s: S.num};
            const firstActual = colLetter(actualStartCol);
            const lastActual = colLetter(actualEndCol);
            ws[XLSX.utils.encode_cell({r:mri,c:ahCol-1})] = {f: 'SUM(' + firstActual + row + ':' + lastActual + row + ')', t:'n', s: S.num};
            ws[XLSX.utils.encode_cell({r:mri,c:aiCol-1})] = {f: 'I' + row + '-' + AH + row, t:'n', s: S.num};
            ws[XLSX.utils.encode_cell({r:mri,c:alCol-1})] = {f: 'IFERROR(_xlfn.XLOOKUP(F' + row + ',Assumptions!B:B,Assumptions!D:D),0)', t:'n', s: S.num};
            ws[XLSX.utils.encode_cell({r:mri,c:amCol-1})] = {f: AJ + row + '+' + AL + row, t:'n', s: S.date};
            ws[XLSX.utils.encode_cell({r:mri,c:anCol-1})] = {f: AL + row + '+' + AK + row, t:'n', s: S.date};
            writeBetaAndValues(ws, mri, row);
            ws[XLSX.utils.encode_cell({r:mri,c:cmCol})] = {f: 'I' + row + '-' + CM + row, t:'n', s: S.num};
            fillRow(ws, mri, cmCol, S.data);
            if (!ws['!rows'][mri]) ws['!rows'][mri] = {};
            ws['!rows'][mri].level = 4;
            row++;
          }
        }
      }
      // BOQ category G column: SUM only the sub-category (section) header rows
      const gRefs = sectionRows.map(r => 'G' + r).join(',');
      ws[XLSX.utils.encode_cell({r:bri,c:6})] = {f: 'SUM(' + gRefs + ')', t:'n', s: S.boqCat};
    }

    // Trade G column: SUM only the BOQ category header rows
    const tradeGRefs = boqCatRows.map(r => 'G' + r).join(',');
    ws[XLSX.utils.encode_cell({r:tri,c:6})] = {f: 'SUM(' + tradeGRefs + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:tri,c:7})] = {f: 'SUBTOTAL(9,H' + tradeStartRow + ':H' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:tri,c:8})] = {f: 'SUBTOTAL(9,I' + tradeStartRow + ':I' + (row-1) + ')', t:'n', s: S.trade};
    for (let i = 0; i < N; i++) {
      const vc = colLetter(valStartCol + i);
      ws[XLSX.utils.encode_cell({r:tri,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + tradeStartRow + ':' + vc + (row-1) + ')', t:'n', s: S.trade};
    }
    ws[XLSX.utils.encode_cell({r:tri,c:cmCol-1})] = {f: 'SUBTOTAL(9,' + CM + tradeStartRow + ':' + CM + (row-1) + ')', t:'n', s: S.trade};
  }

  ws['!outline'] = { above: true };

  // Clear gap column (between Cash In Dates and BETA) — no fill for all rows
  const gapNoFill = { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border };
  for (let r = 0; r < row; r++) {
    ws[XLSX.utils.encode_cell({r:r,c:gapCol-1})] = {v: '', t:'s', s: gapNoFill};
  }

  const totalRow = row;
  const totalIdx = totalRow - 1;
  const lastDataRow = totalRow - 1;

  // Total row G column: SUM only the trade header rows
  const totalGRefs = tradeRows.map(r => 'G' + r).join(',');
  ws[XLSX.utils.encode_cell({r:r0,c:6})] = {f: 'SUM(' + totalGRefs + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:r0,c:7})] = {f: 'SUBTOTAL(9,H4:H' + lastDataRow + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:r0,c:8})] = {f: 'SUBTOTAL(9,I4:I' + lastDataRow + ')', t:'n', s: S.totalRow};
  for (let i = 0; i < N; i++) {
    const col = colLetter(actualStartCol + i);
    ws[XLSX.utils.encode_cell({r:r0,c:actualStartCol-1+i})] = {f: 'SUBTOTAL(9,' + col + '4:' + col + lastDataRow + ')', t:'n', s: S.totalRow};
  }
  ws[XLSX.utils.encode_cell({r:r0,c:ahCol-1})] = {f: 'SUBTOTAL(9,' + AH + '4:' + AH + lastDataRow + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:r0,c:aiCol-1})] = {f: 'SUBTOTAL(9,' + AI + '4:' + AI + lastDataRow + ')', t:'n', s: S.totalRow};
  fillRow(ws, r0, cmCol, S.totalRow);

  ws[XLSX.utils.encode_cell({r:totalIdx,c:5})] = {v: 'Total CashIn', t:'s', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:totalIdx,c:6})] = {f: 'G3', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:totalIdx,c:7})] = {f: 'H3', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:totalIdx,c:8})] = {f: 'I3', t:'n', s: S.totalRow};
  for (let i = 0; i < N; i++) {
    const vc = colLetter(valStartCol + i);
    ws[XLSX.utils.encode_cell({r:totalIdx,c:valStartCol-1+i})] = {f: vc + '3', t:'n', s: S.totalRow};
  }
  fillRow(ws, totalIdx, cmCol, S.totalRow);

  ws['!cols'] = [{wch:12},{wch:10},{wch:10},{wch:10},{wch:8},{wch:35},{wch:15},{wch:15},{wch:15}];
  for (let c = 9; c <= cmCol + 1; c++) ws['!cols'][c] = { wch: 12 };

  // Column grouping 1: Actual Cash IN months → grouped with level=1, summary = "Actual Cash in to date" (ahCol)
  for (let c = actualStartCol - 1; c <= actualEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  // Column grouping 2: BETA.DIST distribution months → grouped with level=1, summary = "TOTAL" (bnCol)
  for (let c = betaStartCol - 1; c <= betaEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  // Column grouping 3: Value/Distribution months → grouped with level=1, summary = "Total" (cmCol)
  for (let c = valStartCol - 1; c <= valEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  ws['!rows'] = ws['!rows'] || [];
  ws['!rows'][0] = { hpx: 36 };
  ws['!rows'][1] = { hpx: 28 };
  ws['!ref'] = 'A1:' + colLetter(cmCol + 1) + totalRow;

  return { ws, lastRow: totalRow, milestoneNames, valStartCol, cmCol };
}

// ============================================================
// BUILD CASH IN SUMMARY SHEET
// ============================================================
function buildCashInSummarySheet(cur, dates, assumptions, projName, cashInLastRow, milestoneNames, ciTabName, ciSumTabName, ciValStartCol) {
  const ws = {};
  const N = dates.length;
  const ciSheetName = ciTabName;

  ws['D2'] = {v: 'Total In (' + cur + ')', t:'s', s: S.sumHeader};
  ws['E2'] = {v: 'Total', t:'s', s: S.sumHeader};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:5+i})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.sumHeader};
  }

  const lastDateCol = colLetter(5 + N);
  ws['D3'] = {v: 'Total In (' + cur + ')', t:'s', s: S.sumColD};
  ws['E3'] = {f: 'SUM(F3:' + lastDateCol + '3)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:2,c:5+i})] = {f: 'SUM(' + col + '4:' + col + '5)', t:'n', s: S.sumTotal};
  }

  ws['D4'] = {v: 'AP', t:'s', s: S.sumColD};
  ws['E4'] = {f: 'SUM(F4:' + lastDateCol + '4)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    ws[XLSX.utils.encode_cell({r:3,c:5+i})] = {v: 0, t:'n', s: S.sumTotal};
  }

  ws['D5'] = {v: 'Progress', t:'s', s: S.sumColD};
  ws['E5'] = {f: 'SUM(F5:' + lastDateCol + '5)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:4,c:5+i})] = {f: col + '19', t:'n', s: S.sumItem};
  }

  ws['C12'] = {v: 'Discipline', t:'s', s: S.sumSection};
  ws['D12'] = {v: 'Invoicing', t:'s', s: S.sumSection};
  ws['E12'] = {v: 'Total', t:'s', s: S.sumSection};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:11,c:5+i})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.sumSection};
  }

  ws['D13'] = {v: 'Total', t:'s', s: S.sumColD};
  ws['E13'] = {f: 'SUM(F13:' + lastDateCol + '13)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    ws[XLSX.utils.encode_cell({r:12,c:5+i})] = {f: "'" + ciSheetName + "'!" + colLetter(ciValStartCol + i) + cashInLastRow, t:'n', s: S.sumTotal};
  }

  const vatPct = assumptions.deductions['VAT'] || 0.05;
  const apPct = assumptions.deductions['Advanced Payment Deduction (AP)'] || 0.10;
  const stampPct = assumptions.deductions['Stamp Duties & Additional Stamp Duties'] || 0.0243;
  const govPct = assumptions.deductions['Governmental Deductions'] || 0.009;
  const vivaPct = assumptions.deductions['Viva Egypt'] || 0.01;

  const deductRows = [
    {r:13, label:'VAT ' + (vatPct*100).toFixed(0) + '%', formula: function(col){return '(' + col + '13/1.05)*0.05';}},
    {r:14, label:'AP ' + (apPct*100).toFixed(0) + '%', formula: function(col){return '(' + col + '13*' + apPct + ')';}},
    {r:15, label:'STAMP DUTIES & ADDITIONAL STAMP DUTIES ' + (stampPct*100).toFixed(2) + '%', formula: function(col){return '(' + col + '13/1.05)*' + stampPct;}},
    {r:16, label:'GOVERNMENTAL DEDUCTIONS ' + (govPct*100).toFixed(1) + '%', formula: function(col){return '(' + col + '13/1.05)*' + govPct;}},
    {r:17, label:'VIVA EGYPT ' + (vivaPct*100).toFixed(0) + '%', formula: function(col){return '(' + col + '13/1.05)*' + vivaPct;}}
  ];

  for (const dr of deductRows) {
    ws[XLSX.utils.encode_cell({r:dr.r,c:3})] = {v: dr.label, t:'s', s: S.sumColD};
    ws[XLSX.utils.encode_cell({r:dr.r,c:4})] = {f: 'SUM(F' + (dr.r+1) + ':' + lastDateCol + (dr.r+1) + ')', t:'n', s: S.sumColE};
    for (let i = 0; i < N; i++) {
      const col = colLetter(6 + i);
      ws[XLSX.utils.encode_cell({r:dr.r,c:5+i})] = {f: dr.formula(col), t:'n', s: S.sumDeduct};
    }
  }

  ws['D19'] = {v: 'Net', t:'s', s: S.sumColD};
  ws['E19'] = {f: 'SUM(F19:' + lastDateCol + '19)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:18,c:5+i})] = {f: col + '13-' + col + '14-' + col + '15-' + col + '16-' + col + '17-' + col + '18', t:'n', s: S.sumNet};
  }

  ws['D23'] = {v: 'Scope of Work', t:'s', s: S.sumSection};
  ws['E23'] = {v: 'Discipline Total', t:'s', s: S.sumSection};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    if (i === 0) {
      ws[XLSX.utils.encode_cell({r:22,c:5})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.sumSection};
    } else {
      ws[XLSX.utils.encode_cell({r:22,c:5+i})] = {f: 'EDATE(' + colLetter(5+i) + '23,1)', t:'n', z:'MMM-YY', s: S.sumSection};
    }
  }

  ws['D24'] = {v: 'Total Cash in Value', t:'s', s: S.sumColD};
  ws['E24'] = {f: 'SUM(F24:' + colLetter(5+N) + '24)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:23,c:5+i})] = {f: 'SUBTOTAL(9,' + col + '25:' + col + '36)', t:'n', s: S.sumTotal};
  }

  ws['D25'] = {v: projName, t:'s', s: S.sumColD};
  ws['E25'] = {f: 'SUBTOTAL(9,E26:E35)', t:'n', s: S.sumColE};
  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:24,c:5+i})] = {f: 'SUBTOTAL(9,' + col + '26:' + col + '35)', t:'n', s: S.sumItem};
  }

  const msNames = milestoneNames.length > 0 ? milestoneNames : ['Progress', 'Retention'];
  for (let m = 0; m < msNames.length; m++) {
    const r = 25 + m;
    ws[XLSX.utils.encode_cell({r,c:3})] = {v: msNames[m], t:'s', s: S.sumColD};
    ws[XLSX.utils.encode_cell({r,c:4})] = {f: 'SUM(F' + (r+1) + ':' + colLetter(5+N) + (r+1) + ')', t:'n', s: S.sumColE};
    for (let i = 0; i < N; i++) {
      ws[XLSX.utils.encode_cell({r,c:5+i})] = {f: "SUMPRODUCT(('" + ciSheetName + "'!$F$4:$F$5000=$D" + (r+1) + ")*1,'" + ciSheetName + "'!" + colLetter(ciValStartCol + i) + "$4:" + colLetter(ciValStartCol + i) + "$5000)", t:'n', s: S.sumItem};
    }
  }

  ws['!cols'] = [{wch:8},{wch:8},{wch:8},{wch:42},{wch:18}];
  for (let c = 5; c <= 5 + N; c++) ws['!cols'][c] = { wch: 14 };
  ws['!ref'] = 'A1:' + colLetter(6+N) + '40';
  return ws;
}

// ============================================================
// CASH OUT: Resolve payment terms for a budget item by Currency + Category
// ============================================================
function getPaymentTermsForItem(item, cur, assumptions) {
  const budCat = (item.budgetCat || '').trim().toUpperCase();
  const coTerms = assumptions.cashOutTerms;

  // Map budget category to assumption group
  if (budCat === 'MATERIAL') {
    // Look for "Material USD", "Material EGP", "Material EUR"
    for (const [key, terms] of Object.entries(coTerms)) {
      const ku = key.toUpperCase();
      if (ku.includes('MATERIAL') && ku.includes(cur)) return terms;
    }
    // Fallback: any Material key
    for (const [key, terms] of Object.entries(coTerms)) {
      if (key.toUpperCase().includes('MATERIAL')) return terms;
    }
  }

  if (budCat === 'S/C') {
    for (const [key, terms] of Object.entries(coTerms)) {
      if (key.toUpperCase().includes('S/C') || key.toUpperCase() === 'S/C') return terms;
    }
  }

  if (budCat === 'SERVICES' || budCat === 'EQ' || budCat === 'LABOUR') {
    for (const [key, terms] of Object.entries(coTerms)) {
      const ku = key.toUpperCase();
      if (ku.includes('SERVICES') && ku.includes('EQ') && ku.includes('LABOUR')) return terms;
      if (ku.includes('SERVICES') && ku.includes('LABOUR')) return terms;
    }
    // Fallback: look for key containing SERVICES
    for (const [key, terms] of Object.entries(coTerms)) {
      if (key.toUpperCase().includes('SERVICES')) return terms;
    }
  }

  // Default fallback
  return [{ name: 'Payment', pct: 1.0, days: 0 }];
}

// Map budget category to cash out group
function getCashOutGroup(budgetCat) {
  const bc = (budgetCat || '').trim().toUpperCase();
  if (bc === 'MATERIAL') return 'Material Supply';
  if (bc === 'S/C') return 'S/C';
  if (bc === 'SERVICES' || bc === 'EQ' || bc === 'LABOUR') return 'SERVICES-EQ-LABOUR';
  return 'Material Supply'; // default
}

// ============================================================
// BUILD CASH OUT SHEET (v2.8 — grouped by category with per-item payment terms)
// ============================================================
function buildCashOutSheet(budgetItems, cur, dates, assumptions, projName, tabName, ciTabName, ciLastRow) {
  const ws = {};
  const N = dates.length;

  // Column layout (same as before, with AA column for Cash Duration Days)
  const actualStartCol = 9;
  const actualEndCol = actualStartCol + N - 1;
  const ahCol = actualEndCol + 1;
  const aiCol = ahCol + 1;
  const ajCol = aiCol + 1;
  const akCol = ajCol + 1;
  const alCol = akCol + 1;
  const amCol = alCol + 1;
  const gapCol = amCol + 1;
  const betaStartCol = gapCol + 1;
  const betaEndCol = betaStartCol + N - 1;
  const bmCol = betaEndCol + 1;
  const valStartCol = bmCol + 1;
  const valEndCol = valStartCol + N - 1;
  const clCol = valEndCol + 1;

  const AH = colLetter(ahCol), AI = colLetter(aiCol), AJ = colLetter(ajCol);
  const AK = colLetter(akCol), AL = colLetter(alCol), AM = colLetter(amCol);
  const BM = colLetter(bmCol), CL = colLetter(clCol);

  // --- HEADERS ---
  ws[XLSX.utils.encode_cell({r:0,c:5})] = {v: 'Dry Cost ' + cur, t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:6})] = {v: 'W/O AP', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:7})] = {v: 'W AP', t:'s', s: S.header};
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:0,c:actualStartCol-1+i})] = {v: 'Actual Cash Out', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:ahCol-1})] = {v: 'Cash flow \nEstimate to Completion', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:aiCol-1})] = {v: 'Progress Dates', t:'s', s: S.header};
  ws[XLSX.utils.encode_cell({r:0,c:alCol-1})] = {v: 'Cash Out Dates', t:'s', s: S.header};

  ws['A2'] = {v: 'Parent Task', t:'s', s: S.subHeader};
  ws['B2'] = {v: 'Start ID', t:'s', s: S.subHeader};
  ws['C2'] = {v: 'Finish ID', t:'s', s: S.subHeader};
  ws['D2'] = {v: '%', t:'s', s: S.subHeader};
  ws['E2'] = {v: 'Item Description', t:'s', s: S.subHeader};

  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:actualStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:aiCol-1})] = {v: 'Start ', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:ajCol-1})] = {v: 'End', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:alCol-1})] = {v: 2, t:'n', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r:1,c:amCol-1})] = {v: 2, t:'n', s: S.subHeader};

  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:betaStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:bmCol-1})] = {v: 'TOTAL', t:'s', s: S.subHeader};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:1,c:valStartCol-1+i})] = {v: dateSerial(d.year, d.month, d.day || 1), t:'n', z:'MMM-YY', s: S.dateBold};
  }
  ws[XLSX.utils.encode_cell({r:1,c:clCol-1})] = {v: 'Total', t:'s', s: S.subHeader};

  // Fill ALL columns in rows 1-2 with header/subHeader style for empty cells
  const lastCol = clCol;
  for (let c = 0; c <= lastCol; c++) {
    const addr0 = XLSX.utils.encode_cell({r:0,c:c});
    if (!ws[addr0]) ws[addr0] = {v: '', t:'s', s: S.header};
    const addr1 = XLSX.utils.encode_cell({r:1,c:c});
    if (!ws[addr1]) ws[addr1] = {v: '', t:'s', s: S.subHeader};
  }
  // Gap column (between Cash Out Dates and BETA.DIST) — clear fill for all rows
  const noFillStyle = { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border };
  ws[XLSX.utils.encode_cell({r:0,c:gapCol-1})] = {v: '', t:'s', s: noFillStyle};
  ws[XLSX.utils.encode_cell({r:1,c:gapCol-1})] = {v: '', t:'s', s: noFillStyle};

  // --- HELPER: Write BETA.DIST and value formulas for a row ---
  function writeCOBetaValues(ws, ri, excelRow) {
    for (let i = 0; i < N; i++) {
      const bc = colLetter(betaStartCol + i);
      ws[XLSX.utils.encode_cell({r:ri,c:betaStartCol-1+i})] = {f: 'IFERROR(_xlfn.BETA.DIST(DATE(YEAR(' + bc + '$2),MONTH(' + bc + '$2),15),$' + AL + '$2,$' + AM + '$2,FALSE,DATE(YEAR($' + AL + excelRow + '),MONTH($' + AL + excelRow + '),1),DATE(YEAR($' + AM + excelRow + '),MONTH($' + AM + excelRow + '),28)),0)', t:'n', s: S.num};
    }
    ws[XLSX.utils.encode_cell({r:ri,c:bmCol-1})] = {f: 'SUM(' + colLetter(betaStartCol) + excelRow + ':' + colLetter(betaEndCol) + excelRow + ')', t:'n', s: S.num};
    for (let i = 0; i < N; i++) {
      const ac = colLetter(actualStartCol + i);
      const bc = colLetter(betaStartCol + i);
      ws[XLSX.utils.encode_cell({r:ri,c:valStartCol-1+i})] = {f: 'IF(' + ac + excelRow + '<>0,' + ac + excelRow + ',IF($' + BM + excelRow + '=0,0,' + bc + excelRow + '/$' + BM + excelRow + '*$' + AH + excelRow + '))', t:'n', s: S.num};
    }
    ws[XLSX.utils.encode_cell({r:ri,c:clCol-1})] = {f: 'SUM(' + colLetter(valStartCol) + excelRow + ':' + colLetter(valEndCol) + excelRow + ')', t:'n', s: S.num};
  }

  // --- TOP TOTAL ROW (row 3) ---
  ws[XLSX.utils.encode_cell({r:2,c:0})] = {v: 'Total Cash Out ' + cur, t:'s', s: S.totalRow};
  fillRow(ws, 2, lastCol, S.totalRow);

  let row = 4;
  if (!ws['!rows']) ws['!rows'] = [];

  // Collect all milestone names for summary
  const allMilestoneNames = new Set();

  // --- GROUP BUDGET ITEMS ---
  const groupOrder = ['Material Supply', 'S/C', 'SERVICES-EQ-LABOUR'];
  const groupedItems = {};
  for (const g of groupOrder) groupedItems[g] = [];

  // Filter: always use non-parent items (they have the correct budgetCat for grouping)
  // Skip items with no amount. Never use parent (#) rows since they lack budgetCat.
  const dataItems = budgetItems.filter(item => !item.isParent && item.amount > 0);

  for (const item of dataItems) {
    const group = getCashOutGroup(item.budgetCat);
    if (groupedItems[group]) groupedItems[group].push(item);
    else groupedItems['Material Supply'].push(item); // default
  }

  // --- Track group header rows for SUBTOTAL formulas ---
  const groupHeaderRows = {};

  // --- WRITE EACH GROUP ---
  for (const groupName of groupOrder) {
    const items = groupedItems[groupName];
    const hri = row - 1;
    const groupStartRow = row + 1;
    groupHeaderRows[groupName] = { headerRow: row, startRow: groupStartRow };

    // Group header
    ws[XLSX.utils.encode_cell({r:hri,c:0})] = {v: groupName, t:'s', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:4})] = {v: groupName, t:'s', s: S.trade};
    fillRow(ws, hri, lastCol, S.trade);
    row++;

    if (items.length === 0) {
      // Empty group — leave a blank data row placeholder
      const eri = row - 1;
      ws[XLSX.utils.encode_cell({r:eri,c:4})] = {v: '(No items)', t:'s', s: S.data};
      fillRow(ws, eri, lastCol, S.data);
      if (!ws['!rows'][eri]) ws['!rows'][eri] = {};
      ws['!rows'][eri].level = 1;
      row++;
    }

    for (const item of items) {
      const milestones = getPaymentTermsForItem(item, cur, assumptions);
      const itemHeaderRow = row;
      const iri = row - 1;

      // Parent task row (dry cost) — styled as sub-category heading
      ws[XLSX.utils.encode_cell({r:iri,c:0})] = {v: item.taskNum || '', t:'s', s: S.section};
      ws[XLSX.utils.encode_cell({r:iri,c:3})] = {v: item.taskNum || '', t:'s', s: S.section};
      ws[XLSX.utils.encode_cell({r:iri,c:4})] = {v: item.description || '', t:'s', s: S.section};
      ws[XLSX.utils.encode_cell({r:iri,c:5})] = {v: item.amount || 0, t:'n', s: S.section};
      writeCOBetaValues(ws, iri, row);
      fillRow(ws, iri, lastCol, S.section);
      if (!ws['!rows'][iri]) ws['!rows'][iri] = {};
      ws['!rows'][iri].level = 1;
      row++;

      // Milestone rows (payment terms split)
      for (const ms of milestones) {
        allMilestoneNames.add(ms.name);
        const mri = row - 1;

        ws[XLSX.utils.encode_cell({r:mri,c:0})] = {v: item.taskNum || '', t:'s', s: S.data};
        // Percentage
        ws[XLSX.utils.encode_cell({r:mri,c:3})] = {v: ms.pct, t:'n', s: S.pct};
        // Milestone name
        ws[XLSX.utils.encode_cell({r:mri,c:4})] = {v: ms.name, t:'s', s: S.data};
        // W/O AP = Dry Cost * %
        ws[XLSX.utils.encode_cell({r:mri,c:6})] = {f: 'F' + itemHeaderRow + '*D' + row, t:'n', s: S.num};
        // W AP
        ws[XLSX.utils.encode_cell({r:mri,c:7})] = {f: 'G' + row, t:'n', s: S.num};
        // Estimate to Completion
        const firstActual = colLetter(actualStartCol);
        const lastActual = colLetter(actualEndCol);
        ws[XLSX.utils.encode_cell({r:mri,c:ahCol-1})] = {f: 'H' + row + '-SUM(' + firstActual + row + ':' + lastActual + row + ')', t:'n', s: S.num};
        // Cash Duration Days (column AK) — written directly from payment terms
        ws[XLSX.utils.encode_cell({r:mri,c:akCol-1})] = {v: ms.days, t:'n', s: S.num};
        // Cash Out dates
        ws[XLSX.utils.encode_cell({r:mri,c:alCol-1})] = {f: AI + row + '+' + AK + row, t:'n', s: S.date};
        ws[XLSX.utils.encode_cell({r:mri,c:amCol-1})] = {f: AK + row + '+' + AJ + row, t:'n', s: S.date};
        // BETA distribution and values
        writeCOBetaValues(ws, mri, row);
        // Variance
        ws[XLSX.utils.encode_cell({r:mri,c:clCol})] = {f: 'H' + row + '-' + CL + row, t:'n', s: S.num};
        fillRow(ws, mri, lastCol, S.data);
        if (!ws['!rows'][mri]) ws['!rows'][mri] = {};
        ws['!rows'][mri].level = 2;
        row++;
      }
    }
    const groupEndRow = row - 1;
    ws[XLSX.utils.encode_cell({r:hri,c:5})] = {f: 'SUBTOTAL(9,F' + groupStartRow + ':F' + groupEndRow + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:6})] = {f: 'SUBTOTAL(9,G' + groupStartRow + ':G' + groupEndRow + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:7})] = {f: 'SUBTOTAL(9,H' + groupStartRow + ':H' + groupEndRow + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:ahCol-1})] = {f: 'SUBTOTAL(9,' + AH + groupStartRow + ':' + AH + groupEndRow + ')', t:'n', s: S.trade};
    for (let i = 0; i < N; i++) {
      const vc = colLetter(valStartCol + i);
      ws[XLSX.utils.encode_cell({r:hri,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + groupStartRow + ':' + vc + groupEndRow + ')', t:'n', s: S.trade};
    }
    ws[XLSX.utils.encode_cell({r:hri,c:clCol-1})] = {f: 'SUBTOTAL(9,' + CL + groupStartRow + ':' + CL + groupEndRow + ')', t:'n', s: S.trade};
    groupHeaderRows[groupName].endRow = groupEndRow;
  }

  // --- INDIRECT COST section (always present, even if empty) ---
  const indirectItems = (assumptions.indirectCostItems || []).filter(ic => ic.currency === cur);
  {
    const hri = row - 1;
    ws[XLSX.utils.encode_cell({r:hri,c:0})] = {v: 'INDIRECT COST', t:'s', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:4})] = {v: 'Indirect Cost', t:'s', s: S.trade};
    const icStartRow = row + 1;
    groupHeaderRows['INDIRECT COST'] = { headerRow: row, startRow: icStartRow };
    fillRow(ws, hri, lastCol, S.trade);
    row++;

    if (indirectItems.length === 0) {
      const eri = row - 1;
      ws[XLSX.utils.encode_cell({r:eri,c:4})] = {v: '(No items)', t:'s', s: S.data};
      fillRow(ws, eri, lastCol, S.data);
      if (!ws['!rows'][eri]) ws['!rows'][eri] = {};
      ws['!rows'][eri].level = 1;
      row++;
    }

    for (const ic of indirectItems) {
      allMilestoneNames.add(ic.name);
      const iri = row - 1;
      ws[XLSX.utils.encode_cell({r:iri,c:4})] = {v: ic.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r:iri,c:5})] = {v: ic.value, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:iri,c:6})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:iri,c:7})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:iri,c:ahCol-1})] = {f: 'H' + row + '-SUM(' + colLetter(actualStartCol) + row + ':' + colLetter(actualEndCol) + row + ')', t:'n', s: S.num};
      writeCOBetaValues(ws, iri, row);
      fillRow(ws, iri, lastCol, S.data);
      if (!ws['!rows'][iri]) ws['!rows'][iri] = {};
      ws['!rows'][iri].level = 1;
      row++;
    }
    ws[XLSX.utils.encode_cell({r:hri,c:5})] = {f: 'SUBTOTAL(9,F' + icStartRow + ':F' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:6})] = {f: 'SUBTOTAL(9,G' + icStartRow + ':G' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:7})] = {f: 'SUBTOTAL(9,H' + icStartRow + ':H' + (row-1) + ')', t:'n', s: S.trade};
    for (let i = 0; i < N; i++) {
      const vc = colLetter(valStartCol + i);
      ws[XLSX.utils.encode_cell({r:hri,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + icStartRow + ':' + vc + (row-1) + ')', t:'n', s: S.trade};
    }
    ws[XLSX.utils.encode_cell({r:hri,c:clCol-1})] = {f: 'SUBTOTAL(9,' + CL + icStartRow + ':' + CL + (row-1) + ')', t:'n', s: S.trade};
    groupHeaderRows['INDIRECT COST'].endRow = row - 1;
  }

  // --- PROJECT OVERHEADS section (always present) ---
  const ohItems = assumptions.projectOverheads.filter(oh => getCurrencyAmount(oh, cur) > 0);
  {
    const hri = row - 1;
    ws[XLSX.utils.encode_cell({r:hri,c:0})] = {v: 'PROJECT OVERHEADS', t:'s', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:4})] = {v: 'Project Overheads', t:'s', s: S.trade};
    const ohStartRow = row + 1;
    groupHeaderRows['PROJECT OVERHEADS'] = { headerRow: row, startRow: ohStartRow };
    fillRow(ws, hri, lastCol, S.trade);
    row++;

    if (ohItems.length === 0) {
      const eri = row - 1;
      ws[XLSX.utils.encode_cell({r:eri,c:4})] = {v: '(No items)', t:'s', s: S.data};
      fillRow(ws, eri, lastCol, S.data);
      if (!ws['!rows'][eri]) ws['!rows'][eri] = {};
      ws['!rows'][eri].level = 1;
      row++;
    }

    for (const oh of ohItems) {
      allMilestoneNames.add(oh.name);
      const ori = row - 1;
      ws[XLSX.utils.encode_cell({r:ori,c:4})] = {v: oh.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r:ori,c:5})] = {v: getCurrencyAmount(oh, cur), t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:ori,c:6})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:ori,c:7})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:ori,c:ahCol-1})] = {f: 'H' + row + '-SUM(' + colLetter(actualStartCol) + row + ':' + colLetter(actualEndCol) + row + ')', t:'n', s: S.num};
      writeCOBetaValues(ws, ori, row);
      fillRow(ws, ori, lastCol, S.data);
      if (!ws['!rows'][ori]) ws['!rows'][ori] = {};
      ws['!rows'][ori].level = 1;
      row++;
    }
    ws[XLSX.utils.encode_cell({r:hri,c:5})] = {f: 'SUBTOTAL(9,F' + ohStartRow + ':F' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:6})] = {f: 'SUBTOTAL(9,G' + ohStartRow + ':G' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:7})] = {f: 'SUBTOTAL(9,H' + ohStartRow + ':H' + (row-1) + ')', t:'n', s: S.trade};
    for (let i = 0; i < N; i++) {
      const vc = colLetter(valStartCol + i);
      ws[XLSX.utils.encode_cell({r:hri,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + ohStartRow + ':' + vc + (row-1) + ')', t:'n', s: S.trade};
    }
    ws[XLSX.utils.encode_cell({r:hri,c:clCol-1})] = {f: 'SUBTOTAL(9,' + CL + ohStartRow + ':' + CL + (row-1) + ')', t:'n', s: S.trade};
    groupHeaderRows['PROJECT OVERHEADS'].endRow = row - 1;
  }

  // --- RISKS & CONTINGENCIES section (always present) ---
  const rcItems = assumptions.risksContingencies.filter(rc => getCurrencyAmount(rc, cur) > 0);
  {
    const hri = row - 1;
    ws[XLSX.utils.encode_cell({r:hri,c:0})] = {v: 'RISKS & CONTINGENCIES', t:'s', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:4})] = {v: 'Risks & Contingencies', t:'s', s: S.trade};
    const rcStartRow = row + 1;
    groupHeaderRows['RISKS & CONTINGENCIES'] = { headerRow: row, startRow: rcStartRow };
    fillRow(ws, hri, lastCol, S.trade);
    row++;

    if (rcItems.length === 0) {
      const eri = row - 1;
      ws[XLSX.utils.encode_cell({r:eri,c:4})] = {v: '(No items)', t:'s', s: S.data};
      fillRow(ws, eri, lastCol, S.data);
      if (!ws['!rows'][eri]) ws['!rows'][eri] = {};
      ws['!rows'][eri].level = 1;
      row++;
    }

    for (const rc of rcItems) {
      allMilestoneNames.add(rc.name);
      const rci = row - 1;
      ws[XLSX.utils.encode_cell({r:rci,c:4})] = {v: rc.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r:rci,c:5})] = {v: getCurrencyAmount(rc, cur), t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:rci,c:6})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:rci,c:7})] = {f: 'F' + row, t:'n', s: S.num};
      ws[XLSX.utils.encode_cell({r:rci,c:ahCol-1})] = {f: 'H' + row + '-SUM(' + colLetter(actualStartCol) + row + ':' + colLetter(actualEndCol) + row + ')', t:'n', s: S.num};
      writeCOBetaValues(ws, rci, row);
      fillRow(ws, rci, lastCol, S.data);
      if (!ws['!rows'][rci]) ws['!rows'][rci] = {};
      ws['!rows'][rci].level = 1;
      row++;
    }
    ws[XLSX.utils.encode_cell({r:hri,c:5})] = {f: 'SUBTOTAL(9,F' + rcStartRow + ':F' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:6})] = {f: 'SUBTOTAL(9,G' + rcStartRow + ':G' + (row-1) + ')', t:'n', s: S.trade};
    ws[XLSX.utils.encode_cell({r:hri,c:7})] = {f: 'SUBTOTAL(9,H' + rcStartRow + ':H' + (row-1) + ')', t:'n', s: S.trade};
    for (let i = 0; i < N; i++) {
      const vc = colLetter(valStartCol + i);
      ws[XLSX.utils.encode_cell({r:hri,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + rcStartRow + ':' + vc + (row-1) + ')', t:'n', s: S.trade};
    }
    ws[XLSX.utils.encode_cell({r:hri,c:clCol-1})] = {f: 'SUBTOTAL(9,' + CL + rcStartRow + ':' + CL + (row-1) + ')', t:'n', s: S.trade};
    groupHeaderRows['RISKS & CONTINGENCIES'].endRow = row - 1;
  }

  // --- TOTAL ROW (row 3) with SUBTOTAL over all data ---
  const coLastDataRow = row - 1;
  ws[XLSX.utils.encode_cell({r:2,c:5})] = {f: 'SUBTOTAL(9,F4:F' + coLastDataRow + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:2,c:6})] = {f: 'SUBTOTAL(9,G4:G' + coLastDataRow + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:2,c:7})] = {f: 'SUBTOTAL(9,H4:H' + coLastDataRow + ')', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:2,c:ahCol-1})] = {f: 'SUBTOTAL(9,' + AH + '4:' + AH + coLastDataRow + ')', t:'n', s: S.totalRow};
  for (let i = 0; i < N; i++) {
    const vc = colLetter(valStartCol + i);
    ws[XLSX.utils.encode_cell({r:2,c:valStartCol-1+i})] = {f: 'SUBTOTAL(9,' + vc + '4:' + vc + coLastDataRow + ')', t:'n', s: S.totalRow};
  }
  ws[XLSX.utils.encode_cell({r:2,c:clCol-1})] = {f: 'SUBTOTAL(9,' + CL + '4:' + CL + coLastDataRow + ')', t:'n', s: S.totalRow};
  fillRow(ws, 2, lastCol, S.totalRow);

  // Final total row
  const totalRow = row;
  const tri = totalRow - 1;
  ws[XLSX.utils.encode_cell({r:tri,c:4})] = {v: 'Total Cashout', t:'s', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:tri,c:5})] = {f: 'F3', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:tri,c:6})] = {f: 'G3', t:'n', s: S.totalRow};
  ws[XLSX.utils.encode_cell({r:tri,c:7})] = {f: 'H3', t:'n', s: S.totalRow};
  for (let i = 0; i < N; i++) {
    const vc = colLetter(valStartCol + i);
    ws[XLSX.utils.encode_cell({r:tri,c:valStartCol-1+i})] = {f: vc + '3', t:'n', s: S.totalRow};
  }
  ws[XLSX.utils.encode_cell({r:tri,c:clCol-1})] = {f: CL + '3', t:'n', s: S.totalRow};
  fillRow(ws, tri, lastCol, S.totalRow);
  row++;

  ws['!outline'] = { above: true };

  // Clear gap column (between Cash Out Dates and BETA) — no fill for all rows
  const gapNoFill = { font:{sz:10,name:'Calibri',color:{rgb:'000000'}}, border };
  for (let r = 0; r < row; r++) {
    ws[XLSX.utils.encode_cell({r:r,c:gapCol-1})] = {v: '', t:'s', s: gapNoFill};
  }

  ws['!cols'] = [{wch:12},{wch:10},{wch:10},{wch:8},{wch:35},{wch:15},{wch:15},{wch:15}];
  for (let c = 8; c <= clCol + 1; c++) ws['!cols'][c] = { wch: 12 };

  // Column grouping 1: Actual Cash Out months → grouped with level=1, summary = "Cash flow Estimate to Completion" (ahCol)
  for (let c = actualStartCol - 1; c <= actualEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  // Column grouping 2: BETA.DIST distribution months → grouped with level=1, summary = "TOTAL" (bmCol)
  for (let c = betaStartCol - 1; c <= betaEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  // Column grouping 3: Value months → grouped with level=1, summary = "Total" (clCol)
  for (let c = valStartCol - 1; c <= valEndCol - 1; c++) {
    if (!ws['!cols'][c]) ws['!cols'][c] = { wch: 12 };
    ws['!cols'][c].level = 1;
  }

  ws['!rows'] = ws['!rows'] || [];
  ws['!rows'][0] = { hpx: 36 };
  ws['!rows'][1] = { hpx: 28 };
  ws['!ref'] = 'A1:' + colLetter(clCol + 1) + row;

  return { ws, lastRow: row, milestoneNames: Array.from(allMilestoneNames), valStartCol, clCol, groupHeaderRows };
}

// ============================================================
// BUILD CASH OUT SUMMARY SHEET
// ============================================================
function buildCashOutSummarySheet(cur, dates, assumptions, projName, cashOutLastRow, milestoneNames, coTabName, coSumTabName, ciSumTabName, coValStartCol, groupHeaderRows) {
  const ws = {};
  const N = dates.length;
  const coSheetName = coTabName;
  const ciSumSheetName = ciSumTabName;

  ws['C1'] = {v: 'OUT', t:'s', s: S.sumHeader};
  ws['D1'] = {f: 'E4', t:'n', s: S.sumTotal};
  ws['E1'] = {v: 'Profit %', t:'s', s: S.sumHeader};

  ws['C2'] = {v: 'OUT - IN', t:'s', s: S.sumHeader};
  ws['D2'] = {f: "='" + ciSumSheetName + "'!E3", t:'n', s: S.sumTotal};
  ws['E2'] = {f: '=1-D1/D2', t:'n', s: S.sumTotal};

  ws['C3'] = {v: 'Discipline', t:'s', s: S.sumSection};
  ws['D3'] = {v: 'Scope of Work', t:'s', s: S.sumSection};
  ws['E3'] = {v: 'Discipline Total', t:'s', s: S.sumSection};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    if (i === 0) {
      ws[XLSX.utils.encode_cell({r:2,c:5})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.sumSection};
    } else {
      ws[XLSX.utils.encode_cell({r:2,c:5+i})] = {f: 'EDATE(' + colLetter(5+i) + '3,1)', t:'n', z:'MMM-YY', s: S.sumSection};
    }
  }

  const lastCol = colLetter(5 + N);
  ws['D4'] = {v: 'Total Cash Out Value', t:'s', s: S.sumColD};
  ws['E4'] = {f: 'SUM(F4:' + lastCol + '4)', t:'n', s: S.sumColE};

  // One row per unique scope-of-work name from the Cash Out sheet.
  // Period cells use the ND10 pattern: match label (column E) against one
  // source value column per month. Do not SUMPRODUCT a 2D month matrix.
  const names = (milestoneNames && milestoneNames.length > 0) ? milestoneNames : [];
  const coLast = cashOutLastRow;
  const firstRow = 5;

  if (names.length === 0) {
    ws[XLSX.utils.encode_cell({r:4,c:3})] = {v: '(No items)', t:'s', s: S.sumLabel};
    ws[XLSX.utils.encode_cell({r:4,c:4})] = {v: 0, t:'n', s: S.sumItem};
    for (let i = 0; i < N; i++) {
      ws[XLSX.utils.encode_cell({r:4,c:5+i})] = {v: 0, t:'n', s: S.sumItem};
    }
    for (let i = 0; i < N; i++) {
      const col = colLetter(6 + i);
      ws[XLSX.utils.encode_cell({r:3,c:5+i})] = {f: 'SUBTOTAL(9,' + col + '5:' + col + '5)', t:'n', s: S.sumTotal};
    }
    ws['!cols'] = [{wch:8},{wch:8},{wch:8},{wch:42},{wch:18}];
    for (let c = 5; c <= 5 + N; c++) ws['!cols'][c] = { wch: 14 };
    ws['!ref'] = 'A1:' + colLetter(6+N) + '5';
    return ws;
  }

  const lastRow = firstRow + names.length - 1;

  for (let i = 0; i < names.length; i++) {
    const r = firstRow + i;
    const ri = r - 1;
    const name = names[i];

    ws[XLSX.utils.encode_cell({r:ri,c:3})] = {v: name, t:'s', s: S.sumLabel};
    ws[XLSX.utils.encode_cell({r:ri,c:4})] = {f: 'SUM(F' + r + ':' + lastCol + r + ')', t:'n', s: S.sumItem};

    for (let j = 0; j < N; j++) {
      const srcCol = colLetter(coValStartCol + j);
      const formula = "SUMPRODUCT(('" + coSheetName + "'!$E$4:$E$" + coLast + "=$D" + r + ")"
                    + "*1,'" + coSheetName + "'!" + srcCol + "$4:" + srcCol + "$" + coLast + ")";
      ws[XLSX.utils.encode_cell({r:ri,c:5+j})] = {f: formula, t:'n', s: S.sumItem};
    }
  }

  for (let i = 0; i < N; i++) {
    const col = colLetter(6 + i);
    ws[XLSX.utils.encode_cell({r:3,c:5+i})] = {f: 'SUBTOTAL(9,' + col + firstRow + ':' + col + lastRow + ')', t:'n', s: S.sumTotal};
  }

  ws['!cols'] = [{wch:8},{wch:8},{wch:8},{wch:42},{wch:18}];
  for (let c = 5; c <= 5 + N; c++) ws['!cols'][c] = { wch: 14 };
  ws['!ref'] = 'A1:' + colLetter(6+N) + lastRow;
  return ws;
}

// ============================================================
// BUILD CASHFLOW SHEET (with embedded chart XML)
// ============================================================
function buildCashflowSheet(cur, dates, assumptions, projName, ciSumTabName, coSumTabName, N) {
  const ws = {};
  if (!N) N = dates.length;
  const ciSumName = ciSumTabName;
  const coSumName = coSumTabName;

  // === HEADER BLOCK (rows 1-9) ===
  ws['B2'] = {v: 'CASH FLOW BASELINE', t:'s', s: S.cfBanner};
  ws['B3'] = {v: projName, t:'s', s: S.cfProjName};

  ws['B5'] = {v: 'Currency', t:'s', s: S.cfInfoLbl};
  ws['C5'] = {v: cur, t:'s', s: S.cfInfoVal};
  ws['D5'] = {v: 'Start Date', t:'s', s: S.cfInfoLbl};
  ws['E5'] = {v: dates[0] ? dateSerial(dates[0].year, dates[0].month, 1) : '', t:'n', z:'MMM-YYYY', s: S.cfInfoVal};

  ws['B6'] = {v: 'Duration', t:'s', s: S.cfInfoLbl};
  ws['C6'] = {v: N + ' Months', t:'s', s: S.cfInfoVal};
  ws['D6'] = {v: 'End Date', t:'s', s: S.cfInfoLbl};
  ws['E6'] = {v: dates[dates.length-1] ? dateSerial(dates[dates.length-1].year, dates[dates.length-1].month, 1) : '', t:'n', z:'MMM-YYYY', s: S.cfInfoVal};

  // Title (row 10)
  ws['B10'] = {v: projName + ' - Cash Flow ' + cur, t:'s', s: S.cfTitle};

  // === METRICS BOX (rows 31-34) ===
  ws['B31'] = {v: 'Max. Deficit:', t:'s', s: S.cfMboxLbl};
  ws['C31'] = {f: 'MIN(C44:' + colLetter(2+N) + '44)', t:'n', s: S.cfMboxNeg};
  ws['B32'] = {v: 'Total Cash In:', t:'s', s: S.cfMboxLbl};
  ws['C32'] = {f: colLetter(2+N) + '39', t:'n', s: S.cfMboxVal};
  ws['B33'] = {v: 'Total Cash Out:', t:'s', s: S.cfMboxLbl};
  ws['C33'] = {f: colLetter(2+N) + '42', t:'n', s: S.cfMboxVal};
  ws['B34'] = {v: 'Net Position:', t:'s', s: S.cfMboxLbl};
  ws['C34'] = {f: 'C32-C33', t:'n', s: S.cfMboxPos};

  // Row 36: dates (was 61)
  ws['B36'] = {v: 'Overall', t:'s', s: S.cfOverall};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:35,c:2+i})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.cfDateHdr};
  }

  // Row 37: Month numbers (was 62)
  ws['B37'] = {v: 'Month', t:'s', s: S.cfMonthNum};
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:36,c:2+i})] = {v: i+1, t:'n', s: S.cfMonthNum};

  // Row 38: Cash In (was 63)
  ws['B38'] = {v: 'Project Cash In "' + cur + '"', t:'s', s: S.cfCashIn};
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:37,c:2+i})] = {f: "='" + ciSumName + "'!" + colLetter(6+i) + "3", t:'n', s: S.cfCashIn};

  // Row 39: Cumulative Cash In (was 64)
  ws['B39'] = {v: 'Cumulative Project Cash In "' + cur + '"', t:'s', s: S.cfCum};
  ws[XLSX.utils.encode_cell({r:38,c:2})] = {f: '=C38', t:'n', s: S.cfCum};
  for (let i = 1; i < N; i++) {
    const col = colLetter(3+i);
    const prev = colLetter(2+i);
    ws[XLSX.utils.encode_cell({r:38,c:2+i})] = {f: '=' + col + '38+' + prev + '39', t:'n', s: S.cfCum};
  }

  // Row 40: Cash In % (was 65)
  ws['B40'] = {v: 'Cash In %', t:'s', s: S.cfPct};
  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:39,c:2+i})] = {f: '=IFERROR(' + col + '39/$' + colLetter(2+N) + '$39,0)', t:'n', z:'0.0%', s: S.cfPct};
  }

  // Row 41: Cash Out (was 66)
  ws['B41'] = {v: 'Project Cash Out "' + cur + '"', t:'s', s: S.cfCashOut};
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:40,c:2+i})] = {f: "='" + coSumName + "'!" + colLetter(6+i) + "4", t:'n', s: S.cfCashOut};

  // Row 42: Cumulative Cash Out (was 67)
  ws['B42'] = {v: 'Cumulative Project Cash Out "' + cur + '"', t:'s', s: S.cfCum};
  ws[XLSX.utils.encode_cell({r:41,c:2})] = {f: '=C41', t:'n', s: S.cfCum};
  for (let i = 1; i < N; i++) {
    const col = colLetter(3+i);
    const prev = colLetter(2+i);
    ws[XLSX.utils.encode_cell({r:41,c:2+i})] = {f: '=' + col + '41+' + prev + '42', t:'n', s: S.cfCum};
  }

  // Row 43: Cash Out % (was 68)
  ws['B43'] = {v: 'Cash Out %', t:'s', s: S.cfPct};
  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:42,c:2+i})] = {f: '=IFERROR(' + col + '42/$' + colLetter(2+N) + '$42,0)', t:'n', z:'0.0%', s: S.cfPct};
  }

  // Row 44: Net Cash Flow (was 69)
  ws['B44'] = {v: 'Project Net Cash Flow "' + cur + '"', t:'s', s: S.cfNet};
  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:43,c:2+i})] = {f: '=' + col + '39-' + col + '42', t:'n', s: S.cfNet};
  }

  ws['!cols'] = [{wch:2},{wch:42},{wch:18}];
  for (let c = 3; c <= 2 + N; c++) ws['!cols'][c] = { wch: 14 };
  ws['!rows'] = [];
  ws['!rows'][1]  = { hpx: 32 }; // Banner row
  ws['!rows'][2]  = { hpx: 28 }; // Project name
  ws['!rows'][4]  = { hpx: 20 }; // Currency/start
  ws['!rows'][5]  = { hpx: 20 }; // Duration/end
  ws['!rows'][9]  = { hpx: 42 }; // Main title
  ws['!rows'][30] = { hpx: 24 }; // Metrics rows
  ws['!rows'][31] = { hpx: 24 };
  ws['!rows'][32] = { hpx: 24 };
  ws['!rows'][33] = { hpx: 24 };
  ws['!rows'][35] = { hpx: 28 }; // Date header
  ws['!rows'][36] = { hpx: 20 }; // Month numbers

  // Cell merges - extended B2:P2 and B3:P3
  const mergeEndCol = Math.max(15, 2 + N); // P = col 15, or wider if more months
  ws['!merges'] = [
    { s:{r:1,c:1}, e:{r:1,c:mergeEndCol} },   // B2:P2+ banner
    { s:{r:2,c:1}, e:{r:2,c:mergeEndCol} },   // B3:P3+ project name
    { s:{r:9,c:1}, e:{r:9,c:8} },              // B10:I10 title
  ];

  // Freeze panes
  ws['!freeze'] = { xSplit: 2, ySplit: 37 };

  ws['!ref'] = 'A1:' + colLetter(3+N) + '55';

  return ws;
}

// ============================================================
// BUILD CASHFLOW EQU SHEET
// ============================================================
function buildCashflowEQUSheet(currencies, dates, assumptions) {
  const ws = {};
  const N = dates.length;
  const projName = assumptions.projectName || 'Project';

  // === HEADER BLOCK (rows 1-9) ===
  ws['B2'] = {v: 'CASH FLOW BASELINE — EQUIVALENT (EGP)', t:'s', s: S.cfBanner};
  ws['B3'] = {v: projName, t:'s', s: S.cfProjName};
  ws['B5'] = {v: 'Currency', t:'s', s: S.cfInfoLbl};
  ws['C5'] = {v: 'EQU (EGP Equivalent)', t:'s', s: S.cfInfoVal};
  ws['D5'] = {v: 'Start Date', t:'s', s: S.cfInfoLbl};
  ws['E5'] = {v: dates[0] ? dateSerial(dates[0].year, dates[0].month, 1) : '', t:'n', z:'MMM-YYYY', s: S.cfInfoVal};
  ws['B6'] = {v: 'Duration', t:'s', s: S.cfInfoLbl};
  ws['C6'] = {v: N + ' Months', t:'s', s: S.cfInfoVal};
  ws['D6'] = {v: 'End Date', t:'s', s: S.cfInfoLbl};
  ws['E6'] = {v: dates[dates.length-1] ? dateSerial(dates[dates.length-1].year, dates[dates.length-1].month, 1) : '', t:'n', z:'MMM-YYYY', s: S.cfInfoVal};

  ws['B10'] = {v: projName + ' - Cash Flow Equivalent (EGP)', t:'s', s: S.cfTitle};

  // === METRICS BOX (rows 31-34) ===
  ws['B31'] = {v: 'Max. Deficit:', t:'s', s: S.cfMboxLbl};

  ws['B36'] = {v: 'Overall', t:'s', s: S.cfOverall};
  for (let i = 0; i < N; i++) {
    const d = dates[i];
    ws[XLSX.utils.encode_cell({r:35,c:2+i})] = {v: dateSerial(d.year, d.month, 1), t:'n', z:'MMM-YY', s: S.cfDateHdr};
  }
  for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r:36,c:2+i})] = {v: i+1, t:'n', s: S.cfMonthNum};

  ws['B38'] = {v: 'Project Cash In "EQU"', t:'s', s: S.cfCashIn};
  ws['B39'] = {v: 'Cumulative Project Cash In "EQU"', t:'s', s: S.cfCum};
  ws['B41'] = {v: 'Project Cash Out "EQU"', t:'s', s: S.cfCashOut};
  ws['B42'] = {v: 'Cumulative Project Cash Out "EQU"', t:'s', s: S.cfCum};
  ws['B44'] = {v: 'Project Net Cash Flow "EQU"', t:'s', s: S.cfNet};

  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:37,c:2+i})] = {f: col + '95', t:'n', s: S.cfCashIn};
  }

  ws[XLSX.utils.encode_cell({r:38,c:2})] = {f: 'C38', t:'n', s: S.cfCum};
  for (let i = 1; i < N; i++) {
    const col = colLetter(3+i); const prev = colLetter(2+i);
    ws[XLSX.utils.encode_cell({r:38,c:2+i})] = {f: col + '38+' + prev + '39', t:'n', s: S.cfCum};
  }

  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:40,c:2+i})] = {f: col + '96', t:'n', s: S.cfCashOut};
  }
  ws[XLSX.utils.encode_cell({r:41,c:2})] = {f: 'C41', t:'n', s: S.cfCum};
  for (let i = 1; i < N; i++) {
    const col = colLetter(3+i); const prev = colLetter(2+i);
    ws[XLSX.utils.encode_cell({r:41,c:2+i})] = {f: col + '41+' + prev + '42', t:'n', s: S.cfCum};
  }

  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:43,c:2+i})] = {f: col + '39-' + col + '42', t:'n', s: S.cfNet};
  }

  ws['B85'] = {v: 'Exchange Rates to EGP', t:'s', s: S.sumSection};
  ws['C85'] = {v: 'Rate', t:'s', s: S.sumSection};

  const orderedCurrencies = sortCurrencies(currencies);
  const currencyRows = {};
  let r = 86;
  for (const cur of orderedCurrencies) {
    const rate = cur === 'EGP' ? 1 : ((assumptions.exchangeRates && assumptions.exchangeRates[cur]) || 0);
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: cur + ' to EGP', t:'s', s: S.data};
    ws[XLSX.utils.encode_cell({r,c:2})] = {v: rate, t:'n', s: S.num};
    r++;
  }

  r += 1;
  for (const cur of orderedCurrencies) {
    const inRow = r + 1;
    const outRow = r + 2;
    const rateRow = 87 + orderedCurrencies.indexOf(cur);
    currencyRows[cur] = { inRow, outRow, rateRow };
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'in ' + cur.toLowerCase(), t:'s', s: S.data};
    for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r,c:2+i})] = {f: "='Cashflow " + cur + "'!" + colLetter(3+i) + "38", t:'n', s: S.num};
    r++;
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'out ' + cur.toLowerCase(), t:'s', s: S.data};
    for (let i = 0; i < N; i++) ws[XLSX.utils.encode_cell({r,c:2+i})] = {f: "='Cashflow " + cur + "'!" + colLetter(3+i) + "41", t:'n', s: S.num};
    r += 2;
  }

  const equInRow = r + 1;
  const equOutRow = r + 2;
  ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'equ in', t:'s', s: S.data};
  ws[XLSX.utils.encode_cell({r:r+1,c:1})] = {v: 'equ out', t:'s', s: S.data};

  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    const partsIn = [], partsOut = [];
    for (const cur of orderedCurrencies) {
      const rows = currencyRows[cur];
      partsIn.push('(' + col + rows.inRow + '*$C$' + rows.rateRow + ')');
      partsOut.push('(' + col + rows.outRow + '*$C$' + rows.rateRow + ')');
    }
    ws[XLSX.utils.encode_cell({r,c:2+i})] = {f: partsIn.join('+') || '0', t:'n', s: S.num};
    ws[XLSX.utils.encode_cell({r:r+1,c:2+i})] = {f: partsOut.join('+') || '0', t:'n', s: S.num};
  }

  for (let i = 0; i < N; i++) {
    const col = colLetter(3+i);
    ws[XLSX.utils.encode_cell({r:37,c:2+i})] = {f: col + equInRow, t:'n', s: S.cfCashIn};
    ws[XLSX.utils.encode_cell({r:40,c:2+i})] = {f: col + equOutRow, t:'n', s: S.cfCashOut};
  }

  ws['!cols'] = [{wch:2},{wch:42},{wch:18}];
  for (let c = 3; c <= 2 + N; c++) ws['!cols'][c] = { wch: 14 };
  ws['!rows'] = [];
  ws['!rows'][1]  = { hpx: 32 };
  ws['!rows'][2]  = { hpx: 28 };
  ws['!rows'][4]  = { hpx: 20 };
  ws['!rows'][5]  = { hpx: 20 };
  ws['!rows'][9]  = { hpx: 42 };
  ws['!rows'][30] = { hpx: 24 };
  ws['!rows'][31] = { hpx: 24 };
  ws['!rows'][32] = { hpx: 24 };
  ws['!rows'][33] = { hpx: 24 };
  ws['!rows'][35] = { hpx: 28 };
  ws['!rows'][36] = { hpx: 20 };
  const mergeEndCol2 = Math.max(15, 2 + N);
  ws['!merges'] = [
    { s:{r:1,c:1}, e:{r:1,c:mergeEndCol2} },
    { s:{r:2,c:1}, e:{r:2,c:mergeEndCol2} },
    { s:{r:9,c:1}, e:{r:9,c:8} },
  ];
  ws['!freeze'] = { xSplit: 2, ySplit: 37 };
  ws['!ref'] = 'A1:' + colLetter(3+N) + Math.max(100, equOutRow);

  return ws;
}

function buildAssumptionsSheet(assumptions) {
  const ws = {};
  let r = 0;
  ws['B1'] = {v: 'Cash In', t:'s', s: S.sumSection};
  ws['B2'] = {v: 'Description', t:'s', s: S.subHeader};
  ws['C2'] = {v: '%', t:'s', s: S.subHeader};
  ws['D2'] = {v: 'Cash Duration (Days)', t:'s', s: S.subHeader};

  r = 3;
  for (const [cat, terms] of Object.entries(assumptions.cashInTerms)) {
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: cat, t:'s', s: S.boqCat};
    r++;
    for (const t of terms) {
      ws[XLSX.utils.encode_cell({r,c:1})] = {v: t.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r,c:2})] = {v: t.pct, t:'n', z:'0%', s: S.pct};
      ws[XLSX.utils.encode_cell({r,c:3})] = {v: t.days, t:'n', s: S.num};
      r++;
    }
    r++;
  }

  r += 2;
  ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Cash Out', t:'s', s: S.sumSection};
  r++;
  ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Description', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r,c:2})] = {v: '%', t:'s', s: S.subHeader};
  ws[XLSX.utils.encode_cell({r,c:3})] = {v: 'Cash Duration', t:'s', s: S.subHeader};
  r++;

  for (const [cat, terms] of Object.entries(assumptions.cashOutTerms)) {
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: cat, t:'s', s: S.boqCat};
    r++;
    for (const t of terms) {
      ws[XLSX.utils.encode_cell({r,c:1})] = {v: t.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r,c:2})] = {v: t.pct, t:'n', z:'0%', s: S.pct};
      ws[XLSX.utils.encode_cell({r,c:3})] = {v: t.days, t:'n', s: S.num};
      r++;
    }
    r++;
  }

  r += 2;
  ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Exchange Rates to EGP', t:'s', s: S.sumSection};
  ws[XLSX.utils.encode_cell({r,c:2})] = {v: 'Rate', t:'s', s: S.sumSection};
  r++;
  for (const cur of sortCurrencies(Object.keys(assumptions.exchangeRates || {})).filter(cur => cur !== 'EGP')) {
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: cur + ' to EGP Exchange Rate', t:'s', s: S.data};
    ws[XLSX.utils.encode_cell({r,c:2})] = {v: assumptions.exchangeRates[cur], t:'n', s: S.num};
    r++;
  }

  if (assumptions.indirectCostItems.length > 0) {
    r += 2;
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Indirect Cost', t:'s', s: S.sumSection};
    r++;
    for (const ic of assumptions.indirectCostItems) {
      ws[XLSX.utils.encode_cell({r,c:1})] = {v: ic.name + ' (' + ic.currency + ')', t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r,c:2})] = {v: ic.value, t:'n', s: S.num};
      r++;
    }
  }

  if (assumptions.projectOverheads.length > 0) {
    r += 2;
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Project Overheads', t:'s', s: S.sumSection};
    r++;
    for (const oh of assumptions.projectOverheads) {
      ws[XLSX.utils.encode_cell({r,c:1})] = {v: oh.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r,c:2})] = {v: oh.pct, t:'n', z:'0.00%', s: {...S.data, numFmt:'0.00%'}};
      let cc = 4;
      Object.entries(oh.amountsByCurrency || {}).forEach(([cur, value]) => {
        if (value > 0) {
          ws[XLSX.utils.encode_cell({r,c:cc})] = {v: cur + ': ' + value, t:'s', s: S.data};
          cc++;
        }
      });
      r++;
    }
  }

  if (assumptions.risksContingencies.length > 0) {
    r += 2;
    ws[XLSX.utils.encode_cell({r,c:1})] = {v: 'Risks & Contingencies', t:'s', s: S.sumSection};
    r++;
    for (const rc of assumptions.risksContingencies) {
      ws[XLSX.utils.encode_cell({r,c:1})] = {v: rc.name, t:'s', s: S.data};
      ws[XLSX.utils.encode_cell({r,c:2})] = {v: rc.pct, t:'n', z:'0.00%', s: {...S.data, numFmt:'0.00%'}};
      let cc = 4;
      Object.entries(rc.amountsByCurrency || {}).forEach(([cur, value]) => {
        if (value > 0) {
          ws[XLSX.utils.encode_cell({r,c:cc})] = {v: cur + ': ' + value, t:'s', s: S.data};
          cc++;
        }
      });
      r++;
    }
  }

  ws['!cols'] = [{wch:5},{wch:48},{wch:18},{wch:25},{wch:18},{wch:18},{wch:18}];
  ws['!ref'] = 'A1:G' + (r + 5);
  return ws;
}

