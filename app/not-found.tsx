import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container page-top">
      <section className="panel" style={{ maxWidth: 680, margin: "8vh auto", textAlign: "center" }}>
        <span className="eyebrow">404 · StackNova</span>
        <h1 style={{ marginTop: 20 }}>هذه الصفحة غير موجودة</h1>
        <p style={{ marginInline: "auto" }}>ربما تغيّر الرابط أو أن الصفحة نُقلت. يمكنك العودة إلى الرئيسية أو متابعة أحد مسارات التعلّم.</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link className="button button-primary" href="/">العودة للرئيسية</Link>
          <Link className="button button-ghost" href="/learn/html/roadmap">خريطة HTML</Link>
          <Link className="button button-ghost" href="/learn/css">مسار CSS</Link>
          <Link className="button button-ghost" href="/learn/javascript">مسار JavaScript</Link>
        </div>
      </section>
    </main>
  );
}
