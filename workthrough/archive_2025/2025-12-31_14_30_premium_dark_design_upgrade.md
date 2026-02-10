# Premium Dark 디자인 업그레이드 (v2)

## 개요
레퍼런스 이미지(Minimal & Refined Hip) 분석을 바탕으로 Hero 섹션의 무거운 검은색 오버레이를 제거하고, Live Members의 LIVE 표시를 인스타그램 스토리 스타일의 핑크 링으로 통일하여 프리미엄 디자인을 완성함.

## 주요 변경사항

### 1. Hero 섹션 (Hero.module.css)
- **제거**: info 컨테이너의 검은색 배경
- **추가**: 핑크 글로우 radial-gradient 오버레이
- **개선**: subtitle에 핑크 그라데이션 배경 + 글로우 효과
- **개선**: 첫 번째 배지에 핑크 액센트 강조

### 2. Live Members (LiveMembers.module.css, LiveMembers.tsx)
- **변경**: Live Count 배지 색상을 빨강 → 핑크(#fd68ba)로 변경
- **강화**: 핑크 링 글로우 효과 (3레이어 box-shadow)
- **추가**: liveGlowPulse 애니메이션 (강한 글로우 펄스)
- **개선**: 비-라이브 멤버 더 흐릿하게 (opacity: 0.5, grayscale: 0.4)

## 핵심 코드

```css
/* 강화된 핑크 링 글로우 */
.avatarWrapper.isLive::after {
  box-shadow:
    0 0 20px rgba(253, 104, 186, 0.7),
    0 0 40px rgba(253, 104, 186, 0.5),
    0 0 60px rgba(253, 104, 186, 0.3);
  animation: liveGlowPulse 2.5s ease-in-out infinite;
}

/* 비-라이브 멤버 더 흐릿하게 */
.avatar:not(.avatarLive) {
  opacity: 0.5;
  filter: grayscale(0.4) brightness(0.85);
}
```

## 결과
- ✅ Hero 섹션: 검은 오버레이 없이 텍스트 시인성 확보
- ✅ Live Members: 인스타그램 스타일 핑크 링 + 강한 글로우
- ✅ Live Count 배지: 핑크색으로 통일
- ✅ 비-라이브 멤버: 명확한 구분 (흐릿하게 처리)
- ✅ 레퍼런스 이미지와 일치하는 디자인

## 다음 단계
- [ ] 다른 페이지(info/live)에도 동일한 LIVE 링 스타일 적용
- [ ] 다크 모드에서 핑크 글로우 가시성 추가 테스트
