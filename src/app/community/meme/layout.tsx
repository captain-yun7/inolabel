import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "짤, 움짤 모음 | INOLABEL",
  description: "짤과 움짤을 공유하는 공간",
  openGraph: {
    title: "짤, 움짤 모음 | INOLABEL",
    description: "짤과 움짤을 공유하는 공간",
    type: "website",
  },
};

export default function MemeBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
