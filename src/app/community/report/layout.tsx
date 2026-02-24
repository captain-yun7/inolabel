import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "신고게시판 | INOLABEL",
  description: "신고 및 건의사항을 작성하는 공간",
  openGraph: {
    title: "신고게시판 | INOLABEL",
    description: "신고 및 건의사항을 작성하는 공간",
    type: "website",
  },
};

export default function ReportBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
