"use client";

import { useState } from "react";

export default function NotifyForm({
  list,
  placeholder,
}: {
  list: "agents" | "guides" | "tools";
  placeholder: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div className="form-success">You&apos;re on the list.</div>;
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Notify me"}
      </button>
      {status === "error" && (
        <div className="form-error" style={{ width: "100%" }}>
          Enter a valid email.
        </div>
      )}
    </form>
  );
}
