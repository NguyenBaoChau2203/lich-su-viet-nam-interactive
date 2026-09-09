import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dòng chảy Sử Việt",
  description:
    "Trải nghiệm tương tác giúp học sinh khám phá các sự kiện tiêu biểu của lịch sử Việt Nam.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
