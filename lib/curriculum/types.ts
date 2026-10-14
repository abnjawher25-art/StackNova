export type LessonSeed = [title: string, summary: string, explanation: string, example: string, challenge: string, hint: string, pattern: string, question: string, answer: string, recovery: string];

export type Lesson = {
  id: string; slug: string; number: number; title: string; summary: string; explanation: string;
  example: string; challenge: string; hint: string; pattern: string; question: string; answer: string;
  recovery: string; area: string; areaNumber: number; stage: 1 | 2 | 3 | 4 | 5; minutes: number;
};

export type TrackKey = "html" | "css" | "javascript";
export type Track = { key: TrackKey; title: string; subtitle: string; areas: string[]; lessons: Lesson[] };
export type LessonProgress = { attempts: number; mastered: boolean };
export type ProgressRecord = Record<string, LessonProgress>;

export function buildLessons(track: TrackKey, seeds: LessonSeed[], areas: string[]): Lesson[] {
  return seeds.map((seed, index) => {
    const number = index + 1;
    const areaNumber = Math.floor(index / 5) + 1;
    return {
      id: `${track}-${String(number).padStart(2, "0")}`,
      slug: `lesson-${String(number).padStart(2, "0")}`,
      number, title: seed[0], summary: seed[1], explanation: seed[2], example: seed[3],
      challenge: seed[4], hint: seed[5], pattern: seed[6], question: seed[7], answer: seed[8],
      recovery: seed[9], area: areas[areaNumber - 1], areaNumber,
      stage: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      minutes: 12 + (index % 4) * 3,
    };
  });
}

export function getProgress(): ProgressRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("stacknova-mastery-v1") || "{}") as ProgressRecord; }
  catch { return {}; }
}

export function saveProgress(progress: ProgressRecord) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("stacknova-mastery-v1", JSON.stringify(progress)); }
  catch { /* The current session can continue if browser storage is unavailable. */ }
  window.dispatchEvent(new CustomEvent<ProgressRecord>("stacknova:progress-updated", { detail: progress }));
}
