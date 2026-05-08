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

## Następne kroki (po MVP)

- Migracja treści do Sanity (CMS dla nietechnicznego autora).
- Embed Instagrama przez LightWidget.
- Kalkulator tempa / VDOT.
- Newsletter (MailerLite/Buttondown).
- Integracja ze Stravą.
