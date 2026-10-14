import { htmlAreas, htmlLessons } from "./html";
import { cssAreas, cssLessons } from "./css";
import { javascriptAreas, javascriptLessons } from "./javascript";
import type { Track, TrackKey } from "./types";

export const tracks: Record<TrackKey, Track> = {
  html: { key: "html", title: "جزيرة HTML", subtitle: "ابنِ هيكل الويب ومعناه وإتاحته.", areas: htmlAreas, lessons: htmlLessons },
  css: { key: "css", title: "جزيرة CSS", subtitle: "حوّل الهيكل إلى واجهات متجاوبة وواضحة.", areas: cssAreas, lessons: cssLessons },
  javascript: { key: "javascript", title: "جزيرة JavaScript", subtitle: "أضف المنطق والتفاعل إلى تطبيقات الويب.", areas: javascriptAreas, lessons: javascriptLessons },
};

export function isTrackMastered(track: Track, progress: Record<string, { attempts: number; mastered: boolean }>) {
  return track.lessons.every((lesson) => progress[lesson.id]?.mastered === true);
}

export function isTrackUnlocked(key: TrackKey, progress: Record<string, { attempts: number; mastered: boolean }>) {
  if (key === "html") return true;
  if (key === "css") return isTrackMastered(tracks.html, progress);
  return isTrackMastered(tracks.html, progress) && isTrackMastered(tracks.css, progress);
}

export function isLessonUnlocked(track: Track, index: number, progress: Record<string, { attempts: number; mastered: boolean }>) {
  if (!isTrackUnlocked(track.key, progress)) return false;
  if (index === 0) return true;
  return progress[track.lessons[index - 1].id]?.mastered === true;
}
