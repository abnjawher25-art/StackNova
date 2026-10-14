"use client";

import Link from "next/link";
import { useState } from "react";

const questions = [
  { topic: "HTML", question: "ما الوسم المناسب لإنشاء رابط قابل للنقر؟", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1, explain: "الوسم <a> ينشئ رابطًا، وتحدد الخاصية href وجهته." },
  { topic: "HTML", question: "لماذا نضيف alt إلى الصورة؟", options: ["لتغيير عرض الصورة فقط", "لإضافة إطار تلقائي", "لوصف الصورة نصيًا عند الحاجة", "لجعل الصورة رابطًا دائمًا"], answer: 2, explain: "يساعد alt في إتاحة وصف نصي للصورة، خصوصًا لقارئات الشاشة وعند تعذر تحميلها." },
  { topic: "HTML", question: "أي عنصر يمثل عنوان الصفحة الرئيسي؟", options: ["<h1>", "<head>", "<title>", "<main>"], answer: 0, explain: "يمثل h1 العنوان الأهم الظاهر داخل محتوى الصفحة؛ أما title فيحدد عنوان التبويب." },
  { topic: "CSS", question: "أي خاصية تغيّر لون النص؟", options: ["background", "font-style", "text-color", "color"], answer: 3, explain: "تتحكم color في لون النص، بينما تتحكم background في الخلفية." },
  { topic: "CSS", question: "ما وظيفة padding؟", options: ["المسافة خارج الحدود", "المسافة بين المحتوى والحدود", "تدوير العنصر", "تغيير نوع الخط"], answer: 1, explain: "padding هي المساحة الداخلية بين المحتوى وحدود العنصر." },
  { topic: "CSS", question: "ما الاستخدام الشائع لـ @media؟", options: ["تعريف متغير JavaScript", "إضافة رابط", "تطبيق تنسيقات حسب خصائص الشاشة", "إنشاء عنصر HTML"], answer: 2, explain: "تسمح Media Queries بتطبيق تنسيقات وفق عرض الشاشة أو خصائص الوسيط." },
  { topic: "JavaScript", question: "أي كلمة مناسبة لقيمة لا تريد إعادة إسنادها؟", options: ["const", "change", "fixed", "static"], answer: 0, explain: "const يمنع إعادة إسناد المتغير، لكنه لا يجعل محتويات الكائنات أو المصفوفات ثابتة تلقائيًا." },
  { topic: "JavaScript", question: "كيف تستجيب لحدث النقر على زر؟", options: ["addStyle()", "onCSS()", "clickNow()", "addEventListener('click', ...)"], answer: 3, explain: "تسجل addEventListener دالة لتعمل عند وقوع حدث مثل click." },
  { topic: "JavaScript", question: "ما الخاصية التي تغيّر النص داخل عنصر؟", options: ["innerColor", "textContent", "fontSize", "href"], answer: 1, explain: "تقرأ textContent النص داخل العنصر أو تستبدله." },
  { topic: "JavaScript", question: "ما وظيفة if؟", options: ["تكرار الكود دائمًا", "استيراد ملف CSS", "تنفيذ كود حسب تحقق شرط", "إنشاء عنصر HTML تلقائيًا"], answer: 2, explain: "تنفّذ if كتلة التعليمات عندما يكون الشرط صحيحًا." },
];

export default function KnowledgeCheckPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  function submitQuiz() {
    setSubmitted(true);
    if (questions.every((_, index) => answers[index] !== undefined)) {
      try { window.localStorage.setItem("stacknova-web-knowledge-check", String(score)); } catch { /* Keep result in this session. */ }
    }
  }
  function resetQuiz() { setAnswers({}); setSubmitted(false); }
  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link></nav><Link className="button button-ghost nav-cta" href="/learn/html/progress">تقدّمي</Link></div></header>
    <main className="container"><section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / التدريب / اختبار المعرفة</div><span className="eyebrow">اختبر نفسك · HTML + CSS + JavaScript</span><h1>اختبار أساسيات تطوير الويب</h1><p>10 أسئلة قصيرة تساعدك على مراجعة ما تعلمته. اختر إجابة واحدة لكل سؤال، ثم اعرض النتيجة والتفسير.</p></section>
      <section className="panel" style={{marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",alignItems:"center"}}><div><h2>تقدّم الاختبار</h2><p style={{marginBottom:0}}>أجبت عن {Object.keys(answers).length} من {questions.length} أسئلة.</p></div><strong style={{fontSize:"1.4rem"}}>{Math.round(Object.keys(answers).length/questions.length*100)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${Object.keys(answers).length/questions.length*100}%`}}/></div></section>
      <section className="roadmap-list">{questions.map((question,index)=><article className="panel" key={question.topic+index} style={{marginBottom:16}}><div className="eyebrow">{question.topic} · السؤال {index+1} من {questions.length}</div><h2 style={{marginTop:10}}>{question.question}</h2><div style={{display:"grid",gap:10,marginTop:16}}>{question.options.map((option,optionIndex)=>{const chosen=answers[index]===optionIndex;const correct=question.answer===optionIndex;return <button key={option} type="button" className={`quiz-option ${chosen?"selected":""} ${submitted&&correct?"correct":""} ${submitted&&chosen&&!correct?"incorrect":""}`} onClick={()=>{if(!submitted)setAnswers(previous=>({...previous,[index]:optionIndex}));}} disabled={submitted} aria-pressed={chosen}><span>{String.fromCharCode(65+optionIndex)}.</span> {option}</button>;})}</div>{submitted&&<div className={`status ${answers[index]===question.answer?"success":""}`} role="status" style={{marginTop:14}}>{answers[index]===question.answer?"إجابة صحيحة. ":"راجع هذه النقطة. "}{question.explain}</div>}</article>)}</section>
      <section className="panel" style={{marginTop:20}}>{submitted?<><span className="eyebrow">نتيجتك</span><h2>{score} من {questions.length} ({Math.round(score/questions.length*100)}%)</h2><p>{score>=8?"أداء ممتاز! واصل التطبيق على المشاريع.":score>=5?"بداية جيدة؛ راجع التفسيرات ثم أعد المحاولة.":"لا بأس، راجع الدروس وجرب مرة أخرى."}</p><div className="editor-actions"><button className="button button-primary" onClick={resetQuiz}>أعد الاختبار</button><Link className="button button-ghost" href="/learn/html/progress">راجع مساراتك</Link></div></>:<><h2>هل أنت مستعد لعرض النتيجة؟</h2><p>أجب عن جميع الأسئلة للحصول على تقييم أدق وحفظ نتيجتك في هذا المتصفح.</p><button className="button button-primary" onClick={submitQuiz} disabled={Object.keys(answers).length !== questions.length}>اعرض النتيجة</button>{Object.keys(answers).length<questions.length&&<p style={{marginTop:12}}>ما زال لديك {questions.length-Object.keys(answers).length} أسئلة دون إجابة.</p>}</>}</section>
    </main><footer className="footer"><div className="container">StackNova · تعلّم، طبّق، ثم اختبر نفسك</div></footer>
  </>;
}
