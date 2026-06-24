import { stationDepartureTemplates } from "@/lib/departures/mockDepartures";
import type { DepartureProvider } from "@/lib/departures/departureProvider";
import type { Departure } from "@/types";

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export class MockDepartureProvider implements DepartureProvider {
  async getNextDepartures(stationId: string, now: Date, limit: number): Promise<Departure[]> {
    const templates = stationDepartureTemplates[stationId] ?? [
      { line: "首都圏路線", destination: "主要駅方面" },
    ];

    return Array.from({ length: limit }, (_, index) => {
      const departureTime = new Date(now);
      departureTime.setMinutes(now.getMinutes() + 3 + index * 4);
      const template = templates[index % templates.length];

      return {
        ...template,
        time: formatTime(departureTime),
      };
    });
  }
}
