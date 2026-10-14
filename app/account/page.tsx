"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function AccountPage() {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: \u0060${window.location.origin}/account\u0060,
          },
        });
        if (error) throw error;
        if (data.session) {
          setUser(data.user);
          setMessage("تم إنشاء الحساب. سنبدأ مزامنة تقدمك تلقائيًا.");
        } else {
          setMessage("تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. أكّد البريد ثم سجّل الدخول.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setMessage("تم تسجيل الدخول. جارٍ استعادة تقدمك من الخادم.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذّر إكمال العملية. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    setMessage(error ? error.message : "تم تسجيل الخروج. يمكنك مواصلة التعلم دون حساب.");
    if (!error) setUser(null);
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link>
          <Link className="button button-ghost" href="/learn/html/progress">عرض تقدمي</Link>
        </div>
      </header>
      <main className="container account-page">
        <section className="account-card panel">
          <span className="eyebrow">اختياري · مزامنة بين أجهزتك</span>
          <h1>حساب StackNova</h1>
          <p className="account-intro">يمكنك التعلم دون حساب. أنشئ حسابًا فقط إذا أردت حفظ تقدمك على الخادم واستعادته على أجهزة أخرى.</p>

          {!supabase ? (
            <div className="status">
              <strong>الحفظ السحابي يحتاج إلى إعداد قاعدة البيانات أولًا.</strong>
              <p>أضف متغيري NEXT_PUBLIC_SUPABASE_URL وNEXT_PUBLIC_SUPABASE_ANON_KEY إلى إعدادات بيئة Vercel، ثم نفّذ تعليمات قاعدة البيانات في ملف docs/CLOUD_PROGRESS_SETUP.md.</p>
              <p>حتى ذلك الحين، سيظل التقدم محفوظًا على هذا المتصفح فقط.</p>
            </div>
          ) : user ? (
            <div className="account-signed-in">
              <div className="account-avatar" aria-hidden="true">{(user.email ?? "S").slice(0, 1).toUpperCase()}</div>
              <h2>أهلًا بك في رحلتك!</h2>
              <p>{user.email}</p>
              <div className="status success">الحساب متصل. سيُزامَن التقدم عند اجتياز الدروس وتسجيل المحاولات.</div>
              <button className="button button-ghost" type="button" onClick={signOut} disabled={busy}>{busy ? "جارٍ تسجيل الخروج…" : "تسجيل الخروج"}</button>
            </div>
          ) : (
            <>
              <div className="account-mode-tabs" role="tablist" aria-label="نوع الحساب">
                <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "account-mode active" : "account-mode"} onClick={() => { setMode("signup"); setMessage(""); }}>إنشاء حساب</button>
                <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "account-mode active" : "account-mode"} onClick={() => { setMode("signin"); setMessage(""); }}>تسجيل الدخول</button>
              </div>
              <form className="account-form" onSubmit={submit}>
                {mode === "signup" && <label>الاسم <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="اسمك (اختياري)" maxLength={80} /></label>}
                <label>البريد الإلكتروني <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                <label>كلمة المرور <input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8 أحرف على الأقل" /></label>
                <button className="button button-primary" type="submit" disabled={busy}>{busy ? "لحظة من فضلك…" : mode === "signup" ? "إنشاء الحساب وحفظ تقدمي" : "تسجيل الدخول واستعادة التقدم"}</button>
              </form>
            </>
          )}
          {message && <p className="status" role="status">{message}</p>}
          <div className="account-privacy"><strong>كيف يُحفظ تقدمك؟</strong><p>التقدم مرتبط بحسابك فقط. لا يحتاج التطبيق إلى صلاحيات وصول خاصة أو مفتاح قاعدة بيانات سري في المتصفح؛ وتتحكم سياسات قاعدة البيانات في الوصول إلى سجل كل مستخدم.</p></div>
          <Link className="text-link" href="/learn">متابعة التعلم دون حساب ↗</Link>
        </section>
      </main>
      <footer className="footer"><div className="container">StackNova · حسابك اختياري، وتعلّمك مستمر.</div></footer>
    </>
  );
}
