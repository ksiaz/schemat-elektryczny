# Schemat jednokreskowy (SLD) — specyfikacja

**Data:** 2026-05-14
**Status:** zatwierdzona przez usera, przed implementacją
**Cel:** Dodać do edytora trzeci, niezależny rysunek — schemat jednokreskowy zgodny z PN-EN 60617 / PN-EN 61082-1, umożliwiający wykonanie dokumentacji do zgłoszenia mikroinstalacji PV w OSD (PGE/Tauron/Enea/Energa).

---

## 1. Definicja i konwencje (norma)

**Schemat jednokreskowy** (ang. *single-line / one-line diagram*, SLD) — uproszczona reprezentacja graficzna instalacji, w której wszystkie żyły obwodu (L1/L2/L3/N/PE lub DC+/DC−/PE) są zwinięte do **jednej linii**. Norma PN-EN 61082-1 określa dokumentację (tabliczka, projektant, data, skala, wersja), PN-EN 60617 / IEC 60617 — symbole graficzne.

**Reprezentacja liczby żył na linii:** w polskiej praktyce kompaktowa etykieta tekstowa obok kabla:
- `YDY 5×6 mm²` — typ × liczba żył × przekrój (standard),
- `YKY 3×2,5+1,5 mm²` — gdy PE/N cieńszy,
- `H1Z2Z2-K 1×6 mm²` — kabel solarny DC.

Liczba `5×` jest **podstawowym, wystarczającym** zapisem liczby żył. Ukośne kreski przecinające linię (każda = 1 żyła) są **wtórnym wizualnym duplikatem** tego samego — w MVP renderujemy obie warstwy z jednego źródła (`cores`).

**Reguła kardynalna:** liczba żył należy do **kabla (edge)**, nie do symbolu. MCB 3P ma własne 3 bieguny narysowane wewnętrznie w symbolu — ale kabel wychodzący może mieć 4 (`3L+N`) albo 5 (`3L+N+PE`) żył, zależnie od kabla. Aparaty łączone są **jedną kreską** o opisanej liczbie przewodników i odpowiednio symbolizowane.

**Praktyczna rola SLD vs MLD:**

| | Wielokreskowy (jest) | Jednokreskowy (dodajemy) |
|---|---|---|
| Linie obwodu | 5 osobnych (L1/L2/L3/N/PE) | 1 + anotacja |
| Cel | montaż, prefabrykacja rozdzielnicy | dokumentacja OSD, przegląd systemu |
| Skala | rozdzielnica / obwód | cały system |
| Wymóg PV | rzadko | **wymagany** przez OSD |

---

## 2. Decyzje produktowe (zatwierdzone)

1. **Anotacja liczby żył** = ukośne kreski auto-renderowane + etykieta tekstowa kabla (oba z `data.cores` edge'a).
2. **Zakres biblioteki MVP** = wariant **C** — PV ON-grid + hybryda, **18 symboli SLD**.
3. **Templates** = TAK, 3 sztuki: `onGrid1PhaseSld`, `onGrid3PhaseSld`, `hybridSld`.
4. **Model danych żył** = źródło na edge'u (cable), `cores: number`; symbol aparatu trzyma własną liczbę biegunów wewnętrznie w `parameters.poles`.
5. **Edge type** = pojedynczy `singleLineCable` — bez podziału na AC/DC (rozróżnienie przez `current` w etykiecie, kolor zawsze czarny).
6. **Routing** = tylko manual (waypoints).
7. **Orphan `singleLineMcb`** w obecnym sheecie wielokreskowym = zostawiamy dla wstecznej kompatybilności, oznaczamy deprecated w `CLAUDE.md`.

---

## 3. Architektura wysokopoziomowa

**Trzeci niezależny sheet `singleLine`** obok istniejących `schematic` (wielokreskowy) i `layout` (rzut).

```
projectStore (Zustand) ── activeSheet: 'schematic' | 'singleLine' | 'layout'
                       ├── nodes / edges                        (multi-line)
                       ├── singleLineNodes / singleLineEdges    ← nowe
                       ├── layoutNodes / layoutEdges
                       ├── schematicPast/Future
                       ├── singleLinePast/Future                ← nowe
                       └── layoutPast/Future
```

- **3 niezależne rysunki w jednym pliku projektu**, przełączane w toolbarze, każdy ma własne nodes/edges/historia/eksport PDF.
- **JSON projektu** rozszerzony o `singleLineNodes` + `singleLineEdges` z fallbackiem `?? []` przy `loadProject` (backward-compat).
- **Skróty (undo/redo/Delete)** routowane przez `activeSheet` — wzorzec już istnieje dla `layout`, kopiujemy 1:1.
- **Eksport PDF** = pojedynczy aktywny sheet → PDF (jak teraz). Batch PDF wszystkich 3 arkuszy = poza MVP.

---

## 4. Biblioteka symboli SLD (18 elementów)

Wszystkie pod `src/nodes/sld/`, prefix nodeType `sld*`, `parameters.poles` (1/2/3/4) gdzie zasadne. Handles top/bottom/left/right (rysowanie pionowe i poziome).

### AC (10):
| Designation | nodeType | Symbol SLD | Kluczowe parametry |
|---|---|---|---|
| — | `sldGridSource` | strzałka „z sieci" + etykieta | network (`~3/N/PE 400/230 V 50 Hz`) |
| ZK | `sldCableJunction` | prostokąt | label |
| P | `sldMeter` | ⊙ z `Wh` (1-kier) lub ⇄ (2-kier) | direction (1-way/2-way), phases (1/3) |
| TA | `sldCt` | ⊙ z ukośnikiem | ratio (`100/5A`) |
| Q | `sldMainSwitch` | rozłącznik izolacyjny | poles, In |
| F-PWP | `sldFireSwitch` | przycisk grzybkowy ⊗ | — |
| F | `sldMcb` | 1 styk + krzywa | poles, curve (B/C/D), In |
| F-RCD | `sldRcd` | trójkąt różnicowy | poles, type (A/B/F/B+), IΔn |
| F | `sldRcbo` | MCB+RCD combo | poles, curve, IΔn, type |
| F-SPD | `sldSpdAc` | strzałka z literą T | klasa (T1/T1+2/T2/T3), UC |

### DC + falownik + magazyn (6):
| Designation | nodeType | Symbol SLD | Parametry |
|---|---|---|---|
| E | `sldPvString` | symbol modułu z `n×` | n, Voc, Isc, Mpp |
| QS | `sldDcDisconnect` | rozłącznik DC | poles, In, Un |
| F | `sldFuseGpv` | bezpiecznik gPV | In, Un |
| F-SPD | `sldSpdDc` | SPD-DC | klasa (T1+2/T2), UC |
| U | `sldInverter` | □ z `=/∼` | typ (string/hybrid), P, MPPT |
| G | `sldBattery` | ogniwo galwaniczne | kWh, V, chemia |

### Uziemienie + granica (2):
| Designation | nodeType | Symbol | Parametry |
|---|---|---|---|
| — | `sldGround` | uziom (3 kreski) | RE |
| — | `sldOsdBoundary` | pionowa linia przerywana + etykieta | label (`Granica własności OSD`) |

**Reuse:** `busbar` (istniejący) — z prostszym renderingiem na SLD, jedna pogrubiona linia z etykietą napięcia.

**Razem:** 18 nowych symboli + 1 reuse szyny.

---

## 5. Edge `singleLineCable` — model + renderer

### Data model
```typescript
data: {
  cableType: string;        // 'YDY' | 'YKY' | 'YKXS' | 'NYM' | 'H1Z2Z2-K' | 'LgY' | <custom>
  cores: number;            // 1..7 — źródło prawdy dla kresek
  crossSection: number;     // mm² (główne żyły)
  peCrossSection?: number;  // mm² (gdy PE chudszy, np. 3×2,5+1,5)
  circuitId?: string;       // 'W1', 'O.1'
  length?: number;          // m (do spadku napięcia)
  current?: 'AC' | 'DC';    // wpływa tylko na format etykiety
}
```

### Renderer (jeden komponent, dwie warstwy z jednego źródła)
1. **Linia** czarna prosta lub ortogonalna z waypointami (manual routing — bazujemy na istniejącym `StraightLineEdge` + `DraggableWaypoint`).
2. **Pęczek ukośnych kresek** w połowie linii: `cores` sztuk, kąt 60°, długość 6 px, odstęp 2 px. Renderowane na ortogonalnym fragmencie; jeśli linia za krótka — fallback na samą etykietę (kreski pominięte).
3. **Etykieta tekstowa** obok kresek, auto-składana:
   - `YDY 5×6 mm²` (standard)
   - `YKY 3×2,5+1,5 mm²` (gdy `peCrossSection !== crossSection`)
   - `H1Z2Z2-K 1×6 mm²` (DC)
   - druga linia `W1` jeśli `circuitId` ustawiony
   - trzecia linia `L=12 m` jeśli `length` ustawiona

### PropertiesPanel dla edge'a SLD
Pola: `cableType` (combobox z presetami `YDY/YKY/YKXS/NYM/H1Z2Z2-K/LgY/+własny`), `cores` (1–7), `crossSection` (number), `peCrossSection` (opt), `circuitId` (text), `length` (opt). Zmiana którejkolwiek wartości → re-render etykiety + przeliczenie kresek (React Flow re-render via edge data update).

---

## 6. Sidebar + Toolbar + Canvas

### Toolbar
Przełącznik trzy-stanowy:
```
[ Schemat wielokreskowy ]  [ Schemat jednokreskowy ]  [ Lokalizacja ]
         schematic                singleLine                 layout
```
Mechanizm `setActiveSheet()` istnieje — dokładamy trzeci stan.

### Sidebar
- Trzeci zestaw `SINGLE_LINE_ELEMENT_DEFINITIONS` w `src/constants/singleLineElements.ts` — 18 wpisów (designation, nodeType, defaultLabel, parameters spec).
- `Sidebar.tsx` rozszerzony: gdy `activeSheet === 'singleLine'` zwraca SLD definitions.
- `dataTransfer` MIME: `application/sld-element` (osobny od `schematic-element` / `layout-element`).
- Nowe kategorie w `ElementCategory`: `'sldAc' | 'sldDc' | 'sldGrounding'` z headerami `Strona AC (SLD)` / `Strona DC (SLD)` / `Uziemienie + granica`.

### Canvas
Nowy `SingleLineCanvas.tsx` — bliźniaczy do `SchematicCanvas`:
- czyta `singleLineNodes/Edges` ze store,
- akceptuje drop `application/sld-element`,
- defaultowy `edgeType` przy łączeniu = `'singleLineCable'`,
- `nodeTypes` zarejestrowane = wyłącznie z prefixem `sld*` + reuse `busbar` (filtrowanie po nodeType).
- `routingMode` zafixowany na `manual` (toggle ukryty / wymuszony).

### App.tsx
Ternary `activeSheet === 'schematic' ? <SchematicCanvas/> : <LayoutCanvas/>` rozszerzony do switch z trzeciego case'em `singleLine`.

### PropertiesPanel
Routuje już przez `activeSheet`. Dla SLD-edge: nowy case `edge.type === 'singleLineCable'` z formularzem opisanym w §5.

---

## 7. Templates SLD (3 sztuki)

Lokalizacja: `src/templates/sld/` — pliki `onGrid1Phase.ts`, `onGrid3Phase.ts`, `hybrid.ts`, każdy zwraca `{ nodes, edges }` dla sheetu `singleLine`. Layout: zawsze top-down, siatka pionowa 60–80 px między aparatami.

### `onGrid1PhaseSld` — PV 1-fazowa ON-grid (~6 kW)
```
GridSource (~/N/PE 230V)
  │ YKY 3×10 mm²  W0
ZK — granica OSD ┄┄┄
  │ YKY 3×10 mm²
Licznik 2-kier (1P)
  │ YDY 3×6 mm²
PWP (F-PWP)
  │
Q1 — rozłącznik główny (1P)
  │
Szyna AC RG (1P+N+PE)
  ├─ F1 MCB B16/1P + RCD typ A 30 mA  →  obwody odbiorcze
  └─ F-SPD T2 (1P+N)
  │ YDY 3×6 mm²  W-PV
RPV-AC: F-MCB B16/1P + F-SPD T2
  │
Inwerter (string 1P)  ═══ DC ═══
  │ H1Z2Z2-K 1×6 mm²
QS-DC + F gPV + F-SPD-DC T1+2
  │
PV String (n×Mpp)
                       ⏚ Uziom RE
```

### `onGrid3PhaseSld` — PV 3-fazowa ON-grid (~10 kW)
Jak wyżej, ale: GridSource `~3/N/PE 400/230`, kabel `YKY 5×10 mm²`, licznik 3-fazowy 2-kier, MCB B16/3P, RCD typ A 30 mA 4P, RPV-AC `F MCB C20/3P` + SPD-AC T2 4P, inwerter 3-fazowy string, 2 stringi DC.

### `hybridSld` — PV 3-fazowa + magazyn
Jak 3-fazowa + dodatkowo: inwerter hybrydowy `U =/∼` dwukierunkowy, bateria `G LiFePO4 10 kWh`, drugi licznik (`P pomiar PV` po stronie odbiorcy). Transfer switch backup — poza MVP.

### Wczytanie templatu
- `TemplateDialog.tsx` rozszerzony o sekcję „Szablony jednokreskowe" — widoczna gdy `activeSheet === 'singleLine'`.
- Wczytanie zastępuje `singleLineNodes/Edges` z potwierdzeniem (zgodnie z obecnym wzorcem dla wielokreskowych templatów).

### ID i etykiety
- Każdy node: `id` przez `crypto.randomUUID()` (jak teraz).
- `label` przez `generateNextLabel(designation)` — `Q1`, `F1`, `F-SPD1` itd.

---

## 8. Eksport PDF

- Reuse `utils/pdfExport` — eksport aktywnego sheetu, API bez zmian.
- Ramka A4/A3/A2 + tabliczka PN-EN 61082-1 — działa, bez zmian.
- Default `projectInfo.drawingNumber` przy pierwszym eksporcie z trybu SLD = `E-01-SLD` (osobna numeracja). Opcjonalne — tylko jeśli pole puste.
- Skala: `bez skali` (standard dla SLD).
- Batch eksport wszystkich 3 sheetów do jednego PDF = poza MVP.

---

## 9. Świadomie pomijamy w MVP (YAGNI)

1. Automatyczna konwersja MLD ↔ SLD (mapping table — osobna duża funkcja).
2. Walidator zgodności (SPD przed/za licznikiem, RCD typ B dla PV po stronie AC, PE na każdym obwodzie) — osobny etap.
3. Eksport DWG (osobny stack: dxf-writer).
4. Stycznik, monitor faz, smart meter, EV charger, transfer switch w SLD — poza zakresem C; iteracyjnie później.
5. Batch PDF wszystkich 3 arkuszy do jednego dokumentu.
6. Auto-numeracja obwodów `W1/W2/...` przy łączeniu kablem — na razie manual `circuitId`.

---

## 10. Pliki — high-level scope

**Nowe:**
- `src/nodes/sld/*.tsx` × 18 (jeden komponent symbolu na plik)
- `src/edges/SingleLineCableEdge.tsx`
- `src/components/canvas/SingleLineCanvas.tsx`
- `src/constants/singleLineElements.ts`
- `src/templates/sld/onGrid1Phase.ts`
- `src/templates/sld/onGrid3Phase.ts`
- `src/templates/sld/hybrid.ts`

**Modyfikacje:**
- `src/store/projectStore.ts` — `singleLineNodes/Edges`, `singleLinePast/Future`, akcje, save/load fallback
- `src/types/index.ts` — `activeSheet` union, `ElementCategory` extension
- `src/nodes/index.ts` — rejestracja 18 nodeTypes
- `src/edges/index.ts` — rejestracja `singleLineCable`
- `src/components/sidebar/Sidebar.tsx` — gałąź SLD + nowe kategorie
- `src/components/toolbar/Toolbar.tsx` — przełącznik 3-stanowy
- `src/components/toolbar/TemplateDialog.tsx` — sekcja SLD templates
- `src/components/properties/PropertiesPanel.tsx` — formularz edge'a SLD
- `src/App.tsx` — switch trzech sheetów
- `CLAUDE.md` — sekcja „Schemat jednokreskowy", deprecate `singleLineMcb`

---

## 11. Weryfikacja (manualna, projekt bez framework testowego)

- Stworzyć projekt: szablon `onGrid3PhaseSld` → eksport PDF → wzrokowa weryfikacja zgodności z normą.
- Round-trip: zapis JSON → reload → identyczny rysunek (nodes/edges, parametry, etykiety).
- Backward-compat: wczytanie starego JSON bez `singleLineNodes` → brak crash, puste SLD.
- Wszystkie 3 templates renderują się bez nakładających się symboli, hash marks zgadzają się z `cores`.
- `npm run build` (tsc -b + vite build) zielone.
- `npm run lint` zielone.

---

## 12. Źródła / normy

- PN-EN 61082-1 — dokumentacja techniczna (tabliczka, ramki, oznaczenia)
- PN-EN 60617 / IEC 60617 — symbole graficzne
- PN-HD 60364-7-712 — instalacje fotowoltaiczne
- PN-EN 61643-11 — ograniczniki przepięć SPD
- IEC 81346-2 — oznaczenia literowe elementów
- IEC 61175 — oznaczenia sygnałów

Materiały referencyjne (praktyka PL):
- [Schemat jednokreskowy instalacji PV — jak go stworzyć i odczytać (Stachursky Sun Energy)](https://stachurskysunenergy.pl/blog/schemat-jednokreskowy-instalacji-pv-jak-go-stworzyc-i-odczytac/)
- [Schemat mikroinstalacji fotowoltaicznej — 10 niezbędnych elementów (Maciej Dolata)](https://blog.maciejdolata.com/fotowoltaika/schemat-mikroinstalacji-fotowoltaicznej-10-niezbednych-elementow/)
- [Praktyczne wskazówki tworzenia schematów jednokreskowych (EPLAN)](https://www.eplan.pl/firma/nowosci/praktyczne-wskazowki-dotyczace-tworzenia-schematow-jednokreskowych/)
- [Symbole PN-EN 60617 (Viessmann dokument referencyjny)](https://www.viessmann.edu.pl/wp-content/uploads/RT4_Zalacznik_ELEKTRYKA_Symbole_graficzne-_wg_PN-EN-60617.pdf)
