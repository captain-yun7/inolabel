# 캘린더 시인성 및 사이즈 개선

## 개요
일정 페이지의 캘린더 컴포넌트에서 라이트/다크 모드 텍스트 시인성을 개선하고, 캘린더 셀 크기 및 비율을 조정했습니다.

## 주요 변경사항
- **수정한 것**: "공지" 레전드 컬러 흰색 → 보라색 (#a855f7)
- **수정한 것**: 캘린더 셀 높이 증가 (80px → 120px)
- **수정한 것**: 날짜 숫자 크기 증가 (text-sm → text-base)
- **수정한 것**: 요일 헤더 크기 증가 및 텍스트 primary 컬러 적용
- **수정한 것**: 오늘 날짜 표시 핑크 배경으로 강조

## 핵심 코드

```tsx
// CalendarGrid.tsx - 셀 크기 개선
className={`
  min-h-[120px] md:min-h-[100px] sm:min-h-[80px]
  flex flex-col p-3
  ...
`}

// 날짜 숫자 스타일
className={`
  text-base font-bold mb-2
  min-w-[36px] min-h-[36px] rounded-full
  ${day.isToday ? 'bg-[var(--color-pink)] text-white' : ''}
`}
```

```tsx
// page.tsx - 레전드 컬러 개선
{ label: "공지", color: "#a855f7" }, // Purple (better visibility)
{ label: "휴방", color: "#6b7280" }, // Gray-500
```

## 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/app/schedule/page.tsx` | 레전드 컬러 수정 |
| `src/app/schedule/page.module.css` | 레전드 닷 크기 증가 |
| `src/components/schedule/Calendar.tsx` | 요일 헤더 스타일 개선 |
| `src/components/schedule/CalendarGrid.tsx` | 셀 크기, 날짜 스타일 개선 |
| `src/components/schedule/EventList.tsx` | 이벤트 컬러 통일 |

## 결과
- ✅ 라이트 모드에서 모든 레전드 가시성 확보
- ✅ 다크 모드에서 텍스트 대비 개선
- ✅ 캘린더 셀 크기 증가로 가독성 향상
- ✅ 오늘 날짜 핑크 배경으로 명확하게 표시
- ✅ 서버 재시작 완료

## 다음 단계
- 캘린더에 실제 일정 데이터 연동
- 이벤트 클릭 시 상세 모달 개선
- 모바일 반응형 추가 최적화
