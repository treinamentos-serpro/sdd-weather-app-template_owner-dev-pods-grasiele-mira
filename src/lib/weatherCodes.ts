const descriptions: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Chuvisco fraco',
  53: 'Chuvisco moderado',
  55: 'Chuvisco intenso',
  56: 'Chuvisco congelante fraco',
  57: 'Chuvisco congelante intenso',
  61: 'Chuva fraca',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante fraca',
  67: 'Chuva congelante forte',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva fracas',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  85: 'Pancadas de neve fracas',
  86: 'Pancadas de neve fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo fraco',
  99: 'Trovoada com granizo forte',
};

function getWeatherIcon(weatherCode: number, isDay: boolean): string {
  if (weatherCode === 0) {
    return isDay ? '☀️' : '🌙';
  }
  if (weatherCode === 1) {
    return isDay ? '🌤️' : '🌙';
  }
  if (weatherCode === 2) {
    return '⛅';
  }
  if (weatherCode === 3) {
    return '☁️';
  }
  if (weatherCode === 45 || weatherCode === 48) {
    return '🌫️';
  }
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return '🌧️';
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) {
    return '❄️';
  }
  if (weatherCode >= 95) {
    return '⛈️';
  }

  return '🌡️';
}

export function getWeatherCodeInfo(weatherCode: number, isDay = true) {
  return {
    description: descriptions[weatherCode] ?? 'Condição desconhecida',
    icon: getWeatherIcon(weatherCode, isDay),
  };
}
