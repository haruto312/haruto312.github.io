"use client";

import { Star } from "lucide-react";
import type { StationWithDepartures } from "@/types";

interface StationCardProps {
  station: StationWithDepartures;
  isFavorite: boolean;
  onToggleFavorite: (stationId: string) => void;
}

function formatDistance(distanceMeters: number): string {
  return distanceMeters >= 1_000
    ? `${(distanceMeters / 1_000).toFixed(1)}km`
    : `${distanceMeters}m`;
}

export function StationCard({ station, isFavorite, onToggleFavorite }: StationCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{station.name}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            現在地から {formatDistance(station.distanceMeters)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(station.id)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-signal-amber hover:text-signal-amber dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          aria-label={isFavorite ? `${station.name}をお気に入り解除` : `${station.name}をお気に入り登録`}
          title={isFavorite ? "お気に入り解除" : "お気に入り登録"}
        >
          <Star
            className="h-5 w-5"
            fill={isFavorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {station.departures.map((departure, index) => (
          <div
            key={`${departure.time}-${departure.line}-${departure.destination}-${index}`}
            className="grid grid-cols-[3.5rem_1fr] gap-3 py-3 first:pt-0 last:pb-0"
          >
            <time className="font-mono text-base font-semibold text-rail-700 dark:text-rail-50">
              {departure.time}
            </time>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {departure.line}
              </p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {departure.destination}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
