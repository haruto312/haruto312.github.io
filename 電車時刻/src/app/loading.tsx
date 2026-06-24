export default function Loading() {
  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-5 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-3xl">
        <div className="h-8 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-5 h-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-5 grid gap-3">
          <div className="h-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </main>
  );
}
