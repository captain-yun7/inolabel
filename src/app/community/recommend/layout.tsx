import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "컨텐츠추천 | INNO LABEL",
  description: "추천 콘텐츠를 공유하는 공간",
  openGraph: {
    title: "컨텐츠추천 | INNO LABEL",
    description: "추천 콘텐츠를 공유하는 공간",
    type: "website",
  },
};

export default function RecommendBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
