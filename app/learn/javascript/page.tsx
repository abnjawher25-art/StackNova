import type { Metadata } from "next";
import TrackOverview from "../_components/TrackOverview";
export default function JavaScriptPathPage() { return <TrackOverview trackKey="javascript" />; }

export const metadata: Metadata = {
  title: "مسار JavaScript — تعلم برمجة الويب",
  description: "تعلم JavaScript بالعربية من خلال دروس في المتغيرات والشروط والدوال والأحداث وDOM والتفاعل مع صفحات الويب.",
  alternates: { canonical: "/learn/javascript" },
};
