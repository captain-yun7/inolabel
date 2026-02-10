# 팬더티비 CSV 형식 통합 및 Mock 데이터 개선

## 개요
팬더티비(PandaTV) 스트리밍 플랫폼의 후원 알림내역 CSV 형식을 분석하여, 프론트엔드의 후원 데이터 표시 형식을 "원"에서 "하트" 단위로 통일하고 Mock 데이터를 대폭 개선했습니다.

**RG Family 웹사이트 목적:**
- 한국 엑셀방송(Excel Unit) 멤버 소개
- 중국 단보방송(Crew Unit) 크루 멤버 소개
- 방송 일정 안내
- 팬들과의 소통 공간
- 후원 랭킹 시스템 (팬더티비 플랫폼)

## 주요 변경사항

### 1. 팬더티비 CSV 형식 분석
- **컬럼 구조**: 종류, 일시, 닉네임, ID, 하트, 팬랭킹순위, 팬등급, 내용, 알림음, 알림텍스트, 상태
- **날짜 형식**: `25.12.29 05:16:29` (YY.MM.DD HH:MM:SS)
- **단위**: 원(₩)이 아닌 하트(Hearts)

### 2. 랭킹 컴포넌트 업데이트
- `RankingCard.tsx`: formatAmount 하트 단위로 변경
- `RankingList.tsx`: formatAmount 하트 단위로 변경
- `/ranking/vip/page.tsx`: VIP 멤버 금액 표시 하트 단위
- `/ranking/vip/[userId]/page.tsx`: 후원 히스토리 하트 단위

### 3. CSV 업로더 팬더티비 형식 지원
- 기존 형식과 팬더티비 형식 동시 지원
- 날짜 파싱: `25.12.29 05:16:29` → ISO 8601
- 샘플 파일 팬더티비 형식으로 교체

### 4. Mock 데이터 대폭 개선
- DiceBear API로 placeholder 아바타 생성
- 조직도: 중복 제거, 14명 정리 (Excel 7명 + Crew 7명)
- 멤버명 영문 통일 (Nano, Irene, Luna 등)
- SNS 링크 팬더티비(pandalive.co.kr) 플랫폼으로 변경
- 이미지 경로 실제 존재 파일로 매핑

### 5. 플랫폼 타입 변경
- `soop` → `pandatv` 전체 변경
- URL: `sooplive.co.kr` → `pandalive.co.kr`
- 조직도 소셜 링크에 팬더티비 아이콘 추가

## 핵심 코드

```typescript
// 팬더티비 하트 단위 포맷팅
const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}만 하트`
  }
  return `${amount.toLocaleString()} 하트`
}

// 팬더티비 CSV 날짜 파싱
const [datePart, timePart] = dateStr.split(' ')
const [yy, mm, dd] = datePart.split('.')
const year = parseInt(yy, 10) + 2000 // 25 -> 2025
```

## 결과
- ✅ 빌드 성공 (29개 페이지 생성)
- ✅ TypeScript 오류 없음
- ✅ 모든 랭킹 관련 페이지 하트 단위 통일
- ✅ 플랫폼 타입 pandatv로 통일

## 다음 단계
- [ ] 실제 팬더티비 데이터 연동 테스트 (실시간 CSV 업로드)
- [ ] 후원 통계 대시보드 추가 (시즌별/멤버별 집계)
- [ ] VIP 페이지 실제 Supabase 데이터 연동
- [ ] 후원 알림 실시간 표시 기능 (WebSocket)
