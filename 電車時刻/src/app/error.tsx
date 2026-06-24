"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 p-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <AlertTriangle className="mx-auto h-8 w-8 text-signal-red" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-semibold">表示中にエラーが発生しました</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-rail-500 px-4 text-sm font-semibold text-white transition hover:bg-rail-700"
        >
          再読み込み
        </button>
      </div>
    </main>
  );
}
