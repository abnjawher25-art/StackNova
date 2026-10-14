import Link from "next/link";

const lessons = [
  { number: "01", id: "basics", title: "المتغيرات والقيم", description: "تعرّف على let وconst والنصوص والأرقام.", time: "10 دقائق" },
  { number: "02", id: "conditions", title: "الشروط والقرارات", description: "استخدم if وelse لاتخاذ قرار بناءً على قيمة.", time: "12 دقيقة" },
  { number: "03", id: "functions", title: "الدوال", description: "قسّم البرنامج إلى خطوات قابلة لإعادة الاستخدام.", time: "15 دقيقة" },
  { number: "04", id: "dom", title: "التعامل مع الصفحة DOM", description: "غيّر النص عند الضغط على زر.", time: "15 دقيقة" },
  { number: "05", id: "mini-project", title: "مشروع عدّاد النقرات", description: "أنشئ عدّادًا تفاعليًا باستخدام JavaScript.", time: "20 دقيقة" },
];

export default function JavaScriptRoadmapPage() {
  return (
    <>
      <header className="site-header"><div className="container nav">
        <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
        <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">HTML</Link><Link href="/learn/css">CSS</Link><Link href="/learn/html/progress">تقدّمي</Link></nav>
        <Link className="button button-primary nav-cta" href="/learn/javascript/basics">ابدأ JavaScript</Link>
      </div></header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / مسارات التعلّم / JavaScript</div>
          <span className="eyebrow">مسار المبتدئين · JavaScript</span>
          <h1>اجعل صفحاتك تتفاعل مع المستخدم</h1>
          <p>ابدأ بالمتغيرات والشروط، ثم تعلّم الدوال وDOM. جرّب الكود في محرر آمن وشاهد النتيجة فورًا.</p>
        </section>
        <section className="roadmap-list">
          {lessons.map((lesson) => <article className="roadmap-item" key={lesson.id}>
            <div className="step-number">{lesson.number}</div><div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
            <Link className="pill" href={`/learn/javascript/${lesson.id}`}>{lesson.time} · ابدأ ↗</Link>
          </article>)}
          <div className="cta"><div><h2>من كتابة الكود إلى بناء التفاعل</h2><p>كل درس ينتهي بتحدٍ تطبيقي صغير.</p></div><Link className="button button-primary" href="/learn/javascript/basics">افتح أول درس ↗</Link></div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تعلّم JavaScript بالتطبيق</div></footer>
    </>
  );
}
