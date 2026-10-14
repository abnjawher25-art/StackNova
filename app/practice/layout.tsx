import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اختبار أساسيات تطوير الويب",
  description:
    "اختبر معرفتك في HTML وCSS وJavaScript من خلال أسئلة قصيرة مع إجابات وتفسيرات تساعدك على المراجعة.",
};

export default function PracticeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
