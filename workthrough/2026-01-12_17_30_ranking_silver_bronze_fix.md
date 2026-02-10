# 랭킹 2/3위 Silver/Bronze 게이지바 색상 수정

## 개요
랭킹 리스트에서 2위(Silver)와 3위(Bronze)가 동일한 회색 스타일을 사용하던 문제를 수정했습니다. 이제 각 순위에 맞는 메탈릭 색상이 적용됩니다.

## 주요 변경사항

### 수정한 것
- **RankingFullList.tsx**: `getRankStyle()` 함수 수정
  - 기존: `if (rank === 2 || rank === 3) return styles.elite;`
  - 수정: 2위는 `styles.silver`, 3위는 `styles.bronze` 반환

- **RankingFullList.module.css**: Silver/Bronze 스타일 분리
  - `.elite` 클래스 → `.silver` + `.bronze` 클래스로 분리
  - 각 순위별 고유 메탈릭 색상 적용

## 핵심 코드

### TSX 변경
```typescript
const getRankStyle = (rank: number) => {
  if (rank === 1) return styles.gold;
  if (rank === 2) return styles.silver;  // 변경
  if (rank === 3) return styles.bronze;  // 변경
  if (rank <= 10) return styles.top10;
  return "";
};
```

### CSS 변경 (주요 부분)
```css
/* 2위 Silver 게이지 */
.silver .gaugeFill {
  background: var(--metallic-silver-gradient);
}

/* 3위 Bronze 게이지 */
.bronze .gaugeFill {
  background: var(--metallic-bronze-gradient);
}
```

## 적용된 스타일 요소

| 요소 | Silver (2위) | Bronze (3위) |
|------|-------------|--------------|
| 배경 그라데이션 | `--metallic-silver-bg` | `--metallic-bronze-bg` |
| 테두리 | `--metallic-silver-border` | `--metallic-bronze-border` |
| 순위 숫자 | 실버 그라데이션 텍스트 | 브론즈 그라데이션 텍스트 |
| 아바타 테두리 | 실버 글로우 | 브론즈 글로우 |
| 이니셜 | 실버 쉬머 애니메이션 | 브론즈 쉬머 애니메이션 |
| 이름 | `--metallic-silver` | `--metallic-bronze` |
| 게이지바 | `--metallic-silver-gradient` | `--metallic-bronze-gradient` |
| 금액 | `--metallic-silver` | `--metallic-bronze` |

## 결과
- ✅ 빌드 성공
- ✅ 2위: 실버 메탈릭 색상 적용
- ✅ 3위: 브론즈 메탈릭 색상 적용
- ✅ 다크/라이트 모드 모두 대응 (CSS 변수 활용)

## 다음 단계
- 브라우저에서 시각적 검증 필요 (로컬 개발 서버 확인)
- 추가 UI/UX 개선점 발굴
