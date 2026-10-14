"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isLessonUnlocked, isTrackUnlocked, tracks } from "@/lib/curriculum";
import { getProgress, type TrackKey } from "@/lib/curriculum/types";

type Props = { trackKey: TrackKey };

export default function TrackOverview({ trackKey }: Props) {
  const track = tracks[trackKey];
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setProgress(getProgress()); setLoaded(true); }, []);
  const mastered = useMemo(() => track.lessons.filter((lesson) => progress[lesson.id]?.mastered).length, [track.lessons, progress]);
  const unlocked = isTrackUnlocked(trackKey, progress);
  const percent = Math.round((mastered / track.lessons.length) * 100);
  const grouped = track.areas.map((area, areaIndex) => ({
    area, areaIndex,
    lessons: track.lessons.filter((lesson) => lesson.areaNumber === areaIndex + 1),
  }));
  const homeHref = trackKey === "html" ? "/" : "/learn/html/roadmap";

  return <>
    <header className="site-header"><div className="container nav">
      <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
      <nav className="nav-links" aria-label="التنقل الرئيسي"><Link href="/">الرئيسية</Link><Link href="/learn/html">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link><Link href="/learn/html/progress">تقدّمي</Link></nav>
      <span className="pill">رحلة إتقان</span>
    </div></header>
    <main className="container track-page">
      <section className="page-top track-hero">
        <div className="breadcrumb"><Link href="/">الرئيسية</Link> / جزر التعلّم / {track.key.toUpperCase()}</div>
        <span className="eyebrow">الجزيرة {trackKey === "html" ? "الأولى" : trackKey === "css" ? "الثانية" : "الثالثة"} · 50 درسًا</span>
        <h1>{track.title}</h1><p>{track.subtitle} كل منطقة تضم خمس مهمات: تعلّم، استكشاف، تدريب، تحدٍ، ثم بوابة إتقان.</p>
        <div className="mastery-summary"><div><strong>{loaded ? mastered : "—"} / 50</strong><span>درس متقن</span></div><div><strong>{loaded ? percent : 0}%</strong><span>التقدم في الجزيرة</span></div><div><strong>10</strong><span>مناطق تعليمية</span></div></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: (loaded ? percent : 0) + "%" }} /></div>
        {!unlocked && <div className="status locked-notice" role="status">هذه الجزيرة مقفلة حتى تتقن جميع دروس المسار السابق. <Link className="text-link" href={homeHref}>ارجع إلى المسار السابق ↗</Link></div>}
      </section>

      <div className="track-shell">
        <aside className="track-sidebar panel">
          <h2>خريطة الجزيرة</h2><p>افتح المنطقة الحالية، واترك بقية المناطق تظهر كأهداف قادمة.</p>
          <nav aria-label="مناطق المسار" className="area-nav">{grouped.map((group) => {
            const areaDone = group.lessons.every((lesson) => progress[lesson.id]?.mastered);
            const areaOpen = unlocked && isLessonUnlocked(track, group.areaIndex * 5, progress);
            return <a key={group.area} className={areaOpen ? "area-nav-link" : "area-nav-link is-locked"} href={areaOpen ? "#area-" + (group.areaIndex + 1) : undefined} aria-disabled={!areaOpen}><span>{String(group.areaIndex + 1).padStart(2, "0")}</span><span>{group.area}</span><b>{areaDone ? "✓" : areaOpen ? "↗" : "🔒"}</b></a>;
          })}</nav>
          <Link className="button button-ghost" href="/learn/html/progress">عرض سجل الإتقان</Link>
        </aside>
        <div className="track-content">
          {grouped.map((group) => {
            const areaDone = group.lessons.every((lesson) => progress[lesson.id]?.mastered);
            const areaOpen = unlocked && isLessonUnlocked(track, group.areaIndex * 5, progress);
            return <section className={areaOpen ? "area-section" : "area-section area-locked"} id={"area-" + (group.areaIndex + 1)} key={group.area}>
              <div className="area-heading"><div><span className="area-kicker">المنطقة {String(group.areaIndex + 1).padStart(2, "0")} · 5 مهمات</span><h2>{group.area}</h2></div><span className={areaDone ? "pill pill-done" : "pill"}>{areaDone ? "اكتملت" : areaOpen ? "على الخريطة" : "مقفلة"}</span></div>
              <div className="lesson-list">{group.lessons.map((lesson) => {
                const masteredLesson = progress[lesson.id]?.mastered === true;
                const lessonUnlocked = unlocked && isLessonUnlocked(track, lesson.number - 1, progress);
                const status = masteredLesson ? "متقن" : lessonUnlocked ? "متاح الآن" : "مقفل";
                const href = "/learn/" + trackKey + "/" + lesson.slug;
                const body = <><span className="lesson-number">{String(lesson.number).padStart(2, "0")}</span><span className="lesson-copy"><strong>{lesson.title}</strong><small>{lesson.summary}</small><span className="lesson-meta">المهمة {lesson.stage} · {lesson.minutes} دقيقة · {status}</span></span><span className="lesson-state" aria-hidden="true">{masteredLesson ? "✓" : lessonUnlocked ? "↗" : "🔒"}</span></>;
                return lessonUnlocked ? <Link className={"lesson-row " + (masteredLesson ? "is-mastered" : "is-current")} href={href} key={lesson.id}>{body}</Link> : <div className="lesson-row is-locked" key={lesson.id} aria-disabled="true">{body}</div>;
              })}</div>
            </section>;
          })}
        </div>
      </div>
    </main>
    <footer className="footer"><div className="container">StackNova · أتقن خطوة، ثم افتح الخطوة التالية.</div></footer>
  </>;
}
