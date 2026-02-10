import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자유게시판 | INNO LABEL",
  description: "INNO LABEL 팬들의 자유로운 소통 공간",
  openGraph: {
    title: "자유게시판 | INNO LABEL",
    description: "INNO LABEL 팬들의 자유로운 소통 공간",
    type: "website",
  },
};

export default function FreeBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
