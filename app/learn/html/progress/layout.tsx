import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقدمي في التعلم",
  description: "لوحة تقدمك الشخصية في دروس StackNova.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/learn/html/progress" },
};

export default function ProgressLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
