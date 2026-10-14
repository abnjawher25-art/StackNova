import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقدمي في التعلم",
  description: "لوحة تقدمك الشخصية في دروس StackNova.",
  robots: { index: false, follow: false },
};

export default function ProgressLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
