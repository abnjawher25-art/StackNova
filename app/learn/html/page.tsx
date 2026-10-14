"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const starterCode = `<h1>مرحبًا بك في StackNova!</h1>
<p>هذه أول صفحة HTML أكتبها بنفسي.</p>
<button>جرّبني</button>`;

export default function HtmlLessonPage() {
  const [code, setCode] = useState(starterCode);
  const [completed, setCompleted] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      setCompleted(window.localStorage.getItem("stacknova-html-lesson-1") === "completed");
    } catch {
      // Progress remains available for the current session if storage is disabled.
    }
    setProgressLoaded(true);
  }, []);

  function checkChallenge() {
    const hasOpeningHeading = /<h1(?:\s|>)/i.test(code);
    const hasClosingHeading = /<\/h1\s*>/i.test(code);
    if (!hasOpeningHeading || !hasClosingHeading) {
      setMessage("لم يكتمل التحدي بعد. أضف عنوانًا باستخدام <h1> ثم أغلقه بـ </h1>.");
      return;
    }

    setCompleted(true);
    setMessage("أحسنت! أكملت تحدي العنوان بنجاح.");
    try {
      window.localStorage.setItem("stacknova-html-lesson-1", "completed");
    } catch {
      // Ignore storage errors; the lesson is still marked complete in this session.
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">خريطة التعلّم</Link></nav>
          <Link className="button button-ghost nav-cta" href="/learn/html/roadmap">كل دروس HTML</Link>
        </div>
      </header>

      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / HTML / الدرس 1</div>
          <span className="eyebrow">المستوى الأول · HTML</span>
          <h1>أنشئ أول عنوان في صفحة ويب</h1>
          <p>في هذا الدرس ستتعرّف على وسم العنوان <code>&lt;h1&gt;</code>، ثم تكتب الكود بنفسك وتشاهد النتيجة مباشرة في المعاينة.</p>
        </section>

        <section className="lesson-layout">
          <div className="panel">
            <h2>١. الفكرة الأساسية</h2>
            <p>تُستخدم لغة HTML لوصف بنية محتوى صفحة الويب. نكتب العنصر غالبًا باستخدام وسم افتتاحي ووسم إغلاق، ونضع المحتوى بينهما.</p>
            <div className="code-window" style={{ transform: "none", borderRadius: 12, margin: "18px 0" }}>
              <div className="window-top"><span className="dot" /><span className="dot" /><span className="dot" /><span className="window-label">example.html</span></div>
              <div className="code-body">
                <span className="code-line"><span className="code-purple">&lt;h1&gt;</span><span className="code-green">أول عنوان لي</span><span className="code-purple">&lt;/h1&gt;</span></span>
              </div>
            </div>
            <h2>٢. جرّب بنفسك</h2>
            <p>عدّل الكود في المحرر. ستتغيّر المعاينة تلقائيًا، ويمكنك استخدام الوسوم التي تعلّمتها لإضافة عنوان وفقرة.</p>
            <label htmlFor="html-editor" style={{ display: "block", marginBottom: 10, fontWeight: 700 }}>محرر HTML</label>
            <textarea id="html-editor" className="lesson-editor" spellCheck={false} value={code} onChange={(event) => setCode(event.target.value)} />
            <div className="editor-actions">
              <button className="button button-primary" onClick={checkChallenge}>تحقّق من التحدي</button>
              <button className="button button-ghost" onClick={() => { setCode(starterCode); setMessage(""); }}>إعادة الكود</button>
            </div>
            {message && <div className={completed ? "status success" : "status"} role="status">{message}</div>}
            {progressLoaded && <><div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: ".9rem" }}><span>تقدّم الدرس</span><span>{completed ? "100%" : "0%"}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: completed ? "100%" : "0%" }} /></div></>}
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div className="panel">
              <h2>المعاينة المباشرة</h2>
              <p>هذه المساحة تعرض نتيجة HTML الذي تكتبه.</p>
              <iframe className="preview-frame" title="معاينة صفحة HTML" sandbox="" srcDoc={code} />
            </div>
            <div className="panel">
              <h2>تحدّي الدرس</h2>
              <p>اكتب عنوانًا صحيحًا باستخدام وسم <code>&lt;h1&gt;</code> ووسم الإغلاق المقابل.</p>
              <ul className="challenge-list">
                <li>ابدأ بوسم افتتاحي.</li>
                <li>اكتب نص العنوان.</li>
                <li>أغلق العنصر بصورة صحيحة.</li>
              </ul>
              <p><strong>تلميح:</strong> كل وسم افتتاحي يحتاج إلى إغلاق مناسب في هذا التمرين.</p>
              <Link className="text-link" href="/learn/html/roadmap">انتقل إلى خريطة الدروس ↗</Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تعلّم بالتطبيق</div></footer>
    </>
  );
}
