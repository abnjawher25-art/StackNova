"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isTrackMastered, isTrackUnlocked, tracks } from "@/lib/curriculum";
import { getProgress, type TrackKey } from "@/lib/curriculum/types";

const galaxyInfo: Record<TrackKey, { number: string; title: string; description: string; icon: string; planet: string; accent: string; mission: string }> = {
  html: {
    number: "01", title: "مجرة HTML", description: "ابنِ هيكل صفحات الويب واكتشف كيف تمنح المحتوى معناه.", icon: "⌘",
    planet: "planet-html", accent: "cyan", mission: "هندسة البنية",
  },
  css: {
    number: "02", title: "مجرة CSS", description: "لوّن عالمك، نسّق العناصر، وصمّم واجهات تتحرك بانسجام.", icon: "✳",
    planet: "planet-css", accent: "violet", mission: "فنّ التصميم",
  },
  javascript: {
    number: "03", title: "مجرة JavaScript", description: "أضف التفاعل والمنطق، واجعل صفحاتك تستجيب لكل فكرة.", icon: "⚡",
    planet: "planet-js", accent: "gold", mission: "قوة التفاعل",
  },
};

const keys: TrackKey[] = ["html", "css", "javascript"];

export default function GalaxyHubPage() {
  const [progress, setProgress] = useState<ReturnType<typeof getProgress>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setLoaded(true);
  }, []);

  const completedLessons = useMemo(
    () => Object.values(progress).filter((item) => item.mastered).length,
    [progress],
  );

  return (
    <main className="galaxy-hub" dir="rtl">
      <div className="hub-starfield" aria-hidden="true">
        {Array.from({ length: 38 }, (_, index) => (
          <span key={index} style={{
            left: ((index * 37 + 9) % 97) + "%",
            top: ((index * 53 + 7) % 91) + "%",
            animationDelay: ((index % 8) * 0.35) + "s",
            opacity: 0.25 + ((index % 5) * 0.13),
          }} />
        ))}
      </div>
      <header className="hub-header">
        <Link href="/" className="hub-brand"><span className="space-logo-mark">S</span> StackNova</Link>
        <div className="hub-header-meta"><span className="hub-pulse" /> خريطة المجرّات <span className="hub-progress-pill">{completedLessons} / 150 مهمة</span></div>
      </header>
      <section className="hub-intro">
        <span className="space-kicker"><span>✦</span> اختر وجهتك التالية</span>
        <h1>ثلاث مجرّات،<br /><span>رحلة واحدة نحو الإتقان.</span></h1>
        <p>كل مجرّة عالم مستقل من المفاهيم والتجارب والألعاب. ابدأ من HTML، وافتح العوالم التالية كلما تقدّمت في رحلتك.</p>
      </section>
      <section className="galaxy-grid" aria-label="المجرات التعليمية">
        {keys.map((key) => {
          const track = tracks[key];
          const info = galaxyInfo[key];
          const unlocked = loaded && isTrackUnlocked(key, progress);
          const mastered = loaded && isTrackMastered(track, progress);
          const done = track.lessons.filter((lesson) => progress[lesson.id]?.mastered).length;
          const percent = Math.round((done / track.lessons.length) * 100);
          return (
            <Link href={"/learn/" + key} className={"galaxy-card galaxy-" + info.accent + (unlocked ? "" : " galaxy-locked")} key={key}>
              <div className="galaxy-card-top"><span className="galaxy-number">{info.number} / SECTOR</span><span className={"galaxy-state" + (mastered ? " state-done" : "")}>{mastered ? "مكتملة ✓" : unlocked ? "متاحة للاستكشاف" : "تُفتح بالتقدم 🔒"}</span></div>
              <div className={"galaxy-art " + info.planet} aria-hidden="true">
                <span className="galaxy-ring ring-a" /><span className="galaxy-ring ring-b" /><span className="galaxy-core">{info.icon}</span>
                <span className="galaxy-moon moon-a" /><span className="galaxy-moon moon-b" /><span className="galaxy-orbit-dot" />
              </div>
              <div className="galaxy-card-copy"><span className="galaxy-mission">{info.mission}</span><h2>{info.title}</h2><p>{info.description}</p></div>
              <div className="galaxy-card-bottom"><div className="galaxy-progress-copy"><span>{done} من 50 مهمة</span><strong>{percent}%</strong></div><div className="galaxy-progress"><span style={{ width: percent + "%" }} /></div><div className="galaxy-enter">{unlocked ? "دخول المجرّة" : "عرض المسار"} <span aria-hidden="true">←</span></div></div>
            </Link>
          );
        })}
      </section>
      <div className="hub-guidance"><span className="hub-guidance-icon">✧</span><p><strong>نصيحة رائد فضاء:</strong> أتقن كل مهمة لتحصل على مفتاح المجرّة التالية. تقدّمك يُحفظ على هذا الجهاز.</p><Link href="/learn/html/progress">عرض تقدّمي ↗</Link></div>
      <footer className="hub-footer"><span>STACKNOVA / GALAXY SELECTOR</span><Link href="/">العودة إلى المحطة الرئيسية ↑</Link></footer>
    </main>
  );
}
