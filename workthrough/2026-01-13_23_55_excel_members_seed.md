# 엑셀부 멤버 12명 데이터 추가

## 개요
Supabase organization 테이블에 실제 엑셀부 멤버 12명의 데이터를 추가했습니다.

## 주요 변경사항
- **추가한 것**: 엑셀부 멤버 12명 (한백설, 해린, 월아, 채은, 가윤, 설윤, 한세아, 청아, 손밍, 키키, 홍서하, 퀸로니)
- **비활성화한 것**: 기존 목업 멤버 8명 (린아, 가애, 나노 등) - `is_active: false`
- **타입 업데이트**: `database.ts`에 `member_profile` 컬럼 타입 추가

## 추가된 멤버 목록
| 순서 | 이름 | 역할 | 생일 | MBTI | 혈액형 | 키 | 몸무게 |
|------|------|------|------|------|--------|-----|--------|
| 1 | 한백설 | MEMBER | 1997-11-26 | ISTP | O | 168 | 46 |
| 2 | 해린 | MEMBER | 2005-07-05 | ESFP | B | 157 | 50 |
| 3 | 월아 | MEMBER | 04-02 | - | - | - | - |
| 4 | 채은 | MEMBER | 2004-03-24 | - | - | - | - |
| 5 | 가윤 | MEMBER | 1996-01-03 | - | - | - | - |
| 6 | 설윤 | MEMBER | 2000-01-10 | - | - | - | - |
| 7 | 한세아 | MEMBER | 1992-12-14 | - | - | - | - |
| 8 | 청아 | MEMBER | 2004-01-03 | - | - | - | - |
| 9 | 손밍 | MEMBER | 1996-07-25 | - | - | - | - |
| 10 | 키키 | MEMBER | 1999-02-10 | - | - | - | - |
| 11 | 홍서하 | MEMBER | 2001-08-30 | - | - | - | - |
| 12 | 퀸로니 | MEMBER | 1991-09-30 | - | - | - | - |

## 생성된 스크립트
| 파일 | 용도 |
|------|------|
| `scripts/seed-excel-members.ts` | 전체 프로필 포함 시드 (member_profile 컬럼 필요) |
| `scripts/add-excel-members-safe.ts` | 기본 데이터만 추가 |
| `scripts/add-remaining-members.ts` | 누락 멤버 추가용 |
| `scripts/check-org.ts` | 테이블 확인용 |
| `scripts/migrations/add-member-profile-column.sql` | 컬럼 추가 SQL |

## 다음 단계
1. **Supabase Dashboard에서 SQL 실행** (상세 정보 저장을 위해):
   ```sql
   ALTER TABLE organization
   ADD COLUMN IF NOT EXISTS member_profile JSONB DEFAULT NULL;
   ```
2. 관리자 페이지(`/admin/organization`)에서 상세 정보 입력
3. 멤버 프로필 이미지 추가 (Supabase Storage)

## 결과
- ✅ 12명 엑셀부 멤버 데이터 추가 완료
- ✅ 조직도 페이지 정상 작동
- ⚠️ member_profile 컬럼 추가 필요 (상세 정보 저장용)

