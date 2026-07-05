"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Module } from "@/lib/curriculum";
import { createClient } from "@/lib/supabase/client";
import { RichText } from "./RichText";
import { BoardExplorer } from "./BoardExplorer";
import { LessonVisual } from "./LessonVisual";

type Phase = "lesson" | "quiz" | "result";

export function ModuleRunner({
  module,
  userId,
  nextSlug,
  alreadyCompleted,
}: {
  module: Module;
  userId: string;
  nextSlug: string | null;
  alreadyCompleted: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [phase, setPhase] = useState<Phase>("lesson");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const totalSteps = module.sections.length;

  // Mark the module in_progress the first time it's opened.
  useEffect(() => {
    if (alreadyCompleted) return;
    supabase
      .from("module_progress")
      .upsert(
        { user_id: userId, module_slug: module.slug, status: "in_progress" },
        { onConflict: "user_id,module_slug", ignoreDuplicates: true }
      )
      .then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- TIME-ON-TASK TRACKING -------------------------------------------
  // Accrue seconds spent in the lesson vs. quiz phases and flush them to the
  // server via the add_module_time RPC. Powers the admin analytics view.
  const phaseRef = useRef<Phase>(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    let last = Date.now();
    let lessonDelta = 0;
    let quizDelta = 0;

    const accumulate = () => {
      const now = Date.now();
      // Clamp each interval so a backgrounded/slept tab can't over-count.
      const secs = Math.min(90, Math.max(0, Math.round((now - last) / 1000)));
      last = now;
      const p = phaseRef.current;
      if (p === "lesson") lessonDelta += secs;
      else if (p === "quiz") quizDelta += secs;
      // "result" phase is not counted.
    };

    const flush = () => {
      accumulate();
      if (lessonDelta === 0 && quizDelta === 0) return;
      const l = lessonDelta;
      const q = quizDelta;
      lessonDelta = 0;
      quizDelta = 0;
      supabase
        .rpc("add_module_time", {
          p_module_slug: module.slug,
          p_lesson: l,
          p_quiz: q,
        })
        .then(() => {});
    };

    const interval = setInterval(flush, 20000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else last = Date.now(); // resume without counting the away time
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.slug]);

  const score = module.quiz.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  );
  const scorePct = Math.round((score / module.quiz.length) * 100);
  const passed = scorePct >= 70;

  async function finishModule() {
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from("module_progress").upsert(
      {
        user_id: userId,
        module_slug: module.slug,
        status: "completed",
        quiz_score: scorePct,
        quiz_total: module.quiz.length,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_slug" }
    );
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    router.refresh();
    setPhase("result");
  }

  // ---- LESSON PHASE ----------------------------------------------------
  if (phase === "lesson") {
    const section = module.sections[step];
    return (
      <div className="space-y-6">
        <StepDots total={totalSteps} current={step} />

        <div className="card p-6 sm:p-8">
          {section.control && (
            <span className="chip mb-4 border-brand-accent/40 text-brand-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Control: {section.control}
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-brand-text">
            {section.heading}
          </h2>
          <div className="mt-4">
            <RichText text={section.body} />
          </div>

          {section.visual && (
            <div className="mt-6">
              <LessonVisual name={section.visual} />
            </div>
          )}

          {section.tip && (
            <div className="mt-5 rounded-xl border border-brand-accent2/30 bg-brand-accent2/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-accent2">
                💡 Operator Tip
              </p>
              <p className="prose-body mt-1 text-brand-text/90">{section.tip}</p>
            </div>
          )}
        </div>

        {/* Show the board explorer on the board-layout module */}
        {module.slug === "board-layout" && <BoardExplorer showModuleLinks={false} />}

        <div className="flex items-center justify-between">
          <button
            className="btn-secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Previous
          </button>
          <span className="text-xs text-brand-muted">
            Lesson {step + 1} of {totalSteps}
          </span>
          {step < totalSteps - 1 ? (
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setPhase("quiz")}>
              Take the quiz →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- QUIZ PHASE ------------------------------------------------------
  if (phase === "quiz") {
    const allAnswered =
      Object.keys(answers).length === module.quiz.length;
    return (
      <div className="space-y-6">
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-2xl font-bold tracking-tight">
              Knowledge Check
            </h2>
          </div>
          <p className="prose-body mt-1">
            Answer all {module.quiz.length} questions. You need 70% to complete
            the module — you can retake it anytime.
          </p>

          <div className="mt-6 space-y-7">
            {module.quiz.map((q, qi) => (
              <fieldset key={qi} className="space-y-3">
                <legend className="font-semibold text-brand-text">
                  {qi + 1}. {q.question}
                </legend>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const isCorrect = q.answer === oi;
                    let stateClass =
                      "border-brand-border bg-brand-surface hover:border-brand-accent/40";
                    if (submitted) {
                      if (isCorrect)
                        stateClass =
                          "border-brand-success/60 bg-brand-success/10";
                      else if (chosen)
                        stateClass = "border-brand-danger/60 bg-brand-danger/10";
                      else stateClass = "border-brand-border bg-brand-surface";
                    } else if (chosen) {
                      stateClass = "border-brand-accent bg-brand-accent/10";
                    }
                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${stateClass} ${
                          submitted ? "cursor-default" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          className="mt-0.5 accent-amber-500"
                          checked={chosen || false}
                          disabled={submitted}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [qi]: oi }))
                          }
                        />
                        <span className="text-brand-text/90">{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="rounded-lg bg-brand-surface px-3 py-2 text-xs text-brand-muted">
                    {answers[qi] === q.answer ? "✅ Correct. " : "❌ Not quite. "}
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              className="btn-ghost"
              onClick={() => {
                setPhase("lesson");
                setStep(0);
              }}
            >
              ← Review lessons
            </button>

            {!submitted ? (
              <button
                className="btn-primary"
                disabled={!allAnswered}
                onClick={() => setSubmitted(true)}
              >
                Submit answers
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    passed ? "text-brand-success" : "text-brand-danger"
                  }`}
                >
                  Score: {scorePct}% ({score}/{module.quiz.length})
                </span>
                {passed ? (
                  <button
                    className="btn-primary"
                    disabled={saving}
                    onClick={finishModule}
                  >
                    {saving ? "Saving…" : "Complete module ✓"}
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setAnswers({});
                    }}
                  >
                    Retake quiz
                  </button>
                )}
              </div>
            )}
          </div>
          {saveError && (
            <p className="mt-3 text-xs text-brand-danger">
              Couldn’t save progress: {saveError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---- RESULT PHASE ----------------------------------------------------
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-success/15 text-3xl">
        🎉
      </div>
      <h2 className="mt-4 text-2xl font-bold">Module complete!</h2>
      <p className="prose-body mx-auto mt-2 max-w-md">
        You finished <span className="font-semibold text-brand-text">{module.title}</span>{" "}
        with a score of {scorePct}%. Your progress has been saved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className="btn-secondary">
          Back to dashboard
        </Link>
        {nextSlug ? (
          <Link href={`/learn/${nextSlug}`} className="btn-primary">
            Next module →
          </Link>
        ) : (
          <Link href="/learn" className="btn-primary">
            All modules
          </Link>
        )}
      </div>
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= current ? "bg-brand-accent" : "bg-brand-border"
          }`}
        />
      ))}
    </div>
  );
}
