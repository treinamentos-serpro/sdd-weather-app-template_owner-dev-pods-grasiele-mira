import type { Unit } from '../types/weather';

export function convertCelsiusToFahrenheit(temperatureC: number): number {
  return (temperatureC * 9) / 5 + 32;
}

export function formatTemperature(temperatureC: number, unit: Unit): string {
  const temperature =
    unit === 'fahrenheit' ? convertCelsiusToFahrenheit(temperatureC) : temperatureC;
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';

  return `${temperature.toFixed(1)} ${symbol}`;
}
