import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-3 font-sans text-4xl font-light tracking-tight text-brand-text">
        We couldn’t find that page
      </h1>
      <p className="mt-2 font-serif text-[15px] leading-relaxed text-brand-text/70">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link href="/dashboard" className="btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}
