import type { Metadata } from "next";
import "./globals.css";
import "./account.css";
import ProgressCloudSync from "./ProgressCloudSync";

export const metadata: Metadata = {
  metadataBase: new URL("https://stack-nova-abnjawher25-8299.vercel.app"),
  title: {
    default: "StackNova — تعلّم البرمجة بالتطبيق",
    template: "%s | StackNova",
  },
  description:
    "تعلّم HTML وCSS وJavaScript باللغة العربية عبر دروس عملية وأمثلة وتحديات تفاعلية ومشاريع تطبيقية.",
  applicationName: "StackNova",
  keywords: [
    "تعلم البرمجة",
    "تعلم تطوير الويب",
    "تعلم HTML بالعربي",
    "تعلم CSS بالعربي",
    "تعلم JavaScript بالعربي",
    "دروس برمجة تفاعلية",
  ],
  openGraph: {
    type: "website",
    locale: "ar_YE",
    siteName: "StackNova",
    title: "StackNova — تعلّم البرمجة بالتطبيق",
    description:
      "منصة عربية لتعلّم HTML وCSS وJavaScript من خلال دروس عملية وأمثلة وتحديات تفاعلية.",
  },
  twitter: {
    card: "summary",
    title: "StackNova — تعلّم البرمجة بالتطبيق",
    description:
      "تعلّم تطوير الويب بالعربية من خلال الدروس العملية والأمثلة والتحديات.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
