import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مرجع HTML وCSS وJavaScript",
  description:
    "مرجع سريع لأهم وسوم HTML وخصائص CSS ومفاهيم JavaScript مع أمثلة كود قابلة للنسخ.",
  alternates: { canonical: "/reference" },
};

export default function ReferenceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
