"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Project = { title: string; level: string; category: "HTML" | "CSS" | "JavaScript" | "مشترك"; description: string; skills: string[]; href: string; };
const projects: Project[] = [
  { title: "صفحة تعريفية", level: "مبتدئ", category: "HTML", description: "أنشئ صفحة بسيطة للتعريف بنفسك وتنظيم المعلومات داخل أقسام واضحة.", skills: ["العناوين والفقرات", "القوائم", "هيكل الصفحة"], href: "/learn/html/mini-project" },
  { title: "بطاقة تعريفية", level: "مبتدئ", category: "CSS", description: "نسّق بطاقة أنيقة باستخدام الألوان والمسافات والحدود وتخطيط العناصر.", skills: ["الألوان", "نموذج الصندوق", "Flexbox"], href: "/learn/css/mini-project" },
  { title: "عدّاد النقرات", level: "متوسط", category: "JavaScript", description: "أنشئ زرًا يزيد العدد عند كل نقرة ويعرض النتيجة مباشرة في الصفحة.", skills: ["المتغيرات", "الأحداث", "DOM"], href: "/learn/javascript/mini-project" },
  { title: "محفظة شخصية تفاعلية", level: "مشروع ختامي", category: "مشترك", description: "اجمع HTML وCSS وJavaScript في صفحة شخصية مع معاينة مباشرة وتحدي إنجاز.", skills: ["HTML", "CSS متجاوب", "JavaScript"], href: "/projects/portfolio" },
];
const filters = ["الكل", "HTML", "CSS", "JavaScript", "مشترك"] as const;
export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("الكل");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.filter(project =>
    (filter === "الكل" || project.category === filter) &&
    (project.title + " " + project.description + " " + project.skills.join(" ")).toLowerCase().includes(query.trim().toLowerCase())
  ), [filter, query]);
  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/javascript">JavaScript</Link></nav><Link className="button button-ghost nav-cta" href="/learn/html/progress">تقدّمي</Link></div></header>
    <main className="container"><section className="page-top"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / المشاريع</div><span className="eyebrow">التعلّم بالمشاريع · Project lab</span><h1>حوّل الدروس إلى مشاريع حقيقية</h1><p>اختر مشروعًا يناسب مستواك، وطبّق مهاراتك خطوة بخطوة. ابدأ بصفحة بسيطة ثم انتقل إلى المشروع الختامي.</p></section>
      <section className="panel" style={{marginBottom:22}}><label htmlFor="projects-search" style={{display:"block",fontWeight:700,marginBottom:8}}>ابحث عن مشروع</label><input id="projects-search" className="reference-search" type="search" placeholder="مثال: بطاقة، DOM، متجاوب..." value={query} onChange={e=>setQuery(e.target.value)}/><div className="filter-row" role="group" aria-label="تصفية المشاريع">{filters.map(item=><button key={item} className={`filter-chip ${filter===item?"active":""}`} type="button" aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><p style={{marginBottom:0}}>المشاريع المتاحة: {filtered.length}</p></section>
      {filtered.length ? <section className="reference-grid">{filtered.map((project,index)=><article className="panel reference-card" key={project.title}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}><span className="eyebrow">{project.category}</span><span className="pill">{project.level}</span></div><h2>{project.title}</h2><p>{project.description}</p><div className="filter-row">{project.skills.map(skill=><span key={skill} className="filter-chip">{skill}</span>)}</div><Link className="button button-primary" href={project.href}>{index===3?"ابدأ المشروع الختامي":"ابدأ المشروع"} ↗</Link></article>)}</section> : <section className="panel"><h2>لا توجد مشاريع مطابقة</h2><button className="button button-ghost" onClick={()=>{setFilter("الكل");setQuery("");}}>مسح التصفية</button></section>}
      <section className="cta" style={{marginTop:28,marginBottom:60}}><div><h2>تحتاج إلى مراجعة سريعة؟</h2><p>راجع أمثلة HTML وCSS وJavaScript قبل البدء.</p></div><Link className="button button-primary" href="/reference">افتح المرجع السريع ↗</Link></section>
    </main><footer className="footer"><div className="container">StackNova · ابنِ شيئًا جديدًا مع كل درس</div></footer>
  </>;
}
