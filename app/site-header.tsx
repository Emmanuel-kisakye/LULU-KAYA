"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { markVisitedNonHomePage } from "./hero-navigation-state";
import ShopModeLink from "./shop/shop-mode-link";

const menuGroups = [
  {
    id: "shop",
    label: "Shop",
    items: [
      { label: "Shop now", href: "/shop#retail" },
      { label: "Wholesale order", href: "/shop#wholesale" },
      { label: "Know your perfume", href: "/know-your-perfume" },
      { label: "Loyalty points", href: "/loyalty-points" },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { label: "Wholesale price and profit", href: "/business#wholesale-info" },
      { label: "Agent commission", href: "/commission" },
      { label: "Join our team", href: "/business#agents" },
      { label: "Get Trained by us", href: "/business#training" },
    ],
  },
  {
    id: "about",
    label: "About Us",
    items: [
      { label: "Lulu Kaya meaning", href: "/#meaning" },
      { label: "Our team", href: "/business#team" },
      { label: "Testimonials", href: "/business#reviews" },
      { label: "Questions", href: "/business#faq" },
    ],
  },
] as const;

type MenuId = (typeof menuGroups)[number]["id"];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const activeMenu = menuGroups.find((group) => group.id === openMenu);
  const activeNavGroup: MenuId | null =
    pathname === "/shop" ||
    pathname === "/know-your-perfume" ||
    pathname === "/loyalty-points" ||
    pathname === "/order-complete"
      ? "shop"
      : pathname === "/business" || pathname === "/commission"
        ? "business"
        : pathname === "/location"
          ? "about"
          : null;

  useEffect(() => {
    if (pathname !== "/") {
      markVisitedNonHomePage();
    }
  }, [pathname]);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!openMenu) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  const toggleMenu = (id: MenuId) => {
    setOpenMenu((currentMenu) => (currentMenu === id ? null : id));
  };

  const menuTrigger = (group: (typeof menuGroups)[number], className = "") => (
    <button
      className={`nav-menu-trigger${activeNavGroup === group.id ? " is-current" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      aria-expanded={openMenu === group.id}
      aria-current={activeNavGroup === group.id ? "page" : undefined}
      aria-controls="primary-nav-dropdown"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpenMenu(group.id);
      }}
      onClick={() => toggleMenu(group.id)}
    >
      {group.label}
      <svg className="nav-chevron" viewBox="0 0 12 8" aria-hidden="true">
        <path d="m1 1 5 5 5-5" />
      </svg>
    </button>
  );

  return (
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? " is-scrolled" : ""}`}
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setOpenMenu(null);
        }
      }}
    >
      <Link className="brand nav-brand" href="/#home" aria-label="Lulu Kaya home">
        <Image
          src="/reference/img/nav-logo.png"
          alt=""
          width={569}
          height={144}
          priority
        />
      </Link>

      <nav className="primary-nav" aria-label="Main navigation">
        <Link
          href="/#home"
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={() => setOpenMenu(null)}
        >
          Home
        </Link>
        {menuGroups.slice(0, 3).map((group) => (
          <span className="nav-menu" key={group.id}>
            {menuTrigger(group)}
          </span>
        ))}
      </nav>

      <Link
        className="header-cta"
        href="/contact"
        aria-current={pathname === "/contact" ? "page" : undefined}
        onClick={() => setOpenMenu(null)}
      >
        Contact Us
      </Link>

      <div
        className="nav-dropdown-panel"
        id="primary-nav-dropdown"
        aria-label={activeMenu ? `${activeMenu.label} links` : undefined}
        hidden={!activeMenu}
      >
        {activeMenu && (
          <>
            <p className="nav-dropdown-heading">{activeMenu.label}</p>
            <ul>
              {activeMenu.items.map((item) => (
                <li key={item.label}>
                  {item.href === "/shop#retail" ? (
                    <ShopModeLink mode="retail" onClick={() => setOpenMenu(null)}>
                      {item.label}
                    </ShopModeLink>
                  ) : item.href === "/shop#wholesale" ? (
                    <ShopModeLink mode="wholesale" onClick={() => setOpenMenu(null)}>
                      {item.label}
                    </ShopModeLink>
                  ) : (
                    <Link href={item.href} onClick={() => setOpenMenu(null)}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </header>
  );
}
