# Admin 기능 강화: 배너 마이그레이션 & CSV 업로드

## 개요
Supabase banners 테이블 SQL 마이그레이션 파일을 생성하고, 후원 관리 페이지에 CSV 대량 업로드 기능을 통합했습니다.

## 주요 변경사항

### 추가된 것
- **SQL 마이그레이션**: `supabase/migrations/20241229_create_banners_table.sql`
  - banners 테이블 생성 (RLS 정책 포함)
  - 인덱스 및 트리거 설정
  - 샘플 데이터 포함

- **CSV 업로드 통합**: `/admin/donations` 페이지
  - 목록/업로드 탭 전환 UI
  - CSV 파싱 및 검증
  - 닉네임 자동 매칭
  - 샘플 CSV 파일 제공

### 수정된 것
- `src/types/database.ts`: banners 테이블에 `updated_at` 필드 추가
- `src/app/admin/shared.module.css`: 탭 버튼, 업로드 섹션 스타일 추가
- `src/app/admin/donations/page.tsx`: CsvUploader 컴포넌트 연동

### 파일 구조
```
supabase/
└── migrations/
    └── 20241229_create_banners_table.sql

public/
└── samples/
    └── donations_sample.csv

src/app/admin/donations/page.tsx (수정)
src/app/admin/shared.module.css (수정)
src/types/database.ts (수정)
```

## 결과
- ✅ 빌드 성공 (31 routes)
- ✅ TypeScript 오류 없음

## 다음 단계
- [ ] Supabase에 SQL 마이그레이션 실행
- [ ] 메인 페이지 Hero 컴포넌트에 banners 데이터 연동
- [ ] CSV 업로드 기능을 다른 Admin 페이지에도 확장 (회원, 시그니처 등)
- [ ] 브라우저에서 CSV 업로드 기능 테스트
