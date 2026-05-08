import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Imię",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rola / opis",
      type: "string",
      description: "Np. \"Biegacz KS Ultra, ambasador @butyjana\"",
    }),
    defineField({
      name: "klub",
      title: "Klub",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Zdjęcie",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "shortBio",
      title: "Krótka bio (1-2 zdania)",
      type: "text",
      rows: 2,
      description: "Pokazuje się pod hero na home, w kartach itp.",
    }),
    defineField({
      name: "bio",
      title: "Pełna bio (na /o-mnie)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normalny", value: "normal" },
            { title: "Nagłówek 2", value: "h2" },
          ],
          marks: {
            decorators: [
              { title: "Pogrubienie", value: "strong" },
              { title: "Kursywa", value: "em" },
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
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "personalBests",
      title: "Rekordy życiowe",
      type: "array",
      of: [
        {
          type: "object",
          name: "pb",
          title: "PB",
          fields: [
            defineField({
              name: "distance",
              title: "Dystans",
              type: "string",
              description: "Np. \"Półmaraton\", \"10 km\"",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "time",
              title: "Czas",
              type: "string",
              description: "Np. \"1:22:52\" (HM) lub \"36:59\" (10k)",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "year",
              title: "Rok",
              type: "string",
              description: "Opcjonalnie, np. \"2022\"",
            }),
          ],
          preview: {
            select: {
              distance: "distance",
              time: "time",
              year: "year",
            },
            prepare({ distance, time, year }) {
              return {
                title: `${distance ?? "—"}: ${time ?? "—"}`,
                subtitle: year ?? "",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "links",
      title: "Linki",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          title: "Link",
          fields: [
            defineField({
              name: "label",
              title: "Etykieta",
              type: "string",
              description: "Np. \"@run_seba\"",
            }),
            defineField({
              name: "type",
              title: "Typ",
              type: "string",
              options: {
                list: [
                  { value: "instagram", title: "Instagram" },
                  { value: "strava", title: "Strava" },
                  { value: "facebook", title: "Facebook" },
                  { value: "youtube", title: "YouTube" },
                  { value: "website", title: "Strona / inne" },
                ],
                layout: "dropdown",
              },
              initialValue: "website",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { label: "label", url: "url" },
            prepare({ label, url }) {
              return { title: label ?? url, subtitle: url };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { name: "name", role: "role", media: "avatar" },
    prepare({ name, role, media }) {
      return { title: name ?? "Autor", subtitle: role, media };
    },
  },
});
