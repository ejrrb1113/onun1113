# 모아 — 전국 행사 통합 지도

React + TypeScript + Tailwind CSS 기반의 실행 가능한 **1~4단계 첫 버전**입니다.

## 현재 동작하는 기능

- PC 3열 / 모바일 지도 + 확장형 목록, 검색, 다크모드
- 17개 시도, 12개 카테고리, 다중 카테고리 행사 샘플 51건
- 행사명·주소 검색, 시도/시군구, 날짜 겹침, 입장료, 대상 나이, 실내/실외, 현재 위치 기반 직선거리의 복합 필터
- 기본 지도(Leaflet + OpenStreetMap), 카테고리 색상 마커, 화면 거리 기반 클러스터, 확대/축소, 상세 선택 시 이동
- '현재 지도 안에서 찾기' 선택 시 지도를 이동할 때 목록 자동 갱신
- GeoJSON 행정구역 지도: 17개 시도 → 250개 시군구 경계, 지역별 **행사 개수 구간**에 따른 색상과 지역 선택
- 카카오 지도 어댑터: JavaScript 키 설정 시 SDK 로드, 카테고리별 마커, 클러스터, 상세 및 화면 영역 연동
- 상세 정보, 카카오 길찾기 링크, 브라우저 로컬 즐겨찾기, 개별 샘플 공유 링크
- PWA manifest / 서비스 워커: 방문한 동일 출처 리소스의 오프라인 캐시. 외부 지도 타일과 카카오 SDK는 오프라인 미지원

**이 앱은 실제 전국 행사 데이터나 실시간 추천을 제공하지 않습니다.** 모든 행사는 가상 데이터이며 화면에 표시됩니다. 검증용 일정은 2026년 10월 28일~11월 15일입니다. 실제 행사 이미지 대신 직접 만든 그래픽을 사용합니다. 미확인 입장료·연령·실내외·홈페이지를 추정하지 않습니다. 연령 필터는 샘플의 최소 참여 연령을 비교합니다.

## 실행 (API 키 없이 가능)

Node.js 22 이상 권장, 검증 환경 Node.js 24.19.0 / npm 11.9.0.

```bash
cd /workspace/onun1113
npm ci
npm run dev
```

터미널에 표시된 개발 서버 주소를 브라우저에서 여세요. 이 클라우드 온보딩 UI는 로컬 웹 미리보기를 제공하지 않습니다. 아래 Vercel 배포를 사용하면 공개 주소를 얻을 수 있습니다.

```bash
npm test              # 검색/필터 단위 테스트
npm run build         # 타입 검사 + 배포 산출물 dist/
npm run preview       # 빌드된 앱 실행
npm run test:e2e      # Chromium PC/모바일 UI 테스트
```

브라우저 테스트는 기본 `/usr/bin/chromium`을 사용합니다. 다른 컴퓨터에서는 Chromium을 설치한 뒤 `CHROMIUM_PATH=/브라우저/경로 npm run test:e2e`로 실행하세요. 테스트의 모바일 검증은 실제 휴대전화가 아닌 Chromium 모바일 에뮬레이션입니다.

## 카카오 지도 키 (선택)

1. https://developers.kakao.com 에서 로그인 → 내 애플리케이션 → 앱 생성.
2. 카카오맵 사용 설정과 웹 플랫폼의 사이트 도메인을 등록합니다. 개발 서버 주소와 배포 후 Vercel 도메인도 각각 등록합니다. 콘솔 정책에 따라 카카오맵 사용 신청/활성화가 필요할 수 있습니다.
3. 앱의 **JavaScript 키**를 확인합니다. REST API 키나 Admin 키가 아닙니다.
4. `.env.example`을 `.env.local`로 복사하고 `VITE_KAKAO_MAP_KEY=발급받은_JavaScript_키`를 입력합니다.
5. 개발 서버를 재시작하고 지도 제공자를 '카카오 지도'로 변경합니다.

JavaScript 지도 키는 브라우저 SDK 동작상 공개됩니다. `.env.local`과 Git 제외는 소스 하드코딩을 막으며 비밀키 보호를 대신하지 않습니다. 카카오 콘솔에서 허용 도메인과 쿼터를 제한하세요. **TourAPI·KOPIS·LLM·Supabase service role 같은 비밀키를 VITE_ 변수에 넣으면 안 됩니다.** 향후 서버 측 함수와 서버 환경변수로만 사용합니다.

공식 지도 문서: https://apis.map.kakao.com/web/guide/ , https://apis.map.kakao.com/web/sample/basicClusterer/

## Vercel 배포

1. 이 프로젝트를 GitHub 저장소에 올립니다.
2. https://vercel.com 에 로그인 → Add New → Project → 저장소 선택.
3. Framework: Vite, Build: `npm run build`, Output: `dist`, Install: `npm ci`.
4. 기본 지도는 환경변수 없이 동작합니다. 카카오 지도 사용 시 프로젝트 Settings → Environment Variables에 `VITE_KAKAO_MAP_KEY`를 추가하고 다시 배포합니다.
5. Deploy 후 생성된 HTTPS 주소를 카카오 웹 도메인에 등록합니다.

현재 Vercel 계정/배포 권한은 제공되지 않아 공개 배포는 실행하지 않았습니다. 기존 chatgpt.site 앱은 이 저장소와 연결되지 않았고 변경하지 않았습니다.

## 프로젝트 구조

```text
src/
  App.tsx          PC/모바일 UI, 필터, 상세, 로컬 즐겨찾기
  Map.tsx          기본 지도, 클러스터, GeoJSON 시도/시군구
  KakaoMap.tsx     선택형 카카오 지도 SDK 어댑터
  data.ts          행사 타입, 카테고리, 명시적 가상 샘플
  search.ts        날짜/거리/복합 필터 순수 함수
  style.css        Tailwind + 반응형 디자인
public/
  data/            출처가 있는 2018년 GeoJSON과 SOURCES.md
  sw.js            동일 출처 리소스 오프라인 캐시
  manifest.webmanifest
scripts/           경계 단순화 재현 스크립트
tests/             단위 테스트와 PC/모바일 브라우저 테스트
```

## 경계·지도 데이터 주의사항

경계는 southkorea/southkorea-maps의 KOSTAT 2018년 자료로 최신 경계가 아닙니다. 최신 특별자치도 명칭과 행정구역 변동은 미반영입니다. 구체적인 출처·단순화·제공 조건은 `public/data/SOURCES.md`를 확인하세요. 색상은 면적당 밀도가 아닌 **행사 개수 구간**입니다. 현재 샘플은 17개 시도에 각각 3건씩 있어 전국 색상이 동일한 것이 정상입니다. 기본 지도 배경 타일은 인터넷 연결이 필요하며, 타일이 차단되어도 로컬 GeoJSON 경계와 마커는 표시됩니다. OpenStreetMap 타일은 대량 다운로드/오프라인 저장을 하지 않습니다. 대규모 공개 운영 시 별도의 타일 제공 서비스와 이용 정책 확인이 필요합니다.

## 다음 단계 (아직 미구현)

5~10단계 Supabase SQL/인덱스/RLS, 실제 수집 API, AI 추천, 계정/기기 간 동기화, 즐겨찾기 폴더, 캘린더, 예약 알림, 자동 수집은 이번 범위에 포함되지 않습니다. 가짜 성공 응답이나 샘플을 실제 데이터로 대체하지 않았습니다.

다음 단계에 필요한 서비스:

| 서비스 | 신청/설정 | 서버에서 사용할 용도 |
|---|---|---|
| Supabase | https://supabase.com 에서 프로젝트 생성 | 행사 DB, Auth, RLS, 사용자 저장 |
| TourAPI | https://www.data.go.kr 에서 한국관광공사 국문 관광정보 서비스 활용 신청 | 축제 등 행사 수집 |
| KOPIS | https://www.kopis.or.kr 에서 Open API 이용 신청 | 공연 데이터 수집 |
| 문화공공데이터 | https://www.culture.go.kr/data 에서 필요한 개별 API 확인/신청 | 문화 행사 수집 |
| 지자체 공공데이터 | https://www.data.go.kr 에서 지역별 데이터셋 확인 | 지자체 행사 수집 |
| LLM 공급자 | 공급자 프로젝트에서 서버 API 키 발급 | DB 내 행사만 대상으로 추천 |

개별 공공 API의 최신 스키마·승인 조건은 실제 연동 단계에서 공식 문서와 승인된 응답을 확인해야 합니다. 현재 이 API들을 연결하거나 검증했다고 주장하지 않습니다. 키 값은 채팅이나 Git에 올리지 말고 Supabase/Vercel의 서버 환경변수에 설정합니다.
