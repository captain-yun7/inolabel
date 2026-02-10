# Supabase 연동 완료 및 라이브 크롤러 구조 구축

## 개요
개발자 통화 내용(2026-01-12)을 기반으로 Supabase 연동을 완료하고, BJ 라이브 상태 수집을 위한 크롤러 구조를 구축했습니다. Mock 데이터에서 실제 DB로 전환 준비가 완료되었습니다.

## 주요 변경사항

### 개발한 것
- **데이터 시딩 스크립트**: `scripts/seed-database.ts` - Mock 데이터를 실제 DB로 이전
- **라이브 상태 업데이트 API**: `/api/live-status/update` - 크롤러 연동용 엔드포인트
- **크롤러 템플릿**: `scripts/crawler/crawler_example.py` - Python/Selenium 기반

### 수정한 것
- `package.json`: `db:seed`, `db:test` 스크립트 추가
- `devDependencies`: tsx, dotenv 추가

### 작성한 문서
- `docs/DEVELOPER_COLLABORATION_GUIDE.md`: 개발자 협업 가이드
- `scripts/crawler/README.md`: 크롤러 사용 가이드

## 핵심 코드

```typescript
// /api/live-status/update - 크롤러에서 호출
export async function POST(request: Request) {
  // API 키 검증 후 organization.is_live 업데이트
  const { updates } = await request.json()
  for (const { member_id, is_live } of updates) {
    await supabase.from('organization').update({ is_live }).eq('id', member_id)
  }
}
```

## DB 현황

| 테이블 | 데이터 |
|--------|--------|
| seasons | 4건 ✅ |
| organization | 14건 ✅ |
| notices | 3건 ✅ |
| profiles/donations | 0건 (추가 필요) |

## 결과
- ✅ Supabase 연결 성공 (새 키 형식 `sb_publishable_*` 지원)
- ✅ 빌드 성공
- ✅ 초기 데이터 시딩 완료

## 다음 단계

### 내일 오전 10시 통화 전 준비
1. **Vercel 환경변수 설정**: Dashboard → Settings → Environment Variables
2. **테스트 배포 확인**: Mock 모드 OFF 상태로 확인

### 개발자 협업 작업
1. **크롤러 개발**: Python/Selenium으로 PandaTV 즐겨찾기 페이지 파싱
2. **후원 데이터 입력**: profiles, donations 테이블 데이터 추가
3. **VIP 기능 검증**: 실제 DB로 VIP 페이지 동작 확인

### 추가 개선 제안
- [ ] 크롤러 자동 실행 (Windows Task Scheduler / cron)
- [ ] 라이브 상태 Webhook 알림 기능
- [ ] Admin 페이지에서 수동 라이브 상태 토글 기능
