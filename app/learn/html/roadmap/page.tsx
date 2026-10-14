import type { Metadata } from "next";
import TrackOverview from "../../_components/TrackOverview";
export default function HtmlRoadmapPage() { return <TrackOverview trackKey="html" />; }

export const metadata: Metadata = {
  title: "خريطة تعلم HTML",
  description: "استعرض خريطة تعلم HTML والدروس والمناطق التعليمية في StackNova.",
  alternates: { canonical: "/learn/html" },
};
