# CLAUDE.md

Kontekst dla przyszłych sesji Claude Code pracujących nad tym repo.

## Projekt

Statyczna strona wizytówkowa (one-pager) elektryka działającego w Otwocku i okolicach
(do 80 km, woj. mazowieckie, PL). Czysty HTML/CSS/JS, bez frameworka i bez build stepu.
Domena docelowa: **elektryka-otwock.pl** — już poprawnie skonfigurowana we wszystkich
miejscach (CNAME, meta og:url, canonical, JSON-LD, sitemap.xml, robots.txt). Nie zmieniać
bez wyraźnej instrukcji.

## Struktura plików

- `index.html` — cała treść strony (jeden plik, sekcje: hero, o mnie, usługi, obszar
  działania, realizacje, kontakt). Zawiera też JSON-LD (`Electrician`) dla Google.
- `style.css` — cały CSS w jednym pliku, tokeny w `:root`, sekcje oznaczone komentarzami-nagłówkami.
- `script.js` — mobilne menu, animacja obwodu w hero (`#circuit-hero`), scroll-reveal
  (`[data-reveal]` + IntersectionObserver), rok w stopce.
- `CNAME` — custom domain dla GitHub Pages (`elektryka-otwock.pl`).
- `robots.txt`, `sitemap.xml` — SEO, wskazują na `elektryka-otwock.pl`.
- `img/realizacje/` — prawdziwe zdjęcia do sekcji Realizacje (`realizacja-1..5.jpg`, bez
  EXIF/GPS, skompresowane do web). Dochodzenie kolejnych zdjęć: dodać plik, wyczyścić
  metadane, dodać `<img>` w `.gallery-grid` z sensownym `alt`.

## System tokenów (design)

Zmienne CSS w `:root` (`style.css`):

- `--navy` (#10233F) / `--navy-deep` (#0B1930) — granat, kolor marki, tła ciemnych sekcji, tekst na jasnym tle.
- `--jade` (#4CAE97) / `--jade-soft` (#6FCBB4) — akcent, CTA, focus states, podświetlenia. Świadomie
  zamiast typowego dla elektryków żółtego/amberowego (żółto-czarny "znak ostrzegawczy" ma prawie każdy
  konkurent) — jadeit odróżnia markę i lepiej się starzeje wizualnie.
- `--cream` (#F4F2EA) — tło strony (zamiast czystej bieli).
- `--charcoal` (#1C1C1C) — główny kolor tekstu.
- `--jade-deep` (#1B6358) — ciemniejszy wariant jadeitu dla eyebrow/ikon na jasnym tle (dociemniony,
  żeby spełniać kontrast WCAG AA 4.5:1 na tle `--cream`; sam `--jade` na jasnym tle tego nie spełnia).
- `--steel` (#5C7088) — tekst drugorzędny/pomocniczy.
- `--line`, `--line-light` — subtelne obramowania/separatory.

Fonty:
- `--font-display`: **Libre Franklin** — nagłówki, przyciski, nawigacja, UI.
- `--font-body`: **Source Serif 4** — treść, akapity.

To świadomy wybór pary sans-serif/serif zamiast typowego zestawu "jeden geometryczny
grotesk na wszystko", żeby strona nie wyglądała jak generyczny landing wygenerowany
przez AI/SaaS builder. Nie zamieniać na inne fonty bez wyraźnej prośby.

## Zasady dalszej pracy

- **Brak frameworków i buildstepu.** Czysty HTML/CSS/JS. Nie dodawać bundlerów, npm
  jako zależności runtime, React itp. bez wyraźnej prośby użytkownika.
- **Brak nowych zależności bez wyraźnej potrzeby** — także CDN-ów, ikon-fontów, JS-owych
  bibliotek. Ikony są jako inline SVG.
- **Dostępność:** min. 18px tekst bazowy (`body { font-size: 18px }`), kontrast min. AA
  (4.5:1) dla tekstu, `:focus-visible` z widocznym obramowaniem (jade), pełne wsparcie
  `prefers-reduced-motion` (animacje i przewijanie muszą się wyłączać/skracać do ~0).
  Dekoracyjne SVG obok tekstu powinny mieć `aria-hidden="true"`.
- **Spójność stylu:** paleta granat/jadeit, zero gradientów, zero mocno zaokrąglonych
  rogów w stylu "AI SaaS" (`--radius` to tylko 6px). Trzymać się istniejącej estetyki.
- Circuit animation w hero (`#circuit-hero`, `.circuit-line`, `.node`, `.bulb-fill`) ma
  długość kresek (`--len`), czas (`--dur`) i opóźnienia (`--delay`/`--bulb-delay`)
  wyliczane dynamicznie w `script.js` z `getTotalLength()` — jeśli zmienia się geometria
  SVG, nic więcej nie trzeba ręcznie przeliczać.

## Formularz kontaktowy

Formularz w sekcji `#kontakt` wysyła dane przez **Web3Forms** (`https://api.web3forms.com/submit`).
Wymaga prawdziwego klucza w ukrytym polu:
```html
<input type="hidden" name="access_key" value="WPISZ_TU_SWOJ_KLUCZ_Z_WEB3FORMS">
```
Klucz do wygenerowania na web3forms.com — bez niego formularz nie zadziała. Pole
`botcheck` to honeypot antyspamowy (ma zostać puste/niewidoczne, nie ruszać).

## Hosting

Docelowo: **GitHub Pages** + **Cloudflare DNS**. Custom domain przez plik `CNAME`
(`elektryka-otwock.pl`) w katalogu głównym. Repo **musi być publiczne**, żeby GitHub
Pages działał na darmowym planie (prywatne repo wymaga GitHub Pro/Team/Enterprise).

## Do zrobienia

- **`access_key` w formularzu kontaktowym** — patrz wyżej, obecnie placeholder
  `WPISZ_TU_SWOJ_KLUCZ_Z_WEB3FORMS`.
- **Brak `og:image`** i obraz w JSON-LD (`img/og-image.jpg`) wskazuje na plik, którego
  nie ma w repo — do ustalenia z klientem, czy dodać realne zdjęcie/grafikę na potrzeby
  udostępniania w social media, czy usunąć te pola.
