import type { ReactNode } from "react";
import Image from "next/image";

type ImageOverlayCardProps = {
  className: string;
  imageAlt: string;
  imageSrc: string;
  sizes: string;
  children: ReactNode;
};

export default function ImageOverlayCard({
  className,
  imageAlt,
  imageSrc,
  sizes,
  children,
}: ImageOverlayCardProps) {
  return (
    <article className={`image-overlay-card ${className}`}>
      <Image
        className="image-overlay-card-image"
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={sizes}
      />
      <div className="image-overlay-card-content">{children}</div>
    </article>
  );
}
