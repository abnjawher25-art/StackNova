"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Lesson = { title: string; intro: string; goal: string; starter: string; checklist: string[]; validate: (code: string) => boolean; success: string; hint: string; };
const lessons: Record<string, Lesson> = {
  basics: {
    title: "المتغيرات والقيم",
    intro: "المتغير اسم نستخدمه للاحتفاظ بقيمة. استخدم const للقيم التي لا تعيد إسنادها وlet عندما تحتاج إلى تغييرها.",
    goal: "عرّف متغيرًا باسم userName ومتغيرًا باسم score.",
    starter: 'const userName = "Ebrahim";\nlet score = 0;\nscore = score + 1;\nconsole.log(userName, score);',
    checklist: ["استخدم const لتعريف userName.", "استخدم let لتعريف score.", "اطبع القيم باستخدام console.log."],
    validate: (code) => /const\s+userName\s*=/.test(code) && /let\s+score\s*=/.test(code) && /console\.log\s*\(/.test(code),
    success: "ممتاز! استخدمت const وlet وطباعة القيم.",
    hint: "يجب تعريف المتغير قبل استخدامه."
  },
  conditions: {
    title: "الشروط والقرارات",
    intro: "تسمح if وelse بتنفيذ تعليمات مختلفة حسب تحقق شرط، مثل إظهار رسالة مختلفة بحسب درجة المستخدم.",
    goal: "اكتب شرطًا يختبر إن كانت الدرجة أكبر من أو تساوي 50.",
    starter: 'const score = 75;\nif (score >= 50) {\n  document.querySelector("#result").textContent = "ناجح";\n} else {\n  document.querySelector("#result").textContent = "حاول مجددًا";\n}',
    checklist: ["استخدم if.", "اختبر score >= 50.", "أضف فرع else."],
    validate: (code) => /if\s*\(/.test(code) && /score\s*>=\s*50/.test(code) && /else\s*\{/.test(code),
    success: "أحسنت! البرنامج يتخذ قرارًا بناءً على الدرجة.",
    hint: "تأكد من إغلاق أقواس الشرط والكتل."
  },
  functions: {
    title: "الدوال",
    intro: "الدالة تجمع تعليمات تحت اسم، ويمكن استدعاؤها كلما احتجت إلى تنفيذها. ويمكن للدالة إرجاع نتيجة باستخدام return.",
    goal: "أنشئ دالة باسم greet تعيد رسالة ترحيب.",
    starter: 'function greet(name) {\n  return "مرحبًا " + name;\n}\ndocument.querySelector("#result").textContent = greet("Ebrahim");',
    checklist: ["عرّف function greet.", "استقبل name كوسيط.", "استخدم return لإرجاع الرسالة."],
    validate: (code) => /function\s+greet\s*\(\s*name\s*\)/.test(code) && /return\s+/.test(code) && /greet\s*\(/.test(code),
    success: "رائع! عرّفت دالة وأعدت استخدامها.",
    hint: "القيمة التي تعيدها الدالة يمكن عرضها أو تخزينها."
  },
  dom: {
    title: "التعامل مع الصفحة DOM",
    intro: "يتيح DOM لجافاسكريبت الوصول إلى عناصر HTML وتغييرها. يمكن ربط دالة بحدث النقر باستخدام addEventListener.",
    goal: "غيّر نص النتيجة عندما يضغط المستخدم على الزر.",
    starter: 'const button = document.querySelector("#action");\nbutton.addEventListener("click", () => {\n  document.querySelector("#result").textContent = "تم الضغط!";\n});',
    checklist: ["اختر الزر باستخدام querySelector.", "استخدم addEventListener مع click.", "غيّر textContent للنتيجة."],
    validate: (code) => /querySelector\s*\(\s*["']#action["']\s*\)/.test(code) && /addEventListener\s*\(\s*["']click["']/.test(code) && /textContent\s*=/.test(code),
    success: "ممتاز! أصبح الزر يغيّر محتوى الصفحة.",
    hint: "تأكد أن محدد العنصر يطابق id الموجود في المعاينة."
  },
  "mini-project": {
    title: "مشروع عدّاد النقرات",
    intro: "اجمع المتغيرات والأحداث وDOM في مشروع صغير يعدّ عدد مرات ضغط الزر.",
    goal: "زد قيمة العدّاد عند كل ضغطة واعرض العدد.",
    starter: 'let count = 0;\nconst button = document.querySelector("#action");\nbutton.addEventListener("click", () => {\n  count++;\n  document.querySelector("#result").textContent = "عدد النقرات: " + count;\n});',
    checklist: ["عرّف count بقيمة صفر.", "زد count عند النقر.", "اعرض العدد باستخدام textContent."],
    validate: (code) => /let\s+count\s*=\s*0/.test(code) && /addEventListener\s*\(\s*["']click["']/.test(code) && /count\+\+|count\s*\+=\s*1|count\s*=\s*count\s*\+\s*1/.test(code) && /textContent\s*=/.test(code),
    success: "أنجزت مشروعك الأول! جرّب الضغط على الزر عدة مرات.",
    hint: "حدّث واجهة المستخدم بعد تغيير قيمة count."
  }
};
const sampleHtml = `<main class="demo"><span class="tag">STACKNOVA · JAVASCRIPT</span><h1>جرّب التفاعل</h1><p>اكتب الكود ثم اضغط الزر في المعاينة.</p><button id="action">جرّب الآن</button><p id="result" class="result">ستظهر النتيجة هنا</p></main>`;
function makePreview(code: string) {
  const safeCode = code.replace(/<\\/script/gi, "<\\\\/script");
  return `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#fff;color:#24113d}.demo{max-width:560px;margin:auto;padding:22px;border:1px solid #ddd6fe;border-radius:16px;background:#faf8ff}.tag{font-size:11px;letter-spacing:1px;color:#7c3aed}h1{font-size:24px}p{line-height:1.7}button{border:0;border-radius:8px;padding:11px 16px;background:#7c3aed;color:white;cursor:pointer}.result{margin-top:20px;padding:12px;background:#ede9fe;border-radius:8px;min-height:42px}</style><body>${sampleHtml}<script>try{\n${safeCode}\n}catch(error){document.querySelector("#result").textContent="خطأ: "+error.message}</script></body></html>`;
}
export default function JavaScriptLessonPage() {
  const params = useParams<{ lesson: string }>();
  const lessonId = params.lesson;
  const lesson = lessons[lessonId];
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!lesson) return;
    setCode(lesson.starter);
    try { setCompleted(window.localStorage.getItem(`stacknova-js-${lessonId}`) === "completed"); } catch { setCompleted(false); }
  }, [lessonId, lesson]);
  function checkChallenge() {
    if (!lesson) return;
    if (!lesson.validate(code)) { setMessage("لم يكتمل التحدي بعد. راجع الخصائص المطلوبة وجرب مجددًا."); return; }
    setCompleted(true);
    setMessage(lesson.success);
    try { window.localStorage.setItem(`stacknova-js-${lessonId}`, "completed"); } catch { /* Keep current session state. */ }
  }
  if (!lesson) return <main className="container page-top"><h1>لم نعثر على هذا الدرس</h1><Link className="button button-primary" href="/learn/javascript">العودة إلى خريطة JavaScript</Link></main>;
  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/javascript">خريطة JavaScript</Link><Link href="/learn/html/progress">تقدّمي</Link></nav><Link className="button button-ghost nav-cta" href="/learn/css">مسار CSS</Link></div></header>
    <main className="container"><section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/learn/javascript">JavaScript</Link> / {lesson.title}</div><span className="eyebrow">تعلّم بالتطبيق · JavaScript</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></section>
      <section className="lesson-layout"><div className="panel"><h2>هدف الدرس</h2><p>{lesson.goal}</p><h2>المطلوب منك</h2><ul className="challenge-list">{lesson.checklist.map(item=><li key={item}>{item}</li>)}</ul>
        <label htmlFor="js-practice-editor" style={{display:"block",margin:"18px 0 10px",fontWeight:700}}>محرر JavaScript</label><textarea id="js-practice-editor" className="lesson-editor" spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} />
        <div className="editor-actions"><button className="button button-primary" onClick={checkChallenge}>تحقّق من التحدي</button><button className="button button-ghost" onClick={()=>{setCode(lesson.starter);setMessage("");}}>إعادة المثال</button></div>
        {message && <div className={completed ? "status success" : "status"} role="status">{message}</div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:22,fontSize:".9rem"}}><span>تقدّم الدرس</span><span>{completed?"100%":"0%"}</span></div><div className="progress-track"><div className="progress-fill" style={{width:completed?"100%":"0%"}} /></div><p><strong>تلميح:</strong> {lesson.hint}</p>
      </div><div style={{display:"grid",gap:20}}><div className="panel"><h2>المعاينة التفاعلية</h2><p>شغّل كودك داخل إطار معزول عن بقية المنصة.</p><iframe className="preview-frame" title={`معاينة درس ${lesson.title}`} sandbox="allow-scripts" srcDoc={makePreview(code)} /></div><div className="panel"><h2>واصل التعلّم</h2><p>انتقل إلى الدرس التالي من خريطة JavaScript.</p><Link className="text-link" href="/learn/javascript">العودة إلى خريطة JavaScript ↗</Link></div></div></section>
    </main><footer className="footer"><div className="container">StackNova · تعلّم JavaScript بالتطبيق</div></footer>
  </>;
}
