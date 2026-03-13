# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cel projektu

Edytor schematów elektrycznych instalacji fotowoltaicznych (PV) — narzędzie webowe dla instalatorów i projektantów PV do tworzenia schematów wielokreskowych (L1/L2/L3/N/PE) z biblioteką symboli zgodną z PN-EN 60617, eksportem do PDF A4 poziomego.

## Commands

- `npm run dev` — start dev server with HMR
- `npm run build` — type-check with `tsc -b` then build with Vite
- `npm run lint` — run ESLint
- `npm run preview` — preview production build locally

## Stack technologiczny

- **React + TypeScript** + **Vite**
- **React Flow (xyflow)** — silnik canvas, węzły, krawędzie
- **Zustand** — globalny stan projektu
- **jsPDF + svg2pdf.js** — eksport PDF A4
- **Tailwind CSS** — stylowanie UI

## Struktura projektu

```
src/
├── components/
│   ├── canvas/          # Obszar roboczy (React Flow wrapper)
│   ├── sidebar/         # Panel boczny z biblioteką elementów
│   ├── properties/      # Panel właściwości zaznaczonego elementu
│   ├── toolbar/         # Pasek narzędzi (zapis, eksport, undo/redo)
│   └── drawing-frame/   # Ramka rysunkowa A4 (tabelka)
├── nodes/               # Węzły React Flow – symbole elektryczne SVG
│   ├── dc/              # Elementy strony DC
│   ├── ac/              # Elementy strony AC
│   ├── enclosures/      # Rozdzielnice (kontenery)
│   └── wiring/          # Szyny, przewody
├── store/               # Zustand store (projekt, historia)
├── types/               # TypeScript typy
├── constants/           # Definicje elementów, kolory żył
└── utils/               # Eksport PDF, helpers
```

## Normy

| Norma | Zastosowanie |
|-------|-------------|
| PN-EN 60617 | Symbole graficzne na schematach |
| PN-HD 60364-7-712 | Instalacje fotowoltaiczne |
| PN-EN 61082-1 | Dokumentacja techniczna, ramki |
| PN-EN 61643-11 | Ograniczniki przepięć SPD |
| IEC 81346-2 | Oznaczenia literowe elementów |

## Kolory żył (norma)

```typescript
export const WIRE_COLORS = {
  L1: '#8B4513',   // brązowy
  L2: '#1a1a1a',   // czarny
  L3: '#808080',   // szary
  N:  '#0000CD',   // niebieski
  PE: '#228B22',   // zielono-żółty (striped)
  DC_PLUS:  '#FF0000',  // czerwony DC+
  DC_MINUS: '#1a1a1a',  // czarny DC-
};
```

## Biblioteka symboli

### Strona DC
- `pv_panel` — Panel PV (E): Model, Pmax, Voc, Isc, ilość w stringu
- `pv_string` — String PV: Liczba paneli, Vstring
- `dc_disconnect` (QS) — Rozłącznik DC: Un, In
- `fuse_gpv` (F) — Bezpiecznik gPV: In, Un
- `spd_dc` (F-SPD) — Ochronnik przepięć DC: Typ T1/T2/T1+2, UC, In, Imax
- `mc4_connector` (X) — Złącze MC4
- `dc_busbar` — Szyna DC

### Falownik / magazyn
- `inverter` (U) — Falownik DC/AC: Model, moc, MPPT, typ
- `battery` (G) — Magazyn energii: Model, pojemność, napięcie

### Strona AC
- `rcd` (F-RCD) — Wyłącznik różnicowoprądowy: Typ A/B/F/B+, In, IΔn, bieguny
- `mcb` (F) — Wyłącznik nadprądowy: Krzywa B/C/D, In, bieguny
- `rcbo` (F) — Wyłącznik RCD+MCB
- `spd_ac` (F-SPD) — Ochronnik przepięć AC: Typ, konfig, UC
- `meter` (P) — Licznik energii kWh
- `ct_meter` (TA) — Przekładnik prądowy
- `ac_disconnect` (QS) — Rozłącznik AC
- `contactor` (KM) — Stycznik
- `main_switch` (Q) — Wyłącznik główny

### Uziemienie i PE
- `ground_rod` — Uziom: RE, typ
- `pe_busbar` / `pen_busbar` / `n_busbar` — Szyny PE/PEN/N
- `equipotential` — Połączenie wyrównawcze

### Rozdzielnice (kontenery — GroupNode w React Flow)
- `main_enclosure` (RG) — Rozdzielnica główna
- `sub_enclosure` (RP) — Podrozdzielnica
- `pv_dc_enclosure` (RPV-DC) — Rozdzielnica DC PV
- `pv_ac_enclosure` (RPV-AC) — Rozdzielnica AC PV
- `cable_junction` (ZK) — Złącze kablowe

### Linie i szyny
- `multiline_ac` — Magistrala AC wielokreskowa (L1+L2+L3+N+PE, 5 linii, odstęp 3px)
- `multiline_dc` — Magistrala DC (DC++DC-+PE)
- `single_line` / `cable` — Przewód jednożyłowy / kabel z opisem przekroju

## Schemat wielokreskowy — zasady rysowania

Magistrala AC = 5 równoległych linii (L1 brązowy, L2 czarny, L3 szary, N niebieski, PE zielono-żółty). Połączenie elementu z magistralą: linia prostopadła z oznaczeniem fazy.

## Dobór SPD — logika

| Lokalizacja | Bez piorunochronu | Z piorunochronem |
|------------|------------------|-----------------|
| Rozdzielnica główna AC | T2 | T1 lub T1+2 |
| Rozdzielnica PV AC | T2 | T1 lub T1+2 |
| Strona DC PV | T2-PV (≥5kA) | T1-PV (≥12,5kA) |
| Podrozdzielnica | T2 | T2 |
| Przy urządzeniu | T3 | T3 |

## Eksport PDF A4

- Format: A4 poziomy (297×210 mm), marginesy 10 mm
- Ramka rysunkowa z tabelką (nazwa projektu, nr rysunku, rewizja, projektant, data, skala, logo)
- Biblioteka: jsPDF + svg2pdf.js

## Stan projektu (Zustand store)

```typescript
interface ProjectStore {
  projectName: string;
  projectInfo: ProjectInfo;
  nodes: Node[];
  edges: Edge[];
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  undo: () => void;
  redo: () => void;
  saveProject: () => void;       // JSON do localStorage
  loadProject: (json: string) => void;
  exportPDF: () => void;
}
```

## Konwencje kodowania

- Komponenty: PascalCase (`InverterNode.tsx`)
- Hooki: camelCase z `use` (`useProjectStore.ts`)
- Typy: PascalCase z sufiksem (`InverterNodeProps`)
- Stałe: SCREAMING_SNAKE_CASE (`WIRE_COLORS`)
- Pliki testów: `*.test.ts`
- Każdy węzeł React Flow w osobnym pliku w `src/nodes/`
- Symbole SVG zgodne z PN-EN 60617 — jako komponenty React

## Plan etapów

1. **Fundament** — Konfiguracja (Tailwind, React Flow, Zustand), canvas z siatką, sidebar drag&drop, 5 pierwszych węzłów (falownik, RCD, MCB, szyna AC, uziom), połączenia
2. **Rozdzielnice** — GroupNode kontenery, szyna DIN, liczenie modułów, zagnieżdżanie
3. **Magistrala wielokreskowa** — Custom Edge 5-liniowy, odgałęzienia, opisy przewodów
4. **Panel właściwości** — Dwuklik → panel, dynamiczne pola wg typu, walidacja
5. **Kompletna biblioteka** — Wszystkie elementy DC i AC, podpowiedź doboru SPD
6. **Eksport** — Ramka A4, PDF z autoskalowaniem, SVG, zapis/wczytywanie JSON
7. **Szablony** — Instalacja 3-faz. ON-grid, 1-faz. ON-grid, hybryda z magazynem
