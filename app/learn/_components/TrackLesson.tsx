"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isLessonUnlocked, tracks } from "@/lib/curriculum";
import { getProgress, saveProgress, type TrackKey } from "@/lib/curriculum/types";

type Props = { trackKey: TrackKey };

export default function TrackLesson({ trackKey }: Props) {
  const params = useParams<{ lesson: string }>();
  const track = tracks[trackKey];
  const lesson = track.lessons.find((item) => item.slug === params.lesson);
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>({});
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState(lesson?.example ?? "");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [reward, setReward] = useState(false);
  useEffect(() => { const saved = getProgress(); setProgress(saved); setAttempts(saved[lesson?.id ?? ""]?.attempts ?? 0); setLoaded(true); }, [lesson?.id]);
  useEffect(() => { if (lesson) setCode(lesson.example); }, [lesson?.id]);

  const index = lesson ? lesson.number - 1 : -1;
  const unlocked = loaded && !!lesson && isLessonUnlocked(track, index, progress);
  const mastered = !!lesson && progress[lesson.id]?.mastered === true;
  const next = lesson ? track.lessons[lesson.number] : undefined;
  const previous = lesson && lesson.number > 1 ? track.lessons[lesson.number - 2] : undefined;
  const regex = useMemo(() => {
    if (!lesson) return null;
    const pattern = lesson.pattern.replace(/^\(\?[is]+\)/, "");
    try { return new RegExp(pattern, "is"); } catch { return null; }
  }, [lesson]);

  function checkMastery() {
    if (!lesson || !unlocked || !regex) return;
    const nextAttempts = (progress[lesson.id]?.attempts ?? 0) + 1;
    const matches = regex.test(code) && code.trim() !== lesson.example.trim();
    const updated = { ...progress, [lesson.id]: { attempts: nextAttempts, mastered: matches || mastered } };
    setAttempts(nextAttempts); setProgress(updated); saveProgress(updated);
    if (matches) { setMessage("أحسنت! اجتزت التحدي وأُضيف إتقان الدرس إلى تقدمك."); setReward(true); setShowRecovery(false); }
    else { setMessage("لم يكتمل الإتقان بعد. عدّل المثال بنفسك، وتأكد من وجود العناصر أو الخصائص المطلوبة ثم أعد المحاولة."); setShowHint(true); }
  }

  if (!lesson) return <main className="container page-top"><h1>هذا الدرس غير موجود</h1><p>اختر درسًا من خريطة المسار.</p><Link className="button button-primary" href={trackKey === "html" ? "/learn/html" : "/learn/" + trackKey}>العودة إلى الخريطة</Link></main>;
  if (!loaded) return <main className="container page-top"><div className="panel loading-panel"><h1>جارٍ تحميل تقدمك…</h1><p>نجهز درس الإتقان ونستعيد إنجازاتك المحفوظة على هذا المتصفح.</p></div></main>;
  if (!unlocked) return <><header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><Link className="button button-ghost" href={"/learn/" + trackKey}>خريطة المسار</Link></div></header><main className="container page-top"><span className="eyebrow">بوابة مغلقة 🔒</span><h1>أتقن المهمة السابقة أولًا</h1><p>لن يُفتح هذا الدرس حتى تكمل متطلبات الدرس السابق. التدرج مقصود حتى تبني أساسًا قويًا.</p>{previous && <Link className="button button-primary" href={"/learn/" + trackKey + "/" + previous.slug}>ارجع إلى: {previous.title}</Link>}{!previous && trackKey !== "html" && <p>أكمل جميع دروس المسار السابق لفتح هذه الجزيرة.</p>}<p><Link className="text-link" href={"/learn/" + trackKey}>عرض خريطة المسار ↗</Link></p></main></>;

  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href={"/learn/" + trackKey}>خريطة المسار</Link><Link href="/learn/html/progress">تقدّمي</Link></nav><span className="pill">المهمة {lesson.number} / 50</span></div></header>
    <main className="container lesson-page">
      <section className="page-top lesson-hero"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href={"/learn/" + trackKey}>{track.title}</Link> / المنطقة {lesson.areaNumber}</div><span className="eyebrow">{lesson.area} · المرحلة {lesson.stage} من 5</span><h1>{lesson.title}</h1><p>{lesson.summary}</p><div className="lesson-progress-head"><span>تقدم المسار</span><strong>{Math.round((track.lessons.filter((item) => progress[item.id]?.mastered).length / 50) * 100)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: (track.lessons.filter((item) => progress[item.id]?.mastered).length / 50 * 100) + "%" }} /></div></section>
      <div className="lesson-stages">
      <article className="panel lesson-stage"><span className="stage-label">المرحلة 1 · افهم</span><h2>حكاية الفكرة</h2><p>{lesson.explanation}</p><h3>هدف الإتقان</h3><p>{lesson.challenge}</p><div className="lesson-example"><div className="window-top"><span className="window-label">example.{trackKey === "html" ? "html" : trackKey === "css" ? "css" : "js"}</span></div><pre>{lesson.example}</pre></div></article>
      <article className="panel lesson-stage"><span className="stage-label">المرحلة 2 · جرّب</span><h2>مختبر التفاعل</h2><p>غيّر المثال بنفسك. يجب أن يتغير الكود عن المثال الأول وأن يحقق متطلبات التحدي قبل تسجيل الإتقان.</p><label htmlFor="lesson-editor" className="editor-label">محرر {trackKey === "html" ? "HTML" : trackKey === "css" ? "CSS" : "JavaScript"}</label><textarea id="lesson-editor" className="lesson-editor" value={code} spellCheck={false} onChange={(event) => { setCode(event.target.value); setMessage(""); setReward(false); }} /><div className="editor-actions"><button className="button button-primary" onClick={checkMastery}>تحقق من الإتقان</button><button className="button button-ghost" onClick={() => { setCode(lesson.example); setMessage(""); setReward(false); }}>إعادة المثال</button><button className="button button-ghost" onClick={() => setShowHint((value) => !value)}>{showHint ? "إخفاء التلميح" : "أظهر تلميحًا"}</button></div>{showHint && <div className="hint-box"><strong>تلميح عملي</strong><p>{lesson.hint}</p></div>}{message && <div className={reward ? "status success" : "status"} role="status">{message}</div>}<div className="attempt-line">محاولاتك في هذا الدرس: {attempts}</div></article>
      <article className="panel lesson-stage"><span className="stage-label">المرحلة 3 · أتقن</span><h2>تحدي الإتقان</h2><p>{lesson.challenge}</p><div className="mastery-question"><strong>سؤال المراجعة</strong><p>{lesson.question}</p><details><summary>إظهار التفسير</summary><p>{lesson.answer}</p></details></div><button className="text-link recovery-toggle" onClick={() => setShowRecovery((value) => !value)}>{showRecovery ? "إخفاء خطة المراجعة" : "احتجت إلى مساعدة؟ افتح خطة المراجعة"}</button>{showRecovery && <div className="hint-box"><strong>خطة معالجة الخطأ</strong><p>{lesson.recovery}</p></div>}{mastered && <div className="status success" role="status">✓ هذا الدرس متقن ومحفوظ في تقدمك.</div>}{mastered && next && <Link className="button button-primary next-lesson" href={"/learn/" + trackKey + "/" + next.slug}>افتح الدرس التالي: {next.title} ↗</Link>}{mastered && !next && <div className="status success">أكملت الجزيرة! {trackKey !== "javascript" ? <Link className="text-link" href={trackKey === "html" ? "/learn/css" : "/learn/javascript"}>افتح الجزيرة التالية ↗</Link> : "أنهيت المسارات الثلاثة. راجع تقدمك وابدأ مشروعًا مستقلًا."}</div>}</article>
      </div>
    </main><footer className="footer"><div className="container"><Link href={"/learn/" + trackKey}>العودة إلى خريطة الجزيرة ↗</Link></div></footer>
  </>;
}
