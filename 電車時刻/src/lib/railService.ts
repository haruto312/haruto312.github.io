import { createDepartureProvider } from "@/lib/departures";
import { createStationProvider } from "@/lib/stations";
import type { Position, StationWithDepartures } from "@/types";

const DEFAULT_RADIUS_METERS = 1_000;
const DEFAULT_DEPARTURE_LIMIT = 3;

export async function getNearbyStationsWithDepartures(
  position: Position,
  now: Date = new Date(),
): Promise<StationWithDepartures[]> {
  const stationProvider = createStationProvider();
  const departureProvider = createDepartureProvider();
  const nearbyStations = await stationProvider.findNearby(position, DEFAULT_RADIUS_METERS);

  return Promise.all(
    nearbyStations.map(async (station) => ({
      ...station,
      departures: await departureProvider.getNextDepartures(
        station.id,
        now,
        DEFAULT_DEPARTURE_LIMIT,
      ),
    })),
  );
}
