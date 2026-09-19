// 캐나다 워홀 초기자본 계산기 - 계산·검사는 이 파일의 함수만 한다.
// data.js의 FX_CAD_KRW_DAILY(환율), OFFICIAL_AMOUNTS(공식 금액), ASSUMED_AMOUNTS(가정값)를 사용한다.

const MSG = {
  hint: "위 두 칸을 채우고 '내 초기자본 계산하기'를 눌러 주세요.",
  fundsEmpty: '보유 자금(원)을 입력해 주세요.',
  fundsInvalid: '보유 자금은 0 이상의 숫자만 입력해 주세요. (예: 4500000)',
  dateEmpty: '출국 예정일을 선택해 주세요.',
  datePast: '출국 예정일은 오늘 이후 날짜로 선택해 주세요.',
  noData: '환율 데이터를 불러오지 못했어요. 페이지를 새로고침해 주세요.',
  assumed: '보험·항공권·생활비는 공식 금액이 아니라 가정값이에요. 공식 금액은 신청·발급비와 증빙자금뿐이에요.'
};

const RATE_SOURCE = 'Frankfurter API · 유럽중앙은행 기준환율';
const POOL_GUIDE_URL = 'https://ircc.canada.ca/english/work/iec/selections.asp';

// ---------- 환율 ----------
function latestRate(series) {
  if (!Array.isArray(series) || series.length === 0) return null;
  const last = series[series.length - 1];
  if (typeof last.cadKrw !== 'number' || !isFinite(last.cadKrw)) return null;
  return { date: last.date, rate: last.cadKrw };
}

function rateRange(series) {
  if (!Array.isArray(series) || series.length === 0) return null;
  let min = series[0], max = series[0];
  for (const r of series) {
    if (r.cadKrw < min.cadKrw) min = r;
    if (r.cadKrw > max.cadKrw) max = r;
  }
  return { min: { date: min.date, rate: min.cadKrw }, max: { date: max.date, rate: max.cadKrw } };
}

function toKrw(cad, rate) {
  return Math.round(cad * rate);
}

// ---------- 표시 형식 ----------
function formatKrw(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function formatRate(rate) {
  return rate.toLocaleString('ko-KR');
}

function formatCad(n) {
  return n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- 입력 검사 ----------
function validateFunds(raw) {
  const v = String(raw == null ? '' : raw).trim().replace(/,/g, '');
  if (v === '') return { ok: false, message: MSG.fundsEmpty };
  if (!/^\d+(\.\d+)?$/.test(v)) return { ok: false, message: MSG.fundsInvalid };
  return { ok: true, value: Number(v) };
}

function isRealDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

function validateDate(raw, todayStr) {
  const v = String(raw == null ? '' : raw).trim();
  if (v === '' || !isRealDate(v)) return { ok: false, message: MSG.dateEmpty };
  if (v < todayStr) return { ok: false, message: MSG.datePast };
  return { ok: true, value: v };
}

function addDays(dateStr, n) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + n));
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ---------- 계산 ----------
// 총액 = 신청·발급비 + 여행자보험 + 항공권 + 증빙 잔고. 도착 후 생활비(참고)는 증빙 잔고에서 쓰는 돈으로 보고 더하지 않는다.
function planCosts(rate, fundsKrw, depDate) {
  const proofFrom = addDays(depDate, -7);
  const items = [
    { key: 'fees', label: '신청·발급비', kind: 'official', cadText: 'CAD ' + formatCad(OFFICIAL_AMOUNTS.applicationFeesCad),
      timing: '초청 수락 후 20일 안', krw: toKrw(OFFICIAL_AMOUNTS.applicationFeesCad, rate) },
    { key: 'insurance', label: '여행자보험', kind: 'assumed', cadText: 'CAD ' + ASSUMED_AMOUNTS.insuranceCad.toLocaleString('ko-KR'),
      timing: '출국 전', krw: toKrw(ASSUMED_AMOUNTS.insuranceCad, rate) },
    { key: 'flight', label: '항공권', kind: 'assumed', cadText: '',
      timing: '출국 전', krw: ASSUMED_AMOUNTS.flightKrw },
    { key: 'proof', label: '증빙 잔고', kind: 'official', cadText: 'CAN$' + OFFICIAL_AMOUNTS.proofOfFundsCad.toLocaleString('ko-KR') + ' · 통장에 있어야 하는 돈',
      timing: '출국 1주일 이내(' + proofFrom + ' 이후) 발급한 잔고증명서', krw: toKrw(OFFICIAL_AMOUNTS.proofOfFundsCad, rate) }
  ];
  let total = 0;
  for (const it of items) total += it.krw;
  const cadSum = OFFICIAL_AMOUNTS.applicationFeesCad + ASSUMED_AMOUNTS.insuranceCad + OFFICIAL_AMOUNTS.proofOfFundsCad;
  return {
    items: items,
    total: total,
    diff: fundsKrw - total,
    livingKrw: toKrw(ASSUMED_AMOUNTS.livingMonthCad, rate),
    proofFrom: proofFrom,
    cadSum: cadSum,
    cadSumKrw: toKrw(cadSum, rate)
  };
}

function rangeCompare(series, cadSum, rateNow) {
  const rr = rateRange(series);
  return {
    now: toKrw(cadSum, rateNow),
    low: { rate: rr.min.rate, date: rr.min.date, krw: toKrw(cadSum, rr.min.rate) },
    high: { rate: rr.max.rate, date: rr.max.date, krw: toKrw(cadSum, rr.max.rate) }
  };
}

function verdictText(fundsKrw, diff) {
  if (diff < 0) return '보유 자금 ' + formatKrw(fundsKrw) + '보다 ' + formatKrw(-diff) + ' 부족해요.';
  if (diff > 0) return '보유 자금 ' + formatKrw(fundsKrw) + '으로 ' + formatKrw(diff) + '이 남아요.';
  return '보유 자금과 딱 맞아요.';
}

function headlineText(total) {
  return '예상 초기자본은 ' + formatKrw(total) + '이에요.';
}

// ---------- 화면 (app.html에서만 동작) ----------
function initApp() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const fundsEl = document.getElementById('funds'), dateEl = document.getElementById('depDate');
  const fundsErr = document.getElementById('fundsError'), dateErr = document.getElementById('dateError');
  const resultEl = document.getElementById('result');
  const today = todayString();
  dateEl.min = today;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function showMessage(text) {
    resultEl.hidden = false;
    resultEl.replaceChildren(el('p', 'hint', text));
  }

  function render(plan, fundsKrw, series, now) {
    const rc = rangeCompare(series, plan.cadSum, now.rate);
    const wrap = document.createDocumentFragment();
    wrap.appendChild(el('div', 'head', headlineText(plan.total)));
    wrap.appendChild(el('div', plan.diff < 0 ? 'verdict short' : 'verdict ok', verdictText(fundsKrw, plan.diff)));

    const table = el('table', 'items');
    const thead = el('thead');
    const hr = el('tr');
    ['항목', '나가는 시점', '원화'].forEach(function (t, i) { const th = el('th', i === 2 ? 'r' : '', t); hr.appendChild(th); });
    thead.appendChild(hr); table.appendChild(thead);
    const tbody = el('tbody');
    plan.items.forEach(function (it) {
      const tr = el('tr');
      const td1 = el('td');
      td1.appendChild(document.createTextNode(it.label + ' '));
      td1.appendChild(el('span', 'badge ' + (it.kind === 'official' ? 'off' : 'as'), it.kind === 'official' ? '공식' : '가정값'));
      if (it.cadText) { td1.appendChild(el('br')); td1.appendChild(el('span', 'sub', it.cadText)); }
      tr.appendChild(td1);
      tr.appendChild(el('td', '', it.timing));
      tr.appendChild(el('td', 'r', formatKrw(it.krw)));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    wrap.appendChild(el('p', 'note', '출국 1주일 이내(' + plan.proofFrom + ' 이후) 발급한 잔고증명서가 필요해요.'));
    wrap.appendChild(el('p', 'note', '참고: 도착 후 첫 1개월 생활비 ' + formatKrw(plan.livingKrw) + '(CAD ' + ASSUMED_AMOUNTS.livingMonthCad.toLocaleString('ko-KR') + ', 가정값)는 증빙 잔고에서 쓰는 돈으로 보고 총액에 더하지 않았어요.'));
    wrap.appendChild(el('p', 'note', '적용 환율: 1캐나다달러 = ' + formatRate(now.rate) + '원 (' + now.date + ', ' + RATE_SOURCE + ')'));
    wrap.appendChild(el('p', 'note', '환율이 최근 1년 최저(' + formatRate(rc.low.rate) + '원, ' + rc.low.date + ')였다면 ' + formatKrw(rc.low.krw) +
      ', 최고(' + formatRate(rc.high.rate) + '원, ' + rc.high.date + ')였다면 ' + formatKrw(rc.high.krw) + '이에요. (신청비·보험·증빙 CAD ' + formatCad(plan.cadSum) + ' 기준, 지금은 ' + formatKrw(rc.now) + ')'));
    wrap.appendChild(el('p', 'note', MSG.assumed));
    const link = el('a', 'btn ghost', '풀 등록 안내 보기');
    link.href = POOL_GUIDE_URL; link.target = '_blank'; link.rel = 'noopener';
    wrap.appendChild(link);

    resultEl.hidden = false;
    resultEl.replaceChildren(wrap);
  }

  function clearErrors() {
    fundsErr.textContent = ''; dateErr.textContent = '';
    fundsEl.removeAttribute('aria-invalid'); dateEl.removeAttribute('aria-invalid');
  }

  function calculate() {
    clearErrors();
    const series = (typeof FX_CAD_KRW_DAILY !== 'undefined') ? FX_CAD_KRW_DAILY : null;
    const now = latestRate(series);
    if (!now) { showMessage(MSG.noData); return; }

    const f = validateFunds(fundsEl.value), d = validateDate(dateEl.value, todayString());
    if (!f.ok || !d.ok) {
      if (!f.ok) { fundsErr.textContent = f.message; fundsEl.setAttribute('aria-invalid', 'true'); }
      if (!d.ok) { dateErr.textContent = d.message; dateEl.setAttribute('aria-invalid', 'true'); }
      resultEl.hidden = true;
      resultEl.replaceChildren();
      (!f.ok ? fundsEl : dateEl).focus();
      return;
    }
    render(planCosts(now.rate, f.value, d.value), f.value, series, now);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); calculate(); });

  const seriesAtLoad = (typeof FX_CAD_KRW_DAILY !== 'undefined') ? FX_CAD_KRW_DAILY : null;
  if (!latestRate(seriesAtLoad)) showMessage(MSG.noData); else showMessage(MSG.hint);
}

if (typeof document !== 'undefined') initApp();
