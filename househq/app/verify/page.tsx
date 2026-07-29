import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VerifyClient from "./VerifyClient";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div className="verify-wrap">Loading…</div>}>
        <VerifyClient />
      </Suspense>
      <SiteFooter />
    </>
  );
}
