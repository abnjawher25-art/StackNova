"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isLessonUnlocked, tracks } from "@/lib/curriculum";
import { getProgress, saveProgress, type TrackKey } from "@/lib/curriculum/types";

type Props = { trackKey: TrackKey };
type GamePiece = { id: number; line: string };
type ChallengeMode = "repair" | "build" | "project";

function getChallengeMode(lessonNumber: number, trackKey: TrackKey): ChallengeMode {
  const offset = trackKey === "html" ? 0 : trackKey === "css" ? 1 : 2;
  const modes: ChallengeMode[] = ["repair", "build", "project"];
  return modes[(lessonNumber - 1 + offset) % modes.length];
}

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
  const starterCode = lesson ? formatExample(lesson.example, trackKey).join("\n") : trackKey === "html" ? "<h1>مرحبًا بالعالم</h1>\n<p>هذه أول صفحة لي.</p>" : trackKey === "css" ? ".title {\n  color: #2868e8;\n}" : "console.log('مرحبًا بالعالم');";
  const [code, setCode] = useState(starterCode);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [reward, setReward] = useState(false);
  const [gameMode, setGameMode] = useState<"fix" | "drag" | "quiz">("fix");
  const [fixCode, setFixCode] = useState("");
  const [fixFeedback, setFixFeedback] = useState("");
  const [dragPieces, setDragPieces] = useState<GamePiece[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragFeedback, setDragFeedback] = useState("");
  const [dragWon, setDragWon] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [challengeCode, setChallengeCode] = useState("");
  const [challengeFeedback, setChallengeFeedback] = useState("");
  const [challengeSuccess, setChallengeSuccess] = useState(false);


  useEffect(() => {
    const saved = getProgress();
    setProgress(saved);
    setAttempts(saved[lesson?.id ?? ""]?.attempts ?? 0);
    setLoaded(true);
  }, [lesson?.id]);
  useEffect(() => { setCode(starterCode); setFixCode(makeBrokenCode(lesson?.example ?? "")); }, [lesson?.id, starterCode]);
  useEffect(() => {
    if (!lesson) return;
    const mode = getChallengeMode(lesson.number, trackKey);
    setChallengeCode(mode === "repair" ? makeBrokenCode(lesson.example) : formatExample(lesson.example, trackKey).join("\n"));
    setChallengeFeedback("");
    setChallengeSuccess(false);
  }, [lesson?.id, trackKey]);

  const index = lesson ? lesson.number - 1 : -1;
  const challengeMode = lesson ? getChallengeMode(lesson.number, trackKey) : "build";
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
  const quizOptions = useMemo(() => {
    if (!lesson) return [];
    const alternatives = track.lessons
      .filter((item) => item.id !== lesson.id)
      .map((item) => item.summary)
      .filter((text, index, all) => text !== lesson.answer && all.indexOf(text) === index)
      .slice(0, 3);
    const choices = [{ text: lesson.answer, correct: true }, ...alternatives.map((text) => ({ text, correct: false }))];
    const shift = lesson.number % choices.length;
    return choices.slice(shift).concat(choices.slice(0, shift));
  }, [lesson, track]);


  function completeLessonFromGame(successMessage = "رائع! حللت اللعبة بنجاح، وأُتقنت المهمة وفتح الدرس التالي مباشرةً.") {
    if (!lesson || mastered) return;
    const nextAttempts = (progress[lesson.id]?.attempts ?? 0) + 1;
    const updated = {
      ...progress,
      [lesson.id]: { attempts: nextAttempts, mastered: true },
    };
    setAttempts(nextAttempts);
    setProgress(updated);
    saveProgress(updated);
    setReward(true);
    setShowRecovery(false);
    setMessage(successMessage);
  }

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

  function checkChallenge() {
    if (!lesson || !regex) return;
    const normalize = (value: string) => value.replace(/\s+/g, "");
    let success = false;

    if (challengeMode === "repair") {
      success = normalize(challengeCode) === normalize(lesson.example);
    } else if (challengeMode === "build") {
      success = challengeCode.trim().length > 0 && normalize(challengeCode) !== normalize(lesson.example) && regex.test(challengeCode);
    } else {
      success = challengeCode.trim().length > formatExample(lesson.example, trackKey).join("\n").trim().length + 10 && normalize(challengeCode) !== normalize(lesson.example) && regex.test(challengeCode);
    }

    setChallengeSuccess(success);
    setChallengeFeedback(success
      ? challengeMode === "repair"
        ? "أحسنت! أصلحت الخطأ في المثال. انتقل إلى المهمة التالية."
        : challengeMode === "build"
          ? "ممتاز! نفّذت المتطلب الأساسي للتحدي."
          : "رائع! وسّعت المثال إلى مشروع مصغّر مع الحفاظ على الفكرة المطلوبة."
      : challengeMode === "repair"
        ? "ما زال هناك اختلاف عن الكود الصحيح. راجع الأقواس والوسوم والرموز."
        : challengeMode === "build"
          ? "لم يتحقق المتطلب بعد. طبّق الفكرة الأساسية للدرس ثم أعد الفحص."
          : "أضف تطويرًا حقيقيًا إلى المثال، وتأكد من بقاء الفكرة الأساسية صحيحة.");

    if (success) {
      completeLessonFromGame("أحسنت! أنجزت تحدي هذه المرحلة بنجاح.");
      setReward(true);
      setShowRecovery(false);
    }
  }

  function makeBrokenCode(source: string) {
    if (trackKey === "html") return source.replace(">", "");
    if (trackKey === "css") return source.includes(":") ? source.replace(":", "") : source.replace("{", "");
    if (source.includes(";")) return source.replace(";", "");
    if (source.includes("console.log")) return source.replace("console.log", "console.logg");
    return source + ")";
  }

  function checkFixCode() {
    if (!lesson) return;
    const normalize = (value: string) => value.replace(/\s+/g, "");
    const isFixed = normalize(fixCode) === normalize(lesson.example);
    setFixFeedback(isFixed
      ? "أحسنت! اكتشفت الخطأ وأعدت الكود إلى صيغته الصحيحة."
      : "لم يُصلح الخطأ بالكامل بعد. قارن الأقواس والرموز مع المثال الأصلي وحاول مرة أخرى.");
    if (isFixed) completeLessonFromGame();
  }

  function moveDragPiece(id: number, delta: number) {
    if (dragWon) return;
    setDragPieces((current) => {
      const from = current.findIndex((piece) => piece.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setDragFeedback("");
  }

  function dropDragPiece(targetId: number) {
    if (draggedId === null || draggedId === targetId || dragWon) return;
    setDragPieces((current) => {
      const from = current.findIndex((piece) => piece.id === draggedId);
      const to = current.findIndex((piece) => piece.id === targetId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null);
    setDragFeedback("");
  }

  function checkDragOrder() {
    const correct = dragPieces.every((piece, index) => piece.id === index);
    setDragWon(correct);
    setDragFeedback(correct
      ? "ترتيب ممتاز! أصبحت أجزاء المثال في مواضعها الصحيحة."
      : "اقتربت! حرّك الأسطر بالسحب أو استخدم الأسهم حتى يصبح الترتيب صحيحًا.");
    if (correct) completeLessonFromGame();
  }

  function checkQuiz() {
    if (quizChoice === null) return;
    setQuizChecked(true);
    if (quizOptions[quizChoice]?.correct) completeLessonFromGame();
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

        <article className="panel lesson-stage game-stage">
          <span className="stage-label">المرحلة 4 · العب</span>
          <h2>مركز الألعاب البرمجية</h2>
          <p>اختر طريقة اللعب التي تناسبك: أصلح خطأً في الكود، رتّب الأجزاء بالسحب، أو اختبر فهمك بسؤال متعدد الخيارات.</p>
          <div className="game-mode-tabs" role="tablist" aria-label="أنماط الألعاب">
            <button type="button" role="tab" aria-selected={gameMode === "fix"} className={gameMode === "fix" ? "game-mode-tab active" : "game-mode-tab"} onClick={() => { setGameMode("fix"); setFixCode(makeBrokenCode(lesson.example)); setFixFeedback(""); }}>🛠️ تصحيح الكود</button>
            <button type="button" role="tab" aria-selected={gameMode === "drag"} className={gameMode === "drag" ? "game-mode-tab active" : "game-mode-tab"} onClick={() => { setGameMode("drag"); setDragPieces([...createGamePieces(exampleLines, lesson.example, trackKey)].reverse()); setDragWon(false); setDragFeedback(""); }}>↕️ السحب والترتيب</button>
            <button type="button" role="tab" aria-selected={gameMode === "quiz"} className={gameMode === "quiz" ? "game-mode-tab active" : "game-mode-tab"} onClick={() => { setGameMode("quiz"); setQuizChoice(null); setQuizChecked(false); }}>✦ اختيار من متعدد</button>
          </div>

          {gameMode === "fix" && <div className="game-panel-content">
            <div className="game-instruction"><span>01</span><div><strong>مهمة إصلاح العطل</strong><p>أدخلنا خطأً صغيرًا في المثال. أصلحه ثم تحقق من الحل.</p></div></div>
            <label htmlFor="fix-code-editor" className="editor-label">الكود الذي يحتاج إلى إصلاح</label>
            <textarea id="fix-code-editor" className="lesson-editor game-fix-editor" value={fixCode} spellCheck={false} onChange={(event) => { setFixCode(event.target.value); setFixFeedback(""); }} />
            <div className="editor-actions"><button type="button" className="button button-primary" onClick={checkFixCode}>تحقق من التصحيح</button><button type="button" className="button button-ghost" onClick={() => { setFixCode(makeBrokenCode(lesson.example)); setFixFeedback(""); }}>إعادة ضبط الخطأ</button></div>
            {fixFeedback && <p className={fixCode.replace(/\s+/g, "") === lesson.example.replace(/\s+/g, "") ? "status success" : "status"} role="status">{fixFeedback}</p>}
          </div>}

          {gameMode === "drag" && <div className="game-panel-content">
            <div className="game-instruction"><span>02</span><div><strong>رتّب أجزاء المثال</strong><p>اسحب كل سطر إلى موضعه. ويمكنك استخدام الأسهم بجوار السطر للتحريك بدقة.</p></div></div>
            <div className="drag-code-list">
              {dragPieces.map((piece, index) => <div key={piece.id} className={"drag-code-piece" + (draggedId === piece.id ? " is-dragging" : "")} draggable={!dragWon} onDragStart={() => setDraggedId(piece.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropDragPiece(piece.id)} onDragEnd={() => setDraggedId(null)}>
                <span className="drag-grip" aria-hidden="true">⠿</span><span className="drag-position">{index + 1}</span><code>{piece.line}</code>
                <span className="drag-move-buttons"><button type="button" aria-label="تحريك السطر للأعلى" disabled={index === 0 || dragWon} onClick={() => moveDragPiece(piece.id, -1)}>↑</button><button type="button" aria-label="تحريك السطر للأسفل" disabled={index === dragPieces.length - 1 || dragWon} onClick={() => moveDragPiece(piece.id, 1)}>↓</button></span>
              </div>)}
            </div>
            <div className="editor-actions"><button type="button" className="button button-primary" onClick={checkDragOrder} disabled={dragWon}>تحقق من الترتيب</button><button type="button" className="button button-ghost" onClick={() => { setDragPieces([...createGamePieces(exampleLines, lesson.example, trackKey)].reverse()); setDragWon(false); setDragFeedback(""); }}>إعادة الترتيب</button></div>
            {dragFeedback && <p className={dragWon ? "status success" : "status"} role="status">{dragFeedback}</p>}
          </div>}

          {gameMode === "quiz" && <div className="game-panel-content">
            <div className="game-instruction"><span>03</span><div><strong>اختبر فهمك</strong><p>اختر إجابة واحدة ثم اعرض نتيجة المحاولة.</p></div></div>
            <h3 className="game-question">{lesson.question}</h3>
            <div className="game-quiz-options">
              {quizOptions.map((option, index) => <button type="button" key={option.text} className={"game-quiz-option" + (quizChoice === index ? " chosen" : "") + (quizChecked && option.correct ? " answer-correct" : "") + (quizChecked && quizChoice === index && !option.correct ? " answer-wrong" : "")} onClick={() => { if (!quizChecked) setQuizChoice(index); }} disabled={quizChecked}><span>{["A", "B", "C", "D"][index]}</span>{option.text}</button>)}
            </div>
            <div className="editor-actions"><button type="button" className="button button-primary" onClick={checkQuiz} disabled={quizChoice === null || quizChecked}>تحقق من الإجابة</button><button type="button" className="button button-ghost" onClick={() => { setQuizChoice(null); setQuizChecked(false); }}>محاولة جديدة</button></div>
            {quizChecked && <p className={quizOptions[quizChoice ?? -1]?.correct ? "status success" : "status"} role="status">{quizOptions[quizChoice ?? -1]?.correct ? "إجابة صحيحة! " + lesson.answer : "ليست الإجابة المطلوبة. راجع المفهوم ثم حاول مجددًا. " + lesson.answer}</p>}
          </div>}
        </article>

        <article className="panel lesson-stage challenge-stage">
          <span className="stage-label">المرحلة 5 · أتقن</span>
          <h2>تحدي متغيّر حسب الدرس</h2>
          <p>كل درس يقدم نوع مهمة مختلفًا بالتناوب، حتى تطبّق الفكرة بدل تكرار نفس السؤال دائمًا.</p>
          <div className="game-instruction">
            <span>{challengeMode === "repair" ? "01" : challengeMode === "build" ? "02" : "03"}</span>
            <div>
              <strong>{challengeMode === "repair" ? "تحدي اكتشاف الخطأ وإصلاحه" : challengeMode === "build" ? "تحدي تنفيذ متطلب" : "تحدي مشروع مصغّر"}</strong>
              <p>{challengeMode === "repair"
                ? `أصلح الكود المعطوب لدرس «${lesson.title}» وأعده إلى صيغة صحيحة.`
                : challengeMode === "build"
                  ? `اكتب أو عدّل الكود لتطبيق الفكرة: ${lesson.summary}`
                  : `طوّر مثال «${lesson.title}» إلى مشروع مصغّر. أضف تحسينًا من عندك مع الحفاظ على الفكرة الأساسية: ${lesson.summary}`}</p>
            </div>
          </div>
          <label htmlFor="final-challenge-editor" className="editor-label">مساحة حل التحدي</label>
          <textarea id="final-challenge-editor" className="lesson-editor" value={challengeCode} spellCheck={false} onChange={(event) => { setChallengeCode(event.target.value); setChallengeFeedback(""); setChallengeSuccess(false); }} />
          <div className="editor-actions">
            <button type="button" className="button button-primary" onClick={checkChallenge}>تحقق من حل التحدي</button>
            <button type="button" className="button button-ghost" onClick={() => { setChallengeCode(challengeMode === "repair" ? makeBrokenCode(lesson.example) : formatExample(lesson.example, trackKey).join("\n")); setChallengeFeedback(""); setChallengeSuccess(false); }}>إعادة التحدي</button>
          </div>
          {challengeFeedback && <div className={challengeSuccess ? "status success" : "status"} role="status">{challengeFeedback}</div>}
          <div className="mastery-question"><strong>سؤال مراجعة المفهوم</strong><p>{lesson.question}</p><details><summary>إظهار الإجابة والتفسير</summary><p>{lesson.answer}</p></details></div>
          <button className="text-link recovery-toggle" onClick={() => setShowRecovery((value) => !value)}>{showRecovery ? "إخفاء خطة المراجعة" : "احتجت إلى مساعدة؟ افتح خطة المراجعة"}</button>
          {showRecovery && <div className="hint-box"><strong>خطة معالجة الخطأ</strong><p>{lesson.recovery}</p></div>}
          {mastered && <div className="status success" role="status">✓ هذا الدرس متقن ومحفوظ في تقدمك.</div>}
          {mastered && next && <Link className="button button-primary next-lesson" href={"/learn/" + trackKey + "/" + next.slug}>افتح الدرس التالي: {next.title} ↗</Link>}
          {mastered && !next && <div className="status success">أكملت الجزيرة! {trackKey !== "javascript" ? <Link className="text-link" href={trackKey === "html" ? "/learn/css" : "/learn/javascript"}>افتح الجزيرة التالية ↗</Link> : "أنهيت المسارات الثلاثة. راجع تقدمك وابدأ مشروعًا مستقلًا."}</div>}
        </article>
      </div>
    </main><footer className="footer"><div className="container"><Link href={"/learn/" + trackKey}>العودة إلى خريطة الجزيرة ↗</Link></div></footer>
  </>;
}
