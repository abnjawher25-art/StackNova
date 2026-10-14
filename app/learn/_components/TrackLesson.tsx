"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isLessonUnlocked, tracks } from "@/lib/curriculum";
import { getProgress, saveProgress, type TrackKey } from "@/lib/curriculum/types";

type Props = { trackKey: TrackKey };
type GamePiece = { id: number; line: string };

function formatExample(source: string, trackKey: TrackKey): string[] {
  const trimmed = source.trim();
  if (!trimmed) return ["// لا يوجد مثال متاح بعد"];

  let formatted = trimmed;
  if (trackKey === "html") {
    formatted = trimmed.replace(/>\s*</g, ">\n<");
  } else if (trackKey === "css") {
    formatted = trimmed
      .replace(/\s*\{\s*/g, " {\n  ")
      .replace(/;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\n\s*}/g, "\n}");
  } else {
    formatted = trimmed
      .replace(/\s*\{\s*/g, " {\n")
      .replace(/;\s*/g, ";\n")
      .replace(/\s*}\s*/g, "\n}\n");
  }

  const rawLines = formatted.split("\n").map((line) => line.trim()).filter(Boolean);
  if (trackKey !== "html") return rawLines;

  let depth = 0;
  return rawLines.map((line) => {
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
    const current = "  ".repeat(depth) + line;
    if (/^<[^/!][^>]*>$/.test(line) && !/\/>$/.test(line) && !/<\/[^>]+>$/.test(line)) depth += 1;
    return current;
  });
}

function buildPreview(code: string, trackKey: TrackKey): string {
  if (trackKey === "html") {
    const hasDocument = /<!doctype html|<html[\s>]/i.test(code);
    return hasDocument
      ? code
      : `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:24px;color:#18253b;background:#fff;line-height:1.7}button{padding:8px 14px;border-radius:8px;border:0;background:#2868e8;color:white}</style></head><body>${code}</body></html>`;
  }

  if (trackKey === "css") {
    const safeCss = code.replace(/<\/style/gi, "<\\/style");
    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:24px;background:#f4f7fb;color:#18253b;line-height:1.7}.preview-card{padding:18px;border-radius:14px;background:#fff;box-shadow:0 8px 24px #14233a18}.preview-card button{padding:8px 14px;border:0;border-radius:8px;background:#2868e8;color:#fff}</style><style>${safeCss}</style></head><body><main class="preview-card"><h2 class="title">مرحبًا بك!</h2><p class="description">هذه منطقة المعاينة المباشرة لتنسيقات CSS.</p><button>زر تجريبي</button></main></body></html>`;
  }

  const safeJs = code.replace(/<\/script/gi, "<\\/script");
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:20px;color:#18253b;background:#fff;line-height:1.7}#console{padding:12px;background:#f1f5fb;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><h3>نتيجة JavaScript</h3><div id="app">يمكن للكود تغيير هذه المنطقة.</div><pre id="console">تظهر رسائل console.log هنا.</pre><script>(()=>{const out=document.getElementById('console');const original=console.log;console.log=(...args)=>{out.textContent+=(out.textContent?'\\n':'')+args.map(v=>typeof v==='object'?JSON.stringify(v):String(v)).join(' ');};try{out.textContent='';${safeJs}}catch(error){out.textContent='خطأ: '+error.message;}})();</script></body></html>`;
}

function createGamePieces(lines: string[], example: string, trackKey: TrackKey): GamePiece[] {
  let pieces = lines.length > 1 ? lines : [];
  if (pieces.length < 2) {
    if (trackKey === "html") {
      pieces = example.match(/<[^>]+>|[^<>]+/g)?.map((part) => part.trim()).filter(Boolean) ?? [];
    } else {
      pieces = example.match(/[^{};]+[{};]?/g)?.map((part) => part.trim()).filter(Boolean) ?? [];
    }
  }
  if (pieces.length < 2) pieces = example.trim().split(/\s+/).filter(Boolean);
  return pieces.map((line, id) => ({ id, line }));
}

export default function TrackLesson({ trackKey }: Props) {
  const params = useParams<{ lesson: string }>();
  const track = tracks[trackKey];
  const lesson = track.lessons.find((item) => item.slug === params.lesson);
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>({});
  const [loaded, setLoaded] = useState(false);
  const starterCode = trackKey === "html" ? "<h1>مرحبًا بالعالم</h1>\n<p>هذه أول صفحة لي.</p>" : trackKey === "css" ? ".title {\n  color: #2868e8;\n}" : "console.log('مرحبًا بالعالم');";
  const [code, setCode] = useState(starterCode);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [reward, setReward] = useState(false);
  const [gameOptions, setGameOptions] = useState<GamePiece[]>([]);
  const [gameSelected, setGameSelected] = useState<number[]>([]);
  const [gameMessage, setGameMessage] = useState("");
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const saved = getProgress();
    setProgress(saved);
    setAttempts(saved[lesson?.id ?? ""]?.attempts ?? 0);
    setLoaded(true);
  }, [lesson?.id]);
  useEffect(() => { setCode(starterCode); }, [lesson?.id, starterCode]);

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
  const exampleLines = useMemo(() => formatExample(lesson?.example ?? "", trackKey), [lesson, trackKey]);
  const previewDocument = useMemo(() => buildPreview(code, trackKey), [code, trackKey]);

  function checkMastery() {
    if (!lesson || !unlocked || !regex) return;
    const nextAttempts = (progress[lesson.id]?.attempts ?? 0) + 1;
    const matches = code.trim().length > 0 && regex.test(code);
    const updated = { ...progress, [lesson.id]: { attempts: nextAttempts, mastered: matches || mastered } };
    setAttempts(nextAttempts);
    setProgress(updated);
    saveProgress(updated);
    if (matches) {
      setMessage("أحسنت! اجتزت التحدي وأُضيف إتقان الدرس إلى تقدمك.");
      setReward(true);
      setShowRecovery(false);
    } else {
      setMessage("لم يكتمل الإتقان بعد. عدّل المثال بنفسك، وتأكد من وجود العناصر أو الخصائص المطلوبة ثم أعد المحاولة.");
      setShowHint(true);
    }
  }

  function startGame() {
    const pieces = createGamePieces(exampleLines, lesson?.example ?? "", trackKey);
    setGameOptions([...pieces].reverse());
    setGameSelected([]);
    setGameWon(false);
    setGameMessage(pieces.length > 1 ? "رتّب أجزاء المثال بالنقر عليها من البداية إلى النهاية." : "راجع المثال ثم انتقل إلى التحدي.");
  }

  function chooseGamePiece(id: number) {
    if (!lesson || gameWon) return;
    const expectedId = gameSelected.length;
    if (id === expectedId) {
      const nextSelected = [...gameSelected, id];
      setGameSelected(nextSelected);
      if (nextSelected.length === gameOptions.length) {
        setGameWon(true);
        setGameMessage("رائع! رتّبت أجزاء المثال بشكل صحيح. حصلت على نقطة إتقان إضافية!");
      } else {
        setGameMessage("صحيح، أكمل ترتيب بقية الأسطر.");
      }
    } else {
      setGameSelected([]);
      setGameMessage("ليس هذا السطر التالي. حاول مجددًا وابدأ من أول المثال.");
    }
  }

  if (!lesson) return <main className="container page-top"><h1>هذا الدرس غير موجود</h1><p>اختر درسًا من خريطة المسار.</p><Link className="button button-primary" href={trackKey === "html" ? "/learn/html" : "/learn/" + trackKey}>العودة إلى الخريطة</Link></main>;
  if (!loaded) return <main className="container page-top"><div className="panel loading-panel"><h1>جارٍ تحميل تقدمك…</h1><p>نجهز درس الإتقان ونستعيد إنجازاتك المحفوظة على هذا المتصفح.</p></div></main>;
  if (!unlocked) return <><header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><Link className="button button-ghost" href={"/learn/" + trackKey}>خريطة المسار</Link></div></header><main className="container page-top"><span className="eyebrow">بوابة مغلقة 🔒</span><h1>أتقن المهمة السابقة أولًا</h1><p>لن يُفتح هذا الدرس حتى تكمل متطلبات الدرس السابق. التدرج مقصود حتى تبني أساسًا قويًا.</p>{previous && <Link className="button button-primary" href={"/learn/" + trackKey + "/" + previous.slug}>ارجع إلى: {previous.title}</Link>}{!previous && trackKey !== "html" && <p>أكمل جميع دروس المسار السابق لفتح هذه الجزيرة.</p>}<p><Link className="text-link" href={"/learn/" + trackKey}>عرض خريطة المسار ↗</Link></p></main></>;

  return <>
    <header className="site-header"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">S</span><span>StackNova</span></Link><nav className="nav-links"><Link href={"/learn/" + trackKey}>خريطة المسار</Link><Link href="/learn/html/progress">تقدّمي</Link></nav><span className="pill">المهمة {lesson.number} / 50</span></div></header>
    <main className="container lesson-page">
      <section className="page-top lesson-hero"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href={"/learn/" + trackKey}>{track.title}</Link> / المنطقة {lesson.areaNumber}</div><span className="eyebrow">{lesson.area} · المرحلة {lesson.stage} من 5</span><h1>{lesson.title}</h1><p>{lesson.summary}</p><div className="lesson-progress-head"><span>تقدم المسار</span><strong>{Math.round((track.lessons.filter((item) => progress[item.id]?.mastered).length / 50) * 100)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: (track.lessons.filter((item) => progress[item.id]?.mastered).length / 50 * 100) + "%" }} /></div></section>
      <div className="lesson-stages lesson-stages-sequence">
        <article className="panel lesson-stage"><span className="stage-label">المرحلة 1 · افهم</span><h2>شرح المفهوم</h2><p>{lesson.explanation}</p><div className="concept-goal"><strong>ماذا ستتعلم؟</strong><p>{lesson.summary}</p></div></article>

        <article className="panel lesson-stage"><span className="stage-label">المرحلة 2 · شاهد</span><h2>مثال سطرًا بسطر</h2><p>اقرأ المثال من الأعلى إلى الأسفل؛ كل سطر يظهر منفصلًا لتستوعب ترتيب الكود وبنيته.</p><div className="lesson-example"><div className="window-top"><span className="dot" /><span className="dot" /><span className="dot" /><span className="window-label">example.{trackKey === "html" ? "html" : trackKey === "css" ? "css" : "js"}</span></div><pre className="example-code">{exampleLines.map((line, lineIndex) => <span className="example-code-line" key={lineIndex}><span className="example-line-number">{lineIndex + 1}</span><code>{line || " "}</code></span>)}</pre></div></article>

        <article className="panel lesson-stage"><span className="stage-label">المرحلة 3 · طبّق</span><h2>التدريب والمعاينة المباشرة</h2><p>عدّل الكود في المحرر، وستظهر النتيجة في شاشة المعاينة مباشرةً. جرّب تغيير النصوص أو القيم ولاحظ الفرق.</p><label htmlFor="lesson-editor" className="editor-label">محرر {trackKey === "html" ? "HTML" : trackKey === "css" ? "CSS" : "JavaScript"}</label><textarea id="lesson-editor" className="lesson-editor" value={code} spellCheck={false} onChange={(event) => { setCode(event.target.value); setMessage(""); setReward(false); }} /><div className="editor-actions"><button className="button button-primary" onClick={checkMastery}>تحقق من الإتقان</button><button className="button button-ghost" onClick={() => { setCode(starterCode); setMessage(""); setReward(false); }}>إعادة المثال</button><button className="button button-ghost" onClick={() => setShowHint((value) => !value)}>{showHint ? "إخفاء التلميح" : "أظهر تلميحًا"}</button></div><div className="live-preview"><div className="live-preview-header"><span className="live-preview-indicator" /><strong>المعاينة المباشرة</strong><span>تتحدّث أثناء الكتابة</span></div><iframe className="live-preview-frame" title="معاينة نتيجة الكود" srcDoc={previewDocument} sandbox="allow-scripts" /> </div>{showHint && <div className="hint-box"><strong>تلميح عملي</strong><p>{lesson.hint}</p></div>}{message && <div className={reward ? "status success" : "status"} role="status">{message}</div>}<div className="attempt-line">محاولاتك في هذا الدرس: {attempts}</div></article>

        <article className="panel lesson-stage game-stage"><span className="stage-label">المرحلة 4 · العب</span><h2>لعبة ترتيب الكود</h2><p>اختبر فهمك بترتيب أجزاء المثال. ابدأ الجولة، ثم اختر الأسطر من أول سطر إلى آخر سطر.</p><button className="button button-primary" onClick={startGame}>{gameOptions.length ? "إعادة الجولة" : "ابدأ اللعبة"}</button>{gameOptions.length > 0 && <div className="code-game"><div className="game-progress">الأسطر الصحيحة: {gameSelected.length} / {gameOptions.length}</div><div className="game-options">{gameOptions.map((piece) => { const selected = gameSelected.includes(piece.id); return <button type="button" key={piece.id} className={"game-piece" + (selected ? " game-piece-selected" : "")} onClick={() => chooseGamePiece(piece.id)} disabled={selected || gameWon}><span>{selected ? "✓" : "↕"}</span><code>{piece.line}</code></button>; })}</div>{gameMessage && <p className={gameWon ? "status success" : "status"} role="status">{gameMessage}</p>}</div>}</article>

        <article className="panel lesson-stage"><span className="stage-label">المرحلة 5 · أتقن</span><h2>التحدي النهائي</h2><p>{lesson.challenge}</p><div className="mastery-question"><strong>سؤال المراجعة</strong><p>{lesson.question}</p><details><summary>إظهار الإجابة والتفسير</summary><p>{lesson.answer}</p></details></div><button className="text-link recovery-toggle" onClick={() => setShowRecovery((value) => !value)}>{showRecovery ? "إخفاء خطة المراجعة" : "احتجت إلى مساعدة؟ افتح خطة المراجعة"}</button>{showRecovery && <div className="hint-box"><strong>خطة معالجة الخطأ</strong><p>{lesson.recovery}</p></div>}{mastered && <div className="status success" role="status">✓ هذا الدرس متقن ومحفوظ في تقدمك.</div>}{mastered && next && <Link className="button button-primary next-lesson" href={"/learn/" + trackKey + "/" + next.slug}>افتح الدرس التالي: {next.title} ↗</Link>}{mastered && !next && <div className="status success">أكملت الجزيرة! {trackKey !== "javascript" ? <Link className="text-link" href={trackKey === "html" ? "/learn/css" : "/learn/javascript"}>افتح الجزيرة التالية ↗</Link> : "أنهيت المسارات الثلاثة. راجع تقدمك وابدأ مشروعًا مستقلًا."}</div>}</article>
      </div>
    </main><footer className="footer"><div className="container"><Link href={"/learn/" + trackKey}>العودة إلى خريطة الجزيرة ↗</Link></div></footer>
  </>;
}
