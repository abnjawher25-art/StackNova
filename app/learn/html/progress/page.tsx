"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const lessons = [
  { id: "stacknova-html-lesson-1", title: "العناوين والفقرات", description: "اكتب عنوانًا وفقرة في أول صفحة HTML.", href: "/learn/html" },
  { id: "stacknova-html-links-images", title: "الروابط والصور", description: "أضف رابطًا وصورة بنص بديل.", href: "/learn/html/links-images" },
  { id: "stacknova-html-lists", title: "القوائم", description: "رتّب العناصر داخل قائمة HTML.", href: "/learn/html/lists" },
  { id: "stacknova-html-mini-project", title: "مشروع الصفحة التعريفية", description: "اجمع المهارات في صفحة صغيرة.", href: "/learn/html/mini-project" },
];

export default function HtmlProgressPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setCompletedIds(lessons.filter((lesson) => window.localStorage.getItem(lesson.id) === "completed").map((lesson) => lesson.id));
    } catch {
      setCompletedIds([]);
    }
    setLoaded(true);
  }, []);

  const completedCount = completedIds.length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => !completedIds.includes(lesson.id)) ?? lessons[lessons.length - 1];

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">خريطة HTML</Link></nav>
          <Link className="button button-primary nav-cta" href={nextLesson.href}>واصل التعلّم</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/learn/html/roadmap">HTML</Link> / تقدّمي</div>
          <span className="eyebrow">مسارك الشخصي · HTML</span>
          <h1>تقدّمك في StackNova</h1>
          <p>تابع الدروس التي أنجزتها، وارجع إلى أي درس متى احتجت إلى المراجعة. يُحفظ التقدّم في هذا المتصفح.</p>
        </section>
        <section className="panel" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div><h2>إنجاز مسار HTML</h2><p style={{ marginBottom: 0 }}>{loaded ? `أنجزت ${completedCount} من ${lessons.length} دروس` : "جارٍ تحميل التقدّم..."}</p></div>
            <strong style={{ fontSize: "2rem" }}>{loaded ? `${percent}%` : "—"}</strong>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: loaded ? `${percent}%` : "0%" }} /></div>
          <Link className="button button-primary" href={nextLesson.href}>{completedCount === lessons.length ? "راجع المشروع الأخير" : "تابع الدرس التالي"} ↗</Link>
        </section>
        <section className="roadmap-list">
          {lessons.map((lesson, index) => {
            const isDone = completedIds.includes(lesson.id);
            return (
              <article className="roadmap-item" key={lesson.id}>
                <div className="step-number">{isDone ? "✓" : String(index + 1).padStart(2, "0")}</div>
                <div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
                <Link className="pill" href={lesson.href}>{isDone ? "مكتمل · مراجعة" : "ابدأ الدرس"} ↗</Link>
              </article>
            );
          })}
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تقدّم صغير كل يوم</div></footer>
    </>
  );
}
