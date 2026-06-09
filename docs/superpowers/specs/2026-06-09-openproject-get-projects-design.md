# OpenProject — pobieranie projektów z API

**Data:** 2026-06-09
**Status:** zatwierdzony projekt, gotowy do planu implementacji

## Cel

Umożliwić node'owi OpenProject pobieranie projektów z API w dwóch trybach:

1. **Operacja "Get Many"** — zwraca projekty jako output node'a (do dalszego przetwarzania w workflow).
2. **Dropdown (listSearch)** — lista rozwijana "wybierz projekt" do użycia w innych operacjach.

Podejście: **w pełni programowe** (`execute()` + `methods.listSearch`), ze wspólnym transportem. Wybrane ze względu na dynamiczny base URL (instancja self-hosted z credentiala) oraz format HAL+JSON, które w trybie deklaratywnym są kruche.

## Założenia API OpenProject

- Endpoint: `GET {url}/api/v3/projects`
- Uwierzytelnianie: **Basic auth**, login `apikey`, hasło = token API użytkownika.
- Format odpowiedzi: **HAL+JSON Collection**:
  ```json
  {
    "_type": "Collection",
    "total": 42,
    "count": 20,
    "pageSize": 20,
    "offset": 1,
    "_embedded": { "elements": [ { "id": 1, "identifier": "demo", "name": "Demo", "active": true, ... } ] }
  }
  ```
- Paginacja: parametry `offset` (numer strony, 1-based) i `pageSize`.
- Filtry: parametr `filters` jako zakodowany JSON, np. `[{"active":{"operator":"=","values":["t"]}}]`.

## Komponenty

### 1. Credential — `credentials/OpenProjectApi.credentials.ts`

Obecnie ma pola `accessToken` + `url`, ale brak wiringu uwierzytelniania. Dodajemy:

- `authenticate`: Basic auth
  - `username: 'apikey'`
  - `password: '={{$credentials.accessToken}}'`
- `test`: request `GET ={{$credentials.url}}/api/v3/configuration` (obsługa przycisku "Test" w UI).

Pola pozostają: `url` (np. `https://backlog.centrumosk.pl`), `accessToken` (password).

### 2. Transport — `nodes/OpenProject/utils/request.ts`

Naprawa istniejącego `openProjectRequest`:

- Base URL z credentiala: `const creds = await this.getCredentials('openProjectApi')` → `url: ${creds.url}/api/v3${resource}`.
- Usunąć `this.getNodeParameter('authentication', 0)` (parametr nie istnieje) oraz `console.log`.
- Uwierzytelnianie przez `this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', options)`.
- Zwraca surowy obiekt HAL.

Sygnatura bez zmian: `(method, resource, qs?, body?)`.

### 3. Operacja "Get Many" — `nodes/OpenProject/resources/projects/getAll.ts`

Nowa funkcja wykonawcza (programowa):

- Czyta parametry: `returnAll` (boolean), `limit` (number, gdy `returnAll=false`), `filters` (collection).
- Buduje `qs`:
  - `pageSize` = 100 (lub mniejszy z `limit`),
  - `offset` = numer strony (start 1),
  - `filters` = zakodowany JSON zbudowany z `filters` collection (jeśli ustawione).
- Paginacja HAL: pętla po stronach, czyta `response._embedded.elements`, zwiększa `offset`, kończy gdy:
  - `returnAll=true`: zebrane `>= response.total`,
  - `returnAll=false`: zebrane `>= limit` (i przycięcie do `limit`).
- Mapuje każdy element na item n8n: `{ json: element }` — pełne dane projektu.
- Zwraca `INodeExecutionData[]`.

### 4. Dropdown — `nodes/OpenProject/projects/get.ts`

Naprawa istniejącego `getProjects` (typ `listSearch`):

- Parsowanie HAL: `response._embedded.elements`.
- Mapowanie: `name: el.name`, `value: el.id` (opcjonalnie `url`).
- Paginacja przez `offset`/`pageSize`; `paginationToken` = następny offset gdy `page * pageSize < response.total`, inaczej `undefined`.
- Filtrowanie po `filter` (opcjonalnie przez `name_and_identifier`).

### 5. Properties — `nodes/OpenProject/resources/projects/index.ts`

- Operacja "Get Many" (`getAll`) **bez** `routing` (wykonanie programowe) — tylko `name`/`value`/`action`.
- `returnAll` (boolean, default `false`).
- `limit` (number, default 50, `minValue: 1`, widoczny gdy `returnAll=false`).
- `filters` (collection, "Add Filter"):
  - **Active** (options: `Any` / `Active Only` / `Inactive`) → filtr `active`, `values: ["t"]`/`["f"]`; `Any` = pominięty.
  - **Name or Identifier** (string) → filtr `name_and_identifier`, operator `~`.

Wzorzec właściwości wg `nodes/GithubIssues/resources/issue/getAll.ts`.

### 6. Node wiring — `nodes/OpenProject/OpenProject.node.ts`

- Dodać metodę `execute()`, która dispatchuje po `resource`/`operation` (na razie: `project` + `getAll` → `getAll`).
- Zmienić `methods: { projects: { getProjects } }` → `methods: { listSearch: { getProjects } }`.

## Obsługa błędów

- Błędy HTTP propagują się z `httpRequestWithAuthentication` (n8n opakowuje w `NodeApiError`).
- W `getProjects` (dropdown) ewentualny brak wyników → pusta lista (bez wyjątku), wzorem `getRepositories`.

## Testy / weryfikacja

- W repo **brak frameworka testowego** — weryfikacja przez:
  - `npm run build` (tsc) przechodzi bez błędów (Node 22 przez fnm — patrz notatka projektu o ograniczeniu wersji Node).
  - Przegląd zgodności typów z formatem HAL.
- Opcjonalnie: ręczny test w instancji n8n przeciw realnemu OpenProject.

## Poza zakresem (YAGNI)

- Filtry `parent_id`, daty (`created_at`/`updated_at`), `sortBy` — do dodania później w razie potrzeby.
- OAuth2 — pozostajemy przy API key (Basic auth).
- Operacje na zasobie `task` — osobny spec.