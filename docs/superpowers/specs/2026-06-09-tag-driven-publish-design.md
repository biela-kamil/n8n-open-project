# Tag-driven npm publish — design

**Data:** 2026-06-09
**Status:** zaakceptowany

## Cel

Po utworzeniu i wypchnięciu taga wersji (np. `0.2.0`) GitHub Actions ma
automatycznie: ustawić tę wersję w `package.json`, zbudować paczkę,
opublikować ją na npm z provenance, i zacommitować bump wersji z powrotem
do brancha `main`. Tag jest jedynym źródłem prawdy o numerze wersji.

## Zakres

Zmiana dotyczy wyłącznie `.github/workflows/publish.yml`. Bez zmian:
`ci.yml`, skrypty w `package.json`, kod node'a.

## Przepływ użytkownika

```
git tag 0.2.0
git push origin 0.2.0
```

## Zachowanie workflow (trigger: push taga `*.*.*`)

1. `actions/checkout@v4` z `ref: main` i `contents: write` (możliwość pushu na main).
2. `actions/setup-node@v4` (`lts/*`, cache npm) + `npm ci`.
3. Ustawienie wersji z taga:
   `npm version "$GITHUB_REF_NAME" --no-git-tag-version --allow-same-version`.
4. Publikacja: `npm publish --provenance --access public`.
   Build + lint odpalają się automatycznie przez istniejący hook
   `prepublishOnly` (`n8n-node prerelease`).
5. Po udanej publikacji: commit `chore: release <wersja>` (`package.json`
   + `package-lock.json`) i `git push origin main`.

## Uprawnienia joba

- `id-token: write` — OIDC dla npm provenance.
- `contents: write` — push commita z bumpem na main.

## Decyzje i konsekwencje

- **Tag = źródło prawdy.** Tag wskazuje commit sprzed bumpa; `main` po
  publikacji ma poprawną wersję. Dla npm/provenance bez znaczenia
  (publikowana wersja == tag).
- **Branch protection na main** zablokuje krok 5 (push). Wymaga wyjątku
  dla github-actions[bot] albo rezygnacji z commit-backu.
- **release-it** nie jest już używany w CI; zależność zostaje dla
  ewentualnego użycia lokalnego (usunięcie poza zakresem).

## Setup jednorazowy

npmjs.com → ustawienia paczki → Trusted Publishers → GitHub Actions,
workflow `publish.yml` (instrukcja w komentarzu pliku workflow).
