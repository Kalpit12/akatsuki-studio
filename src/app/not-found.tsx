import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="label mb-4">404</p>
      <h1 className="heading-lg mb-6">This scene doesn&apos;t exist</h1>
      <p className="mb-10 max-w-md text-muted">
        The page you&apos;re looking for has been cut from the final edit.
      </p>
      <MagneticButton href="/">Return Home</MagneticButton>
    </div>
  );
}
