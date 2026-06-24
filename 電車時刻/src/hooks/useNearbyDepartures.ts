"use client";

import { useCallback, useEffect, useState } from "react";
import { getNearbyStationsWithDepartures } from "@/lib/railService";
import type { Position, StationWithDepartures } from "@/types";

interface NearbyDeparturesState {
  stations: StationWithDepartures[];
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: Date | null;
}

export function useNearbyDepartures(position: Position | null) {
  const [state, setState] = useState<NearbyDeparturesState>({
    stations: [],
    isLoading: false,
    error: null,
    lastUpdatedAt: null,
  });

  const refresh = useCallback(async () => {
    if (!position) {
      return;
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const stations = await getNearbyStationsWithDepartures(position);
      setState({
        stations,
        isLoading: false,
        error: null,
        lastUpdatedAt: new Date(),
      });
    } catch {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: "発車時刻の取得に失敗しました。",
      }));
    }
  }, [position]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!position) {
      return;
    }

    const timerId = window.setInterval(() => {
      void refresh();
    }, 30_000);

    return () => window.clearInterval(timerId);
  }, [position, refresh]);

  return {
    ...state,
    refresh,
  };
}
