import Link from "next/link";
import siteData from "../site-data.json";
import ShopModeLink from "../shop/shop-mode-link";

export default function OrderCompletePage() {
  return (
    <main className="landing site-page subpage">
      <section>
        <div className="wrap donebox">
          <span className="label">Last step</span>
          <h1>Press send in WhatsApp.</h1>
          <p>Your order has opened in WhatsApp. Send it there and we will confirm it.</p>
          <p className="loyal">
            <b>You are collecting loyalty points.</b> Every order takes you closer
            to a free {siteData.retailMinMl} ml bottle. Order again to reach {siteData.loyaltyRedeem} points.{" "}
            <Link href="/loyalty-points">How loyalty points work</Link>
          </p>
          <h2>Follow Lulu Kaya</h2>
          <div className="social">
            <a href="https://www.tiktok.com/@lulu.kaya.perfumes" target="_blank" rel="noreferrer">Follow on TikTok</a>
            <a href="https://www.instagram.com/lulu.kaya.perfumes" target="_blank" rel="noreferrer">Follow on Instagram</a>
          </div>
          <p><ShopModeLink mode="retail">Start a new order</ShopModeLink></p>
        </div>
      </section>
    </main>
  );
}
