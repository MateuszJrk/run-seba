# Jutro z Sebą — checklist

Spotkanie z Sebą. Ten plik to punkt odniesienia, żeby nic nie przegapić. Po wizycie można go usunąć.

---

## 🚀 Setup techniczny (~30 min razem)

### Sanity CMS

- [ ] Zaprosić Sebę jako **Editor** w Sanity:
      <https://www.sanity.io/manage/project/cr63utxk/members> → Invite member → email Seby → role: **Editor**
- [ ] Seba akceptuje invite z maila + tworzy konto (Google/GitHub OAuth)
- [ ] Wchodzi na <https://run-seba.pl/studio>, loguje się
- [ ] Razem otwieramy w Sanity **Autor (Seba)** — singleton dokument:
  - Wpisuje swoje **imię/ksywka**, rolę, klub, krótką bio
  - Wrzuca **avatar** (zdjęcie)
  - Edytuje **rekordy życiowe** (PB) — może dodać własne kategorie
  - Dodaje **linki social** (IG, Strava, FB, YT, www)
  - Pełna bio w **bio** (block content) — pokazuje się na /o-mnie
  - Bez tego strona /o-mnie używa fallback hardcoded — działa, ale Seba nie edytuje sam
- [ ] Razem tworzymy pierwszy "prawdziwy" post — pokazujemy mu:
  - jak dodać tytuł, slug, opis, datę, cover, tagi
  - jak pisać w block-content (nagłówki, listy, pogrubienie, linki)
  - jak wstawić **galerię zdjęć** (`+` → Galeria zdjęć, drag&drop, układ grid/mozaika)
  - jak osadzić **YouTube/Strava embed** (`+` → Embed → wkleja URL)
  - **Publish** vs Draft
  - Slug = nie zmienia po publikacji (psuje linki)

### LightWidget (Instagram feed)

- [ ] Razem zakładamy konto na <https://lightwidget.com> (przez OAuth Instagram `@run_seba` — Seba klika)
- [ ] Tworzymy widget:
  - Layout: Grid 3×2 (6 ostatnich zdjęć)
  - Bez border, transparent background
- [ ] Kopiujemy widget ID (z embed code: `cdn.lightwidget.com/widgets/<ID>.html`)
- [ ] Wpisujemy `NEXT_PUBLIC_LIGHTWIDGET_ID` w Vercel envs (Production + Preview + Development)
- [ ] Redeploy → na `/o-mnie` pojawia się sekcja "Z Instagrama @run_seba"

### Google Analytics 4

- [ ] Wejdź na <https://analytics.google.com/>
- [ ] Utwórz nowe property dla `run-seba.pl` (data stream: Web)
- [ ] Skopiuj **Measurement ID** (format: `G-XXXXXXXXXX`)
- [ ] Dodaj `NEXT_PUBLIC_GA_MEASUREMENT_ID` w Vercel envs (Production + Preview)
- [ ] Redeploy — GA4 z Consent Mode default-deny (zgodne z GDPR bez bannera)

### MapTiler (ładniejsze mapy w /biegi/[id]) — można dziś

- [ ] Rejestracja: <https://cloud.maptiler.com/auth/widget> (free tier 100k req/m)
- [ ] Skopiuj API key z <https://cloud.maptiler.com/account/keys/>
- [ ] Dodaj `NEXT_PUBLIC_MAPTILER_KEY` w Vercel envs (Production + Preview + Development)
- [ ] Redeploy → mapy w `/biegi/[id]` używają vector tiles streets-v2 zamiast OSM raster

Bez tego klucza wszystko działa, tylko mapy są mniej "smooth".

### Strava (jeśli Seba ma konto i publikuje aktywności)

**Pre-Seba (Mateusz):**

- [ ] Rejestracja Strava App: <https://www.strava.com/settings/api>
  - Application name: `run-seba.pl`
  - Category: Other
  - Website: `https://run-seba.pl`
  - Authorization Callback Domain: `run-seba.pl`
- [ ] Zachowaj Client ID + Client Secret

**Z Sebą:**

- [ ] W przeglądarce otworzyć link autoryzacji (zamień `XXX` na Client ID):

      ```
      https://www.strava.com/oauth/authorize?client_id=XXX&redirect_uri=https://run-seba.pl/&response_type=code&scope=read,activity:read
      ```

- [ ] Seba klika **Authorize**, Strava przekieruje na `https://run-seba.pl/?code=YYY&scope=...`
- [ ] Skopiować `code` z URL
- [ ] Jednorazowa wymiana code → refresh_token (curl):

      ```bash
      curl -X POST https://www.strava.com/oauth/token \
        -F client_id=XXX -F client_secret=ZZZ -F code=YYY \
        -F grant_type=authorization_code
      ```

- [ ] Z odpowiedzi JSON wyciągnąć `refresh_token`
- [ ] 3 envy w Vercel: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`
- [ ] Redeploy → sekcja "Ostatnie biegi" na home zamienia się z mock na real

---

## ❓ Pytania do Seby (dla content / decyzji)

### Sprzęt i pomiary

- [ ] Z jakiego **zegarka** korzystasz? (Garmin XYZ? Coros? Apple Watch? Polar?)
- [ ] Czy synchronizujesz aktywności **z Stravą** automatycznie?
- [ ] Czy **publikujesz aktywności publicznie** na Stravie (visibility = Everyone)?
- [ ] Jakich **butów** używasz w rotacji? (modele, ile km, co recenzowałbyś)
- [ ] Inne ulubione marki/sprzęt: czołówka, kompresory, GPS pulsometr, plecak hydration?

### Treningi i plany

- [ ] Z jakiego **planu treningowego** korzystasz? (Daniels' Running Formula? Pfitzinger? Hanson? Własny?)
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
- [ ] Czy chcesz **mail kontaktowy** publiczny (`hej@run-seba.pl` jako placeholder)?
- [ ] Co chciałbyś **zmienić wizualnie** na blogu? (kolorystyka, krój, układ — granat butyjana OK?)

---

## 🎬 Demo dla Seby (~15 min)

Pokazać blog na pełnej okazałości:

- [ ] **Hero** z parallax (jego zdjęcie z trasy)
- [ ] **Lista postów** z stagger animacją
- [ ] **Pojedynczy post** — galeria zdjęć, lightbox, reading progress, related posts
- [ ] **Kalkulator tempa** — z jego PB jako default
- [ ] **Strony** /o-mnie z PB grid (count-up), /kontakt
- [ ] **Custom 404** ("Zgubiłeś trasę")
- [ ] **Mobile** — hamburger menu, mobile-friendly kalkulator
- [ ] **Dark mode** toggle
- [ ] **Studio** — pokazać jak wygląda jego edytor
- [ ] **Vercel dashboard** — analytics, deployment, jak wgląda od admin strony

---

## 🛠️ Decyzje do podjęcia razem

- [ ] **Sekcja /trasy** na blogu:
      - **A)** Curated: Seba wybiera 5-10 ulubionych tras, dodaje GPX + opis + zdjęcia w Sanity. Mapy na każdej.
      - **B)** Tylko Strava feed: nie ma osobnej strony `/trasy`, ostatnie biegi automatycznie z API.
      - **C)** Oba: `/trasy` curated dla flagshipowych, plus Strava feed na home dla świeżego.
- [ ] **Newsletter**: zostawiamy NIE? (Mateusz już zdecydował, ale zapytać dla pewności)
- [ ] **Komentarze pod postami**: Seba chce / nie? (default: nie ma — moderowanie, spam, mało wartości)
- [ ] **Author info w Sanity**: czy stworzyć osobny dokument "author" żeby Seba mógł edytować swoją bio bez kodu, czy zostawić hardcoded?

---

## 📋 Po spotkaniu (Mateusz, samodzielnie)

- [ ] Wpisać wszystkie envy do Vercel (LightWidget, Strava jeśli ustaliliśmy)
- [ ] Redeploy
- [ ] Test produkcji: Strava feed, IG widget, Sanity webhook → publikacja → revalidate
- [ ] Usunąć ten plik (`JUTRO.md`) jeśli wszystko zrobione
- [ ] Aktualizacja `README.md` z final stanem (envs, instrukcje dla Seby)
- [ ] Wysłać Sebie linki "ściągi":
  - Studio: <https://run-seba.pl/studio>
  - Live: <https://run-seba.pl>
  - Webhook tab w Sanity (gdyby chciał śledzić revalidacje)

---

## 🔮 Backlog na później (nie dziś, nie jutro)

- RSS feed `/rss.xml` (~15 min)
- Wyszukiwarka Cmd+K (gdy postów >10)
- Author "Seba" jako dokument w Sanity (zamiast hardcoded)
- Speed Insights metrics review po pierwszym tygodniu
- Pierwsza wzmianka w mediach społecznościowych (post Seby na IG: "Mam blog!")
- Migracja istniejących treści (jeśli Seba miał coś na innej platformie)
- Komercyjna współpraca jak ruch wzrośnie (wartość ad-spaceów, sklepu afiliacyjnego)
