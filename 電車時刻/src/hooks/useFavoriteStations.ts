"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tokyo-next-trains.favoriteStationIds";

export function useFavoriteStations() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return;
    }

    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        setFavoriteIds(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavoriteIds((current) =>
      current.includes(stationId)
        ? current.filter((id) => id !== stationId)
        : [...current, stationId],
    );
  }, []);

  return {
    favoriteIds,
    favoriteSet,
    toggleFavorite,
  };
}
