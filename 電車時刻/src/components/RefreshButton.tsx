"use client";

import { RefreshCcw } from "lucide-react";

interface RefreshButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function RefreshButton({ isLoading, onRefresh }: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isLoading}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rail-500 hover:text-rail-700 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      aria-label="手動更新"
      title="手動更新"
    >
      <RefreshCcw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
    </button>
  );
}
