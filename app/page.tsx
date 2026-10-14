"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="minimal-home" dir="rtl">
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
