import Link from "next/link";

const lessons = [
  { number: "01", id: "basics", title: "الألوان والنصوص", description: "استخدم color و font-size لتنسيق النصوص.", time: "10 دقائق" },
  { number: "02", id: "colors", title: "الخلفيات والحدود", description: "أضف خلفية وحدودًا لتوضيح أجزاء الصفحة.", time: "12 دقيقة" },
  { number: "03", id: "box-model", title: "نموذج الصندوق", description: "افهم margin و padding و border عمليًا.", time: "15 دقيقة" },
  { number: "04", id: "flexbox", title: "تخطيط Flexbox", description: "رتّب العناصر باستخدام display و justify-content.", time: "15 دقيقة" },
  { number: "05", id: "responsive", title: "التصميم المتجاوب", description: "استخدم media queries لتناسب الصفحة الهاتف والحاسوب.", time: "15 دقيقة" },
  { number: "06", id: "mini-project", title: "بطاقة تعريفية", description: "اجمع الألوان والمسافات وFlexbox في بطاقة واحدة.", time: "20 دقيقة" },
];

export default function CssRoadmapPage() {
  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <nav className="nav-links"><Link href="/">الرئيسية</Link><Link href="/learn/html/roadmap">خريطة HTML</Link><Link href="/learn/html/progress">تقدّمي</Link></nav>
          <Link className="button button-primary nav-cta" href="/learn/css/basics">ابدأ CSS</Link>
        </div>
      </header>
      <main className="container">
        <section className="page-top">
          <div className="breadcrumb"><Link href="/">الرئيسية</Link> / مسارات التعلّم / CSS</div>
          <span className="eyebrow">مسار المبتدئين · CSS3</span>
          <h1>حوّل الصفحة إلى تصميم حيّ</h1>
          <p>تعلّم CSS من خلال ستة دروس تطبيقية. غيّر القيم في المحرر وشاهد النتيجة فورًا، ثم أكمل التحدي لحفظ إنجازك على هذا المتصفح.</p>
        </section>
        <section className="roadmap-list">
          {lessons.map((lesson) => (
            <article className="roadmap-item" key={lesson.id}>
              <div className="step-number">{lesson.number}</div>
              <div><h2>{lesson.title}</h2><p>{lesson.description}</p></div>
              <Link className="pill" href={`/learn/css/${lesson.id}`}>{lesson.time} · ابدأ ↗</Link>
            </article>
          ))}
          <div className="cta"><div><h2>التصميم يبدأ بتجربة صغيرة</h2><p>ابدأ بالألوان، ثم انتقل إلى المسافات والتخطيط.</p></div><Link className="button button-primary" href="/learn/css/basics">افتح أول درس ↗</Link></div>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · تعلّم CSS بالتطبيق</div></footer>
    </>
  );
}
