import Image from "next/image";
import Link from "next/link";
import ShopModeLink from "./shop/shop-mode-link";

const socialLinks = [
  ["Instagram", "https://www.instagram.com/lulu.kaya.perfumes"],
  ["TikTok", "https://www.tiktok.com/@lulu.kaya.perfumes"],
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" href="/" aria-label="Lulu Kaya home">
            <Image src="/reference/img/lk-mark.png" alt="" width={34} height={36} />
            <span>Lulu Kaya</span>
          </Link>
          <p className="footer-slogan">Where Beauty Finds Refuge · Bukoto, Kampala</p>
          <div className="footer-socials" aria-label="Social media">
            <a
              className="footer-social"
              href={socialLinks[0][1]}
              target="_blank"
              rel="noreferrer"
              aria-label={socialLinks[0][0]}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-icon-dot" cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a
              className="footer-social"
              href={socialLinks[1][1]}
              target="_blank"
              rel="noreferrer"
              aria-label={socialLinks[1][0]}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 3v11.2a4.2 4.2 0 1 1-3.4-4.1" />
                <path d="M14 3c.4 2.8 2.3 4.8 5 5.2" />
              </svg>
            </a>
            <a
              className="footer-social"
              href="https://wa.me/256793196848"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.8a8.2 8.2 0 1 1 16-3.5Z" />
                <path d="M9 8.5c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.7c.1.2.1.3-.1.5l-.5.6c-.2.2-.1.4 0 .6.5.8 1.2 1.5 2 2 .2.1.4.2.6 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .3-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.4-1.1-.3-2.4-.9-3.7-2.1-1.2-1.1-2-2.5-2.2-3.5-.2-.9.4-1.7 1-2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-link-groups">
          <div className="footer-link-group">
            <h2>Shop</h2>
            <ul>
              <li><ShopModeLink mode="retail">Shop all</ShopModeLink></li>
              <li><ShopModeLink mode="wholesale">Wholesale</ShopModeLink></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h2>Discover</h2>
            <ul>
              <li><Link href="/#meaning">About Us</Link></li>
              <li><Link href="/">Home</Link></li>
            </ul>
          </div>
          <div className="footer-link-group">
            <h2>Visit</h2>
            <ul>
              <li><a href="https://wa.me/256793196848" target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Lulu+Kaya+Perfumes%2C+Bukoto+Kisasi+Rd%2C+Kampala"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bukoto, Kampala
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <span>lulukaya.com</span>
        <p>
          Lulu Kaya is a trading name of Adisi Ya Afrika Holding Limited, Bukoto,
          Bukoto-Kisasi Road, Kampala, Uganda.
        </p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Lulu Kaya. All rights reserved.</span>
        <Link className="footer-top-link" href="/#home">Back to top ↑</Link>
      </div>
    </footer>
  );
}
