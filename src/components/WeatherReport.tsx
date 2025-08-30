import { useWeatherData } from "@/weather";

export const WeatherReport = () => {
  const { weather } = useWeatherData();

  return (
    <>
      <div className="absolute top-20 min-h-44 left-20 p-4 rounded-xl bg-white/20 backdrop-blur-md shadow-lg text-gray-800 w-48 flex flex-col justify-center items-center space-y-2">
        {!weather ? (
          <Loader />
        ) : (
          <>
            {/* Weericoon (emoji) */}
            <div className="text-6xl">{weather.current.weatherIcon}</div>

            {/* Temperatuur */}
            <div className="text-3xl font-semibold">
              {Math.round(weather.current.temperature2m)}°C
            </div>
          </>
        )}
      </div>

      <div className="absolute top-20 min-h-44 right-20 p-4 rounded-xl bg-white/20 backdrop-blur-md shadow-lg text-gray-800 w-48 flex flex-col justify-center items-center space-y-2">
        {!weather ? (
          <Loader />
        ) : (
          <>
            {/* Weericoon (emoji) */}
            <div className="text-6xl">{weather.daily.weatherIcon}</div>

            {/* Max temperatuur */}
            <div className="text-3xl font-semibold">
              {Math.round(weather.daily.temperature2mMax)}°C
            </div>

            {/* Neerslagverwachting */}
            <div className="text-lg text-center">
              {weather.daily.precipitationSum > 0 ? "☔️" : ""}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-48 min-h-44">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></div>
    </div>
  );
};
