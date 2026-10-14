"use client";

import Link from "next/link";

const stars = [
  { x: "8%", y: "14%", delay: "0s", size: 2 }, { x: "18%", y: "72%", delay: "1.2s", size: 3 },
  { x: "29%", y: "24%", delay: "2.1s", size: 2 }, { x: "42%", y: "83%", delay: ".5s", size: 2 },
  { x: "55%", y: "12%", delay: "1.7s", size: 3 }, { x: "67%", y: "70%", delay: "2.8s", size: 2 },
  { x: "78%", y: "25%", delay: ".8s", size: 2 }, { x: "91%", y: "61%", delay: "1.4s", size: 3 },
  { x: "13%", y: "42%", delay: "2.5s", size: 2 }, { x: "36%", y: "57%", delay: ".3s", size: 2 },
  { x: "73%", y: "43%", delay: "1.9s", size: 2 }, { x: "84%", y: "84%", delay: ".9s", size: 2 },
  { x: "48%", y: "34%", delay: "2.4s", size: 2 }, { x: "5%", y: "87%", delay: "1.1s", size: 2 },
];

export default function HomePage() {
  return (
    <main className="space-home" dir="rtl">
      <div className="space-starfield" aria-hidden="true">
        {stars.map((star, index) => (
          <span key={index} className="space-star" style={{ left: star.x, top: star.y, animationDelay: star.delay, width: star.size, height: star.size }} />
        ))}
        <span className="shooting-star shooting-star-one" />
        <span className="shooting-star shooting-star-two" />
      </div>
      <div className="space-nebula nebula-violet" aria-hidden="true" />
      <div className="space-nebula nebula-cyan" aria-hidden="true" />
      <div className="space-planet planet-large" aria-hidden="true"><span /></div>
      <div className="space-planet planet-small" aria-hidden="true" />
      <div className="space-orbit orbit-one" aria-hidden="true" />
      <div className="space-orbit orbit-two" aria-hidden="true" />
      <header className="space-topbar">
        <Link className="space-wordmark" href="/" aria-label="StackNova الرئيسية"><span className="space-logo-mark">S</span> StackNova</Link>
        <span className="space-status"><i /> أكاديمية البرمجة الكونية</span>
      </header>
      <section className="space-home-content">
        <span className="space-kicker"><span>✦</span> مهمتك تبدأ من هنا</span>
        <h1>كل سطر كود<br /><span>عالم جديد.</span></h1>
        <p className="space-intro">انطلق في رحلة بين المجرّات، اكتشف أسرار تطوير الويب، وحوّل المعرفة إلى مهارة عبر التجربة والألعاب والتحديات.</p>
        <Link className="space-start-button" href="/learn">
          <span className="space-start-icon" aria-hidden="true">↗</span>
          <span><strong>ابدأ الرحلة</strong><small>اكتشف المجرّات الثلاث</small></span>
          <span className="space-button-arrow" aria-hidden="true">←</span>
        </Link>
        <div className="space-home-stats"><span><b>03</b> مجرّات تعليمية</span><span><b>150</b> مهمة تفاعلية</span><span><b>∞</b> فرص للاكتشاف</span></div>
      </section>
      <div className="space-bottom-glow" aria-hidden="true" />
      <footer className="space-home-footer"><span>STACKNOVA / LEARN BEYOND THE CODE</span><span>رحلتك · مستقبلك · إبداعك</span></footer>
    </main>
  );
}
