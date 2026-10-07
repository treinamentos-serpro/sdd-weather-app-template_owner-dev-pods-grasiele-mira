import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = city.trim();
    if (disabled || query.length === 0) {
      return;
    }

    onSearch(query);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
    >
      <label htmlFor="city-search" className="mb-2 block text-sm font-medium text-white">
        Buscar cidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="city-search"
          type="search"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Ex.: São Paulo"
          disabled={disabled}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-night-800/80 px-4 py-3 text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-accent-500 px-5 py-3 font-medium text-white transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
