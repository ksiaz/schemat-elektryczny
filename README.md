# Edytor Schematów Elektrycznych PV

Aplikacja webowa do tworzenia schematów elektrycznych instalacji fotowoltaicznych.

## Uruchomienie

```bash
git clone https://github.com/ksiaz/schemat-elektryczny.git
cd schemat-elektryczny
npm install
npm run dev
```

Otwórz http://localhost:5173 w przeglądarce.

## Zapis i przenoszenie projektów

- **Ctrl+S** — szybki zapis do przeglądarki (localStorage)
- **JSON** — eksport projektu do pliku (bezpieczna kopia)
- **Wczytaj** — import projektu z pliku JSON
- **PDF / JPG / SVG** — eksport do wydruku

Przenosisz projekt między komputerami: eksportuj JSON → wczytaj na drugim.

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Stack

React 19, TypeScript, Vite 8, @xyflow/react, Zustand, Tailwind CSS
