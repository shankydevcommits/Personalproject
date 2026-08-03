"use client";

import { useState } from "react";
import BuyModal, { type ModalTarget } from "./BuyModal";
import type { Product } from "@/lib/catalog";

export default function BuyButton({ product }: { product: Product }) {
  const [target, setTarget] = useState<ModalTarget | null>(null);

  return (
    <>
      <span
        className="buy-btn"
        style={{ cursor: "pointer" }}
        onClick={() => setTarget({ mode: "single", product })}
      >
        Buy now
      </span>
      <BuyModal target={target} onClose={() => setTarget(null)} />
    </>
  );
}
