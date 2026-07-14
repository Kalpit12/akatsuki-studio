import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkIndex } from "@/components/work/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected films and campaigns by Akatsuki Studio — recent visual work built to move brands past the scroll.",
};

export default function WorkPage() {
  return <WorkIndex projects={projects} />;
}
