"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function UnsubscribedClient() {
  const params = useSearchParams();
  const ok = params.get("ok") === "1";

  return (
    <div className="simple-page">
      <h1>{ok ? "You're unsubscribed" : "Link expired or invalid"}</h1>
      <p>
        {ok
          ? "You won't receive any more marketing emails from HouseHQ. You'll still get transactional emails for anything you purchase."
          : "That unsubscribe link couldn't be verified. If you're still receiving unwanted emails, use the Contact form and we'll remove you manually."}
      </p>
      <Link href="/" className="back-link">
        ← Back to HouseHQ
      </Link>
    </div>
  );
}
