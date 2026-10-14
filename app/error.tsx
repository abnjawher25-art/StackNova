"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("StackNova route error:", error);
  }, [error]);

  return (
    <main className="container page-top">
      <section className="panel" style={{ maxWidth: 680, margin: "8vh auto", textAlign: "center" }}>
        <span className="eyebrow">StackNova · خطأ مؤقت</span>
        <h1 style={{ marginTop: 20 }}>حدثت مشكلة أثناء فتح الصفحة</h1>
        <p style={{ marginInline: "auto" }}>لم نفقد تقدّمك المحفوظ في هذا المتصفح. جرّب تحميل الصفحة مرة أخرى، أو ارجع إلى الرئيسية.</p>
        {error.digest && <p style={{ fontSize: ".85rem" }}>رمز المراجعة: {error.digest}</p>}
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <button className="button button-primary" onClick={() => reset()}>إعادة المحاولة</button>
          <Link className="button button-ghost" href="/">العودة للرئيسية</Link>
        </div>
      </section>
    </main>
  );
}
