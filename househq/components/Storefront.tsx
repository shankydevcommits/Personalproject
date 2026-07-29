"use client";

import { useState } from "react";
import {
  states,
  categoryMeta,
  stateAbbr,
  stateChipLabel,
  formatPrice,
  productsFor,
  findBundle,
  type Product,
  type Bundle,
} from "@/lib/catalog";
import BuyModal, { type ModalTarget } from "./BuyModal";

const ALL_TABS = ["fhb", "renters", "investors", "sellers"];

export default function Storefront() {
  const [currentState, setCurrentState] = useState("vic");
  const [currentTab, setCurrentTab] = useState("all");
  const [target, setTarget] = useState<ModalTarget | null>(null);

  const abbr = stateAbbr[currentState];
  const bundle = findBundle(currentState) as Bundle;
  const tabsToShow = currentTab === "all" ? ALL_TABS : [currentTab];

  function switchState(state: string) {
    setCurrentState(state);
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
        <div
          className="state-selector"
          style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}
        >
          {states.map((s) => (
            <div
              key={s}
              className={`state-chip${s === currentState ? " active" : ""}`}
              onClick={() => switchState(s)}
            >
              {stateChipLabel[s]}
            </div>
          ))}
        </div>
        <div className="cat-grid">
          {ALL_TABS.map((cat) => (
            <div
              key={cat}
              className="cat-card"
              onClick={() => {
                setCurrentTab(cat);
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="cat-code">{categoryMeta[cat].code}</div>
              <h3>{categoryMeta[cat].name}</h3>
              <p>{categoryMeta[cat].blurb}</p>
              <div className="cat-count">
                3 checklists · <span>{abbr}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="catalog">
        <div className="section-head">
          <div className="section-label">The catalogue</div>
          <h2>
            First Home Buyer checklists — <span>{abbr}</span>
          </h2>
        </div>
        <div className="catalog-tabs">
          <div
            className={`tab${currentTab === "all" ? " active" : ""}`}
            onClick={() => setCurrentTab("all")}
          >
            All
          </div>
          {ALL_TABS.map((cat) => (
            <div
              key={cat}
              className={`tab${currentTab === cat ? " active" : ""}`}
              onClick={() => setCurrentTab(cat)}
            >
              {categoryMeta[cat].name}
            </div>
          ))}
        </div>

        {tabsToShow.map((cat) => (
          <div className="product-grid" key={cat}>
            {productsFor(currentState, cat).map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onBuy={() => setTarget({ mode: "single", product })}
              />
            ))}
          </div>
        ))}

        <div className="bundle-strip">
          <div className="left">
            <h4>The Complete {stateChipLabel[currentState]} Bundle</h4>
            <p>
              All 12 checklists — FHB, renters, investors and sellers — in one
              download.
            </p>
          </div>
          <div
            className="bundle-price"
            onClick={() => setTarget({ mode: "bundle", bundle })}
            style={{ cursor: "pointer" }}
          >
            <span className="was">{formatPrice(bundle.wasCents)}</span>
            {formatPrice(bundle.priceCents)}
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
