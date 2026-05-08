import { fetchHistoricalWeather } from "@/lib/weather";

type Props = {
  /** [lat, lng] from start point of activity polyline */
  coordinates: Array<[number, number]>;
  isoDateTime: string;
};

export async function WeatherWidget({ coordinates, isoDateTime }: Props) {
  if (coordinates.length === 0) return null;

  const [lat, lng] = coordinates[0];
  const weather = await fetchHistoricalWeather(lat, lng, isoDateTime);
  if (!weather) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pogoda podczas biegu
          </p>
          <p className="mt-2 flex items-center gap-3 text-2xl font-bold tabular-nums">
            <span aria-hidden className="text-3xl">
              {weather.weatherIcon}
            </span>
            <span className="font-mono">
              {weather.temperature.toFixed(1)}
              <span className="text-base font-normal text-muted-foreground">
                °C
              </span>
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {weather.weatherLabel}
          </p>
        </div>
        <dl className="space-y-1 text-right text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Wiatr</dt>
            <dd className="font-mono tabular-nums">
              {weather.windSpeed.toFixed(0)} km/h
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Opady</dt>
            <dd className="font-mono tabular-nums">
              {weather.precipitation.toFixed(1)} mm
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
