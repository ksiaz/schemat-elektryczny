# Zasady czytelności schematu jednokreskowego (SLD) — research

Źródło: deep-research (IEC 61082-1:2014, IEC 60617, ISO 81714-1, ISO 3098-1, EPLAN,
NECA 100, yFiles, Wikipedia). 20 twierdzeń potwierdzonych adwersaryjnie (2/3 głosów),
5 obalonych. Wartości w **mm = wymiary papierowe** (ISO 216) — w edytorze trzeba je
przeskalować do px przez wspólny współczynnik px/mm, zachowując PROPORCJE.

## Rodzina norm
- **IEC 61082-1:2014** — prezentacja dokumentów elektrotechnicznych: szerokości linii (5.10),
  fonty (5.11), rozmiar symboli (5.12.2), orientacja (5.12.3), czytelność (5.1),
  orientacja tekstu (5.2), oznaczanie obiektów (5.20). Rys. 45/46 = umiejscowienie oznaczeń.
- **IEC 60617** — geometria symboli; moduł projektowy **M = 2.5 mm**.
- **ISO 81714-1** — szerokość linii symbolu = **M/10** (= 0.25 mm), znaki i linie tą samą wagą.
- **ISO 3098-1** — szereg wysokości tekstu.
- IEC 60848 (GRAFCET) — nie wniósł reguł czytelności; pomijamy.

## Reguły wprost implementowalne

### 1. Rozmiar symboli i siatka
- Symbole projektowane na module **M = 2.5 mm**; bounding box = mała całkowita wielokrotność M.
- Powiększanie symbolu — krokami znormalizowanymi (IEC 61082-1 rys. 12), nie dowolnie.
- **Siatka EPLAN „C" = 4 mm**, krok przyłączy symboli wielobiegunowych = **8 mm** (= 2× siatka).
  Reguła kciuka: siatka = połowa rozstawu punktów przyłączeniowych. (de-facto CAD, nie IEC.)

### 2. Umiejscowienie oznaczeń (Q1, F1…) — BEZ kolizji z przewodami
- **NAD** liniami poziomymi, **NA LEWO** od linii pionowych, wzdłuż linii (IEC 61082-1 rys. 45/46).
- Szablony rozmieszczenia (property arrangements) używać bez zmian; odstępować TYLKO dla
  rozwiązania kolizji / wyjścia tekstu poza symbol (EPLAN Data Standard).
- Tekst **poziomy, lewo→prawo, stała wysokość**; przy kolizji — linia odniesienia (leader),
  NIE obracać etykiety i NIE rzucać tekstu na przewód. (Bezwzględny zakaz obrotu OBALONY —
  tekst może iść wzdłuż pionowego przewodu, ale preferencja = poziomo.)

### 3. Wagi linii
- Szerokość linii symbolu = **M/10 = 0.25 mm**; znaki i linie symbolu tą samą wagą (ISO 81714-1).
- Szereg szerokości (ISO 128-20 / 9175-1, krok √2): 0.13, 0.18, **0.25, 0.35, 0.5**, 0.7, 1.0, 1.4, 2.0 mm.
- Hierarchia: treść elektryczna (symbole + połączenia) **najciemniejsza/najgrubsza**; tło/architektura
  cieniej. Stosunek dwóch sąsiednich wag **≥ 2:1** (ISO 81714-1).

### 4. Typografia
- Wysokości tekstu (ISO 3098-1, krok √2): **1.8, 2.5, 3.5, 5**, 7, 10, 14, 20 mm.
  Dla schematów typowo **2.5 / 3.5 / 5 mm**. (2.8 mm z 1974 — przestarzałe, nie używać.)
- Odstęp między znakami **≥ 2× szerokość kreski** liter (ISO 3098-1, 4.2).
- Szerokość kreski liter = **h/10** (ISO 3098-5). Font: ISO 3098 / ISOCP (AutoCAD).

### 5. Prowadzenie połączeń
- **Tylko kąty proste** (poziom/pion) — czytelna siatka, minimum skrzyżowań (IEC 61082-1 rys. 36/37).
  Przekątne = świadomy wyjątek (np. rotacja faz).
- Połączenie = **kropka/blob** na skrzyżowaniu. Skrzyżowanie BEZ połączenia: czyste przejście
  bez kropki lub półkole „przeskoku" (hop).
- Skrzyżowania 4-drożne **rozsuwać na dwa złącza T** (nowoczesny zalecany styl), zamiast
  niejednoznacznego krzyża 4-drożnego.

## Zastrzeżenia
- Wartości 4 mm / 8 mm to praktyka EPLAN, nie norma IEC.
- Wszystkie mm = wymiary papieru; w edytorze wybrać px/mm i trzymać proporcje
  (linia symbolu = M/10, odstęp znaków = 2× kreska, krok przyłączy = 2× siatka).
- Reguły dotyczą głównie IEC 61082-1 + 60617 + ISO 81714 + ISO 3098.
