import { useEffect, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { formatTemperature } from './lib/temperature';
import { getWeatherCodeInfo } from './lib/weatherCodes';
import { mockWeatherData } from './mocks/weather';
import type { Unit } from './types/weather';

type WeatherStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

const statusOptions: { label: string; value: WeatherStatus }[] = [
  { label: 'Início', value: 'idle' },
  { label: 'Carregando', value: 'loading' },
  { label: 'Sem resultados', value: 'empty' },
  { label: 'Falha', value: 'error' },
  { label: 'Clima', value: 'success' },
];

function formatForecastDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`));
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null);

  useEffect(() => {
    if (loadingQuery === null) {
      return;
    }

    const timer = window.setTimeout(() => {
      const matchesMockCity = loadingQuery
        .trim()
        .toLocaleLowerCase('pt-BR')
        .includes(mockWeatherData.city.name.toLocaleLowerCase('pt-BR'));
      setStatus(matchesMockCity ? 'success' : 'empty');
      setLoadingQuery(null);
    }, 550);

    return () => window.clearTimeout(timer);
  }, [loadingQuery]);

  function handleSearch(query: string) {
    setSearchQuery(query);
    setLoadingQuery(query);
    setStatus('loading');
  }

  function handleRetry() {
    const query = searchQuery || mockWeatherData.city.name;
    setSearchQuery(query);
    setLoadingQuery(query);
    setStatus('loading');
  }

  function selectStatus(nextStatus: WeatherStatus) {
    setLoadingQuery(null);
    setStatus(nextStatus);
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center">
          <a
            href="#inicio"
            className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-xl border border-sun/30 bg-sun/10 text-2xl text-sun"
            >
              ☼
            </span>
            <span>
              <span className="block text-lg font-semibold leading-tight">Tempo</span>
              <span className="text-xs text-white/55">PREVISÃO LOCAL</span>
            </span>
          </a>

          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar onSearch={handleSearch} />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main id="inicio" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent-400">WEATHER / BRASIL</p>
            <h1 className="mt-1 text-2xl font-semibold">Previsão do tempo</h1>
          </div>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Prévia de estado"
          >
            <span className="mr-1 text-xs text-white/55">Prévia</span>
            {statusOptions.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => selectStatus(value)}
                className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
                  status === value
                    ? 'border-accent-400/50 bg-accent-500/20 text-white'
                    : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {status === 'idle' && (
          <section className="py-14 text-center sm:py-20" aria-labelledby="idle-title">
            <p className="text-sm font-medium text-sun">CLIMA NA SUA CIDADE</p>
            <h2 id="idle-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
              Um novo dia começa com a previsão certa.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/65">
              Busque uma cidade para ver as condições atuais e os próximos cinco dias.
            </p>
          </section>
        )}

        {status === 'loading' && <LoadingState />}

        {status === 'empty' && (
          <EmptyState
            title="Nenhuma cidade encontrada"
            hint="Confira o nome digitado e tente buscar novamente."
          />
        )}

        {status === 'error' && (
          <ErrorState
            message="Não foi possível carregar os dados do clima."
            onRetry={handleRetry}
          />
        )}

        {status === 'success' && (
          <div className="space-y-8">
            <CurrentWeather
              city={mockWeatherData.city}
              current={mockWeatherData.current}
              unit={unit}
            />

            <section aria-labelledby="forecast-title">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">HOJE E PRÓXIMOS DIAS</p>
                  <h2 id="forecast-title" className="mt-1 text-xl font-semibold">
                    Previsão para 5 dias
                  </h2>
                </div>
                <span className="text-sm text-white/60">{mockWeatherData.city.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {mockWeatherData.forecast.map((day) => {
                  const weather = getWeatherCodeInfo(day.weatherCode);
                  return (
                    <article
                      key={day.date}
                      aria-label={`Previsão para ${formatForecastDate(day.date)}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                    >
                      <p className="text-sm font-medium capitalize text-white/70">
                        {formatForecastDate(day.date)}
                      </p>
                      <span aria-hidden="true" className="mt-4 block text-3xl">
                        {weather.icon}
                      </span>
                      <p className="mt-2 min-h-10 text-sm text-white/70">{weather.description}</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-semibold">
                          {formatTemperature(day.maxTemperatureC, unit)}
                        </span>
                        <span className="text-sm text-white/55">
                          {formatTemperature(day.minTemperatureC, unit)}
                        </span>
                      </div>
                      {day.precipitationSumMm !== undefined && (
                        <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/55">
                          Chuva: {day.precipitationSumMm} mm
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
