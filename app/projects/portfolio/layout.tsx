import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مشروع بناء محفظة شخصية",
  description:
    "أنشئ محفظة مطور ويب باستخدام HTML وCSS وJavaScript مع محرر ومعاينة مباشرة وخطوات تحقق.",
  alternates: { canonical: "/projects/portfolio" },
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
