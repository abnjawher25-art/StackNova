import Link from "next/link";

const lessons = [
  { number: "01", title: "العناوين والفقرات", description: "اكتب أول عنوان وفقرة، وافهم كيف تصف عناصر HTML محتوى الصفحة.", status: "متاح الآن", href: "/learn/html" },
  { number: "02", title: "الروابط والصور", description: "اربط الصفحات وأضف الصور مع نص بديل مناسب.", status: "قريبًا", href: "/learn/html" },
  { number: "03", title: "القوائم", description: "نظّم المعلومات باستخدام القوائم المرتبة وغير المرتبة.", status: "قريبًا", href: "/learn/html" },
  { number: "04", title: "بناء صفحة متكاملة", description: "اجمع ما تعلّمته في صفحة شخصية صغيرة.", status: "قريبًا", href: "/learn/html" },
];

export default function HtmlRoadmapPage() {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html">درس HTML</Link></nav>
          <Link className="button button-primary nav-cta" href="/learn/html">ابدأ الدرس الأول</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / خريطة التعلّم</div>
          <span className="eyebrow">مسار المبتدئين · HTML</span>
          <h1>خريطة تعلّم HTML</h1>
          <p>ابدأ من أساسيات بناء الصفحة، ثم انتقل إلى الروابط والصور والقوائم، واختم بتطبيق يجمع ما تعلّمته. الدروس التي لم تُفتح بعد ستُبنى تدريجيًا.</p>
        </section>
        <section className="roadmap-list">
          {lessons.map((lesson) => (
            <article className="roadmap-item" key={lesson.number}>
              <div className="step-number">{lesson.number}</div>
              <div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
              <span className="pill">{lesson.status}</span>
            </article>
          ))}
          <div className="cta"><div><h2>جاهز للتطبيق؟</h2><p>ابدأ بالدرس الأول، واكتب الكود وشاهد النتيجة مباشرة.</p></div><Link className="button button-primary" href="/learn/html">افتح الدرس ↗</Link></div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · خطوة عملية كل يوم</div></footer>
    </>
  );
}
