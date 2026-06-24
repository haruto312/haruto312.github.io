"use client";

import { useCallback, useEffect, useState } from "react";
import type { Position } from "@/types";

type GeolocationStatus = "idle" | "loading" | "success" | "error" | "unsupported";

interface GeolocationState {
  position: Position | null;
  status: GeolocationStatus;
  error: string | null;
}

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 30_000,
};

function getErrorMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "位置情報の利用が許可されていません。ブラウザ設定から許可してください。";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "現在地を取得できませんでした。電波状況を確認してください。";
  }

  return "現在地の取得がタイムアウトしました。もう一度お試しください。";
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    status: "idle",
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({
        position: null,
        status: "unsupported",
        error: "このブラウザは位置情報取得に対応していません。",
      });
      return;
    }

    setState((current) => ({ ...current, status: "loading", error: null }));
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setState({
          position: {
            lat: result.coords.latitude,
            lng: result.coords.longitude,
          },
          status: "success",
          error: null,
        });
      },
      (error) => {
        setState((current) => ({
          position: current.position,
          status: "error",
          error: getErrorMessage(error),
        }));
      },
      options,
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
  };
}
