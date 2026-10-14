"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Lesson = {
  title: string;
  intro: string;
  goal: string;
  starter: string;
  checklist: string[];
  validate: (code: string) => boolean;
  success: string;
  hint: string;
};

const lessons: Record<string, Lesson> = {
  "links-images": {
    title: "الروابط والصور",
    intro: "تعلّم كيف تنقل الزائر إلى صفحة أخرى، وكيف تعرض صورة مع نص بديل يساعد على فهمها.",
    goal: "أنشئ رابطًا وصورة باستخدام الوسمين a و img.",
    starter: `<h1>أشيائي المفضلة</h1>
<p>تعرّف على موقعي المفضل:</p>
<a href="https://example.com">افتح الموقع</a>
<h2>صورة توضيحية</h2>
<img src="https://placehold.co/320x160" alt="صورة تجريبية">`,
    checklist: ["استخدم رابطًا يحتوي على href.", "أضف صورة باستخدام img.", "اكتب نصًا بديلًا داخل alt."],
    validate: (code) => /<a\b[^>]*href\s*=/i.test(code) && /<img\b/i.test(code) && /\balt\s*=/i.test(code),
    success: "ممتاز! أضفت رابطًا وصورة مع نص بديل.",
    hint: "الرابط يبدأ بـ <a>، والصورة تستخدم <img> مع الخاصية alt."
  },
  lists: {
    title: "القوائم في HTML",
    intro: "استخدم القوائم لترتيب الخطوات أو جمع عناصر مرتبطة بطريقة واضحة.",
    goal: "أنشئ قائمة غير مرتبة تضم ثلاثة عناصر على الأقل.",
    starter: `<h1>أهدافي في تعلّم الويب</h1>
<ul>
  <li>تعلّم HTML</li>
  <li>تعلّم CSS</li>
  <li>تطبيق مشروع صغير</li>
</ul>
<h2>خطواتي التالية</h2>
<ol>
  <li>التدرب يوميًا</li>
  <li>مراجعة ما تعلّمته</li>
</ol>`,
    checklist: ["افتح قائمة باستخدام ul.", "أضف ثلاثة عناصر li على الأقل.", "أغلق القائمة بصورة صحيحة."],
    validate: (code) => /<ul\b/i.test(code) && /<\/ul\s*>/i.test(code) && (code.match(/<li\b/gi) || []).length >= 3,
    success: "أحسنت! أنشأت قائمة غير مرتبة تضم ثلاثة عناصر على الأقل.",
    hint: "كل عنصر قائمة يُكتب داخل <li>، وتُجمع العناصر داخل <ul> أو <ol>."
  },
  "mini-project": {
    title: "مشروعك الأول: صفحة تعريفية",
    intro: "اجمع العناوين والفقرات والروابط والصور والقوائم في صفحة بسيطة تعرّف بك.",
    goal: "أنشئ صفحة تحتوي على عنوان وفقرة ورابط وقائمة.",
    starter: `<h1>مرحبًا، أنا مطوّر ويب مبتدئ</h1>
<p>أتعلم بناء صفحات الويب خطوة بخطوة.</p>
<h2>مهارات أعمل على تطويرها</h2>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<p><a href="https://example.com">موقع أتعلم منه</a></p>`,
    checklist: ["أضف عنوانًا رئيسيًا وفقرة.", "أضف قائمة بثلاثة عناصر.", "أضف رابطًا يحتوي على href."],
    validate: (code) => /<h1(?:\s|>)/i.test(code) && /<p(?:\s|>)/i.test(code) && /<ul\b/i.test(code) && (code.match(/<li\b/gi) || []).length >= 3 && /<a\b[^>]*href\s*=/i.test(code),
    success: "رائع! أنجزت أساسيات صفحتك التعريفية الأولى.",
    hint: "قسّم الصفحة إلى أجزاء صغيرة، ثم تأكد من وجود كل عنصر مطلوب."
  }
};

export default function HtmlPracticeLessonPage() {
  const params = useParams<{ lesson: string }>();
  const lessonId = params.lesson;
  const lesson = lessons[lessonId];
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!lesson) {
      setProgressLoaded(true);
      return;
    }
    const key = `stacknova-html-${lessonId}`;
    try {
      setCompleted(window.localStorage.getItem(key) === "completed");
    } catch {
      setCompleted(false);
    }
    setCode(lesson.starter);
    setProgressLoaded(true);
  }, [lessonId, lesson]);

  function checkChallenge() {
    if (!lesson) return;
    if (!lesson.validate(code)) {
      setMessage("لم يكتمل التحدي بعد. راجع المطلوب وجرب مرة أخرى.");
      return;
    }
    setCompleted(true);
    setMessage(lesson.success);
    try {
      window.localStorage.setItem(`stacknova-html-${lessonId}`, "completed");
    } catch {
      // The lesson remains complete for this session.
    }
  }

  if (!lesson) {
    return (
      <main className="container page-top">
        <h1>لم نعثر على هذا الدرس</h1>
        <p>اختر درسًا من خريطة تعلّم HTML.</p>
        <Link className="button button-primary" href="/learn/html/roadmap">العودة إلى الخريطة</Link>
      </main>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">خريطة HTML</Link></nav>
          <Link className="button button-ghost nav-cta" href="/learn/html">الدرس الأول</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/learn/html/roadmap">HTML</Link> / {lesson.title}</div>
          <span className="eyebrow">تعلّم بالتطبيق · HTML</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.intro}</p>
        </section>
        <section className="lesson-layout">
          <div className="panel">
            <h2>هدف الدرس</h2>
            <p>{lesson.goal}</p>
            <h2>المطلوب منك</h2>
            <ul className="challenge-list">{lesson.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            <label htmlFor="html-practice-editor" style={{ display: "block", margin: "18px 0 10px", fontWeight: 700 }}>محرر HTML</label>
            <textarea id="html-practice-editor" className="lesson-editor" spellCheck={false} value={code} onChange={(event) => setCode(event.target.value)} />
            <div className="editor-actions">
              <button className="button button-primary" onClick={checkChallenge}>تحقّق من التحدي</button>
              <button className="button button-ghost" onClick={() => { setCode(lesson.starter); setMessage(""); }}>إعادة المثال</button>
            </div>
            {message && <div className={completed ? "status success" : "status"} role="status">{message}</div>}
            {progressLoaded && <><div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: ".9rem" }}><span>تقدّم الدرس</span><span>{completed ? "100%" : "0%"}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: completed ? "100%" : "0%" }} /></div></>}
            <p><strong>تلميح:</strong> {lesson.hint}</p>
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            <div className="panel"><h2>المعاينة المباشرة</h2><p>سترى هنا نتيجة الكود الذي تكتبه.</p><iframe className="preview-frame" title={`معاينة درس ${lesson.title}`} sandbox="" srcDoc={code} /></div>
            <div className="panel"><h2>واصل التعلّم</h2><p>أكمل التحدي ثم انتقل إلى الدرس التالي من خريطة المسار.</p><Link className="text-link" href="/learn/html/roadmap">العودة إلى خريطة الدروس ↗</Link></div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تعلّم بالتطبيق</div></footer>
    </>
  );
}
