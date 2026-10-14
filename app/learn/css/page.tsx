import type { Metadata } from "next";
import TrackOverview from "../_components/TrackOverview";
export default function CssPathPage() { return <TrackOverview trackKey="css" />; }

export const metadata: Metadata = {
  title: "مسار CSS — تنسيق وتصميم صفحات الويب",
  description: "تعلم CSS بالعربية عبر دروس عملية في الألوان والتخطيط وFlexbox والتصميم المتجاوب وتنسيق الواجهات.",
  alternates: { canonical: "/learn/css" },
};
