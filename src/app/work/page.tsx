import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkIndex } from "@/components/work/WorkIndex";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Our most recent works — films and campaigns by Akatsuki Studio. Vibrant visuals that tell powerful stories.",
};

export default function WorkPage() {
  return <WorkIndex projects={projects} />;
}
