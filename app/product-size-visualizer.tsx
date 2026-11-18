"use client";

import Image from "next/image";
import { useState } from "react";

export type ProductSizeOption = {
  id: string;
  volumeMl: number;
  image: string;
  price?: number;
  dimensions?: string;
  imageScale?: number;
  imageAlt?: string;
};

export type VisualizedProduct = {
  name: string;
  sizes: readonly ProductSizeOption[];
};

type ProductSizeVisualizerProps = {
  product: VisualizedProduct;
  id?: string;
};

const formatUgx = (amount: number) => `UGX ${amount.toLocaleString("en-UG")}`;

export default function ProductSizeVisualizer({
  product,
  id,
}: ProductSizeVisualizerProps) {
  const firstSize = product.sizes[0];
  const [selectedSizeId, setSelectedSizeId] = useState(firstSize?.id ?? "");
  const [previewSizeId, setPreviewSizeId] = useState<string | null>(null);

  if (!firstSize) {
    throw new Error(`Product "${product.name}" must have at least one size option.`);
  }

  const selectedSize =
    product.sizes.find(({ id: sizeId }) => sizeId === selectedSizeId) ?? firstSize;
  const displayedSize =
    product.sizes.find(({ id: sizeId }) => sizeId === previewSizeId) ?? selectedSize;
  const splitIndex = Math.ceil(product.sizes.length / 2);

  const renderOptions = (sizes: readonly ProductSizeOption[], alignment: "left" | "right") => (
    <div className={`product-size-options product-size-options-${alignment}`}>
      {sizes.map((size) => (
        <button
          className="product-size-option"
          type="button"
          key={size.id}
          aria-pressed={selectedSize.id === size.id}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setPreviewSizeId(size.id);
          }}
          onFocus={() => setPreviewSizeId(size.id)}
          onClick={() => {
            setSelectedSizeId(size.id);
            setPreviewSizeId(null);
          }}
        >
          <span className="product-size-volume">{size.volumeMl} ml</span>
          {size.price !== undefined && (
            <span className="product-size-price">{formatUgx(size.price)}</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <section
      className="product-size-visualizer"
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="product-size-visualizer-inner">
        <div className="product-size-heading">
          <h2 id={id ? `${id}-title` : undefined}>{product.name}</h2>
          <p>Click to see Bottle Size.</p>
        </div>

        <div
          className="product-size-layout"
          role="group"
          aria-label={`${product.name} sizes`}
          onPointerLeave={() => setPreviewSizeId(null)}
          onBlur={(event) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              setPreviewSizeId(null);
            }
          }}
        >
          {renderOptions(product.sizes.slice(0, splitIndex), "left")}

          <div className="product-size-preview" aria-live="polite">
            <div className="product-size-image">
              {product.sizes.map((size) => (
                <div
                  className={`product-size-image-layer${displayedSize.id === size.id ? " is-visible" : ""}`}
                  key={size.id}
                  aria-hidden={displayedSize.id !== size.id}
                >
                  <div
                    className="product-size-image-asset"
                    style={{
                      width: `${(size.imageScale ?? 1) * 100}%`,
                      height: `${(size.imageScale ?? 1) * 100}%`,
                    }}
                  >
                    <Image
                      src={size.image}
                      alt={
                        displayedSize.id === size.id
                          ? size.imageAlt ?? `${product.name}, ${size.volumeMl} ml`
                          : ""
                      }
                      fill
                      priority={firstSize.id === size.id}
                      sizes="(max-width: 760px) 75vw, 38vw"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="product-size-details">
              <strong>{displayedSize.volumeMl} ml</strong>
              {displayedSize.price !== undefined && (
                <span>{formatUgx(displayedSize.price)}</span>
              )}
              {displayedSize.dimensions && <span>{displayedSize.dimensions}</span>}
            </div>
          </div>

          {renderOptions(product.sizes.slice(splitIndex), "right")}
        </div>
      </div>
    </section>
  );
}
