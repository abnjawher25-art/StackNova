"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="minimal-home" dir="rtl">
      <style>{`
        .minimal-home {
          position: relative;
          display: grid;
          min-height: 100svh;
          place-items: center;
          overflow: hidden;
          isolation: isolate;
          padding: 28px;
          background:
            radial-gradient(ellipse at 50% 40%, rgba(35, 105, 220, .16), transparent 48%),
            linear-gradient(145deg, #07111f 0%, #0a1b30 52%, #07121f 100%);
        }
        .minimal-home::before {
          position: absolute;
          z-index: -1;
          inset: 0;
          content: "";
          opacity: .18;
          background-image: linear-gradient(rgba(140,190,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(140,190,255,.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, #000 10%, transparent 76%);
        }
        .minimal-home-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          animation: minimal-appear .7s ease-out both;
        }
        .minimal-brand-mark {
          display: grid;
          width: 76px;
          height: 76px;
          place-items: center;
          border: 1px solid rgba(179, 224, 255, .55);
          border-radius: 25px;
          color: white;
          background: linear-gradient(145deg, #66baff, #2864df 65%, #28c9df);
          box-shadow: 0 16px 50px rgba(44, 130, 255, .3), inset 0 1px 0 rgba(255,255,255,.5);
          font: 900 2.3rem/1 Inter, sans-serif;
        }
        .minimal-brand-name {
          margin: 0;
          color: #f4f8ff;
          font: 800 clamp(2.7rem, 8vw, 5rem)/1.1 Inter, sans-serif;
          letter-spacing: -.06em;
          text-shadow: 0 0 42px rgba(91, 171, 255, .22);
        }
        .minimal-start-button {
          min-width: 176px;
          margin-top: 10px;
          padding: 15px 28px;
          border-radius: 16px;
          font-size: 1.05rem;
          box-shadow: 0 12px 34px rgba(40, 104, 232, .3);
        }
        .minimal-orb {
          position: absolute;
          z-index: -1;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: .2;
          pointer-events: none;
        }
        .minimal-orb-one { top: -190px; right: -110px; background: #2877ff; }
        .minimal-orb-two { bottom: -220px; left: -90px; background: #18c5df; }
        @keyframes minimal-appear {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .minimal-home-content { animation: none; }
        }
      `}</style>
      <div className="minimal-orb minimal-orb-one" aria-hidden="true" />
      <div className="minimal-orb minimal-orb-two" aria-hidden="true" />
      <section className="minimal-home-content" aria-label="StackNova">
        <div className="minimal-brand-mark" aria-hidden="true">S</div>
        <h1 className="minimal-brand-name">StackNova</h1>
        <Link className="button button-primary minimal-start-button" href="/learn/html">
          ابدأ <span aria-hidden="true">←</span>
        </Link>
      </section>
    </main>
  );
}
