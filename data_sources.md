# 근거표 — 숫자와 출처 (M5-01)

> 링크를 **직접 열어** 값·기준 시점·제목이 문서에 있는지 확인한 것만 남깁니다. 본문은 복사하지 않습니다.

|번호|값과 단위|기준 시점|기관·문서|링크|말해주는 것|말해주지 않는 것|확인|
|---|---|---|---|---|---|---|---|
|D1|CAD/KRW 환율 990.76원 (1캐나다달러=990.76원)|2026-09-18|Frankfurter API (유럽중앙은행 ECB 기준환율)|https://api.frankfurter.dev/v1/latest?base=CAD&symbols=KRW|오늘 은행 기준환율에 가까운 매매기준율 수준|은행별 실제 살 때 환율(현찰/전신환) 스프레드는 없음|☐ 직접 열어 봄 (AI가 열어 990.76·2026-09-18 확인함)|
|D2|캐나다 워킹홀리데이(IEC) 참가자 필수 증빙자금 CAN$2,500(첫 3개월 체류비)|페이지 최종 업데이트 2025-11-17|캐나다 이민난민시민권부(IRCC), canada.ca|https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/prepare-arrival.html|출국 1주일 이내 발급한 잔고증명서에 있어야 하는 최소 금액|무급 인턴(Co-op) 참가자는 전체 체류비를 추가로 더 보여줘야 함(이 값에 미포함)|☐ 직접 열어 봄 (AI가 열어 CAN$2,500·1주일 이내·2025-11-17 확인함)|
|D3|IEC 신청·발급 비용 합계 CAD 369.75 (참가비 184.75 + 오픈 워크퍼밋 발급비 100 + 바이오메트릭 85)|참가비 184.75는 2025-12-01 인상(이전 179.75). 수수료 목록 페이지 2026-07-02 수정, 인상 안내 페이지 2026-04-30 수정, 신청 페이지 2026-05-28 수정|캐나다 이민난민시민권부(IRCC): 수수료 목록 · 수수료 변경 안내 · IEC 신청 페이지|참가비 184.75와 바이오메트릭 85: https://ircc.canada.ca/english/information/fees/fees.asp · 인상 시점: https://ircc.canada.ca/english/information/fees/fee-changes.asp · 워크퍼밋 발급비 100: https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/apply-work-permit.html|워킹홀리데이 카테고리 기준 신청 단계에서 내는 정부 수수료 합계|보험료·항공권·생활비는 포함 안 됨. Young Professional/Co-op은 워크퍼밋 발급비(100) 제외돼 269.75. 신청 페이지는 참가비 숫자를 직접 보여 주지 않고 수수료 목록을 안내함|☐ 직접 열어 봄 (AI가 세 페이지를 열어 값 확인함)|

## 기간별 변화 — 최근 12개월 CAD/KRW 최고·최저

- 기간: 2025-09-18 ~ 2026-09-18 (256 영업일, Frankfurter API 일별 시계열, 링크: https://api.frankfurter.dev/v1/2025-09-18..2026-09-18?base=CAD&symbols=KRW — AI가 전체 시계열을 받아 최저·최고·차액을 직접 계산해 확인함)
- 최저 968.97원 (2026-09-11) · 최고 1,109.99원 (2026-06-05)
- 계산식: 증빙자금 필요 원화 = 990.76원 → CAN$2,500 × 최저/최고 환율
  - 최저 시점 환전: 2,500 × 968.97 = **2,422,425원**
  - 최고 시점 환전: 2,500 × 1,109.99 = **2,774,975원**
  - 차액: **352,550원** (최고가 최저 대비 +14.55%)
- 해석: 캐나다 워킹홀리데이 증빙자금(고정된 CAD 금액)을 언제 환전하느냐에 따라 최근 1년 안에서도 원화 기준으로 35만 원 넘게 차이가 났다.
- 한계: 이 값은 ECB 기준환율(매매기준율 성격)이며 실제 은행 창구의 현찰·전신환 환율, 수수료, 우대율은 포함하지 않는다. IRCC 요구 금액(CAN$2,500)은 워킹홀리데이 카테고리 기준이며, 정규 취업비자·이민 프로그램의 증빙자금 기준은 별도다.

## 직접 열어 확인할 링크

- https://api.frankfurter.dev/v1/latest?base=CAD&symbols=KRW (D1)
- https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/prepare-arrival.html (D2)
- https://ircc.canada.ca/english/information/fees/fees.asp (D3: 참가비 184.75 · 바이오메트릭 85)
- https://ircc.canada.ca/english/information/fees/fee-changes.asp (D3: 2025-12-01 인상, 179.75 → 184.75)
- https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/apply-work-permit.html (D3: 워크퍼밋 발급비 100)
- https://api.frankfurter.dev/v1/2025-09-18..2026-09-18?base=CAD&symbols=KRW (기간별 변화 시계열)

## 참고용 추정치 (근거표에 넣지 않음 — 민간 자료 집계, 서비스에 그대로 쓰지 말 것)

- 인천↔토론토/밴쿠버 편도 항공권: 대략 100만~150만원 (계절·항공사별 편차 큼, 공식 출처 아님)
- 여행자보험 1년: 대략 CAD 600~1,200 (보험사·보장범위별 편차 큼, IRCC는 필수라고만 명시하고 금액 미공개)
- 도착 후 월 생활비(셰어룸+식비+기타, 토론토·밴쿠버 1인 기준): 대략 CAD 1,350~2,100
- 이 수치들은 앱 화면에 "확인된 값"으로 표시하지 않고, 사용자가 직접 입력해서 계산하는 항목으로 다룬다.

## 앱에 쓸 데이터

- 파일: 현재 `data/public/`에는 CAD 환율이 없음(USD·JPY·EUR·CNY만 있음). Frankfurter API가 CAD도 키 없이 제공하므로, M6-02에서 `fx_krw_daily.js`와 같은 방식으로 `data/public/fx_cad_krw_daily.js`를 새로 만들어 쓸 예정.
- 화면에 표시할 출처·기준 시점: "Frankfurter API(ECB 기준환율), 기준일 2026-09-18" 문구 고정 표시.
- 받지 못했을 때 보여줄 것: 이번에 받아 둔 기준 시점 값(990.76원)을 "마지막 확인 값"으로 표시하고 실시간 아님을 안내.
