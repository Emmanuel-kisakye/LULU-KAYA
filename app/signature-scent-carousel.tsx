import type { ReactNode } from "react";
import ImageOverlayCard from "./image-overlay-card";

export type SignatureScentPerfume = {
  id: string;
  name: string;
  family: string;
  topNotes: readonly string[];
  heartNotes: readonly string[];
  baseNotes: readonly string[];
  description: string;
};

type SignatureScentCardProps = {
  perfume: SignatureScentPerfume;
  className?: string;
  showNotes?: boolean;
  children?: ReactNode;
};

type SignatureScentCarouselProps = {
  perfumes: readonly SignatureScentPerfume[];
};

export function SignatureScentCard({
  perfume,
  className,
  showNotes = true,
  children,
}: SignatureScentCardProps) {
  const noteGroups = [
    ["Top", perfume.topNotes],
    ["Heart", perfume.heartNotes],
    ["Base", perfume.baseNotes],
  ] as const;

  return (
    <ImageOverlayCard
      className={`signature-scent-card${className ? ` ${className}` : ""}`}
      imageSrc="/reference/img/bottle-50ml.jpg"
      imageAlt=""
      sizes="(max-width: 760px) 260px, 280px"
    >
      <div className="signature-scent-card-copy">
        <p>{perfume.family}</p>
        <h3>{perfume.name}</h3>
        {showNotes && (
          <dl className="signature-scent-card-notes">
            {noteGroups.map(([label, notes]) => notes.length > 0 && (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{notes.join(", ")}</dd>
              </div>
            ))}
          </dl>
        )}
        {perfume.description && (
          <span className="signature-scent-card-description">{perfume.description}</span>
        )}
      </div>
      {children}
    </ImageOverlayCard>
  );
}

export default function SignatureScentCarousel({
  perfumes,
}: SignatureScentCarouselProps) {
  if (perfumes.length === 0) {
    return null;
  }

  return (
    <div className="signature-scent-carousel" role="group" aria-label="Signature scents">
      <div
        className="signature-scent-track"
        style={{ animationDuration: `${Math.max(28, perfumes.length * 3.5)}s` }}
      >
        {[false, true].map((isDuplicate) => (
          <div
            className="signature-scent-card-group"
            aria-hidden={isDuplicate || undefined}
            key={isDuplicate ? "duplicate" : "original"}
          >
            {perfumes.map((perfume) => (
              <SignatureScentCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
