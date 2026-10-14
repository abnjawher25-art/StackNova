import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackNova — تعلّم البرمجة بالتطبيق",
  description:
    "منصة تفاعلية لتعلّم تطوير الويب من خلال دروس قصيرة وتجارب عملية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
