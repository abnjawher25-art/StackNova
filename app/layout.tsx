import type { Metadata } from "next";
import "./globals.css";
import "./account.css";
import ProgressCloudSync from "./ProgressCloudSync";

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
      <body>
        {children}
        <ProgressCloudSync />
      </body>
    </html>
  );
}
