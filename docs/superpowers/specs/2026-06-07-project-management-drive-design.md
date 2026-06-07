# Biblioteka projektów + logowanie Google/Drive — projekt (spec)

Data: 2026-06-07
Status: zatwierdzony przez użytkownika

## Cel

Aplikacja trzyma dziś **jeden projekt naraz** (cały stan w jednym kluczu `localStorage`, autozapis). Brakuje zarządzania wieloma projektami. Cel:

1. **Project management** — wiele nazwanych projektów (Nowy / Otwórz / Zmień nazwę / Duplikuj / Usuń / Zapisz / Zapisz jako).
2. **Współdzielenie przez Google Drive** — projekty w prywatnym, wspólnym folderze Drive, dostępne dla osób, którym folder udostępniono; logowanie kontem Google.
3. **Tryb lokalny opcjonalny** — bez logowania aplikacja działa offline na `localStorage`. Drive jest opcjonalnym backendem.

Twarde wymaganie: rysunki zawierają dane obiektu/klienta — **nie mogą wyciec**. Dane żyją tylko w `localStorage` (lokalnie) lub w prywatnym folderze Drive (chronionym logowaniem Google). Nigdy w publicznym repozytorium.

## Konfiguracja (nie-sekrety, mogą być w repo)

- **OAuth Client ID:** `1024580768546-8u00tv82f5oed9rvrliodt6u42s0s730.apps.googleusercontent.com`
- **ID wspólnego folderu Drive:** `1175WlBUyA24EQUCBMeT492l5Fr74lSiB`
- Trzymane w `src/config/google.ts` (lub `googleConfig`). Client ID jest publiczny i bezpieczny w przeglądarce. **client_secret NIE jest używany ani commitowany.**
- OAuth: typ Web, autoryzowane źródła `https://ksiaz.github.io`, `http://localhost:5173`. Aplikacja w trybie „Testing" — dostęp tylko dla dodanych test users (Ty + współpracownik).

## Model danych

- **Jeden projekt = jeden plik JSON** w folderze Drive (albo jeden wpis w kolekcji `localStorage` w trybie lokalnym).
- Zawartość pliku = dokładnie ten sam kształt, co dziś produkuje `saveProject()` (projectName, projectInfo, wszystkie arkusze: nodes/edges schematu, layoutu, single-line, formaty, labelCounters) — rozszerzony o metadane:

```ts
interface ProjectFile {
  schemaVersion: 1;
  id: string;            // UUID nadawany przy tworzeniu
  name: string;          // = projectName
  updatedAt: string;     // ISO; stempel zapisu
  data: ProjectData;     // obecny payload saveProject()
}
```

- W trybie Drive: nazwa pliku `"<name>.schemat.json"`, a `id` przechowywany w `appProperties` pliku (do stabilnej identyfikacji niezależnej od nazwy). MIME `application/json`.
- W trybie lokalnym: klucz `schemat:projects` w `localStorage` = mapa `id -> ProjectFile`. Dodatkowo `schemat:lastOpenedId`.

## Warstwa zapisu (storage) — wymienna

Wspólny interfejs, dwie implementacje. Reszta aplikacji zależy tylko od interfejsu.

```ts
interface ProjectStorage {
  list(): Promise<ProjectMeta[]>;              // {id, name, updatedAt}
  load(id: string): Promise<ProjectFile>;
  create(name: string, data: ProjectData): Promise<ProjectMeta>;
  save(id: string, name: string, data: ProjectData,
       knownUpdatedAt?: string): Promise<{updatedAt: string; conflict?: boolean}>;
  rename(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
  duplicate(id: string, newName: string): Promise<ProjectMeta>;
}
```

- `LocalProjectStorage` — implementacja na `localStorage` (mapa wyżej).
- `DriveProjectStorage` — implementacja na Google Drive REST API (v3) ograniczona do jednego folderu (`parents = [FOLDER_ID]`).
- `save()` zwraca `conflict: true`, gdy `knownUpdatedAt` jest starsze niż wersja w magazynie (Drive `modifiedTime` / lokalne `updatedAt`) — patrz Współbieżność.

## Logowanie (Google Identity Services)

- Skrypt GIS (`https://accounts.google.com/gsi/client`) ładowany dynamicznie.
- `google.accounts.oauth2.initTokenClient` z zakresem `https://www.googleapis.com/auth/drive` (dostęp do plików w udostępnionym folderze; w trybie Testing nie wymaga weryfikacji Google — przy pierwszym logowaniu jednorazowy ekran „aplikacja niezweryfikowana").
- Token dostępu trzymany **wyłącznie w pamięci** (stan modułu auth), nie w `localStorage`. Po wygaśnięciu (401) — ciche ponowne pobranie tokenu; jeśli wymaga interakcji, prośba o ponowne kliknięcie „Zaloguj".
- Brak backendu, brak `client_secret`.

## UI

- **Pasek narzędzi:** przycisk **„Projekty"** (otwiera modal) + wskaźnik logowania **„Zaloguj Google" / „<email> ⌄"** (wyloguj).
- **Modal „Projekty":**
  - Nagłówek z przełącznikiem źródła: **Drive** (gdy zalogowany) / **Lokalne**.
  - Lista projektów (`name`, `updatedAt`), sortowana po `updatedAt` malejąco.
  - Akcje na pozycji: **Otwórz**, **Zmień nazwę**, **Duplikuj**, **Usuń** (z potwierdzeniem).
  - Przyciski globalne: **Nowy projekt**, (w trybie Drive, gdy zalogowany) odświeżenie listy.
  - Stany: ładowanie, pusta lista, błąd (np. brak sieci / brak dostępu).
- **Zapis:** aktywny projekt autozapisuje się do swojego pliku z debounce (np. 2 s po ostatniej zmianie) + zawsze do lokalnego bufora offline. „Zapisz jako" tworzy nowy plik/wpis.

## Współbieżność (2 osoby)

- Model **„ostatni zapis wygrywa"** z miękkim ostrzeżeniem.
- Przy otwarciu zapamiętujemy `updatedAt`/`modifiedTime`. Przed zapisem `save()` sprawdza, czy wersja w magazynie jest nowsza. Jeśli tak → `conflict: true` → modal: „Ten projekt zmienił się na Drive od czasu otwarcia. Nadpisać czy wczytać nowszą wersję?".
- Bez realtime-collab (YAGNI dla 2 osób).

## Migracja

- Przy starcie: jeśli istnieje stary klucz `localStorage` (obecny pojedynczy projekt) i nie ma jeszcze kolekcji `schemat:projects`, automatycznie tworzymy z niego pierwszy wpis biblioteki (nadajemy `id`, `name` z `projectName` lub „Projekt 1"). Nic nie ginie.

## Tryb działania (lokalny vs Drive)

- **Niezalogowany:** modal pokazuje **Lokalne**, storage = `LocalProjectStorage`. Pełna funkcjonalność offline.
- **Zalogowany:** domyślnie źródło **Drive**, storage = `DriveProjectStorage`. Użytkownik może przełączyć na Lokalne.
- Logowanie jest **opcjonalne** — appka nigdy nie blokuje pracy z powodu braku logowania.

## Obsługa błędów

- Brak sieci / błąd Drive → komunikat w modalu, możliwość pracy w trybie lokalnym; autozapis lokalny zawsze działa.
- Wygasły token → ciche odświeżenie; przy niepowodzeniu prośba o ponowne logowanie, bez utraty bieżącej pracy.
- Uszkodzony JSON pliku → pominięty na liście z oznaczeniem błędu, nie wywala aplikacji.

## Zakres / granice (YAGNI)

- Bez kont/haseł własnych — tożsamość = konto Google.
- Bez realtime collaboration, bez historii wersji (poza „ostatni zapis wygrywa").
- Bez folderów/zagnieżdżeń w bibliotece — płaska lista w jednym wspólnym folderze.
- Bez współdzielenia per-projekt z poziomu apki — dostęp wynika z udostępnienia folderu w Google Drive.

## Pliki (orientacyjnie)

- `src/config/google.ts` — Client ID, Folder ID, zakres.
- `src/services/googleAuth.ts` — ładowanie GIS, logowanie/wylogowanie, token.
- `src/services/drive.ts` — niskopoziomowe wywołania Drive REST (list/get/create/update/delete w folderze).
- `src/services/projectStorage.ts` — interfejs + `LocalProjectStorage` + `DriveProjectStorage`.
- `src/store/projectStore.ts` — akcje biblioteki (newProject/openProject/saveCurrent/...), migracja, debounce autozapisu.
- `src/components/projects/ProjectsModal.tsx` — UI biblioteki.
- `src/components/toolbar/Toolbar.tsx` — przycisk „Projekty" + status logowania.
