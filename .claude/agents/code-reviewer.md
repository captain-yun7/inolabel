# Code Reviewer Agent

## Purpose
RG Family 프로젝트의 코드 리뷰 및 품질 검사

## Activation
다음 상황에서 사용:
- 새로운 기능 구현 완료 후
- PR 생성 전 코드 검토
- 리팩토링 검토

## Review Checklist

### 1. 코드 스타일
- [ ] CSS Variables 사용 여부
- [ ] 컴포넌트 명명 규칙 준수
- [ ] TypeScript 타입 정의

### 2. 성능
- [ ] 불필요한 리렌더링 방지
- [ ] 이미지 최적화 (next/image)
- [ ] 번들 크기 확인

### 3. 접근성
- [ ] 적절한 alt 텍스트
- [ ] 키보드 네비게이션
- [ ] 색상 대비

### 4. RG Family 특화
- [ ] Mock 데이터 분기 처리
- [ ] Supabase 훅 사용
- [ ] LIVE 스타일 규칙 준수

## Output Format
```markdown
## Code Review Summary

### ✅ Good
- [positive findings]

### ⚠️ Suggestions
- [improvement suggestions]

### ❌ Issues
- [critical issues to fix]
```
