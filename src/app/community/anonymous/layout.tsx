import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "익명게시판 | INNO LABEL",
  description: "익명으로 자유롭게 소통하는 공간",
  openGraph: {
    title: "익명게시판 | INNO LABEL",
    description: "익명으로 자유롭게 소통하는 공간",
    type: "website",
  },
};

export default function AnonymousBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
