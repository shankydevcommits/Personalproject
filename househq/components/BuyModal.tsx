"use client";

import { useState } from "react";
import { formatPrice, type Product, type Bundle } from "@/lib/catalog";

export type ModalTarget =
  | { mode: "single"; product: Product }
  | { mode: "bundle"; bundle: Bundle };

export default function BuyModal({
  target,
  onClose,
}: {
  target: ModalTarget | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!target) return null;

  const name =
    target.mode === "single"
      ? target.product.name
      : `The Complete ${target.bundle.stateName} Bundle`;
  const price =
    target.mode === "single"
      ? target.product.priceCents
      : target.bundle.priceCents;

  function reset() {
    setEmail("");
    setPhone("");
    setConsent(false);
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function submit() {
    if (!target) return;
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        target.mode === "single" ? "/api/checkout" : "/api/checkout-bundle";
      const payload =
        target.mode === "single"
          ? { slug: target.product.slug, email, phone, marketingConsent: consent }
          : { state: target.bundle.state, email, phone, marketingConsent: consent };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>
          Close ✕
        </button>

        <div className="modal-step active">
          <div className="modal-eyebrow">Checkout</div>
          <h3>Almost there</h3>
          <div className="product-name">
            {name} — {formatPrice(price)}
          </div>

          <label>Email address</label>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="hint">
            We&apos;ll email your verification code and download link here
            once your payment is confirmed.
          </div>

          <label>Mobile number</label>
          <input
            type="tel"
            placeholder="04XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="hint">
            Captured for order updates — not used for verification.
          </div>

          <div className="consent-row">
            <input
              type="checkbox"
              id="consentBox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <p>
              Also send me occasional emails about new checklists and
              bundles. I can unsubscribe anytime. (Optional — required
              fields above are only for delivering my purchase.) See our{" "}
              <a href="/legal/privacy" className="link-inline" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}
          <div className="form-note">
            You&apos;ll enter your card details next on Stripe&apos;s secure
            checkout page. After payment, we&apos;ll email you a 4-digit code
            to verify it&apos;s really your email before the download
            unlocks.
          </div>

          <button className="modal-btn" onClick={submit} disabled={loading}>
            {loading ? "Redirecting to payment…" : "Continue to payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
