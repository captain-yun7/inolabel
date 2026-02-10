# 디자인 시스템 개선 - cnine/kuniv 참조 스타일 적용

## 개요
cnine.kr과 kuniv.kr (K-Group) 사이트를 참조하여 RG Family 디자인 시스템을 개선했습니다. 글로벌 유틸리티 클래스 추가 및 라이브 인디케이터 색상을 시안색으로 변경했습니다.

## 주요 변경사항

### 1. globals.css - 디자인 유틸리티 클래스 추가
- `.hover-pink`: 핑크 호버 효과 (버튼, 카드, 링크용)
- `.card-hover`: 카드 호버 시 상승 + 핑크 글로우
- `.scale-hover`: 호버 시 확대 효과
- `.live-pulse`, `.live-border`: 라이브 펄스 애니메이션 (시안색)
- `.podium-gold/silver/bronze`: 랭킹 포디움 글로우 효과
- `.badge-glow-gold/pink/cyan`: 배지 글로우
- `.animate-slide-up`, `.stagger-children`: 스태거 애니메이션
- `.glass-card`: 글라스 모피즘 카드

### 2. MemberCard.module.css - 라이브 인디케이터 변경
- 라이브 멤버 아바타 테두리: 핑크 → **시안색(#00d4ff)** (cnine 스타일)
- 골드 리더 + 라이브 상태: 골드 외곽 + 시안 내부 링
- `liveBorderPulse` 애니메이션 추가

### 3. 디자인 개선 계획 문서
- `docs/2026-01-16_DESIGN_IMPROVEMENT_PLAN.md` 생성
- 향후 개선 항목 및 우선순위 정리

## 결과
- ✅ 빌드 성공 (37개 페이지)
- ✅ main 브랜치에 푸시 완료
- ✅ Vercel 자동 배포 트리거됨

## 다음 단계
1. **조직도 트리 구조 연결선**: SVG로 계층 연결선 추가
2. **뷰 모드 토글**: 커뮤니티 썸네일/리스트 전환
3. **캘린더 리디자인**: 더케이 스타일 풀 캘린더 뷰
4. **VIP 페이지 회차 선택기**: EpisodeSelector 컴포넌트 구현
