import { WorkMorphProvider } from "@/components/work/WorkMorphProvider";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkMorphProvider>{children}</WorkMorphProvider>;
}
