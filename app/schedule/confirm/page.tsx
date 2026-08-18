import { Suspense } from "react";
import { ConfirmResponse } from "@/components/ConfirmResponse";

export const metadata = { title: "Confirm Availability" };

/**
 * Landing page for availability-poll email links. Token-authenticated via
 * security-definer RPCs, so no sign-in is required.
 */
export default function ConfirmPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-surface px-4">
      <Suspense fallback={null}>
        <ConfirmResponse />
      </Suspense>
    </div>
  );
}
