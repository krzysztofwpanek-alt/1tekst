# Walne Zgromadzenie GWŻ — serwis z hasłem

Cała strona jest chroniona jednym wspólnym hasłem: **Twarda6**
(wpisanym na stałe w `worker.js` — patrz komentarz w tym pliku, jeśli
chcesz je zmienić).

## Struktura

```
worker.js              logika logowania (hasło Twarda6 wpisane na stałe)
wrangler.jsonc          konfiguracja Workera — wskazuje worker.js i folder public/
public/
  index.html               strona główna (widoczna dopiero po zalogowaniu)
  login.html                ekran logowania
  style.css                 style całej strony
  nav.js                     obsługa menu (hamburger na mobile)
  assets/logogwz.jpg          logo gminy
  gorace-tematy/                5 podstron: proces o synagogę, budżet, „Misiewicze” w akcji, Misiewicze 2, Misiewicze 3
  uchwaly/                       4 podstrony projektów uchwał
  materialy/                      (utwórz sam) — miejsce na pliki PDF z treścią uchwał
```

## Wdrożenie na Cloudflare (Workers + Git)

1. Wgraj całą zawartość tego folderu (łącznie z `worker.js` i
   `wrangler.jsonc` w katalogu głównym) do repozytorium na GitHubie —
   `wrangler.jsonc` musi leżeć OBOK folderu `public/`, nie w jego środku.
2. W Cloudflare: Workers & Pages → Create application → Import a
   repository → wybierz repozytorium. Framework preset: None, nic
   więcej nie trzeba ustawiać — `wrangler.jsonc` sam wskaże resztę.
3. Save and Deploy. Nie musisz dodawać żadnej zmiennej środowiskowej —
   hasło jest już w kodzie.
4. Po wdrożeniu: zakładka Overview → włącz `workers.dev` (jeśli jest
   oznaczone „Disabled”) i przetestuj adres w oknie incognito — powinno
   przekierować na `/login.html`, a po wpisaniu `Twarda6` wpuścić dalej.
5. Podłącz domenę: zakładka Domains → Add domain → `gwzwatch.pl`.
   (Jeśli domena jest już podpięta do innego projektu w Twoim koncie,
   trzeba ją najpierw stamtąd usunąć — patrz jego zakładka Domains.)

## Zmiana hasła

Otwórz `worker.js`, zmień linię:
```js
const SITE_PASSWORD = "Twarda6";
```
na nowe hasło, zapisz i wypchnij commit na GitHub — Cloudflare wdroży
zmianę automatycznie. Wszyscy zostaną wylogowani i będą musieli wpisać
nowe hasło.

## Aktualizacja treści

- Nowa uchwała / załącznik: wgraj plik PDF do `public/materialy/`
  i dodaj link w odpowiedniej podstronie w `public/uchwaly/`.
- Zmiana treści: edytuj bezpośrednio pliki `.html` w `public/`.
