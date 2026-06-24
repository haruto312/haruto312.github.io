import { MockDepartureProvider } from "@/lib/departures/mockDepartureProvider";
import type { DepartureProvider } from "@/lib/departures/departureProvider";

export function createDepartureProvider(): DepartureProvider {
  return new MockDepartureProvider();
}
