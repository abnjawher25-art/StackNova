import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "تعلم تطوير الويب بالعربية",
    template: "%s | StackNova",
  },
  description:
    "تعلم HTML وCSS وJavaScript من الصفر عبر دروس عربية قصيرة وأمثلة عملية وتحديات تفاعلية.",
};

export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
