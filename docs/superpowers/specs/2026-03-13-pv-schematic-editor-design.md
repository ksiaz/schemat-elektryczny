# Edytor Schematow Elektrycznych PV — Design Spec

Data: 2026-03-13

---

## Cel projektu

Aplikacja webowa do tworzenia profesjonalnych schematow elektrycznych instalacji fotowoltaicznych, zgodnych z polskimi normami. Narzedzie dla instalatorow i projektantow PV.

---

## Decyzje projektowe

| Kwestia | Decyzja |
|---------|---------|
| React | 19 (juz zainstalowany, kompatybilny z @xyflow/react) |
| Jezyk interfejsu | Tylko polski |
| Zapis danych | Offline (localStorage + JSON), architektura gotowa na backend |
| Priorytet szablonow | Bez priorytetu — 1-faz, 3-faz, hybryda rowno wazne |
| Polaczenia | Inteligentne trasowanie (domyslne) + reczne punkty zalamania (do wyboru) |
| Formaty arkuszy | A4, A3, A2 z ramka rysunkowa; PDF z mozliwoscia zoom |
| Czytelnosc | Druk + ekran — odpowiednie grubosci linii i fonty |

---

## Stack technologiczny

- **React 19 + TypeScript** (strict mode, brak `any`)
- **Vite 8** — bundler + dev server
- **@xyflow/react** — silnik canvas, wezly, krawedzie
- **Zustand** — globalny stan projektu z undo/redo
- **jsPDF + svg2pdf.js** — eksport PDF
- **Tailwind CSS** — stylowanie UI

---

## Architektura — dwa moduly

### Modul 1: Edytor schematow elektrycznych (glowny)

Pelny edytor schematow wielokreskowych z biblioteka symboli zgodna z PN-EN 60617.

**Layout:**
```
+-----------------------------------------------------+
|  TOOLBAR (zapis, eksport, undo/redo, nazwa projektu) |
+--------------+--------------------------+------------+
|   SIDEBAR    |        CANVAS            | PROPERTIES |
|  (biblioteka |    (React Flow +         |  (panel    |
|   elementow) |     siatka + zoom)       |  wlasciw.) |
+--------------+--------------------------+------------+
```

**Canvas:**
- Predefiniowany format arkusza (A4/A3/A2) z ramka rysunkowa
- Siatka z pan/zoom
- Drag & drop elementow z Sidebar
- Dwuklik na element otwiera panel Properties

**Polaczenia:**
- Tryb automatyczny: inteligentne trasowanie (ortogonalne, omijanie elementow)
- Tryb reczny: uzytkownik klika punkty zalamania
- Przelacznik trybu w toolbarze

### Modul 2: Widok przekroju / lokalizacji (osobna zakladka)

Uproszczony rysunek montazowy — zarys budynku z naniesionymi trasami kablowymi i lokalizacjami urzadzen.

**Elementy:**
- Zarys budynku (sciany, dach, pietra) — proste ksztalty
- Trasy kablowe: linie z opisem, mozliwosc zmiany koloru
- Ikony urzadzen: falownik, rozdzielnice, uziom, ladowarka EV
- Panele PV na dachu
- Nie CAD — czytelny schemat dla klienta i ekipy montazowej

**Osobna zakladka** — nie wplywa na funkcjonalnosci modulu schematow.

**Biblioteka elementow modulu 2:**
| ID | Element | Opis |
|----|---------|------|
| `building_outline` | Zarys budynku | Prostokat z mozliwoscia edycji ksztaltu |
| `roof_outline` | Zarys dachu | Wielokat (dwuspadowy, plaski, itp.) |
| `floor_line` | Linia pietra | Pozioma linia z etykieta |
| `wall_line` | Sciana | Linia z gruboscia |
| `cable_route` | Trasa kablowa | Linia z opisem, zmiana koloru |
| `pv_panel_layout` | Panel PV (widok z gory) | Prostokat z wymiarami |
| `device_icon_inverter` | Ikona falownika | Uproszczona ikona z etykieta |
| `device_icon_enclosure` | Ikona rozdzielnicy | Prostokat z oznaczeniem |
| `device_icon_ground` | Ikona uziomu | Symbol uziomu |
| `device_icon_charger` | Ikona ladowarki EV | Uproszczona ikona |

---

## Biblioteka symboli

### Strona DC — schemat jednokreskowy (styl SolarEdge)

Strona DC rysowana jako schemat jednokreskowy:
- Jedna czerwona linia na string (nie wielokreskowy DC+/DC-)
- Kazdy string oznaczony etykieta: PV1, PV2, PV3 itd.
- Panele jako uproszczony symbol na koncu linii z opisem (ilosc x model)
- Optymalizatory (jesli SolarEdge) jako symbole na linii stringu
- Czytelny, kompaktowy schemat — wzorowany na dokumentacji SolarEdge

| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `pv_string` | String PV (linia z etykieta PV1, PV2...) | — | Liczba paneli, model, Vstring, Pstring |
| `pv_panel_symbol` | Symbol paneli na koncu stringu | E | Ilosc, Model, Pmax, Voc, Isc |
| `optimizer` | Optymalizator (opcjonalny, SolarEdge) | — | Model, Pmax, Vout |
| `dc_disconnect` | Rozlacznik DC | QS | Un, In |
| `fuse_gpv` | Bezpiecznik gPV | F | In, Un |
| `spd_dc` | Ochronnik przepiec DC | F-SPD | Typ T1/T2/T1+2, UC, In, Imax |
| `mc4_connector` | Zlacze MC4 | X | — |

### Falownik / magazyn
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `inverter` | Falownik DC/AC | U | Model, moc, MPPT, typ (ON/Hybryda/Off) |
| `battery` | Magazyn energii | G | Model, pojemnosc, napiecie |

### Strona AC
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `rcd` | Wylacznik roznicowopradowy | F-RCD | Typ A/B/F/B+, In, IDn, bieguny |
| `mcb` | Wylacznik nadpradowy | F | Krzywa B/C/D, In, bieguny |
| `rcbo` | Wylacznik RCD+MCB | F | Jak RCD + MCB |
| `spd_ac` | Ochronnik przepiec AC | F-SPD | Typ, konfig, UC |
| `meter` | Licznik energii kWh | P | Model, typ, dwukierunkowy |
| `ct_meter` | Przekladnik pradowy | TA | Przekladnia |
| `ac_disconnect` | Rozlacznik AC | QS | In, bieguny |
| `contactor` | Stycznik | KM | In, cewka |
| `main_switch` | Wylacznik glowny | Q | In, bieguny |

### Ladowarki EV
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `ev_charger` | Ladowarka EV / wallbox | — | Model, moc, typ (1-faz/3-faz), gniazdo/kabel |
| `ev_mcb` | Wylacznik nadpradowy EV | F | Krzywa, In, bieguny |
| `ev_rcd` | Wylacznik RCD typ B dla EV | F-RCD | Typ B/B+, In, IDn |

### Przelaczniki zasilania (off-grid / hybryda)
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `transfer_switch` | Przelacznik zasilania SZR | Q | Typ (reczny/auto), In, bieguny |
| `ats` | Przelacznik automatyczny ATS | QA | In, czas przelaczenia |

### Uziemienie i PE
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `ground_rod` | Uziom | — | RE, typ |
| `pe_busbar` | Szyna PE | PE | — |
| `pen_busbar` | Szyna PEN | PEN | — |
| `n_busbar` | Szyna N | N | — |
| `equipotential` | Polaczenie wyrownawcze | — | — |

### Rozdzielnice (kontenery — GroupNode)
| ID | Element | Oznaczenie | Parametry |
|----|---------|-----------|-----------|
| `main_enclosure` | Rozdzielnica glowna | RG | Moduly, IP |
| `sub_enclosure` | Podrozdzielnica | RP | j.w. |
| `pv_dc_enclosure` | Rozdzielnica DC PV | RPV-DC | j.w. |
| `pv_ac_enclosure` | Rozdzielnica AC PV | RPV-AC | j.w. |
| `cable_junction` | Zlacze kablowe | ZK | Typ, prad |

### Linie i szyny
| ID | Element |
|----|---------|
| `multiline_ac` | Magistrala AC wielokreskowa (L1+L2+L3+N+PE) |
| `dc_line` | Linia DC jednokreskowa (czerwona, z etykieta stringu) |
| `single_line` | Przewod jednoylowy |
| `cable` | Kabel (z opisem przekroju) |

---

## Normy

| Norma | Zastosowanie |
|-------|-------------|
| PN-EN 60617 | Symbole graficzne na schematach |
| PN-HD 60364-7-712 | Instalacje fotowoltaiczne |
| PN-EN 61082-1 | Dokumentacja techniczna, ramki |
| PN-EN 61643-11 | Ograniczniki przepiec SPD |
| IEC 81346-2 | Oznaczenia literowe elementow |

---

## Kolory zyl (norma)

```typescript
export const WIRE_COLORS = {
  L1: '#808080',   // szary
  L2: '#1a1a1a',   // czarny
  L3: '#8B4513',   // brazowy
  N:  '#0000CD',   // niebieski
  PE: '#228B22',   // zielono-zolty (striped)
  DC:  '#FF0000',  // czerwony — schemat DC jednokreskowy
};
```

---

## Dobor SPD — logika

| Lokalizacja | Bez piorunochronu | Z piorunochronem |
|------------|------------------|-----------------|
| Rozdzielnica glowna AC | T2 | T1 lub T1+2 |
| Rozdzielnica PV AC | T2 | T1 lub T1+2 |
| Strona DC PV | T2-PV (>=5kA) | T1-PV (>=12,5kA) |
| Podrozdzielnica | T2 | T2 |
| Przy urzadzeniu | T3 | T3 |

---

## Schemat wielokreskowy — zasady

Magistrala AC = 5 rownoleglych linii z odstepem 1mm w przestrzeni canvas (skaluje sie z zoomem, czytelne zarowno na ekranie jak i w druku):
- L1 brazowy, L2 czarny, L3 szary, N niebieski, PE zielono-zolty
- Grubosc linii: 0.35mm (standard dla schematow elektrycznych)

Polaczenie elementu z magistrala: linia prostopadla z oznaczeniem fazy.

---

## Ramka rysunkowa

| Pole | Opis |
|------|------|
| Nazwa projektu | Inwestycja / adres |
| Nr rysunku | np. E-01 |
| Rewizja | Rev. A |
| Projektant | Imie, nazwisko |
| Data | DD.MM.RRRR |
| Skala | 1:1 / bez skali |
| Format | A4 / A3 / A2 |
| Logo firmy | Opcjonalne |

---

## Eksport

### PDF
- Formaty: A4 / A3 / A2 poziomy
- Marginesy: 10 mm
- Ramka rysunkowa zawsze widoczna
- PDF z mozliwoscia zoom
- Legenda symboli opcjonalna (dodatkowa strona)
- Biblioteka: jsPDF + svg2pdf.js

### SVG
- Eksport do pliku SVG z osadzonymi stylami (kolory, grubosci linii)
- Fonty zamienione na sciezki (path) dla przenoszalnosci
- Metadane: nazwa projektu, data, rewizja w komentarzu SVG

---

## Stan projektu (Zustand store)

```typescript
type SheetFormat = 'A4' | 'A3' | 'A2';

interface ProjectInfo {
  projectName: string;       // Inwestycja / adres
  drawingNumber: string;     // np. E-01
  revision: string;          // Rev. A
  designer: string;          // Imie, nazwisko
  date: string;              // DD.MM.RRRR
  scale: string;             // 1:1 / bez skali
  format: SheetFormat;
  companyLogo?: string;      // base64 lub URL
}

// Pelny snapshot stanu modulu — prostota nad wydajnoscia
// (dla duzych projektow mozna pozniej zoptymalizowac na diffy)
interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
}

interface ProjectStore {
  // Projekt
  projectName: string;
  projectInfo: ProjectInfo;
  activeSheet: 'schematic' | 'layout';

  // Format arkusza per modul
  schematicFormat: SheetFormat;
  layoutFormat: SheetFormat;

  // Schemat (modul 1)
  nodes: Node[];
  edges: Edge[];

  // Przekroj/lokalizacja (modul 2)
  layoutNodes: Node[];
  layoutEdges: Edge[];

  // Historia — osobna per modul
  schematicPast: HistoryEntry[];
  schematicFuture: HistoryEntry[];
  layoutPast: HistoryEntry[];
  layoutFuture: HistoryEntry[];

  // Akcje
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: (json: string) => void;
  exportPDF: () => void;
}

// Abstrakcja zapisu — localStorage na start, backend pozniej
interface StorageAdapter {
  save(projectId: string, data: string): Promise<void>;
  load(projectId: string): Promise<string | null>;
  list(): Promise<string[]>;
  delete(projectId: string): Promise<void>;
}
```

**Auto-zapis:** co 30 sekund przy zmianach (dirty flag) + ostrzezenie `beforeunload` przy niezapisanych zmianach. Fallback na eksport JSON gdy localStorage pelny (limit ~5MB).

---

## Konwencje kodowania

- Komponenty: PascalCase (`InverterNode.tsx`)
- Hooki: camelCase z `use` (`useProjectStore.ts`)
- Typy: PascalCase z sufiksem (`InverterNodeProps`)
- Stale: SCREAMING_SNAKE_CASE (`WIRE_COLORS`)
- Pliki testow: `*.test.ts`
- Kazdy wezel React Flow w osobnym pliku w `src/nodes/`
- Symbole SVG zgodne z PN-EN 60617 — jako komponenty React
- Komentarze po polsku
- Max ~150 linii na plik (wytyczna, nie twardy limit — zlozony wezel SVG moze przekroczyc; wtedy wydzielic SVG do osobnego pliku)
- TypeScript strict mode, brak `any`
- Skroty klawiaturowe: Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+S (zapis), Ctrl+C/V (kopiuj/wklej elementy), Delete (usun zaznaczone), Ctrl+A (zaznacz wszystko)
- Platforma docelowa: desktop (przegladarka), bez wsparcia mobile/tablet w pierwszej wersji

---

## Plan etapow

### Etap 1 — Fundament
- Konfiguracja Tailwind, React Flow, Zustand
- Canvas z siatka i pan/zoom, format arkusza A4
- Sidebar z lista elementow (drag & drop)
- 5 pierwszych wezlow: falownik, RCD, MCB, szyna AC, uziom
- Podstawowe polaczenia

### Etap 2 — Rozdzielnice
- GroupNode kontenery (rozdzielnice)
- Szyna DIN wewnatrz
- Automatyczne liczenie modulow
- Zagniezdzone rozdzielnice

### Etap 3 — Magistrala wielokreskowa
- Custom Edge dla L1/L2/L3/N/PE (5 linii w kolorach)
- Odgalezienia od magistrali
- Opis przewodow (przekroj, typ, dlugosc)

### Etap 4 — Panel wlasciwosci
- Dwuklik otwiera panel
- Dynamiczne pola wg typu elementu
- Walidacja parametrow

### Etap 5 — Kompletna biblioteka
- Wszystkie elementy DC i AC
- Ladowarki EV (wallbox, zabezpieczenia)
- Przelaczniki zasilania (SZR, ATS)
- Podpowiedz doboru SPD

### Etap 6 — Polaczenia zaawansowane
- Inteligentne trasowanie (omijanie elementow)
- Tryb reczny z punktami zalamania
- Przelacznik trybu w toolbarze

### Etap 7 — Modul przekroju / lokalizacji
- Osobna zakladka
- Zarys budynku (sciany, dach)
- Trasy kablowe z opisem i zmiana koloru
- Ikony urzadzen (falownik, rozdzielnice, uziom, ladowarka)
- Panele PV na dachu

### Etap 8 — Eksport i zapis
- Ramka rysunkowa A4/A3/A2
- Eksport PDF z autoskalowaniem i zoom
- Eksport SVG
- Zapis/wczytywanie JSON (localStorage + plik)
- StorageAdapter (abstrakcja gotowa na backend)

### Etap 9 — Szablony
- Instalacja 3-faz. ON-grid
- Instalacja 1-faz. ON-grid
- Hybryda z magazynem energii
- Instalacja z ladowarka EV
