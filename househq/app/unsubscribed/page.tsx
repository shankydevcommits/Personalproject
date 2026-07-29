import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UnsubscribedClient from "./UnsubscribedClient";

export const dynamic = "force-dynamic";

export default function UnsubscribedPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <UnsubscribedClient />
      </Suspense>
      <SiteFooter />
    </>
  );
}
