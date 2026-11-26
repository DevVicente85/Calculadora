const cur = document.getElementById('current-operand'), prev = document.getElementById('previous-operand');
let c = '0', p = '', op = null, reset = false, syms = { add: '+', subtract: '-', multiply: '×', divide: '÷' };

function update() {
    cur.textContent = c;
    prev.textContent = op ? `${p} ${syms[op]}` : '';
}

function addNum(n) {
    if (c === '0' || reset) { c = n; reset = false; }
    else { if (c.length < 15) c += n; }
    update();
}

function addDec() {
    if (reset) { c = '0,'; reset = false; update(); return; }
    if (!c.includes(',')) { c += ','; update(); }
}

function setOp(a) {
    if (!c) return;
    if (p && !reset) compute();
    op = a; p = c; reset = true;
    update();
}

function compute() {
    const pv = parseFloat(p.replace(',', '.')), cv = parseFloat(c.replace(',', '.'));
    if (isNaN(pv) || isNaN(cv)) return;
    let r;
    if (op === 'add') r = pv + cv;
    else if (op === 'subtract') r = pv - cv;
    else if (op === 'multiply') r = pv * cv;
    else if (op === 'divide') {
        if (cv === 0) { alert('Erro: Divisão por zero!'); clearAll(); return; }
        r = pv / cv;
    }
    c = parseFloat(r.toFixed(10)).toString().replace('.', ',');
    op = null; p = ''; reset = true;
    update();
}

function clearAll() { c = '0'; p = ''; op = null; reset = false; update(); }
function del() { if (!reset) c = c.length === 1 ? '0' : c.slice(0, -1); update(); }
function sign() { if (c !== '0') c = c.startsWith('-') ? c.slice(1) : '-' + c; update(); }
function pct() {
    const cv = parseFloat(c.replace(',', '.'));
    if (!isNaN(cv)) c = (cv / 100).toString().replace('.', ',');
    update();
}

document.querySelectorAll('.btn.number').forEach(b => b.onclick = () => b.dataset.decimal ? addDec() : addNum(b.dataset.number));
document.querySelectorAll('.btn.operator').forEach(b => b.onclick = () => setOp(b.dataset.action));
document.querySelectorAll('.btn.function').forEach(b => {
    const a = b.dataset.action;
    b.onclick = () => { if (a === 'clear') clearAll(); if (a === 'delete') del(); if (a === 'sign') sign(); if (a === 'percent') pct(); };
});
document.querySelector('.btn.equals').onclick = () => { if (op && p) compute(); };

update();