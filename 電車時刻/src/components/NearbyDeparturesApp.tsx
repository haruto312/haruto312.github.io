"use client";

import { LocateFixed, MapPin, WifiOff } from "lucide-react";
import { useFavoriteStations } from "@/hooks/useFavoriteStations";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyDepartures } from "@/hooks/useNearbyDepartures";
import { RefreshButton } from "@/components/RefreshButton";
import { StationCard } from "@/components/StationCard";

interface NearbyDeparturesAppProps {
  bootedAt: string;
}

function formatPosition(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function formatUpdatedAt(date: Date | null): string {
  if (!date) {
    return "未取得";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function NearbyDeparturesApp({ bootedAt }: NearbyDeparturesAppProps) {
  const geolocation = useGeolocation();
  const departures = useNearbyDepartures(geolocation.position);
  const favorites = useFavoriteStations();

  const sortedStations = [...departures.stations].sort((a, b) => {
    const favoriteDelta =
      Number(favorites.favoriteSet.has(b.id)) - Number(favorites.favoriteSet.has(a.id));
    return favoriteDelta || a.distanceMeters - b.distanceMeters;
  });

  const canRefresh = Boolean(geolocation.position);

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4 pb-4">
          <div>
            <p className="text-sm font-medium text-rail-700 dark:text-rail-50">
              Tokyo Next Trains
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
              近くの駅と次の発車
            </h1>
          </div>
          <RefreshButton
            isLoading={departures.isLoading}
            onRefresh={() => {
              if (canRefresh) {
                void departures.refresh();
              } else {
                geolocation.requestLocation();
              }
            }}
          />
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rail-50 text-rail-700 dark:bg-rail-950 dark:text-rail-50">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">現在地</p>
              <p className="truncate font-mono text-sm text-slate-950 dark:text-white">
                {geolocation.position
                  ? formatPosition(geolocation.position.lat, geolocation.position.lng)
                  : "位置情報を取得しています"}
              </p>
            </div>
          </div>

          {geolocation.error ? (
            <div className="mt-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100">
              <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{geolocation.error}</p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>半径1km以内を検索</span>
            <span>最終更新 {formatUpdatedAt(departures.lastUpdatedAt)}</span>
          </div>
        </section>

        <section className="mt-5 flex-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              最寄り駅一覧
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {sortedStations.length}駅
            </span>
          </div>

          {geolocation.status === "loading" && sortedStations.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900">
              <LocateFixed className="h-8 w-8 animate-pulse text-rail-700 dark:text-rail-50" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                GPS許可を確認しています
              </p>
            </div>
          ) : null}

          {departures.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100">
              {departures.error}
            </div>
          ) : null}

          {!departures.isLoading &&
          geolocation.status === "success" &&
          sortedStations.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              半径1km以内に登録済みの駅が見つかりませんでした。
            </div>
          ) : null}

          <div className="grid gap-3">
            {sortedStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isFavorite={favorites.favoriteSet.has(station.id)}
                onToggleFavorite={favorites.toggleFavorite}
              />
            ))}
          </div>
        </section>

        <footer className="py-5 text-center text-xs text-slate-400">
          Server boot {new Date(bootedAt).toLocaleString("ja-JP")}
        </footer>
      </div>
    </main>
  );
}
