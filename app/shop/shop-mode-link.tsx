"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const SHOP_MODE_NAVIGATION_EVENT = "lulu-kaya:shop-mode-navigation";

type ShopModeLinkProps = {
  mode: "retail" | "wholesale";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export default function ShopModeLink({
  mode,
  className,
  children,
  onClick,
}: ShopModeLinkProps) {
  return (
    <Link
      className={className}
      href={`/shop#${mode}`}
      onClick={(event) => {
        if (
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          window.dispatchEvent(
            new CustomEvent(SHOP_MODE_NAVIGATION_EVENT, { detail: mode }),
          );
        }
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
