"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const htmlLessons = [
  { id: "stacknova-html-lesson-1", title: "العناوين والفقرات", description: "اكتب عنوانًا وفقرة في أول صفحة HTML.", href: "/learn/html" },
  { id: "stacknova-html-links-images", title: "الروابط والصور", description: "أضف رابطًا وصورة بنص بديل.", href: "/learn/html/links-images" },
  { id: "stacknova-html-lists", title: "القوائم", description: "رتّب العناصر داخل قائمة HTML.", href: "/learn/html/lists" },
  { id: "stacknova-html-mini-project", title: "مشروع الصفحة التعريفية", description: "اجمع المهارات في صفحة صغيرة.", href: "/learn/html/mini-project" },
];
const cssLessons = [
  { id: "stacknova-css-basics", title: "الألوان والنصوص", description: "نسّق لون النص وحجمه.", href: "/learn/css/basics" },
  { id: "stacknova-css-colors", title: "الخلفيات والحدود", description: "أضف خلفية وحدودًا للبطاقات.", href: "/learn/css/colors" },
  { id: "stacknova-css-box-model", title: "نموذج الصندوق", description: "طبّق margin وpadding.", href: "/learn/css/box-model" },
  { id: "stacknova-css-flexbox", title: "تخطيط Flexbox", description: "رتّب العناصر ووزّع المسافات.", href: "/learn/css/flexbox" },
  { id: "stacknova-css-responsive", title: "التصميم المتجاوب", description: "حسّن التنسيق على الهاتف باستخدام Media Queries.", href: "/learn/css/responsive" },
  { id: "stacknova-css-mini-project", title: "مشروع بطاقة تعريفية", description: "اجمع خصائص CSS في مشروع صغير.", href: "/learn/css/mini-project" },
];
const jsLessons = [
  { id: "stacknova-js-basics", title: "المتغيرات والقيم", description: "تعرّف على let وconst.", href: "/learn/javascript/basics" },
  { id: "stacknova-js-conditions", title: "الشروط والقرارات", description: "استخدم if وelse.", href: "/learn/javascript/conditions" },
  { id: "stacknova-js-functions", title: "الدوال", description: "اكتب دالة تعيد نتيجة.", href: "/learn/javascript/functions" },
  { id: "stacknova-js-dom", title: "التعامل مع DOM", description: "غيّر الصفحة عند النقر.", href: "/learn/javascript/dom" },
  { id: "stacknova-js-mini-project", title: "مشروع عدّاد النقرات", description: "أنشئ عدّادًا تفاعليًا.", href: "/learn/javascript/mini-project" },
];
const allLessons = [...htmlLessons, ...cssLessons, ...jsLessons];

export default function ProgressPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);\n  const [quizScore, setQuizScore] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCompletedIds(allLessons.filter((lesson) => window.localStorage.getItem(lesson.id) === "completed").map((lesson) => lesson.id));
      setQuizScore(window.localStorage.getItem("stacknova-web-knowledge-check"));
    } catch {
      setCompletedIds([]);\n      setQuizScore(null);
    }
    setLoaded(true);
  }, []);

  const completedCount = completedIds.length;
  const percent = Math.round((completedCount / allLessons.length) * 100);
  const nextLesson = allLessons.find((lesson) => !completedIds.includes(lesson.id)) ?? allLessons[allLessons.length - 1];

  function renderLessons(lessons: typeof allLessons) {
    return lessons.map((lesson, index) => {
      const isDone = completedIds.includes(lesson.id);
      return (
        <article className="roadmap-item" key={lesson.id}>
          <div className="step-number">{isDone ? "✓" : String(index + 1).padStart(2, "0")}</div>
          <div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
          <Link className="pill" href={lesson.href}>{isDone ? "مكتمل · مراجعة" : "ابدأ الدرس"} ↗</Link>
        </article>
      );
    });
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">خريطة HTML</Link><Link href="/learn/css">خريطة CSS</Link><Link href="/learn/javascript">خريطة JavaScript</Link></nav>
          <Link className="button button-primary nav-cta" href={nextLesson.href}>واصل التعلّم</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / تقدّمي</div>
          <span className="eyebrow">مسارك الشخصي · HTML + CSS + JavaScript</span>
          <h1>تقدّمك في StackNova</h1>
          <p>تابع الدروس التي أنجزتها في مسارات HTML وCSS وJavaScript. يُحفظ التقدّم محليًا في هذا المتصفح.</p>
        </section>
        <section className="panel" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div><h2>إنجازك الكلي</h2><p style={{ marginBottom: 0 }}>{loaded ? `أنجزت ${completedCount} من ${allLessons.length} دروس` : "جارٍ تحميل التقدّم..."}</p></div>
            <strong style={{ fontSize: "2rem" }}>{loaded ? `${percent}%` : "—"}</strong>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: loaded ? `${percent}%` : "0%" }} /></div>
          <Link className="button button-primary" href={nextLesson.href}>{completedCount === allLessons.length ? "راجع آخر درس" : "تابع الدرس التالي"} ↗</Link>
        </section>
        <section className="panel" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div><span className="eyebrow">تدريب إضافي</span><h2 style={{ marginTop: 6 }}>اختبار أساسيات تطوير الويب</h2><p style={{ marginBottom: 0 }}>{quizScore === null ? "لم تسجل نتيجة بعد. اختبر معلوماتك في HTML وCSS وJavaScript." : `آخر نتيجة محفوظة: ${quizScore} من 10 (${Math.round(Number(quizScore) / 10 * 100)}%).`}</p></div>
            <Link className="button button-primary" href="/practice">{quizScore === null ? "ابدأ الاختبار" : "أعد الاختبار"} ↗</Link>
          </div>
        </section>
        <section className="roadmap-list">
          <div><span className="eyebrow">المسار الأول</span><h2>أساسيات HTML</h2></div>
          {renderLessons(htmlLessons)}
          <div style={{ marginTop: 18 }}><span className="eyebrow">المسار الثاني</span><h2>تنسيق CSS</h2></div>
          {renderLessons(cssLessons)}\n          <div style={{ marginTop: 18 }}><span className="eyebrow">المسار الثالث</span><h2>أساسيات JavaScript</h2></div>\n          {renderLessons(jsLessons)}
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تقدّم صغير كل يوم</div></footer>
    </>
  );
}
