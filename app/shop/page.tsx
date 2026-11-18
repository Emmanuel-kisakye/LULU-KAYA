import Link from "next/link";
import siteData from "../site-data.json";
import type { SignatureScentPerfume } from "../signature-scent-carousel";
import ShopOrderForm from "./shop-order-form";

const formatUgx = (amount: number) => amount.toLocaleString("en-UG");
const notesFrom = (notes: string) =>
  notes.split(",").map((note) => note.trim()).filter(Boolean);

const hasScentProfile = (
  name: string,
): name is keyof typeof siteData.scentProfiles =>
  Object.prototype.hasOwnProperty.call(siteData.scentProfiles, name);

const scents = siteData.scents.map((name, index) => {
  const profile = hasScentProfile(name) ? siteData.scentProfiles[name] : undefined;

  if (profile && profile.length !== 5) {
    throw new Error(`The scent profile for "${name}" must contain five fields.`);
  }

  const [family = "Fragrance", topNotes = "", heartNotes = "", baseNotes = "", description = ""] =
    profile ?? [];
  const perfume: SignatureScentPerfume = {
    id: name,
    name,
    family: family || "Fragrance",
    topNotes: notesFrom(topNotes),
    heartNotes: notesFrom(heartNotes),
    baseNotes: notesFrom(baseNotes),
    description,
  };

  return {
    perfume,
    group: siteData.scentGroups[index] ?? "u",
    comingSoon: siteData.scentGroups[index] === "s",
  };
});

const retailSizes = siteData.sizes.filter(({ ml }) => ml >= siteData.retailMinMl);
const wholesaleSizes = siteData.sizes.map(({ ml, wholesale, unit }) => {
  if (unit !== 1 && unit !== 12) {
    throw new Error(`The wholesale price unit for ${ml} ml must be per bottle or per dozen.`);
  }
  const validatedUnit: 1 | 12 = unit === 12 ? 12 : 1;
  return { ml, wholesale, unit: validatedUnit };
});
const towns = siteData.towns.map(([name, fare]) => {
  if (typeof name !== "string" || typeof fare !== "number") {
    throw new TypeError("Invalid town delivery data in app/site-data.json");
  }
  return { name, fare };
});

export default function ShopPage() {
  return (
    <main className="landing site-page subpage">
      <section id="shop" className="orderpage" aria-labelledby="shop-title">
        <div className="wrap">
          <span className="label">Shop</span>
          <h1 id="shop-title">Choose your scents.</h1>
          <p>Over 250 scents in seven sizes. Pick up in Bukoto, Kampala or get it delivered.</p>
          <ShopOrderForm
            scents={scents}
            sizes={retailSizes}
            wholesaleSizes={wholesaleSizes}
            wholesaleMinimum={siteData.wholesaleMinimum}
            whatsappNumber={siteData.contact.whatsapp}
          />
          <p>
            Scent names describe the fragrance style of each oil. Lulu Kaya is not
            affiliated with the brands named.
          </p>

          <section aria-labelledby="retail-prices-title">
            <h2 id="retail-prices-title">Retail prices</h2>
            <p>Retail sells 20 ml and above only. Amounts in UGX, per bottle.</p>
            <div className="tablebox">
              <table>
                <thead>
                  <tr><th scope="col">Size</th><th scope="col">Retail price</th></tr>
                </thead>
                <tbody>
                  {retailSizes.map(({ ml, retail }) => (
                    <tr key={ml}><td>{ml} ml</td><td>{formatUgx(retail)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="wholesale-prices" aria-labelledby="wholesale-title">
            <h2 id="wholesale-title">Wholesale prices</h2>
            <p>
              Wholesale prices start at UGX {formatUgx(siteData.wholesaleMinimum)},
              which is 4 dozen of 6 ml. Each wholesale quantity is a dozen
              (12 bottles), whether it is one scent or a blend. Add more to
              complete a wholesale order; smaller orders are sold at retail
              prices. All seven sizes are available wholesale.
            </p>
            <div className="tablebox">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Wholesale</th>
                    <th scope="col">You sell at</th>
                    <th scope="col">Your profit</th>
                  </tr>
                </thead>
                <tbody>
                  {siteData.sizes.map(({ ml, retail, wholesale, unit }) => (
                    <tr key={ml}>
                      <td>{ml} ml</td>
                      <td>{formatUgx(wholesale)} {unit === 12 ? "a dozen" : "a bottle"}</td>
                      <td>{formatUgx(retail)}</td>
                      <td>{formatUgx(retail * unit - wholesale)} {unit === 12 ? "a dozen" : "a bottle"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Buy at the wholesale price, sell at the retail price and keep the
              difference. The goal we work towards with every wholesale buyer is
              more than UGX 1 million profit a month.
            </p>
          </section>

          <section aria-labelledby="bottle-options-title">
            <h2 id="bottle-options-title">Choose your scents</h2>
            <p>One scent per bottle or mix scents in one bottle.</p>
            <p>Mixing starts from a {siteData.mixMinMl} ml bottle. The mix costs the same as any bottle of that size.</p>
          </section>

          <section aria-labelledby="delivery-title">
            <h2 id="delivery-title">How you get it</h2>
            <ul>
              <li>Pick up at our shop in Bukoto, Kampala</li>
              <li>Delivery in Kampala (SafeBoda, pay the rider)</li>
              <li>Delivery outside Kampala (bus)</li>
            </ul>
            <p>Delivery charges do not earn loyalty points. We confirm delivery costs on WhatsApp.</p>
            <details>
              <summary>Kampala delivery areas</summary>
              <ul>
                {siteData.areas.map(([area, km]) => (
                  <li key={area}>{area} — about {km} km from our Bukoto shop</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>Delivery outside Kampala</summary>
              <ul>
                {towns.map(({ name, fare }) => (
                  <li key={name}>{name} — estimated delivery charge UGX {formatUgx(fare)}</li>
                ))}
              </ul>
            </details>
          </section>

          <section aria-labelledby="payment-title">
            <h2 id="payment-title">Pay with MTN or Airtel Money</h2>
            <div className="payment-options">
              <div>
                <h3>MTN Mobile Money</h3>
                <ol>
                  <li>Dial <strong>*165*3#</strong></li>
                  <li>Enter merchant code <strong>04171001</strong></li>
                  <li>Enter the amount and confirm</li>
                </ol>
              </div>
              <div>
                <h3>Airtel Money</h3>
                <ol>
                  <li>Dial <strong>*185*9#</strong></li>
                  <li>Enter merchant code <strong>4426700</strong></li>
                  <li>Enter the amount and confirm</li>
                </ol>
              </div>
            </div>
            <p>
              The merchant name you will see is <strong>ADISI YA AFRIKA</strong>.
              After you pay, <strong>take a screenshot of the payment message</strong>.
              You will send it to us on WhatsApp with your order.
            </p>
          </section>

          <section aria-labelledby="order-details-title">
            <h2 id="order-details-title">Complete your order</h2>
            <p>Order now, pay now or after we confirm your order.</p>
            <ul>
              <li>Your name and WhatsApp number</li>
              <li>How you get it: pick up, Kampala delivery or delivery outside Kampala</li>
              <li>Your area and exact place or landmark for delivery</li>
              <li>Instagram or TikTok username (for loyalty points)</li>
              <li>Paid with, number you paid with and transaction ID (optional)</li>
              <li>Notes for us (optional)</li>
            </ul>
            <p>All sales are final. We do not accept returns. We use your name and phone number only to confirm and deliver your order.</p>
            <p>
              We check your payment screenshot against our records, then confirm
              your order and send your receipt on WhatsApp.
            </p>
            <a href="https://wa.me/256793196848?text=Hello%20Lulu%20Kaya%2C%20I%20would%20like%20to%20place%20an%20order.">
              Start your order on WhatsApp
            </a>
          </section>

          <p><Link href="/loyalty-points">Learn how loyalty points work</Link></p>
        </div>
      </section>
    </main>
  );
}
