import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schema } from "@/sanity/schemas";

export default defineConfig({
  basePath: studioUrl,
  name: "run-seba",
  title: "run-seba.pl",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Treści")
          .items([
            S.listItem()
              .title("Wpisy")
              .child(
                S.documentTypeList("post")
                  .title("Wpisy")
                  .defaultOrdering([{ field: "date", direction: "desc" }]),
              ),
            S.listItem()
              .title("Autor (Seba)")
              .child(
                S.document()
                  .schemaType("author")
                  .documentId("seba")
                  .title("Autor"),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
