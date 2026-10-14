import type { Metadata } from "next";
import TrackOverview from "../_components/TrackOverview";
export default function HtmlPathPage() { return <TrackOverview trackKey="html" />; }

export const metadata: Metadata = {
  title: "مسار HTML — تعلم بناء صفحات الويب",
  description: "ابدأ تعلم HTML بالعربية عبر 50 درسًا عمليًا لبناء هيكل صفحات الويب وفهم العناصر والروابط والصور والنماذج.",
  alternates: { canonical: "/learn/html" },
};
