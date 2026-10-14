import type { Metadata } from "next";
import TrackLesson from "../../_components/TrackLesson";
import { tracks } from "@/lib/curriculum";

type RouteProps = { params: Promise<{ lesson: string }> };

export function generateStaticParams() {
  return tracks.css.lessons.map((lesson) => ({ lesson: lesson.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = tracks.css.lessons.find((item) => item.slug === slug);

  if (!lesson) {
    return {
      title: "الدرس غير موجود",
      robots: { index: false, follow: false },
    };
  }

  const title = `${lesson.title} — درس ${c.label} عملي`;
  return {
    title,
    description: lesson.summary,
    alternates: { canonical: `/learn/css/${lesson.slug}` },
    openGraph: {
      type: "article",
      locale: "ar_YE",
      title,
      description: lesson.summary,
    },
  };
}

export default function CSSLessonRoute() {
  return <TrackLesson trackKey="css" />;
}
