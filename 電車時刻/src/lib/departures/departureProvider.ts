import type { Departure } from "@/types";

export interface DepartureProvider {
  getNextDepartures(stationId: string, now: Date, limit: number): Promise<Departure[]>;
}
