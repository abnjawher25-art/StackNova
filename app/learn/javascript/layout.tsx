import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "تعلم JavaScript بالعربية",
    template: "%s | StackNova",
  },
  description:
    "تعلم JavaScript للمبتدئين عبر المتغيرات والشروط والدوال وDOM والأحداث والتحديات التفاعلية.",
};

export default function JavaScriptLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
