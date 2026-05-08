import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./author";
import { postType } from "./post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType],
};
