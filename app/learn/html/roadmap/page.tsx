import Link from "next/link";

const lessons = [
  { number: "01", title: "العناوين والفقرات", description: "اكتب أول عنوان وفقرة، وافهم كيف تصف عناصر HTML محتوى الصفحة.", status: "متاح الآن", href: "/learn/html" },
  { number: "02", title: "الروابط والصور", description: "اربط الصفحات وأضف الصور مع نص بديل مناسب.", status: "متاح الآن", href: "/learn/html/links-images" },
  { number: "03", title: "القوائم", description: "نظّم المعلومات باستخدام القوائم المرتبة وغير المرتبة.", status: "متاح الآن", href: "/learn/html/lists" },
  { number: "04", title: "مشروع صفحة تعريفية", description: "اجمع العناوين والفقرات والروابط والقوائم في صفحة واحدة.", status: "متاح الآن", href: "/learn/html/mini-project" },
];

export default function HtmlRoadmapPage() {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html">درس HTML</Link><Link href="/learn/html/progress">تقدّمي</Link></nav>
          <Link className="button button-primary nav-cta" href="/learn/html">ابدأ الدرس الأول</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / خريطة التعلّم</div>
          <span className="eyebrow">مسار المبتدئين · HTML</span>
          <h1>خريطة تعلّم HTML</h1>
          <p>تدرّج عبر أربعة دروس عملية: العناوين والفقرات، ثم الروابط والصور، ثم القوائم، وأخيرًا مشروع يجمع المهارات الأساسية. يَحفظ كل درس إنجازك على هذا المتصفح.</p>
        </section>
        <section className="roadmap-list">
          {lessons.map((lesson) => (
            <article className="roadmap-item" key={lesson.number}>
              <div className="step-number">{lesson.number}</div>
              <div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
              <Link className="pill" href={lesson.href}>{lesson.status} ↗</Link>
            </article>
          ))}
          <div className="cta"><div><h2>جاهز للتطبيق؟</h2><p>ابدأ بالدرس الأول، واكتب الكود وشاهد النتيجة مباشرة.</p></div><Link className="button button-primary" href="/learn/html">افتح الدرس ↗</Link></div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · خطوة عملية كل يوم</div></footer>
    </>
  );
}
