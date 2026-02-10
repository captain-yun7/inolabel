# 메인페이지 아키텍처 & 디자인 분석 보고서

## 개요
software-architecture 및 landing-page-guide-v2 스킬 기준으로 현재 RG Family 메인페이지를 분석한 결과입니다.

---

## 1. Software Architecture 분석

### 현재 잘 되어 있는 점

| 원칙 | 현황 | 파일 |
|------|------|------|
| **단일 책임** | 각 컴포넌트가 명확한 역할 | Hero, LiveMembers, Notice, Shorts, VOD |
| **의존성 역전** | useSupabase 훅으로 DB 추상화 | `lib/hooks/useSupabase.ts` |
| **설정 분리** | USE_MOCK_DATA 플래그로 환경 분리 | `lib/config.ts` |
| **스타일 캡슐화** | CSS Modules 사용 | `*.module.css` |
| **타입 안전성** | TypeScript 인터페이스 정의 | 각 컴포넌트 내부 |

### 개선 필요 사항

#### 1.1 인라인 스타일 제거 (page.tsx)
```typescript
// 현재 (문제)
<div style={{
  maxWidth: "var(--max-width)",
  margin: "0 auto",
  padding: "2rem",
  // ...
}}>

// 개선 방향
<div className={styles.mainContent}>
```
**위치**: `src/app/page.tsx:15-23`, `41-65`

#### 1.2 반복 패턴 추상화
각 컴포넌트의 로딩/빈 상태 패턴이 반복됨:
```typescript
// 모든 컴포넌트에 동일한 패턴
if (isLoading) return <LoadingState />
if (data.length === 0) return <EmptyState />
return <ActualContent />
```
**제안**: `withDataFetching` HOC 또는 커스텀 훅으로 추상화

#### 1.3 타입 정의 중앙화
```
현재: 각 컴포넌트 내 interface 정의
개선: src/types/components.ts로 분리
```

#### 1.4 Footer 컴포넌트 분리
```typescript
// 현재: page.tsx 내 인라인 footer
// 개선: src/components/Footer.tsx로 분리
```

#### 1.5 데이터 페칭 패턴 통합
```typescript
// 제안: React Query 또는 SWR 도입
// 또는 컨텍스트 기반 데이터 프로바이더
```

---

## 2. Landing Page Guide 분석

### 현재 잘 되어 있는 점

| 요소 | 현황 | 점수 |
|------|------|------|
| **테마 시스템** | CSS 변수 기반 다크/라이트 모드 | ⭐⭐⭐⭐⭐ |
| **타이포그래피** | Space Grotesk + Noto Sans KR | ⭐⭐⭐⭐⭐ |
| **시각 효과** | Grain 텍스처, Glassmorphism | ⭐⭐⭐⭐ |
| **애니메이션** | Framer Motion, 호버 효과 | ⭐⭐⭐⭐ |
| **컬러 시스템** | 브랜드 컬러 + Glow 효과 | ⭐⭐⭐⭐⭐ |

### 11 Essential Landing Page Elements 체크리스트

| 요소 | 현재 | 상태 | 우선순위 |
|------|------|------|---------|
| 1. **Hero + Value Proposition** | 배너 슬라이더 있음 | ⚠️ 부분 | 🔴 높음 |
| 2. **Primary CTA** | 배너 내 CTA 버튼 | ⚠️ 부분 | 🔴 높음 |
| 3. **Trust Indicators** | 없음 | ❌ 없음 | 🟡 중간 |
| 4. **Social Proof** | 없음 | ❌ 없음 | 🟡 중간 |
| 5. **Features/Benefits** | 없음 | ❌ 없음 | 🟡 중간 |
| 6. **Visual Content** | Shorts, VOD 있음 | ✅ 양호 | - |
| 7. **Secondary CTA** | 없음 | ❌ 없음 | 🟢 낮음 |
| 8. **FAQ Section** | 없음 | ❌ 없음 | 🟢 낮음 |
| 9. **Navigation** | 있음 | ✅ 양호 | - |
| 10. **Footer** | 최소화 구현 | ⚠️ 부분 | 🟡 중간 |
| 11. **Mobile Responsive** | 있음 | ✅ 양호 | - |

### 개선 제안 사항

#### 2.1 Hero 섹션 강화
```
현재: 배너 슬라이더 (이벤트/공지 중심)
개선:
- 첫 슬라이드에 명확한 Value Proposition
- "RG FAMILY - 팬덤의 중심" 같은 헤드라인
- 즉각적인 가입/참여 CTA
```

#### 2.2 Social Proof 섹션 추가
```
제안:
- 총 멤버 수, 총 후원 금액 표시
- "3,000+ 멤버가 함께합니다"
- 실시간 후원 피드 (선택)
```

#### 2.3 Footer 확장
```
현재: 약관 | 정책
개선:
- 소셜 미디어 링크
- 사이트맵
- 연락처 정보
- 디스코드/팬카페 링크
```

#### 2.4 시각적 개선
```css
/* 제안: 메인 컨텐츠 영역에 gradient-mesh 적용 */
.mainContent {
  background:
    radial-gradient(at 20% 80%, rgba(253, 104, 186, 0.08) 0%, transparent 50%),
    radial-gradient(at 80% 20%, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
}
```

---

## 3. 현재 페이지 플로우 vs 권장 플로우

### 현재 플로우
```
Hero (배너) → Live + Notice → Shorts → VOD → Footer
```

### 권장 플로우 (Landing Page Best Practice)
```
Hero (가치 제안)
    ↓
Stats (멤버 수, 후원 금액)
    ↓
Live Members
    ↓
Featured Content (Shorts + VOD)
    ↓
Notice (공지사항)
    ↓
CTA (가입/참여 유도)
    ↓
Footer (확장)
```

---

## 4. 실행 가능한 개선 작업 (우선순위별)

### 🔴 높은 우선순위

1. **page.tsx 인라인 스타일 제거**
   - CSS Module로 이동
   - 예상 시간: 30분

2. **Footer 컴포넌트 분리**
   - 소셜 링크, 사이트맵 추가
   - 예상 시간: 1시간

3. **Hero 첫 슬라이드 개선**
   - Value Proposition 강화
   - 예상 시간: 30분

### 🟡 중간 우선순위

4. **Stats 섹션 추가**
   - 멤버/후원 통계 표시
   - 예상 시간: 2시간

5. **타입 정의 중앙화**
   - src/types/로 이동
   - 예상 시간: 1시간

6. **데이터 페칭 패턴 통합**
   - 커스텀 훅 또는 Context 도입
   - 예상 시간: 3시간

### 🟢 낮은 우선순위

7. **Social Proof 섹션**
   - 실시간 후원 피드
   - 예상 시간: 4시간

8. **FAQ 섹션**
   - 자주 묻는 질문
   - 예상 시간: 2시간

---

## 5. 결론

### 현재 상태 평가
- **아키텍처**: 70/100 (기본 구조 양호, 세부 개선 필요)
- **디자인 시스템**: 85/100 (테마/컬러/타이포 우수)
- **랜딩 페이지 요소**: 55/100 (핵심 요소 부족)

### 핵심 권장 사항
1. 인라인 스타일 제거로 유지보수성 향상
2. Footer 컴포넌트 분리 및 확장
3. Stats 섹션 추가로 신뢰도 구축
4. Hero 슬라이드에 명확한 가치 제안 추가

### 참고
- software-architecture 스킬: SOLID 원칙, Clean Architecture
- landing-page-guide-v2 스킬: 11 Essential Elements, Premium Design
