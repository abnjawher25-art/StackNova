"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Topic = { category: "HTML" | "CSS" | "JavaScript"; title: string; summary: string; code: string; };
const topics: Topic[] = [
  { category: "HTML", title: "عنوان رئيسي", summary: "استخدم h1 للعنوان الأهم داخل المحتوى.", code: "<h1>عنوان الصفحة</h1>" },
  { category: "HTML", title: "فقرة نصية", summary: "ضع النصوص العادية داخل عنصر p.", code: "<p>هذه فقرة تعريفية.</p>" },
  { category: "HTML", title: "رابط", summary: "تحدد href وجهة الانتقال.", code: '<a href="https://example.com">زيارة الموقع</a>' },
  { category: "HTML", title: "صورة بنص بديل", summary: "اكتب وصفًا مفيدًا في alt عند الحاجة.", code: '<img src="photo.jpg" alt="وصف الصورة">' },
  { category: "HTML", title: "قائمة غير مرتبة", summary: "اجمع عناصر القائمة داخل ul وكل عنصر داخل li.", code: "<ul>\n  <li>العنصر الأول</li>\n  <li>العنصر الثاني</li>\n</ul>" },
  { category: "CSS", title: "تغيير لون النص", summary: "تتحكم color في لون النص.", code: "p {\n  color: rebeccapurple;\n}" },
  { category: "CSS", title: "المساحة الداخلية", summary: "تضيف padding مساحة بين المحتوى والحدود.", code: ".card {\n  padding: 16px;\n}" },
  { category: "CSS", title: "تخطيط Flexbox", summary: "استخدم display:flex لترتيب العناصر في محور.", code: ".container {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}" },
  { category: "CSS", title: "تصميم متجاوب", summary: "تطبق media query تنسيقات عند عرض معين.", code: "@media (max-width: 600px) {\n  .container {\n    flex-direction: column;\n  }\n}" },
  { category: "CSS", title: "زوايا مستديرة", summary: "تضفي border-radius نعومة على البطاقات والأزرار.", code: ".card {\n  border-radius: 14px;\n}" },
  { category: "JavaScript", title: "متغير ثابت الإسناد", summary: "استخدم const عندما لا تحتاج إلى إعادة إسناد المتغير.", code: 'const userName = "Ebrahim";' },
  { category: "JavaScript", title: "متغير قابل للتغيير", summary: "استخدم let للقيم التي قد تعيد إسنادها.", code: "let score = 0;\nscore += 1;" },
  { category: "JavaScript", title: "شرط", summary: "ينفذ if كتلة عندما يتحقق الشرط.", code: "if (score >= 50) {\n  console.log('ناجح');\n} else {\n  console.log('حاول مجددًا');\n}" },
  { category: "JavaScript", title: "دالة", summary: "ضع مهمة قابلة لإعادة الاستخدام داخل function.", code: "function greet(name) {\n  return 'مرحبًا ' + name;\n}" },
  { category: "JavaScript", title: "حدث النقر", summary: "استجب للنقر باستخدام addEventListener.", code: 'button.addEventListener("click", () => {\n  result.textContent = "تم الضغط";\n});' },
  { category: "JavaScript", title: "اختيار عنصر", summary: "يعثر querySelector على أول عنصر يطابق المحدد.", code: 'const button = document.querySelector("#action");' },
];

const filters = ["الكل", "HTML", "CSS", "JavaScript"] as const;
export default function ReferencePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("الكل");
  const [copied, setCopied] = useState("");
  const filtered = useMemo(() => topics.filter(topic =>
    (filter === "الكل" || topic.category === filter) &&
    (topic.title + " " + topic.summary + " " + topic.code + " " + topic.category).toLowerCase().includes(query.trim().toLowerCase())
  ), [filter, query]);
  async function copyCode(topic: Topic) {
    try {
      await navigator.clipboard.writeText(topic.code);
      setCopied(topic.title);
    } catch {
      setCopied("تعذر النسخ؛ حدّد الكود وانسخه يدويًا");
    }
  }
  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link></nav><Link className="button button-ghost nav-cta" href="/learn/html/progress">تقدّمي</Link></div></header>
    <main className="container"><section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / مرجع سريع</div><span className="eyebrow">مرجع سريع · Quick reference</span><h1>المفاهيم التي تحتاجها، في مكان واحد</h1><p>ابحث عن وسم أو خاصية أو مفهوم، اختر المسار، وانسخ المثال لتجربته في محررك.</p></section>
      <section className="panel" style={{marginBottom:22}}><label htmlFor="reference-search" style={{display:"block",fontWeight:700,marginBottom:8}}>ابحث في المرجع</label><input id="reference-search" className="reference-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="مثال: flex، رابط، const..." /><div className="filter-row" role="group" aria-label="تصفية حسب التقنية">{filters.map(item=><button key={item} type="button" className={`filter-chip ${filter===item?"active":""}`} onClick={()=>setFilter(item)} aria-pressed={filter===item}>{item}</button>)}</div><p style={{marginBottom:0}}>عدد النتائج: {filtered.length}</p></section>
      {filtered.length ? <section className="reference-grid">{filtered.map(topic=><article className="panel reference-card" key={topic.category+topic.title}><div className="eyebrow">{topic.category}</div><h2>{topic.title}</h2><p>{topic.summary}</p><pre className="reference-code" dir="ltr"><code>{topic.code}</code></pre><button type="button" className="button button-ghost" onClick={()=>copyCode(topic)}>{copied===topic.title?"تم النسخ ✓":"نسخ المثال"}</button></article>)}</section> : <section className="panel"><h2>لا توجد نتائج</h2><p>جرّب كلمة أقصر أو اختر «الكل» للبحث في جميع التقنيات.</p><button className="button button-ghost" onClick={()=>{setQuery("");setFilter("الكل");}}>مسح البحث</button></section>}
      {copied && <p className="status success" role="status" style={{marginTop:16}}>{copied==="تعذر النسخ؛ حدّد الكود وانسخه يدويًا"?copied:`تم نسخ مثال «${copied}».`}</p>}
      <section className="cta" style={{marginTop:28,marginBottom:60}}><div><h2>جاهز للتطبيق؟</h2><p>انتقل إلى الدروس العملية أو اختبر ما تعلمته.</p></div><Link className="button button-primary" href="/practice">ابدأ اختبار المعرفة ↗</Link></section>
    </main><footer className="footer"><div className="container">StackNova · مرجع صغير يساعدك على البناء</div></footer>
  </>;
}
