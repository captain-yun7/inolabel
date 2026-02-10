# RG Family Skills

## 개요
Claude Code 스킬 자동 활성화 시스템

## 사용 가능한 스킬

| 스킬 | 설명 | 트리거 키워드 |
|-----|------|--------------|
| `rg-dev` | RG Family 개발 가이드라인 | 디자인, 컴포넌트, 스타일 |
| `frontend-design` | 프리미엄 다크 UI 디자인 | UI, CSS, 레이아웃 |
| `workthrough-v2` | 개발 작업 문서화 | 완료, 요약, 정리 |
| `kaizen` | 코드 리팩토링 | 리팩토링, 개선, 최적화 |

## 스킬 구조

```
skills/
├── skill-rules.json      # 활성화 규칙
├── README.md             # 이 파일
└── rg-dev/               # RG Family 전용 스킬
    ├── SKILL.md          # 메인 스킬 파일 (<500줄)
    └── resources/        # 세부 리소스
        └── styling.md
```

## 스킬 활성화 원리

1. 사용자가 프롬프트 입력
2. `skill-activation-prompt.sh` 훅 실행
3. `skill-rules.json`의 키워드/패턴 매칭
4. 매칭된 스킬 제안 표시

## 새 스킬 추가하기

1. `skills/[skill-name]/SKILL.md` 생성
2. `skill-rules.json`에 규칙 추가
3. 필요시 `resources/` 폴더에 세부 문서 추가

## 스킬 규칙 예시

```json
{
  "my-skill": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["키워드1", "키워드2"],
      "intentPatterns": ["(패턴).*(매칭)"]
    }
  }
}
```
