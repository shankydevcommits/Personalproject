"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Links = { name: string; url: string }[];

export default function VerifyClient() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const token = params.get("token");

  const [phase, setPhase] = useState<"loading" | "code" | "done">(
    token ? "loading" : "code"
  );
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<Links>([]);
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "loading">(
    "idle"
  );
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const attemptedMagicLink = useRef(false);

  useEffect(() => {
    if (orderId && token && !attemptedMagicLink.current) {
      attemptedMagicLink.current = true;
      verify({ orderId, token });
    }
  }, [orderId, token]);

  if (!orderId) {
    return (
      <div className="verify-wrap">
        <div className="verify-card">
          <div className="form-error">Missing order reference.</div>
        </div>
      </div>
    );
  }

  async function verify(body: { orderId: string; code?: string; token?: string }) {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setPhase("code");
        return;
      }
      setLinks(data.links || []);
      setPhase("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("code");
    }
  }

  function handleCodeSubmit() {
    if (!orderId) return;
    const code = boxRefs.current.map((el) => el?.value || "").join("");
    if (code.length !== 4) {
      setError("Enter the 4-digit code from your email.");
      return;
    }
    verify({ orderId, code });
  }

  async function handleResend() {
    if (!orderId) return;
    setResendStatus("loading");
    try {
      const res = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      setResendStatus(res.ok ? "sent" : "idle");
    } catch {
      setResendStatus("idle");
    }
  }

  return (
    <div className="verify-wrap">
      <div className="verify-card">
        {phase === "loading" && (
          <div className="modal-success">
            <p>Verifying…</p>
          </div>
        )}

        {phase === "code" && (
          <>
            <div className="modal-eyebrow">Step 2 of 2 — Enter your code</div>
            <h3>Check your email</h3>
            <div className="product-name">
              We&apos;ve sent a 4-digit code to your email to confirm it&apos;s
              you.
            </div>
            <div className="code-boxes">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  ref={(el) => {
                    boxRefs.current[i] = el;
                  }}
                  onInput={(e) => {
                    const val = (e.target as HTMLInputElement).value;
                    if (val && boxRefs.current[i + 1]) {
                      boxRefs.current[i + 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="hint" style={{ marginTop: 12 }}>
              Didn&apos;t get it?{" "}
              <a
                onClick={handleResend}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {resendStatus === "loading"
                  ? "Sending…"
                  : resendStatus === "sent"
                  ? "Sent — check your inbox"
                  : "Resend code"}
              </a>
            </div>
            <button className="modal-btn" onClick={handleCodeSubmit}>
              Verify &amp; unlock download
            </button>
          </>
        )}

        {phase === "done" && (
          <div className="modal-success">
            <div className="check">✓</div>
            <h3>You&apos;re verified</h3>
            <p style={{ fontSize: 13, color: "var(--slate)", margin: "10px 0 22px" }}>
              Your download link{links.length > 1 ? "s have" : " has"} also
              been emailed to you as a backup.
            </p>
            <ul className="download-list">
              {links.map((l) => (
                <li key={l.url}>
                  <span>{l.name}</span>
                  <a className="download-btn" href={l.url}>
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
