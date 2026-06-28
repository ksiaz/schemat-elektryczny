// Tokeny stylu CAD dla symboli schematu jednokreskowego (SLD).
// Jedno zrodlo prawdy: kazdy symbol uzywa tych samych wag linii, atramentu
// i typografii — stad spojna, czytelna kreska jak na rysunku CAD (IEC 60617).

export const INK = '#1a1a1a'; // jeden atrament calej grafiki symbolu

// Czerwien — TYLKO swiadomy wyjatek dla elementow bezpieczenstwa (ESTOP).
// Reszta biblioteki pozostaje monochromatyczna.
export const RED = '#dc2626';

// Dwie wagi linii — tak jak w CAD: obrys/przewod vs detal wewnetrzny.
export const STROKE = 1.4; // obrys symbolu + kikuty przylaczeniowe
export const FINE = 0.9; // detal wewnetrzny (strzalki, styk, sprezyna, hatch)

export const GU = 10; // modul siatki (canvas snap [10,10])
export const STUB = 10; // standardowa dlugosc kikuta = 1 modul

// Skala renderu symbolu — jedno pokretlo powiekszajace CALY symbol (grafika +
// tekst + uchwyty) jednorodnie. Symbole rysujemy w „jednostkach projektowych",
// a SVG skaluje je na ekran. Bump tej wartosci = wieksze, czytelniejsze symbole
// bez przerabiania wspolrzednych. (Problem „symbole za male".)
//
// MUSI BYC LICZBA CALKOWITA. Punkty przylaczeniowe sa na wielokrotnosciach 10
// (siatka jedn. projektowych); offset uchwytu = wspolrzedna × SCALE. Tylko gdy
// SCALE jest calkowite, offset zostaje wielokrotnoscia 10 → uchwyt ląduje na
// siatce canvas [10,10] i kable da sie wyrownac prostopadle. Skala ulamkowa
// (np. 1.6) przesuwa uchwyty poza siatke → kabli nie da sie zlozyc pod katem prostym.
export const SCALE = 2;

// Odstep etykiety (oznaczenie/opis) od krawedzi symbolu, w jednostkach projektowych.
// Etykieta laduje Z BOKU symbolu (poza osia pionowego przewodu) — IEC 61082-1
// rys. 45/46: oznaczenia na lewo/z boku linii pionowych, NIE na przewodzie.
export const GAP = 5;

// Typografia — wspolny font dla wszystkich symboli.
export const FONT = 'ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif';
export const LABEL = { size: 9, weight: 700, fill: INK }; // oznaczenie (Q1, M1...)
export const RATING = { size: 7, weight: 400, fill: '#666' }; // opis pod symbolem
export const GLYPH = { size: 10, weight: 400, fill: INK }; // tekst w symbolu (Wh, ∼, Δ)
