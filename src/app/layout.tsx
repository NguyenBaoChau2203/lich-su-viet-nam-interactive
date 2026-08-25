import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lịch sử Việt Nam — nền tảng kỹ thuật',
  description: 'Nền tảng kỹ thuật cho hệ thống tìm hiểu lịch sử Việt Nam tương tác.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
