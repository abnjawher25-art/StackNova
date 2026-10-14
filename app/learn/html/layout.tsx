import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "تعلم HTML بالعربية",
    template: "%s | StackNova",
  },
  description:
    "تعلم أساسيات HTML وبناء صفحات الويب خطوة بخطوة مع أمثلة عملية وتحديات للمبتدئين.",
};

export default function HtmlLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
