"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type CssLesson = {
  title: string;
  intro: string;
  goal: string;
  starter: string;
  checklist: string[];
  validate: (code: string) => boolean;
  success: string;
  hint: string;
};

const lessons: Record<string, CssLesson> = {
  basics: {
    title: "الألوان والنصوص",
    intro: "ابدأ بتغيير لون العنوان وحجم النص. في CSS نختار العنصر ثم نكتب الخصائص داخل الأقواس.",
    goal: "غيّر لون العنوان وحجم الفقرة.",
    starter: "h1 {\n  color: #7c3aed;\n}\np {\n  font-size: 20px;\n}",
    checklist: ["اكتب خاصية color.", "أضف خاصية font-size.", "استخدم قيمة حجم بوحدة px."],
    validate: (code) => /color\s*:/i.test(code) && /font-size\s*:\s*\d+px/i.test(code),
    success: "رائع! نسّقت اللون وحجم النص.",
    hint: "تُكتب الخاصية بهذا الشكل: اسم-الخاصية: القيمة;"
  },
  colors: {
    title: "الخلفيات والحدود",
    intro: "تساعد الخلفيات والحدود على فصل أجزاء الواجهة وجعل البطاقات أكثر وضوحًا.",
    goal: "أضف خلفية وحدودًا إلى البطاقة.",
    starter: ".card {\n  background-color: #f3e8ff;\n  border: 2px solid #7c3aed;\n  color: #24113d;\n}",
    checklist: ["أضف background-color.", "أضف border.", "حافظ على تباين النص مع الخلفية."],
    validate: (code) => /background(?:-color)?\s*:/i.test(code) && /border\s*:/i.test(code),
    success: "أحسنت! أضفت خلفية وحدودًا للبطاقة.",
    hint: "يمكن كتابة border باستخدام السمك ونوع الخط واللون."
  },
  "box-model": {
    title: "نموذج الصندوق",
    intro: "كل عنصر يشبه صندوقًا: المحتوى في الداخل، ثم padding، ثم border، ثم margin خارج العنصر.",
    goal: "امنح البطاقة مساحة داخلية وخارجية.",
    starter: ".card {\n  padding: 24px;\n  margin: 16px;\n  border: 1px solid #c4b5fd;\n}",
    checklist: ["أضف padding بمقدار 20px أو أكثر.", "أضف margin.", "احتفظ بحدود البطاقة."],
    validate: (code) => /padding\s*:\s*(2\d|[3-9]\d)px/i.test(code) && /margin\s*:/i.test(code),
    success: "ممتاز! أصبحت البطاقة تملك مساحة داخلية وخارجية.",
    hint: "padding داخل الحدود، أما margin فيضيف مساحة خارجها."
  },
  flexbox: {
    title: "تخطيط Flexbox",
    intro: "Flexbox طريقة سهلة لترتيب العناصر على محور واحد والتحكم في المسافات بينها.",
    goal: "اجعل العناصر بجانب بعضها ووزّع المسافات.",
    starter: ".items {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n}",
    checklist: ["استخدم display: flex.", "أضف justify-content.", "أضف مسافة بين العناصر باستخدام gap."],
    validate: (code) => /display\s*:\s*flex\s*;/i.test(code) && /justify-content\s*:/i.test(code),
    success: "رائع! استخدمت Flexbox لتخطيط العناصر.",
    hint: "جرّب center أو space-between أو flex-start كقيمة لـ justify-content."
  },
  "mini-project": {
    title: "مشروع بطاقة تعريفية",
    intro: "اجمع ما تعلّمته لتصميم بطاقة صغيرة تحتوي على عنوان ووصف وزر.",
    goal: "أنشئ تنسيقًا لبطاقة باستخدام الخلفية والمسافات وFlexbox.",
    starter: ".profile-card {\n  background: #f5f3ff;\n  color: #24113d;\n  padding: 24px;\n  margin: 16px;\n  border-radius: 16px;\n}\n.profile-actions {\n  display: flex;\n  gap: 10px;\n}",
    checklist: ["أضف خلفية للبطاقة.", "أضف padding.", "استخدم display: flex للأزرار."],
    validate: (code) => /background(?:-color)?\s*:/i.test(code) && /padding\s*:/i.test(code) && /display\s*:\s*flex\s*;/i.test(code),
    success: "أنجزت بطاقة CSS الأولى! يمكنك تعديل الألوان والمسافات بحرية.",
    hint: "يمكن أن تتضمن البطاقة أكثر من قاعدة CSS، واحدة لكل جزء."
  }
};

const sampleHtml = `<main class="demo-page">
  <section class="profile-card">
    <span class="demo-tag">STACKNOVA</span>
    <h1>مرحبًا، أنا مطوّر ويب</h1>
    <p>أتعلم تصميم واجهات جميلة خطوة بخطوة.</p>
    <div class="profile-actions"><button>مشاريعي</button><button class="secondary">تواصل معي</button></div>
  </section>
  <div class="items"><span>HTML</span><span>CSS</span><span>Flexbox</span></div>
  <div class="card"><strong>جرّب بنفسك</strong><p>غيّر قيم CSS ثم شاهد النتيجة.</p></div>
</main>`;

function makePreview(css: string) {
  return `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
  *{box-sizing:border-box}body{margin:0;padding:18px;background:#fff;font-family:Arial,sans-serif;color:#24113d}.demo-page{max-width:620px;margin:auto}.profile-card,.card{border:1px solid #ddd6fe;border-radius:14px;padding:18px;margin:10px 0}.demo-tag{font-size:11px;letter-spacing:2px;color:#7c3aed}h1{font-size:22px;margin:10px 0}p{line-height:1.7}button{border:0;border-radius:8px;padding:9px 13px;background:#7c3aed;color:white}.secondary{background:#ede9fe;color:#4c1d95}.profile-actions,.items{display:flex;gap:10px;flex-wrap:wrap}.items{margin:16px 0}.items span{padding:7px 12px;background:#f3f4f6;border-radius:8px}
  ${css.replace(/<\/style/gi, "<\\/style")}
  </style><body>${sampleHtml}</body></html>`;
}

export default function CssPracticeLessonPage() {
  const params = useParams<{ lesson: string }>();
  const lessonId = params.lesson;
  const lesson = lessons[lessonId];
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!lesson) { setLoaded(true); return; }
    try { setCompleted(window.localStorage.getItem(`stacknova-css-${lessonId}`) === "completed"); }
    catch { setCompleted(false); }
    setCode(lesson.starter);
    setLoaded(true);
  }, [lessonId, lesson]);

  function checkChallenge() {
    if (!lesson) return;
    if (!lesson.validate(code)) {
      setMessage("لم يكتمل التحدي بعد. تأكد من الخصائص المطلوبة وجرب مرة أخرى.");
      return;
    }
    setCompleted(true);
    setMessage(lesson.success);
    try { window.localStorage.setItem(`stacknova-css-${lessonId}`, "completed"); } catch { /* Session state remains available. */ }
  }

  if (!lesson) return <main className="container page-top"><h1>لم نعثر على هذا الدرس</h1><p>اختر درسًا من خريطة CSS.</p><Link className="button button-primary" href="/learn/css">العودة إلى خريطة CSS</Link></main>;

  return (
    <>
      <header className="site-header"><div className="container nav">
        <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
        <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/css">خريطة CSS</Link><Link href="/learn/html/progress">تقدّمي</Link></nav>
        <Link className="button button-ghost nav-cta" href="/learn/html/roadmap">مسار HTML</Link>
      </div></header>
      <main className="container">
        <section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/learn/css">CSS</Link> / {lesson.title}</div>
          <span className="eyebrow">تعلّم بالتطبيق · CSS</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></section>
        <section className="lesson-layout">
          <div className="panel">
            <h2>هدف الدرس</h2><p>{lesson.goal}</p><h2>المطلوب منك</h2>
            <ul className="challenge-list">{lesson.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            <label htmlFor="css-practice-editor" style={{ display: "block", margin: "18px 0 10px", fontWeight: 700 }}>محرر CSS</label>
            <textarea id="css-practice-editor" className="lesson-editor" spellCheck={false} value={code} onChange={(event) => setCode(event.target.value)} />
            <div className="editor-actions"><button className="button button-primary" onClick={checkChallenge}>تحقّق من التحدي</button><button className="button button-ghost" onClick={() => { setCode(lesson.starter); setMessage(""); }}>إعادة المثال</button></div>
            {message && <div className={completed ? "status success" : "status"} role="status">{message}</div>}
            {loaded && <><div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: ".9rem" }}><span>تقدّم الدرس</span><span>{completed ? "100%" : "0%"}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: completed ? "100%" : "0%" }} /></div></>}
            <p><strong>تلميح:</strong> {lesson.hint}</p>
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            <div className="panel"><h2>المعاينة المباشرة</h2><p>عدّل CSS وستتغير العناصر هنا مباشرة.</p><iframe className="preview-frame" title={`معاينة درس ${lesson.title}`} sandbox="" srcDoc={makePreview(code)} /></div>
            <div className="panel"><h2>واصل التعلّم</h2><p>بعد إكمال التحدي، اختر درسًا آخر من خريطة CSS.</p><Link className="text-link" href="/learn/css">العودة إلى خريطة CSS ↗</Link></div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تعلّم CSS بالتطبيق</div></footer>
    </>
  );
}
