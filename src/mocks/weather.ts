import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    name: 'São Paulo',
    country: 'Brasil',
    countryCode: 'BR',
    latitude: -23.5505,
    longitude: -46.6333,
    region: 'São Paulo',
    timezone: 'America/Sao_Paulo',
  },
  current: {
    time: '2026-10-07T12:00',
    temperatureC: 23.4,
    apparentTemperatureC: 24.1,
    relativeHumidityPercent: 62,
    precipitationMm: 0,
    pressureHpa: 1012,
    weatherCode: 2,
    isDay: true,
    windSpeedKmh: 13.7,
    windDirectionDeg: 135,
  },
  forecast: [
    {
      date: '2026-10-07',
      minTemperatureC: 17.2,
      maxTemperatureC: 25.8,
      weatherCode: 2,
      precipitationSumMm: 0.2,
    },
    {
      date: '2026-10-08',
      minTemperatureC: 18.1,
      maxTemperatureC: 27.3,
      weatherCode: 1,
      precipitationSumMm: 0,
    },
    {
      date: '2026-10-09',
      minTemperatureC: 19.4,
      maxTemperatureC: 26.1,
      weatherCode: 61,
      precipitationSumMm: 4.6,
    },
    {
      date: '2026-10-10',
      minTemperatureC: 17.8,
      maxTemperatureC: 23.6,
      weatherCode: 3,
      precipitationSumMm: 0.8,
    },
    {
      date: '2026-10-11',
      minTemperatureC: 16.9,
      maxTemperatureC: 24.7,
      weatherCode: 0,
      precipitationSumMm: 0,
    },
  ],
};
