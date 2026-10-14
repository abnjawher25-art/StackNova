"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isTrackUnlocked, tracks } from "@/lib/curriculum";
import { getProgress } from "@/lib/curriculum/types";

export default function ProgressPage() {
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setProgress(getProgress()); setLoaded(true); }, []);
  const all = Object.values(tracks).flatMap((track) => track.lessons);
  const completed = all.filter((lesson) => progress[lesson.id]?.mastered).length;
  const totalAttempts = Object.values(progress).reduce((sum, item) => sum + item.attempts, 0);

  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link></nav></div></header>
    <main className="container track-page">
      <section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / تقدمي</div><span className="eyebrow">لوحة الإتقان · محفوظة على هذا المتصفح</span><h1>رحلتك حتى الآن</h1><p>لا يُحتسب الدرس مكتملًا إلا بعد اجتياز تحديه. تقدمك محفوظ محليًا على هذا المتصفح.</p>
        <div className="mastery-summary"><div><strong>{loaded ? completed : "—"} / 150</strong><span>درس متقن</span></div><div><strong>{loaded ? Math.round(completed / 150 * 100) : 0}%</strong><span>التقدم الكلي</span></div><div><strong>{loaded ? totalAttempts : "—"}</strong><span>محاولات التحدي</span></div></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: (loaded ? completed / 150 * 100 : 0) + "%" }} /></div>
      </section>
      <section className="track-grid progress-tracks">{Object.values(tracks).map((track) => {
        const done = track.lessons.filter((lesson) => progress[lesson.id]?.mastered).length;
        const open = isTrackUnlocked(track.key, progress);
        const href = "/learn/" + track.key;
        return <article className="track-card" key={track.key}><div className="track-icon">{track.key === "html" ? "⌘" : track.key === "css" ? "✳" : "⚡"}</div><span className="eyebrow">{open ? "متاح" : "مقفل حتى الإتقان"}</span><h2>{track.title}</h2><p>{track.subtitle}</p><div className="mastery-inline"><strong>{done} / 50</strong><span>درس متقن</span></div><div className="progress-track"><div className="progress-fill" style={{ width: done / 50 * 100 + "%" }} /></div><Link className="button button-primary" href={href}>{open ? "فتح خريطة المسار" : "راجع تقدم المسار السابق"} ↗</Link></article>;
      })}</section>
      <section className="panel progress-note"><h2>كيف يعمل الإتقان؟</h2><ul><li>تبدأ بمهمة واحدة متاحة، وتبقى الدروس التالية مقفلة.</li><li>تعديل المثال واجتياز نمط التحدي يسجل إتقان الدرس.</li><li>عند الإخفاق تحصل على تلميح وخطة مراجعة ومحاولات إضافية.</li><li>بعد إتقان جميع دروس الجزيرة، تُفتح الجزيرة التالية.</li></ul></section>
    </main><footer className="footer"><div className="container">StackNova · تقدم ثابت، ومهارة حقيقية.</div></footer>
  </>;
}
