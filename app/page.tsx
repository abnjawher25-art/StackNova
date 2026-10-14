"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [english, setEnglish] = useState(false);
  const copy = english
    ? {
        home: "Home",
        paths: "Learning paths",
        roadmap: "Roadmap",
        start: "Start learning",
        badge: "A clearer way to learn web development",
        titleA: "Turn curiosity into",
        titleB: "real-world skills.",
        description:
          "Learn by building. Short lessons, instant feedback, and a live coding playground help you move from your first tag to your first project.",
        explore: "Explore the HTML lesson",
        journey: "View learning roadmap",
        note1: "Learn at your own pace",
        note2: "Practice in your browser",
        note3: "Track your progress",
        tracksTitle: "Choose your starting point",
        tracksDesc: "Build strong foundations, one practical step at a time.",
        allPaths: "View all paths →",
        html: "HTML foundations",
        htmlDesc: "Understand page structure, headings, paragraphs, links, and semantic elements.",
        css: "CSS styling",
        cssDesc: "Bring pages to life with colors, layouts, spacing, and responsive design.",
        js: "JavaScript essentials",
        jsDesc: "Add interaction, work with the DOM, and make your pages respond to users.",
        lessons: "lessons",
        beginner: "Beginner",
        roadmapTitle: "A path you can follow",
        roadmapDesc: "A simple progression from fundamentals to complete projects.",
        step1: "Structure",
        step1d: "Learn HTML elements and page structure.",
        step2: "Design",
        step2d: "Style interfaces with CSS.",
        step3: "Interaction",
        step3d: "Use JavaScript to create behavior.",
        step4: "Build",
        step4d: "Combine your skills into projects.",
        ctaTitle: "Your first line of code starts here.",
        ctaDesc: "Open the interactive HTML lesson and try it yourself.",
        footer: "Learn. Build. Grow. Your next step starts with StackNova."
      }
    : {
        home: "الرئيسية",
        paths: "المسارات",
        roadmap: "خريطة التعلّم",
        start: "ابدأ التعلّم",
        badge: "طريقة أوضح لتعلّم تطوير الويب",
        titleA: "حوّل فضولك إلى",
        titleB: "مهارات حقيقية.",
        description:
          "تعلّم بالتطبيق لا بالمشاهدة فقط. دروس قصيرة، وتغذية راجعة فورية، ومساحة برمجية تفاعلية تساعدك على الانتقال من أول وسم إلى أول مشروع.",
        explore: "جرّب درس HTML",
        journey: "استكشف خريطة التعلّم",
        note1: "تعلّم حسب وقتك",
        note2: "طبّق داخل المتصفح",
        note3: "تابع تقدّمك",
        tracksTitle: "اختر نقطة البداية",
        tracksDesc: "ابنِ أساسًا قويًا، خطوة عملية في كل مرة.",
        allPaths: "عرض المسارات ←",
        html: "أساسيات HTML",
        htmlDesc: "تعلّم هيكل الصفحة والعناوين والفقرات والروابط والعناصر الدلالية.",
        css: "تنسيق CSS",
        cssDesc: "أضف الألوان والتخطيطات والمسافات والتصميم المتجاوب إلى صفحاتك.",
        js: "أساسيات JavaScript",
        jsDesc: "أضف التفاعل، وتعرّف على DOM، واجعل صفحاتك تستجيب للمستخدم.",
        lessons: "دروس",
        beginner: "مبتدئ",
        roadmapTitle: "مسار واضح يمكنك اتباعه",
        roadmapDesc: "تدرّج بسيط من الأساسيات إلى بناء مشاريع متكاملة.",
        step1: "الهيكل",
        step1d: "تعلّم عناصر HTML وبنية الصفحة.",
        step2: "التصميم",
        step2d: "نسّق الواجهات باستخدام CSS.",
        step3: "التفاعل",
        step3d: "استخدم JavaScript لإضافة السلوك.",
        step4: "التطبيق",
        step4d: "اجمع مهاراتك في مشاريع عملية.",
        ctaTitle: "أول سطر برمجي يبدأ من هنا.",
        ctaDesc: "افتح درس HTML التفاعلي وجرّب بنفسك.",
        footer: "تعلّم. ابنِ. تطوّر. خطوتك القادمة تبدأ مع StackNova."
      };

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/" aria-label="StackNova home">
            <span className="brand-mark">S</span>
            <span>StackNova</span>
          </Link>
          <nav className="nav-links" aria-label={english ? "Main navigation" : "التنقل الرئيسي"}>
            <a href="#paths">{copy.paths}</a>
            <Link href="/learn/html/roadmap">{copy.roadmap}</Link>
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="button button-ghost" onClick={() => setEnglish(!english)} aria-label="Change language">
              {english ? "العربية" : "English"}
            </button>
            <Link className="button button-primary nav-cta" href="/learn/html">{copy.start}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">✦ {copy.badge}</span>
              <h1>{copy.titleA}<br /><span className="gradient-text">{copy.titleB}</span></h1>
              <p className="hero-copy">{copy.description}</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/learn/html">{copy.explore} <span aria-hidden="true">↗</span></Link>
                <Link className="button button-ghost" href="/learn/html/roadmap">{copy.journey}</Link>
              </div>
              <div className="hero-note"><span>{copy.note1}</span><span>{copy.note2}</span><span>{copy.note3}</span></div>
            </div>
            <div className="code-window" aria-label="Example of HTML code">
              <div className="window-top"><span className="dot" /><span className="dot" /><span className="dot" /><span className="window-label">index.html</span></div>
              <div className="code-body">
                <span className="code-line code-muted">&lt;!DOCTYPE html&gt;</span>
                <span className="code-line"><span className="code-purple">&lt;html</span> <span className="code-green">lang</span>=<span className="code-orange">"en"</span><span className="code-purple">&gt;</span></span>
                <span className="code-line">  <span className="code-purple">&lt;body&gt;</span></span>
                <span className="code-line">    <span className="code-purple">&lt;h1&gt;</span><span className="code-green">Hello, web!</span><span className="code-purple">&lt;/h1&gt;</span></span>
                <span className="code-line">    <span className="code-purple">&lt;p&gt;</span><span className="code-orange">My journey starts here.</span><span className="code-purple">&lt;/p&gt;</span></span>
                <span className="code-line">  <span className="code-purple">&lt;/body&gt;</span></span>
                <span className="code-line"><span className="code-purple">&lt;/html&gt;</span></span>
              </div>
              <div className="preview-card"><small>LIVE PREVIEW</small><strong>Hello, web!</strong><p style={{ marginBottom: 0 }}>My journey starts here.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="paths">
          <div className="container">
            <div className="section-heading">
              <div><h2>{copy.tracksTitle}</h2><p>{copy.tracksDesc}</p></div>
              <Link className="text-link" href="/learn/html/roadmap">{copy.allPaths}</Link>
            </div>
            <div className="track-grid">
              <article className="track-card"><div className="track-icon">⌘</div><h3>{copy.html}</h3><p>{copy.htmlDesc}</p><div className="track-meta"><span>HTML5</span><span>4 {copy.lessons}</span></div><p style={{ marginTop: 18, marginBottom: 0 }}><Link className="text-link" href="/learn/html">{copy.start} ↗</Link></p></article>
              <article className="track-card"><div className="track-icon">✳</div><h3>{copy.css}</h3><p>{copy.cssDesc}</p><div className="track-meta"><span>CSS3</span><span>6 {copy.lessons}</span></div><p style={{ marginTop: 18, marginBottom: 0 }}><Link className="text-link" href="/learn/css">{copy.start} ↗</Link></p></article>
              <article className="track-card"><div className="track-icon">⚡</div><h3>{copy.js}</h3><p>{copy.jsDesc}</p><div className="track-meta"><span>ES6+</span><span>5 {copy.lessons}</span></div><p style={{ marginTop: 18, marginBottom: 0 }}><Link className="text-link" href="/learn/javascript">{copy.start} ↗</Link></p></article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading"><div><h2>{copy.roadmapTitle}</h2><p>{copy.roadmapDesc}</p></div><Link className="text-link" href="/learn/html/roadmap">{copy.roadmap} ↗</Link></div>
            <div className="roadmap">
              {[{ n: "01", title: copy.step1, desc: copy.step1d }, { n: "02", title: copy.step2, desc: copy.step2d }, { n: "03", title: copy.step3, desc: copy.step3d }, { n: "04", title: copy.step4, desc: copy.step4d }].map((step) => (
                <article className="roadmap-step" key={step.n}><div className="step-number">{step.n}</div><h3>{step.title}</h3><p>{step.desc}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container"><div className="cta"><div><h2>{copy.ctaTitle}</h2><p>{copy.ctaDesc}</p></div><Link className="button button-primary" href="/learn/html">{copy.start} ↗</Link><Link className="button button-ghost" href="/projects/portfolio">{english ? "Build a portfolio" : "جرّب المشروع النهائي"} ↗</Link><Link className="button button-ghost" href="/practice">{english ? "Test your skills" : "اختبر معلوماتك"} ↗</Link><Link className="button button-ghost" href="/reference">{english ? "Quick reference" : "المرجع السريع"} ↗</Link><Link className="button button-ghost" href="/projects">{english ? "Project lab" : "معرض المشاريع"} ↗</Link></div></div>
        </section>
      </main>
      <footer className="footer"><div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><span>© {new Date().getFullYear()} StackNova</span><span>{copy.footer}</span></div></footer>
    </>
  );
}
