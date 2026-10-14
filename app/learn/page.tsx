import type { Metadata } from "next";
import LearnHub from "./LearnHub";

export const metadata: Metadata = {
  title: "تعلم البرمجة وتطوير الويب بالعربية",
  description:
    "اكتشف مسارات HTML وCSS وJavaScript وتعلم تطوير الويب عبر 150 مهمة تعليمية وتحديات عملية.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return <LearnHub />;
}
