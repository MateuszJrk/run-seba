/**
 * Open-Meteo historical weather API — no API key, free.
 * https://open-meteo.com/
 */

export type WeatherSnapshot = {
  temperature: number; // °C
  weatherCode: number; // WMO code
  weatherLabel: string;
  weatherIcon: string; // emoji
  windSpeed: number; // km/h
  precipitation: number; // mm
};

type ApiResponse = {
  hourly?: {
    time: string[];
    temperature_2m: Array<number | null>;
    weathercode: Array<number | null>;
    windspeed_10m: Array<number | null>;
    precipitation: Array<number | null>;
  };
};

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

function describeWeatherCode(code: number): {
  label: string;
  icon: string;
} {
  if (code === 0) return { label: "Słonecznie", icon: "☀️" };
  if (code === 1) return { label: "Przejaśnienia", icon: "🌤️" };
  if (code === 2) return { label: "Częściowe zachmurzenie", icon: "⛅" };
  if (code === 3) return { label: "Pochmurno", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "Mgła", icon: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Mżawka", icon: "🌦️" };
  if (code >= 61 && code <= 67) return { label: "Deszcz", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Śnieg", icon: "🌨️" };
  if (code >= 80 && code <= 82) return { label: "Przelotne opady", icon: "🌦️" };
  if (code >= 85 && code <= 86)
    return { label: "Przelotny śnieg", icon: "🌨️" };
  if (code === 95) return { label: "Burza", icon: "⛈️" };
  if (code >= 96 && code <= 99) return { label: "Burza z gradem", icon: "⛈️" };
  return { label: "Pogoda", icon: "🌡️" };
}

export async function fetchHistoricalWeather(
  lat: number,
  lng: number,
  isoDateTime: string,
): Promise<WeatherSnapshot | null> {
  const date = isoDateTime.slice(0, 10);
  const hour = Number.parseInt(isoDateTime.slice(11, 13), 10) || 0;

  // Wybierz endpoint w zależności od wieku daty
  const ageMs = Date.now() - new Date(date).getTime();
  const days = ageMs / (1000 * 60 * 60 * 24);
  const useForecast = days < 90;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    hourly: "temperature_2m,weathercode,windspeed_10m,precipitation",
    timezone: "Europe/Warsaw",
  });

  if (useForecast) {
    params.set("past_days", String(Math.min(92, Math.ceil(days) + 1)));
    params.set("forecast_days", "1");
  } else {
    params.set("start_date", date);
    params.set("end_date", date);
  }

  const url = `${useForecast ? FORECAST_URL : ARCHIVE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86_400 } }); // 24h
    if (!res.ok) return null;
    const data = (await res.json()) as ApiResponse;
    if (!data.hourly?.time) return null;

    // Znajdź index dla naszej daty + godziny
    const wanted = `${date}T${String(hour).padStart(2, "0")}:00`;
    const idx = data.hourly.time.findIndex((t) => t.startsWith(wanted));
    const i =
      idx >= 0
        ? idx
        : data.hourly.time.findIndex((t) => t.startsWith(date));
    if (i < 0) return null;

    const temp = data.hourly.temperature_2m[i];
    const code = data.hourly.weathercode[i];
    const wind = data.hourly.windspeed_10m[i];
    const prec = data.hourly.precipitation[i];
    if (temp == null || code == null) return null;

    const { label, icon } = describeWeatherCode(code);
    return {
      temperature: temp,
      weatherCode: code,
      weatherLabel: label,
      weatherIcon: icon,
      windSpeed: wind ?? 0,
      precipitation: prec ?? 0,
    };
  } catch (error) {
    console.warn("Weather fetch failed:", error);
    return null;
  }
}
