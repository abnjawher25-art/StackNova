import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الحساب",
  description: "إدارة حساب StackNova ومزامنة تقدم التعلم.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
