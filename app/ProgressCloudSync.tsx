"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProgress, saveProgress, type ProgressRecord } from "@/lib/curriculum/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const OWNER_KEY = "stacknova-progress-owner-v1";
const GUEST_KEY = "stacknova-guest-mastery-v1";

function mergeProgress(first: ProgressRecord, second: ProgressRecord): ProgressRecord {
  const merged: ProgressRecord = { ...first };
  for (const [lessonId, item] of Object.entries(second)) {
    const existing = merged[lessonId];
    merged[lessonId] = {
      attempts: Math.max(existing?.attempts ?? 0, item.attempts ?? 0),
      mastered: Boolean(existing?.mastered || item.mastered),
    };
  }
  return merged;
}

function readGuestProgress(): ProgressRecord | null {
  try {
    const value = localStorage.getItem(GUEST_KEY);
    return value ? (JSON.parse(value) as ProgressRecord) : null;
  } catch {
    return null;
  }
}

export default function ProgressCloudSync() {
  const client = createSupabaseBrowserClient();
  const userRef = useRef<{ id: string } | null>(null);
  const applyingRemote = useRef(false);
  const [status, setStatus] = useState<"local" | "loading" | "saved" | "saving" | "error">(
    client ? "loading" : "local",
  );

  useEffect(() => {
    if (!client) {
      setStatus("local");
      return;
    }

    let active = true;

    async function persistProgress(userId: string, progress: ProgressRecord) {
      if (!active) return;
      setStatus("saving");
      const { error } = await client.from("stacknova_progress").upsert(
        { user_id: userId, progress, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
      if (active) setStatus(error ? "error" : "saved");
    }

    async function handleSession(sessionUser: { id: string } | null) {
      if (!active) return;

      if (!sessionUser) {
        userRef.current = null;
        const previousOwner = localStorage.getItem(OWNER_KEY);
        if (previousOwner) {
          const guestProgress = readGuestProgress();
          localStorage.removeItem(OWNER_KEY);
          localStorage.removeItem(GUEST_KEY);
          applyingRemote.current = true;
          saveProgress(guestProgress ?? {});
          applyingRemote.current = false;
        }
        setStatus("local");
        return;
      }

      const userId = sessionUser.id;
      const previousOwner = localStorage.getItem(OWNER_KEY);
      const initialLocalProgress = getProgress();

      if (!previousOwner) {
        try {
          localStorage.setItem(GUEST_KEY, JSON.stringify(initialLocalProgress));
        } catch {
          // Cloud saving can still work when local storage is unavailable.
        }
      }

      const { data, error } = await client
        .from("stacknova_progress")
        .select("progress")
        .eq("user_id", userId)
        .maybeSingle();

      if (!active) return;
      if (error) {
        userRef.current = sessionUser;
        setStatus("error");
        return;
      }

      // Read again after the network request so progress made while loading is not lost.
      const latestLocalProgress = getProgress();
      // Never merge another signed-in user's local data into this account.
      const localForThisUser = previousOwner && previousOwner !== userId
        ? {}
        : latestLocalProgress;
      const cloudProgress = (data?.progress ?? {}) as ProgressRecord;
      const merged = mergeProgress(localForThisUser, cloudProgress);

      localStorage.setItem(OWNER_KEY, userId);
      userRef.current = sessionUser;
      applyingRemote.current = true;
      saveProgress(merged);
      applyingRemote.current = false;
      await persistProgress(userId, merged);
    }

    const progressHandler = (event: Event) => {
      if (applyingRemote.current || !userRef.current) return;
      const progress = (event as CustomEvent<ProgressRecord>).detail;
      if (progress) void persistProgress(userRef.current.id, progress);
    };

    window.addEventListener("stacknova:progress-updated", progressHandler);
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      void handleSession(session?.user ? { id: session.user.id } : null);
    });
    void client.auth.getSession().then(({ data }) => {
      void handleSession(data.session?.user ? { id: data.session.user.id } : null);
    });

    return () => {
      active = false;
      window.removeEventListener("stacknova:progress-updated", progressHandler);
      authListener.subscription.unsubscribe();
    };
  }, [client]);

  const label = status === "local"
    ? "حفظ محلي"
    : status === "loading"
      ? "جارٍ استعادة التقدم…"
      : status === "saving"
        ? "جارٍ الحفظ…"
        : status === "error"
          ? "مزامنة غير متاحة"
          : "التقدم محفوظ سحابيًا";

  return (
    <Link className="account-floating-link" href="/account" title="إدارة الحساب وحفظ التقدم">
      <span className={status === "saved" ? "account-status-dot is-saved" : "account-status-dot"} />
      <span>الحساب</span>
      <small>{label}</small>
    </Link>
  );
}
