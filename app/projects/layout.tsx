import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "مشاريع برمجة تطبيقية",
    template: "%s | StackNova",
  },
  description:
    "طبّق مهارات HTML وCSS وJavaScript عبر أفكار مشاريع ويب عملية مناسبة للمبتدئين.",
};

export default function ProjectsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
