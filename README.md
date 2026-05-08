# run-seba.pl

Blog o bieganiu — Next.js 16 (App Router) + Tailwind v4 + MDX.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 + `@tailwindcss/typography` + shadcn/ui
- `@next/mdx` + `gray-matter` (frontmatter) + `remark-gfm`
- `next-themes` (dark mode)
- Hosting: Vercel
- Domena: run-seba.pl (nazwa.pl)

## Praca lokalnie

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build produkcyjny
```

Skopiuj `.env.example` → `.env.local`, jeśli zmieniasz `NEXT_PUBLIC_SITE_URL`.

## Pisanie postów

Każdy post to plik `.mdx` w `content/posts/`. Slug = nazwa pliku.

```mdx
---
title: "Tytuł wpisu"
description: "Krótki opis (pokazuje się na liście i w Google)."
date: "2026-05-08"
tags: ["maraton", "buty"]
---

Treść markdownem. Można osadzać React/MDX:

![Opis zdjęcia](/sciezka-do-zdjecia.jpg)
```

Po dodaniu pliku i pushu — Vercel zbuduje i opublikuje. Lokalnie zobaczysz po `npm run dev`.

## Deploy na Vercel

1. Wepchnij repo do GitHuba.
2. Na vercel.com → "Add New… → Project" → import repo.
3. Framework: Next.js (auto-wykryje). Brak zmiennych wymaganych.
4. Po pierwszym deployu: **Settings → Domains** → dodaj `run-seba.pl` i `www.run-seba.pl`.
5. Vercel pokaże rekordy DNS do wklejenia w panelu nazwa.pl:
   - `A` `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
6. W nazwa.pl (panel domeny → DNS) ustaw te rekordy. Propagacja: kilka minut do paru godzin.

## Struktura

```
content/posts/         pliki .mdx
src/
  app/                 strony (App Router)
    blog/[slug]/       pojedynczy post
    tagi/[tag]/        wpisy po tagu
  components/          UI (header, footer, theme toggle…)
  lib/posts.ts         helper do listowania postów + tagów
  mdx-components.tsx   globalne komponenty MDX (img → next/image, a → next/link)
```

## Sanity (CMS dla kolegi)

Studio osadzone pod `/studio` na tej samej domenie (np. `https://run-seba.pl/studio`). Kolega wchodzi w przeglądarce, loguje się kontem Sanity (Google/GitHub) i pisze posty w edytorze block-content (jak Notion).

### Lokalnie

1. `.env.local` musi mieć:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=cr63utxk
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_REVALIDATE_SECRET=<wygenerowany sekret>
   ```
2. `npm run dev` → otwórz `http://localhost:3000/studio`.

### Vercel — zmienne środowiskowe (Production + Preview)

W Vercel → Settings → Environment Variables dodaj:
- `NEXT_PUBLIC_SITE_URL` = `https://run-seba.pl`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `cr63utxk`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` = `2026-05-08`
- `SANITY_REVALIDATE_SECRET` = ten sam sekret co lokalnie

Po zapisie → Deployments → Redeploy.

### Webhook do natychmiastowej rewalidacji

Bez webhooka strona odświeża treści Sanity co 60 sekund (revalidate). Z webhookiem — natychmiast po publikacji.

W Sanity (`https://www.sanity.io/manage/personal/project/cr63utxk/api/webhooks`):
1. **Create webhook**
2. Name: `Vercel revalidate`
3. URL: `https://run-seba.pl/api/revalidate`
4. Dataset: `production`
5. Trigger on: Create, Update, Delete
6. Filter: `_type == "post"`
7. Projection:
   ```
   { _type, "slug": slug.current }
   ```
8. HTTP method: `POST`
9. HTTP Headers: zostaw default
10. **Secret**: ten sam co `SANITY_REVALIDATE_SECRET` w Vercel
11. Save

Każda publikacja postu w Studio wywoła revalidate `/`, `/blog/[slug]`, `/tagi`, `/tagi/[tag]`.

## Pisanie postów w MDX (alternatywa dla Sanity)

Dla custom contentu z osadzonymi komponentami React (np. interaktywny kalkulator tempa) możesz dalej pisać w MDX. Plik `.mdx` w `content/posts/`, slug = nazwa pliku.

```mdx
---
title: "Tytuł wpisu"
description: "Krótki opis (1-2 zdania)."
date: "2026-05-08"
tags: ["maraton", "buty"]
cover: "/posts/{slug}.jpg"
---

Treść markdownem. Zdjęcia wrzucaj do `public/posts/`.
```

`getAllPosts()` ciągnie z obu źródeł i łączy po dacie.

## Następne kroki

- Embed Instagrama (`@run_seba`) przez LightWidget.
- Kalkulator tempa / VDOT.
- Newsletter (MailerLite/Buttondown).
- Integracja ze Stravą (ostatnie aktywności).
- Strona `/trasy` z mapami tras.
