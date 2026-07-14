import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "industry", type: "string" }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "coverVideo", type: "url" }),
    defineField({ name: "coverImage", type: "url" }),
    defineField({ name: "heroVideo", type: "url" }),
    defineField({ name: "challenge", type: "text" }),
    defineField({ name: "direction", type: "text" }),
    defineField({
      name: "results",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "credits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "role", type: "string" },
            { name: "name", type: "string" },
          ],
        },
      ],
    }),
    defineField({ name: "gallery", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "featured", type: "boolean" }),
  ],
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client Logo",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "logo", type: "image" }),
  ],
});

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "image", type: "url" }),
  ],
});

export const schemas = [project, clientLogo, journalPost];
