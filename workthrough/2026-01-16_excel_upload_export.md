# 후원 데이터 Excel 업로드/내보내기 기능 구현

## 개요
관리자 후원 관리 페이지에 Excel(.xlsx) 파일 업로드 및 내보내기 기능 추가. 기존 CSV 업로드 기능을 확장하여 Excel 파일 지원을 추가하고, 데이터 내보내기 기능을 새로 구현.

## 주요 변경사항

### 신규 파일
- `src/lib/utils/excel.ts` - Excel 내보내기 유틸리티
  - `exportToExcel<T>()` - 범용 Excel 내보내기 함수
  - `exportDonations()` - 후원 데이터 전용 내보내기

### 수정 파일
- `src/components/admin/CsvUploader.tsx` - Excel 업로드 지원 추가
  - xlsx 라이브러리 import
  - `parseExcel()` 함수 추가
  - Dropzone accept 타입에 xlsx MIME 타입 추가
  - 파일 확장자 감지 후 적절한 파서 사용

- `src/app/admin/donations/page.tsx` - 내보내기 버튼 추가
  - `handleExport()` 핸들러 추가
  - 내보내기 버튼 UI 추가 (Download 아이콘)

- `src/app/admin/shared.module.css` - 내보내기 버튼 스타일
- `src/lib/utils/index.ts` - excel export 추가

## 핵심 코드

```typescript
// excel.ts - Excel 내보내기
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions = {}
): void {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  XLSX.writeFile(workbook, fullFileName)
}

// CsvUploader.tsx - Excel 파싱
const parseExcel = useCallback((buffer: ArrayBuffer): CsvRow[] => {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
  // ...
}, [])
```

## 결과
- ✅ 빌드 성공 (TypeScript 에러 없음)
- ✅ CSV + Excel(.xlsx) 업로드 지원
- ✅ Excel 내보내기 기능 (donations_YYYY-MM-DD.xlsx)
- ✅ 호버 시 핑크(#fd68ba) 스타일 적용

## 다음 단계
- 다른 관리자 페이지에도 Excel 내보내기 확장 (시즌, 멤버 등)
- 대용량 파일 업로드 시 프로그레스 바 추가
- 샘플 Excel 파일 생성 및 다운로드 링크 추가
