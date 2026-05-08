import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Wpis",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Krótki opis",
      type: "text",
      rows: 3,
      description:
        "Pokazuje się na liście postów i w wynikach Google. 1–2 zdania.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "date",
      title: "Data publikacji",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Zdjęcie nagłówkowe",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (opis dla czytników ekranu i SEO)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tagi",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "np. maraton, buty, trening, trasy, współpraca",
    }),
    defineField({
      name: "body",
      title: "Treść",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normalny", value: "normal" },
            { title: "Nagłówek 2", value: "h2" },
            { title: "Nagłówek 3", value: "h3" },
            { title: "Cytat", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Pogrubienie", value: "strong" },
              { title: "Kursywa", value: "em" },
              { title: "Kod", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Podpis", type: "string" }),
          ],
        },
        {
          type: "object",
          name: "embed",
          title: "Embed (YouTube / Strava / Vimeo)",
          fields: [
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description:
                "Wklej link do filmu YouTube, aktywności Strava lub filmu Vimeo. System sam rozpozna typ.",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "caption",
              title: "Podpis (opcjonalnie)",
              type: "string",
            }),
          ],
          preview: {
            select: { url: "url", caption: "caption" },
            prepare({ url, caption }) {
              return {
                title: caption ?? "Embed",
                subtitle: url ?? "(brak URL)",
              };
            },
          },
        },
        {
          type: "object",
          name: "gallery",
          title: "Galeria zdjęć",
          fields: [
            defineField({
              name: "images",
              title: "Zdjęcia",
              type: "array",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Alt text",
                      type: "string",
                    }),
                    defineField({
                      name: "caption",
                      title: "Podpis",
                      type: "string",
                    }),
                  ],
                },
              ],
              validation: (rule) => rule.min(2).max(24),
              options: { layout: "grid" },
            }),
            defineField({
              name: "layout",
              title: "Układ",
              type: "string",
              options: {
                list: [
                  { title: "Grid 2 kolumny", value: "grid-2" },
                  { title: "Grid 3 kolumny", value: "grid-3" },
                  { title: "Mozaika (różne rozmiary)", value: "mosaic" },
                ],
                layout: "radio",
              },
              initialValue: "grid-2",
            }),
          ],
          preview: {
            select: {
              images: "images",
              layout: "layout",
            },
            prepare({ images, layout }) {
              const count = Array.isArray(images) ? images.length : 0;
              const noun =
                count === 1 ? "zdjęcie" : count < 5 ? "zdjęcia" : "zdjęć";
              return {
                title: `Galeria — ${count} ${noun}`,
                subtitle: layout ?? "grid-2",
                media: Array.isArray(images) ? images[0] : undefined,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "cover",
    },
    prepare({ title, date, media }) {
      const dateStr = date
        ? new Intl.DateTimeFormat("pl-PL").format(new Date(date))
        : "(brak daty)";
      return { title: title ?? "(bez tytułu)", subtitle: dateStr, media };
    },
  },
  orderings: [
    {
      title: "Data malejąco",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
