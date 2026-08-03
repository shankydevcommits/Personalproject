"use client";

import { useState } from "react";
import {
  states,
  categoryMeta,
  categoryHeading,
  stateAbbr,
  stateChipLabel,
  formatPrice,
  productsFor,
  findBundle,
  bundleWasCents,
  type Product,
  type Bundle,
} from "@/lib/catalog";
import BuyModal, { type ModalTarget } from "./BuyModal";

const STAGE_TABS = ["all", "fhb", "renters", "investors", "sellers"];

export default function Storefront() {
  const [currentState, setCurrentState] = useState("vic");
  const [currentTab, setCurrentTab] = useState("all");
  const [target, setTarget] = useState<ModalTarget | null>(null);

  const abbr = stateAbbr[currentState];
  const bundle = findBundle(currentState) as Bundle;
  const wasCents = bundleWasCents(currentState);
  const visibleProducts = productsFor(
    currentState,
    currentTab === "all" ? undefined : currentTab
  );

  function scrollToCatalog() {
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section id="categories">
        <div className="section-head">
          <div className="section-label">Start here</div>
          <h2>Find your stage</h2>
        </div>
        <div className="block-grid">
          {STAGE_TABS.map((tab) => (
            <div
              key={tab}
              className={`select-block${tab === currentTab ? " active" : ""}`}
              onClick={() => {
                setCurrentTab(tab);
                scrollToCatalog();
              }}
            >
              <div className="cat-code">{categoryMeta[tab].code}</div>
              <h3>{categoryMeta[tab].name}</h3>
              <p>{categoryMeta[tab].blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="state-select">
        <div className="section-head">
          <div className="section-label">Then</div>
          <h2>Choose your state</h2>
        </div>
        <div className="block-grid">
          {states.map((s) => (
            <div
              key={s}
              className={`select-block${s === currentState ? " active" : ""}`}
              onClick={() => {
                setCurrentState(s);
                scrollToCatalog();
              }}
            >
              <div className="cat-code">STATE</div>
              <h3>{stateChipLabel[s]}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="catalog">
        <div className="section-head">
          <div className="section-label">The catalogue</div>
          <h2>
            {categoryHeading[currentTab]} for <span>{abbr}</span>
          </h2>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onBuy={() => setTarget({ mode: "single", product })}
            />
          ))}
        </div>

        <div className="bundle-strip">
          <div className="left">
            <h4>The Complete {stateChipLabel[currentState]} Bundle</h4>
            <p>All 13 checklists (FHB, renters, investors and sellers) in one download.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div className="bundle-price">
              <span className="was">{formatPrice(wasCents)}</span>
              {formatPrice(bundle.priceCents)}
            </div>
            <span
              className="buy-btn"
              style={{
                background: "var(--stamp)",
                borderColor: "var(--stamp)",
                color: "var(--white)",
                cursor: "pointer",
              }}
              onClick={() => setTarget({ mode: "bundle", bundle })}
            >
              Buy bundle
            </span>
          </div>
        </div>
      </section>

      <BuyModal target={target} onClose={() => setTarget(null)} />
    </>
  );
}

function ProductCard({
  product,
  onBuy,
}: {
  product: Product;
  onBuy: () => void;
}) {
  return (
    <div className="product-card">
      {product.pinned && <div className="pinned-badge">&#9733;</div>}
      <div className="product-topline">
        <h4 style={{ maxWidth: "75%" }}>{product.name}</h4>
        <div className="badge-mini">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>
      <div className="desc">{product.description}</div>
      <div className="product-footer">
        <span className="price">{formatPrice(product.priceCents)}</span>
        <span className="buy-btn" onClick={onBuy} style={{ cursor: "pointer" }}>
          Buy now
        </span>
      </div>
    </div>
  );
}
