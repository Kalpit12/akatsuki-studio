import type { Metadata } from "next";
import { journalPosts } from "@/data/journal";
import { JournalIndex } from "@/components/journal/JournalIndex";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Insights on creative campaigns, craft, and process notes from Akatsuki Studio Kenya.",
};

export default function JournalPage() {
  return <JournalIndex posts={[...journalPosts]} />;
}
