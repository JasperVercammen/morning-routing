import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";

const weatherIcons: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  51: "🌦️",
  52: "🌦️",
  53: "🌦️",
  54: "🌦️",
  55: "🌦️",
  56: "🌦️",
  61: "🌧️",
  62: "🌧️",
  63: "🌧️",
  64: "🌧️",
  65: "🌧️",
  66: "🌧️",
  67: "🌧️",
  71: "❄️",
  72: "❄️",
  73: "❄️",
  74: "❄️",
  751: "❄️",
  76: "❄️",
  77: "❄️",
  80: "🌧️",
  81: "🌧️",
  82: "🌧️",
  95: "⛈️",
  96: "⛈️",
  97: "⛈️",
  98: "⛈️",
  99: "⛈️",
};

const params = {
  latitude: 51.1117,
  longitude: 4.6919,
  daily: [
    "temperature_2m_max",
    "showers_sum",
    "rain_sum",
    "precipitation_sum",
    "precipitation_hours",
    "weather_code",
  ],
  current: [
    "temperature_2m",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
  ],
  forecast_days: 1,
};
const url = "https://api.open-meteo.com/v1/forecast";

type TWeatherData = {
  current: {
    time: Date;
    temperature2m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weatherCode: number;
    weatherIcon: string;
    cloudCover: number;
  };
  daily: {
    time: Date;
    temperature2mMax: number;
    showersSum: number;
    rainSum: number;
    precipitationSum: number;
    precipitationHours: number;
    weatherCode: number;
    weatherIcon: string;
  };
};

export const useWeatherData = () => {
  const [weather, setWeather] = useState<TWeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const responses = await fetchWeatherApi(url, params);
      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current()!;
      const daily = response.daily()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature2m: Math.floor(current.variables(0)!.value()),
          precipitation: current.variables(1)!.value(),
          rain: current.variables(2)!.value(),
          showers: current.variables(3)!.value(),
          snowfall: current.variables(4)!.value(),
          weatherCode: current.variables(5)!.value(),
          weatherIcon: weatherIcons[current.variables(5)!.value() ?? -1],
          cloudCover: current.variables(6)!.value(),
        },
        daily: {
          time: [
            ...Array(
              (Number(daily.timeEnd()) - Number(daily.time())) /
                daily.interval()
            ),
          ].map(
            (_, i) =>
              new Date(
                (Number(daily.time()) +
                  i * daily.interval() +
                  utcOffsetSeconds) *
                  1000
              )
          ),
          temperature2mMax: daily.variables(0)!.valuesArray()!,
          showersSum: daily.variables(1)!.valuesArray()!,
          rainSum: daily.variables(2)!.valuesArray()!,
          precipitationSum: daily.variables(3)!.valuesArray()!,
          precipitationHours: daily.variables(4)!.valuesArray()!,
          weatherCode: daily.variables(5)!.valuesArray()!,
        },
      };
      // we only need the first day of the daily forecast (we also only fetch one day)
      setWeather({
        current: weatherData.current,
        daily: {
          time: weatherData.daily.time[0],
          temperature2mMax: Math.floor(weatherData.daily.temperature2mMax[0]),
          showersSum: weatherData.daily.showersSum[0],
          rainSum: weatherData.daily.rainSum[0],
          precipitationSum: weatherData.daily.precipitationSum[0],
          precipitationHours: weatherData.daily.precipitationHours[0],
          weatherCode: weatherData.daily.weatherCode[0],
          weatherIcon: weatherIcons[weatherData.daily.weatherCode[0]],
        },
      });
    };
    fetchWeatherData();
  }, []);
  return { weather };
};
