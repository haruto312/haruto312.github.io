import type { NearbyStation, Position, Station } from "@/types";

export interface StationProvider {
  findNearby(position: Position, radiusMeters: number): Promise<NearbyStation[]>;
  listStations(): Promise<Station[]>;
}
