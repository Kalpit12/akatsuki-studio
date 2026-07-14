import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemas } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "akatsuki-studio",
  title: "Akatsuki Studio CMS",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemas },
});
