"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const starterHtml = `<main class="portfolio">
  <span class="eyebrow">HELLO, I'M</span>
  <h1>Ebrahim — Web Developer</h1>
  <p class="intro">أتعلم بناء تجارب ويب بسيطة وجميلة.</p>
  <button id="contactBtn">تعرّف عليّ</button>
  <p id="message" aria-live="polite"></p>
  <section class="projects"><h2>مشاريعي</h2><article><strong>StackNova</strong><p>منصة تعلّم البرمجة بالتطبيق.</p></article></section>
</main>`;
const starterCss = `* { box-sizing: border-box; }
body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #f5f3ff; color: #24113d; }
.portfolio { max-width: 620px; margin: 0 auto; padding: 28px; background: white; border-radius: 20px; }
.eyebrow { color: #7c3aed; font-size: 12px; letter-spacing: 2px; }
h1 { font-size: 30px; }
.intro { line-height: 1.8; }
button { border: 0; border-radius: 9px; padding: 12px 18px; background: #7c3aed; color: white; cursor: pointer; }
.projects article { margin-top: 12px; padding: 16px; border: 1px solid #ddd6fe; border-radius: 12px; }
@media (max-width: 520px) { .portfolio { padding: 16px; } h1 { font-size: 23px; } }`;
const starterJs = `document.querySelector("#contactBtn").addEventListener("click", () => {
  document.querySelector("#message").textContent = "سعيد بزيارتك! هذا أول مشروع لي.";
});`;

function buildPreview(html: string, css: string, js: string) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body>${html}<script>try{\n${js}\n}catch(error){document.body.insertAdjacentHTML("beforeend","<p>JavaScript error: "+error.message+"</p>")}</script></body></html>`;
}

export default function PortfolioCapstonePage() {
  const [html, setHtml] = useState(starterHtml);
  const [css, setCss] = useState(starterCss);
  const [js, setJs] = useState(starterJs);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try { setCompleted(window.localStorage.getItem("stacknova-project-portfolio") === "completed"); }
    catch { setCompleted(false); }
  }, []);
  function checkProject() {
    const ok = /<h1\b/i.test(html) && /class\s*=\s*["']portfolio["']/i.test(html) &&
      /@media\s*\(/i.test(css) && /border-radius\s*:/i.test(css) &&
      /addEventListener\s*\(\s*["']click["']/i.test(js) && /textContent\s*=/i.test(js);
    if (!ok) { setMessage("راجع قائمة التحقق: نحتاج عنوانًا وبطاقة HTML، تنسيقًا متجاوبًا، وحدث نقر يغيّر النص."); return; }
    setCompleted(true);
    setMessage("أحسنت! أكملت أساسيات مشروع المحفظة. جرّب الآن تخصيصه باسمك وألوانك.");
    try { window.localStorage.setItem("stacknova-project-portfolio", "completed"); } catch { /* Current session remains usable. */ }
  }
  function resetProject() { setHtml(starterHtml); setCss(starterCss); setJs(starterJs); setMessage(""); }
  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link></nav><Link className="button button-ghost nav-cta" href="/learn/html/progress">تقدّمي</Link></div></header>
    <main className="container"><section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / المشاريع / محفظة شخصية</div><span className="eyebrow">مشروع تطبيقي · HTML + CSS + JavaScript</span><h1>ابنِ بطاقة محفظتك الشخصية</h1><p>اجمع المهارات الثلاث في مشروع واحد. عدّل كل جزء، وشاهد النتيجة مباشرة داخل معاينة معزولة.</p></section>
      <section className="panel" style={{marginBottom:20}}><h2>قائمة التحقق</h2><ul className="challenge-list"><li>HTML: عنوان رئيسي وبطاقة مشاريع.</li><li>CSS: تصميم للبطاقة وقاعدة @media للشاشات الصغيرة.</li><li>JavaScript: زر يغيّر رسالة الصفحة عند النقر.</li></ul></section>
      <section className="lesson-layout"><div className="panel"><h2>مساحة العمل</h2><label htmlFor="capstone-html" style={{display:"block",fontWeight:700,margin:"14px 0 8px"}}>HTML</label><textarea id="capstone-html" className="lesson-editor" style={{minHeight:190}} spellCheck={false} value={html} onChange={e=>setHtml(e.target.value)}/><label htmlFor="capstone-css" style={{display:"block",fontWeight:700,margin:"18px 0 8px"}}>CSS</label><textarea id="capstone-css" className="lesson-editor" style={{minHeight:230}} spellCheck={false} value={css} onChange={e=>setCss(e.target.value)}/><label htmlFor="capstone-js" style={{display:"block",fontWeight:700,margin:"18px 0 8px"}}>JavaScript</label><textarea id="capstone-js" className="lesson-editor" style={{minHeight:140}} spellCheck={false} value={js} onChange={e=>setJs(e.target.value)}/><div className="editor-actions"><button className="button button-primary" onClick={checkProject}>تحقّق من المشروع</button><button className="button button-ghost" onClick={resetProject}>إعادة البداية</button></div>{message&&<div className={completed?"status success":"status"} role="status">{message}</div>}<div style={{display:"flex",justifyContent:"space-between",marginTop:22}}><span>إنجاز المشروع</span><strong>{completed?"100%":"قيد العمل"}</strong></div><div className="progress-track"><div className="progress-fill" style={{width:completed?"100%":"0%"}}/></div></div>
      <div style={{display:"grid",gap:20,alignContent:"start"}}><div className="panel"><h2>المعاينة المباشرة</h2><p>جرّب زر «تعرّف عليّ» داخل المعاينة.</p><iframe className="preview-frame" title="معاينة مشروع المحفظة الشخصية" sandbox="allow-scripts" srcDoc={buildPreview(html,css,js)}/></div><div className="panel"><h2>خطواتك التالية</h2><p>خصص النصوص والألوان، ثم أضف مشاريع أخرى أو رابطًا للتواصل.</p><Link className="text-link" href="/learn/html/progress">راجع تقدّمك في المسارات ↗</Link></div></div></section>
    </main><footer className="footer"><div className="container">StackNova · مشروعك الأول يجمع مهارات الويب</div></footer>
  </>;
}
