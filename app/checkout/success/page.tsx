import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-5 py-24 text-center text-muted">Verifying your payment…</div>}>
      <SuccessContent sessionId={searchParams.session_id || ""} />
    </Suspense>
  );
}
