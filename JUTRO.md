# Jutro z Sebą — checklist

Spotkanie z Sebą. Ten plik to punkt odniesienia, żeby nic nie przegapić. Po wizycie można go usunąć.

---

## ✅ Już zrobione przed spotkaniem

- [x] **GA4** — property utworzone, `NEXT_PUBLIC_GA_MEASUREMENT_ID` w Vercel envs, działa
- [x] **Sanity webhook** — revalidation `/api/revalidate` wpięty, każdy Publish odświeża stronę natychmiast
- [x] **Sanity testowy post** — wgrany, sprawdzona widoczność na produkcji
- [x] **Domena** `run-seba.pl` aktywna na Vercel z certyfikatem SSL

---

## 🚀 Setup techniczny z Sebą (~30-45 min razem)

### 1. Sanity CMS — dostęp dla Seby

- [ ] Zaprosić Sebę jako **Editor**:
      <https://www.sanity.io/manage/project/cr63utxk/members> → Invite member → email Seby → role: **Editor**
- [ ] Seba akceptuje invite z maila + tworzy konto (Google/GitHub OAuth)
- [ ] Wchodzi na <https://run-seba.pl/studio>, loguje się
- [ ] **CORS origins** w Sanity (jeśli jeszcze nie):
      <https://www.sanity.io/manage/project/cr63utxk/api/cors> → upewnij się że są:
      `http://localhost:3000`, `https://run-seba.vercel.app`, `https://run-seba.pl`
      (z "Allow credentials" dla każdego)

### 2. Wypełnienie dokumentu Autor (singleton)

- [ ] Razem otwieramy w Sanity **Treści → Autor (Seba)**:
  - **Imię** (np. "Seba")
  - **Rola** (np. "Biegacz KS Ultra, ambasador @butyjana")
  - **Klub**
  - **Avatar** — wrzuca własne zdjęcie
  - **Krótka bio** (1-2 zdania)
  - **Pełna bio** w block-content — pokazuje się na `/o-mnie`
  - **Rekordy życiowe** — może edytować PB (dystans + czas + rok)
  - **Linki social** — IG, Strava, FB, YT, www (z odpowiednimi typami)
  - **Publish**
- [ ] Bez tego dokumentu strona `/o-mnie` używa fallback hardcoded — działa, ale Seba nie edytuje sam

### 3. Pierwszy "prawdziwy" post — pokaz Studio

- [ ] Razem tworzymy post w Sanity i pokazujemy mu:
  - Tytuł, slug (klik **Generate**), opis, datę, cover, tagi
  - Block-content: nagłówki (H2/H3), listy, pogrubienie, linki, cytaty
  - **Galeria zdjęć** (`+` → Galeria zdjęć, drag&drop, układ grid 2/grid 3/mozaika)
  - **YouTube/Strava embed** (`+` → Embed → wkleja URL, system rozpoznaje typ)
  - **Pojedyncze zdjęcie** w treści (`+` → Image, alt + caption)
  - **Publish** vs Draft (czerwony/zielony badge)
  - **Slug** = nie zmieniać po publikacji (psuje linki + SEO)
- [ ] Sprawdzamy że post pojawia się natychmiast na `https://run-seba.pl/blog/<slug>` (webhook revalidation)

### 4. LightWidget (Instagram feed na `/o-mnie`)

- [ ] Razem zakładamy konto na <https://lightwidget.com> (przez OAuth Instagram `@run_seba` — Seba klika autoryzację)
- [ ] Tworzymy widget:
  - Layout: **Grid 3×2** (6 ostatnich zdjęć)
  - Bez border, transparent background, spacing ~8px
- [ ] Kopiujemy widget ID (z embed code: `cdn.lightwidget.com/widgets/<ID>.html` — interesuje nas hex string)
- [ ] Wpisujemy `NEXT_PUBLIC_LIGHTWIDGET_ID` w Vercel envs (Production + Preview + Development)
- [ ] Redeploy → na `/o-mnie` pojawia się sekcja "Z Instagrama @run_seba"

### 5. MapTiler (vector tiles dla map w /biegi/[id])

- [ ] Rejestracja: <https://cloud.maptiler.com/auth/widget> (free tier 100k req/m)
- [ ] Skopiuj API key z <https://cloud.maptiler.com/account/keys/>
- [ ] Dodaj `NEXT_PUBLIC_MAPTILER_KEY` w Vercel envs (Production + Preview + Development)
- [ ] Redeploy → mapy w `/biegi/[id]` używają vector tiles streets-v2 (light + dark) zamiast OSM raster

Bez tego klucza wszystko działa, tylko mapy są mniej "smooth".

### 6. GA udostępnienie Sebie

- [ ] <https://analytics.google.com/> → Administracja → Zarządzanie dostępem do **usługi `run-seba.pl`** (NIE poziom konta)
- [ ] **+** → email Seby → rola **Czytelnik**
- [ ] Seba dostanie maila z linkiem, kliknie, zaloguje się swoim Google → widzi tylko run-seba.pl property
- [ ] Vercel panel **NIE** udostępniaj (Hobby plan = 1 member, Pro $20/mc niepotrzebne — Seba widzi statystyki w GA)

### 7. Strava OAuth (jeśli Seba potwierdzi że publikuje aktywności publicznie)

**Pre-Seba (Mateusz może zrobić wcześniej):**

- [ ] Rejestracja Strava App: <https://www.strava.com/settings/api>
  - Application name: `run-seba.pl`
  - Category: `Other`
  - Website: `https://run-seba.pl`
  - Authorization Callback Domain: `run-seba.pl`
- [ ] Zachowaj **Client ID** i **Client Secret** (zostaw kartę otwartą)

**Z Sebą:**

- [ ] W przeglądarce otworzyć link autoryzacji (zamień `XXX` na Twój Client ID):

      ```
      https://www.strava.com/oauth/authorize?client_id=XXX&redirect_uri=https://run-seba.pl/&response_type=code&scope=read,activity:read
      ```

- [ ] Seba klika **Authorize**, Strava przekieruje na `https://run-seba.pl/?code=YYY&scope=...`
- [ ] Skopiuj `code` z URL (tylko wartość po `code=`, przed `&`)
- [ ] Jednorazowa wymiana code → refresh_token (curl):

      ```bash
      curl -X POST https://www.strava.com/oauth/token \
        -F client_id=XXX -F client_secret=ZZZ -F code=YYY \
        -F grant_type=authorization_code
      ```

- [ ] Z odpowiedzi JSON wyciągnij `refresh_token`
- [ ] **3 envy** w Vercel: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`
- [ ] Redeploy → sekcja **"Ostatnie biegi"** na home + **`/biegi/[id]`** strony zamieniają się z mock w real data

---

## ❓ Pytania do Seby (dla content / decyzji)

### Sprzęt i pomiary

- [ ] Z jakiego **zegarka** korzystasz? (Garmin XYZ? Coros? Apple Watch? Polar?)
garmin 965
- [ ] Czy synchronizujesz aktywności **z Stravą** automatycznie?
tak
- [ ] Czy **publikujesz aktywności publicznie** na Stravie (visibility = Everyone)?

- [ ] Jakich **butów** używasz w rotacji? (modele, ile km, co recenzowałbyś)

- [ ] Inne ulubione marki/sprzęt: czołówka, kompresory, GPS pulsometr, plecak hydration?
aplikacjia roovy, trenażer Elite Suito, 

### Treningi i plany

- [ ] Z jakiego **planu treningowego** korzystasz? (Daniels' Running Formula? Pfitzinger? Hanson? Własny?)
https://ratemytrail.com/
- [ ] Z jakich **aplikacji** korzystasz na co dzień? (Garmin Coach? TrainingPeaks? Final Surge?)

- [ ] **Cele na 2026/2027**: jakie starty? Jaki jest plan na maraton?

### Trasy

- [ ] Czy masz **ulubione trasy** które chciałbyś pokazać na blogu jako "curated"?

- [ ] Czy masz **GPX-y** wyeksportowane z Garmin Connect / Strava?
- [ ] Region biegowy: gdzie najczęściej trenujesz? (las / miasto / góry)

### Content i ton

- [ ] Co chciałbyś **pisać w pierwszej kolejności**? (relacja z ostatniego startu? recenzja butów? plan na sezon?)
- [ ] **Częstotliwość publikacji**: chcesz mieć regularny rytm (np. co tydzień) czy "kiedy mi coś przyjdzie do głowy"?
- [ ] **Współpraca @butyjana** — jak długo? co konkretnie testujesz? czy są inne marki w pipeline?

### Inne

- [ ] Czy masz **inne zdjęcia** z biegów (od fotografów, prywatne) które możemy użyć?
- [ ] Czy chcesz **mail kontaktowy** publiczny (`hej@run-seba.pl` jako placeholder, czy własny adres)?
- [ ] Co chciałbyś **zmienić wizualnie** na blogu? (kolorystyka, krój, układ — granat butyjana OK?)

---

## 🎬 Demo dla Seby (~15-20 min)

Pokazać blog na pełnej okazałości:

- [ ] **Hero** z parallax (jego zdjęcie z trasy) + scroll indicator
- [ ] **2026 w liczbach** (count-up animacja km/biegi/tempo/wzniesienia — mock dziś)
- [ ] **Najnowsze wpisy** (limit 4 + link "Wszystkie wpisy →" do `/blog`)
- [ ] **Strava feed** — 3 karty z gradient polyline po tempie, klik → strona biegu
- [ ] **`/blog`** — pełna lista postów + paginacja 6/strona
- [ ] **Pojedynczy post** — cover, reading progress bar, galeria zdjęć z lightbox, embed YouTube/Strava, share buttons (FB/IG/copy), related posts
- [ ] **`/biegi/[id]`** — bajerancka strona aktywności:
  - Real mapa MapLibre z polyline kolorystycznym po tempie
  - Stats grid (dystans, czas, tempo, przewyższenie, HR, kadencja, kalorie)
  - Weather widget (temperatura/wiatr/opady z Open-Meteo)
  - Profil przewyższenia (SVG line chart z gradient fill)
  - Splity per km (tabela z bar chart, BEST badge)
  - Share buttons
- [ ] **`/kalkulator`** — pace + predykcje Riegel + VDOT + tabela tempa treningowego E/M/T/I/R (Daniels)
- [ ] **`/o-mnie`** — avatar + PB grid (count-up), bio, linki social
- [ ] **`/tagi`** — pill buttons z liczbą postów per tag
- [ ] **Custom 404** — `/cokolwiek` ("Zgubiłeś trasę"), `/biegi/9999` ("Ta trasa zniknęła z GPS")
- [ ] **Mobile** — hamburger menu z aktywnym linkiem, mobile-friendly kalkulator i mapy
- [ ] **Dark mode** toggle w prawym górnym rogu
- [ ] **Studio** — pokazać jego edytor:
  - Wpisy (lista + Create)
  - Autor (Seba) singleton
  - Block-content: nagłówki, listy, pogrubienie, linki, galeria, embed
- [ ] **Vercel dashboard** — krótki przegląd (deployments, analytics, logs) — TYLKO Twój ekran
- [ ] **GA Realtime** — w Twojej zakładce GA pokazać że ruch jest mierzony
test pushh
---

## 🛠️ Decyzje do podjęcia razem

- [ ] **Sekcja `/trasy`** na blogu (currently NIE ma):
  - **A)** Curated: Seba wybiera 5-10 ulubionych tras, dodaje GPX + opis + zdjęcia w Sanity. Mapy na każdej.
  - **B)** Tylko Strava feed: bez `/trasy`, ostatnie biegi automatycznie z API (już mamy).
  - **C)** Oba: `/trasy` curated dla flagshipowych, plus Strava feed na home dla świeżego.
- [ ] **Komentarze pod postami**: chce / nie? (default: nie ma — moderowanie, spam, mało wartości)
- [ ] **RSS feed** — dorzucamy? (15 min roboty, niewidoczne ale uczciwe; tylko ułatwia subskrypcję)
- [ ] **Wyszukiwarka Cmd+K po postach** — dorzucamy gdy będzie >10 postów?
- [ ] **Pierwszy "real" post** — co dziś / w tym tygodniu publikujemy?
- [ ] **Branding** — granat butyjana zostaje? (pasuje do plastronu, ale można zmienić)

---

## 📋 Po spotkaniu (Mateusz, samodzielnie)

- [ ] Wpisać brakujące envy do Vercel (LightWidget ID, MapTiler key, Strava OAuth jeśli ustaliliśmy)
- [ ] Redeploy
- [ ] **Test produkcji:**
  - Strava feed real (jeśli envy są) — `https://run-seba.pl/`
  - IG widget na `/o-mnie`
  - Mapa MapTiler na `/biegi/1`
  - Sanity webhook → publikacja → revalidate w <1 sek
- [ ] **GA Realtime** — sprawdzić że tracking się odpala (otworzyć stronę i widać siebie w GA)
- [ ] Aktualizacja `README.md` z final stanem (envs, instrukcje dla Seby)
- [ ] Wysłać Sebie linki "ściągi":
  - Studio: <https://run-seba.pl/studio>
  - Live: <https://run-seba.pl>
  - GA dashboard: <https://analytics.google.com/>
  - JUTRO.md już można usunąć (`rm JUTRO.md && git commit -am "drop"`)

---

## 🔮 Backlog na później (nie dziś, nie jutro)

- **`/trasy`** curated (zależnie od decyzji jutrzejszej z Sebą)
- **RSS feed** `/rss.xml` (~15 min)
- **Wyszukiwarka Cmd+K** (gdy postów >10)
- **`/statystyki`** — weekly chart, monthly km, pace progression z Stravy
- **Compare aktywności** — `/biegi/compare?ids=1,2` side-by-side
- **Form contact** — Resend zamiast `mailto:` (jeśli kiedyś będzie spam)
- **Author bio jako Sanity dokument** — ✅ ZROBIONE, Seba jutro wypełni
- **Pierwsza wzmianka w mediach społecznościowych** — post Seby na IG: "Mam blog!"
- **Migracja istniejących treści** (jeśli Seba miał coś na innej platformie)
- **Komercyjna współpraca** jak ruch wzrośnie (ad-spaces, affiliate sklep)
- **PWA / Add to home screen** — manifest.json, ikony (overkill na razie)

---

## 📊 Czego już użyliśmy (ścięga technologii dla Seby)

- **Next.js 16** (App Router, RSC, ISR)
- **Sanity CMS** (block-content + galerie + embed)
- **Tailwind v4** + shadcn/ui (komponenty UI)
- **MapLibre GL** + OSM/MapTiler tiles (mapy)
- **Strava API** (refresh token flow, streams)
- **Open-Meteo** (historical weather, free)
- **GA4** (Consent Mode default-deny)
- **Vercel OG** (dynamic OG images)
- **motion** (Framer Motion — animacje)
- **yet-another-react-lightbox** (galerie postów)
- **@mapbox/polyline** (Strava polyline decoding)
