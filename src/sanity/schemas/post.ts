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
