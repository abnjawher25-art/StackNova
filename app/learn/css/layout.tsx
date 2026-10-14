import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "تعلم CSS بالعربية",
    template: "%s | StackNova",
  },
  description:
    "تعلم CSS وتنسيق صفحات الويب باستخدام الألوان والتخطيط وFlexbox والتصميم المتجاوب عبر أمثلة عملية.",
};

export default function CssLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
