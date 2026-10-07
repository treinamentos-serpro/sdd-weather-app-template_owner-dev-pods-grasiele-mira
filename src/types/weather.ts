export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  name: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  region?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperatureC: number;
  apparentTemperatureC?: number;
  relativeHumidityPercent?: number;
  precipitationMm?: number;
  pressureHpa?: number;
  weatherCode: number;
  isDay?: boolean;
  windSpeedKmh?: number;
  windDirectionDeg?: number;
}

export interface ForecastDay {
  date: string;
  minTemperatureC: number;
  maxTemperatureC: number;
  weatherCode: number;
  precipitationSumMm?: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
