export interface Departure {
  time: string;
  destination: string;
  line: string;
}

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface NearbyStation extends Station {
  distanceMeters: number;
}

export interface StationWithDepartures extends NearbyStation {
  departures: Departure[];
}
