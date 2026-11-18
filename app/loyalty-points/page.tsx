import Link from "next/link";
import siteData from "../site-data.json";
import ShopModeLink from "../shop/shop-mode-link";

export default function LoyaltyPointsPage() {
  return (
    <main className="landing site-page subpage">
      <section>
        <div className="wrap pointsbox">
          <span className="label">Lulu Kaya Loyalty Points</span>
          <h1>Shop, collect {siteData.loyaltyRedeem} loyalty points, get a free {siteData.retailMinMl} ml bottle.</h1>
          <div className="psteps">
            <div>
              <b>1. Shop</b>
              <span>
                Every UGX {siteData.loyalty.retail.toLocaleString("en-UG")} you
                spend earns 1 point. For wholesale, every UGX{" "}
                {siteData.loyalty.wholesale.toLocaleString("en-UG")} earns 1 point.
              </span>
            </div>
            <div>
              <b>2. Collect</b>
              <span>
                Points add up with every order on your WhatsApp number. We send
                your balance with each receipt, and you can ask for it any time on WhatsApp.
              </span>
            </div>
            <div>
              <b>3. Redeem</b>
              <span>
                {siteData.loyaltyRedeem} points get you a free {siteData.retailMinMl} ml bottle in any scent.
                Follow us on Instagram or TikTok to redeem.
              </span>
            </div>
          </div>
          <section className="ptrack">
            <h2>Check your balance</h2>
            <p className="pick-note">
              Message us from the WhatsApp number you order with, and we reply
              with your loyalty points.
            </p>
            <a
              className="btn"
              href="https://wa.me/256793196848?text=Hello%20Lulu%20Kaya%2C%20please%20send%20me%20my%20loyalty%20points%20balance."
              target="_blank"
              rel="noreferrer"
            >
              Check my points on WhatsApp
            </a>
          </section>
          <div className="basket-actions">
            <ShopModeLink className="btn" mode="retail">Shop now and earn loyalty points</ShopModeLink>
            <ShopModeLink className="btn ghost" mode="wholesale">Wholesale order</ShopModeLink>
          </div>
          <div className="homefollow">
            <span>Follow to redeem</span>
            <a className="btn ghost" href="https://www.tiktok.com/@lulu.kaya.perfumes" target="_blank" rel="noreferrer">TikTok</a>
            <a className="btn ghost" href="https://www.instagram.com/lulu.kaya.perfumes" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p className="pick-note">Delivery charges do not earn loyalty points. Loyalty points are counted on paid orders.</p>
        </div>
      </section>
    </main>
  );
}
