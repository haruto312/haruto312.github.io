import { MockStationProvider } from "@/lib/stations/mockStationProvider";
import type { StationProvider } from "@/lib/stations/stationProvider";

export function createStationProvider(): StationProvider {
  return new MockStationProvider();
}
