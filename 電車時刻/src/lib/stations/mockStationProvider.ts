import { distanceInMeters } from "@/lib/geolocation/distance";
import { mockStations } from "@/lib/stations/mockStations";
import type { StationProvider } from "@/lib/stations/stationProvider";
import type { NearbyStation, Position, Station } from "@/types";

export class MockStationProvider implements StationProvider {
  async listStations(): Promise<Station[]> {
    return mockStations;
  }

  async findNearby(position: Position, radiusMeters: number): Promise<NearbyStation[]> {
    return mockStations
      .map((station) => ({
        ...station,
        distanceMeters: distanceInMeters(position, station),
      }))
      .filter((station) => station.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
