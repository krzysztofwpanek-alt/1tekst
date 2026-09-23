# Walne Zgromadzenie GWŻ — serwis z hasłem (wersja 2)

Cała strona chroniona jednym wspólnym hasłem: **Twarda6** (wpisanym na
stałe w `worker.js` — patrz komentarz w tym pliku).

## Struktura

```
worker.js              logika logowania (hasło Twarda6 wpisane na stałe)
wrangler.jsonc           konfiguracja Workera (wskazuje worker.js i public/,
                          html_handling: none + jawne mapowanie "/" → index.html —
                          patrz komentarze w worker.js, dlaczego to ważne)
public/
  index.html                strona główna z kartami wszystkich tematów
  login.html                  ekran logowania
  style.css                    style całej strony
  nav.js                        obsługa menu (hamburger na mobile)
  assets/logogwz.jpg              logo gminy
  assets/uchwala-2003-adnotacje.jpeg   zdjęcie w artykule o procesie
  materialy/proces-zgwz-dokumenty.pdf   pełne dokumenty źródłowe sprawy (16 stron)
  gorace-tematy/
    proces-synagoga.html          PEŁNY ARTYKUŁ (gotowa treść)
    budzet.html                    „wkrótce” — 28 września
    ulica-smetna.html               „wkrótce” — 1 października
    przeplaca.html                   „wkrótce” — 5 października
    misiewicze.html                   „wkrótce” — 8 października
    misiewicze-reaktywacja.html        „wkrótce” — 9 października
    zarzad-fatalnie.html                „wkrótce” — 13 października
  uchwaly/
    zrownowazenie-budzetu.html      „wkrótce” — 28 września
    regulamin-zarzadu.html           „wkrótce” — 13 października
    polityka-zakupow.html             „wkrótce” — 5 października
    ugoda-zgwz.html                    tekst zastępczy (lorem ipsum), bez daty
```

## Wdrożenie na Cloudflare (Workers + Git)

1. Wgraj całą zawartość tego folderu do repozytorium na GitHubie —
   `worker.js` i `wrangler.jsonc` muszą leżeć w katalogu głównym, OBOK
   (nie w środku) folderu `public/`.
2. Workers & Pages → Create application → Import a repository → wybierz
   repozytorium. Framework preset: None — reszta ustawień jest już w
   `wrangler.jsonc`.
3. Save and Deploy. Zmienne środowiskowe nie są potrzebne — hasło jest
   w kodzie.
4. Zakładka Overview → jeśli `workers.dev` jest oznaczone „Disabled”,
   włącz je, żeby przetestować adres przed podłączeniem domeny.
5. Domains → Add domain → `gwzwatch.pl`. Jeśli domena jest już podpięta
   do innego projektu w Twoim koncie Cloudflare, trzeba ją najpierw
   stamtąd usunąć (jego zakładka Domains → Remove).

## Aktualizacja treści

- Podmiana strony „wkrótce” na docelowy tekst: edytuj odpowiedni plik
  `.html` — zastąp blok `<div class="coming-soon">…</div>` właściwą
  treścią (może wyglądać tak samo jak `gorace-tematy/proces-synagoga.html`).
- Nowy załącznik PDF: wgraj do `public/materialy/` i dodaj link w
  odpowiedniej podstronie.
- Zmiana hasła: w `worker.js` podmień wartość `SITE_PASSWORD`, zapisz
  i wypchnij commit.
