import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weather = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const metrics = [
    {
      label: 'Umidade',
      value:
        current.relativeHumidityPercent === undefined ? '—' : `${current.relativeHumidityPercent}%`,
    },
    {
      label: 'Vento',
      value: current.windSpeedKmh === undefined ? '—' : `${current.windSpeedKmh} km/h`,
    },
    {
      label: 'Precipitação',
      value: current.precipitationMm === undefined ? '—' : `${current.precipitationMm} mm`,
    },
    {
      label: 'Pressão',
      value: current.pressureHpa === undefined ? '—' : `${current.pressureHpa} hPa`,
    },
  ];

  return (
    <section
      aria-labelledby="current-weather-city"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md"
    >
      <p className="text-sm font-medium text-white/65">Clima atual</p>
      <h2 id="current-weather-city" className="mt-1 text-2xl font-semibold text-white">
        {city.name}
        {city.country && (
          <span className="ml-2 text-base font-normal text-white/65">{city.country}</span>
        )}
      </h2>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <span aria-hidden="true" className="text-6xl leading-none">
          {weather.icon}
        </span>
        <div>
          <p className="text-base text-white/75">{weather.description}</p>
          <p className="mt-1 text-6xl font-semibold text-white sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
        </div>
      </div>

      <dl
        aria-label="Métricas atuais"
        className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-5 sm:grid-cols-4"
      >
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-white/60">{label}</dt>
            <dd className="mt-1 text-lg font-medium text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
