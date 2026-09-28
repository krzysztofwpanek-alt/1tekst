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
  materialy/polityka-antymobbingowa-wzor.pdf   załącznik do tekstu „Laszon Hara”
  materialy/sprawozdanie-finansowe-2022.pdf … 2025.pdf   załączniki w zakładce Budżet GWŻ (po ok. 5,5 MB)
  gorace-tematy/
    proces-synagoga.html            PEŁNY ARTYKUŁ o procesie (+ PDF z dokumentami sprawy)
    laszon-hara.html                 PEŁNY TEKST o mobbingu (+ załącznik PDF: polityka antymobbingowa)
    ofiary-mobbingu.html              „wkrótce” — 15 października
    budzet.html                        analiza sprawozdań finansowych 2022–2025 (tabele responsywne)
                                        + symulator budżetu z suwakami (cel: oszczędności 5,3 mln zł)
                                        + załączniki: sprawozdania finansowe 2022–2025
    symulator-budzetu.html              „wkrótce” — wieczorem 17 października (miejsce na aplikację do głosowania)
    ulica-smetna.html                    „wkrótce” — 1 października
    przeplaca.html                        „wkrótce” — 5 października
    misiewicze.html                        „wkrótce” — 8 października
    misiewicze-reaktywacja.html             „wkrótce” — 9 października
    zarzad-fatalnie.html                     „wkrótce” — 13 października
  uchwaly/
    zrownowazenie-budzetu.html      „wkrótce” — 16 października
    regulamin-zarzadu.html           „wkrótce” — 13 października
    polityka-zakupow.html             „wkrótce” — 5 października
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
