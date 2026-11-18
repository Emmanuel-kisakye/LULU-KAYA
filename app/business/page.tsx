import Image from "next/image";
import Link from "next/link";
import siteData from "../site-data.json";
import ShopModeLink from "../shop/shop-mode-link";

const team = [
  ["Sydney Ogada", "Director and Founder", "sydney.jpg"],
  ["Laurynas Vaiciulis", "Director and Founder", "laurynas.jpg"],
  ["Pretty Aline", "Marketing", "pretty.jpg"],
  ["Nixon Kironga", "Sales and Operations", "nixon.jpg"],
  ["Davin Nuwagaba", "Customer Experience", "davin.jpg"],
] as const;

const questions = [
  ["How long does the perfume last?", "Our perfume oils last for more than 24 hours."],
  ["Can I return a perfume?", "No. We do not accept returns, so all sales are final. Smell the scent at our shop first, or start with a 3 ml bottle."],
  ["How do I pay?", "With MTN Mobile Money or Airtel Money, using the merchant codes shown at checkout. The merchant name you will see is ADISI YA AFRIKA. Pay first, then send your order on WhatsApp with a screenshot of the payment message."],
  ["Do you deliver?", "Yes. In Kampala we send by SafeBoda and you pay the rider directly when your order arrives. Outside Kampala we send by bus and you pay the delivery charge. The checkout shows an estimate for your area."],
  ["Can I mix scents?", "Yes, from a 20 ml bottle upwards. A mixed bottle costs the same as any bottle of that size."],
  ["How do loyalty points work?", "Every UGX 50,000 you spend at retail earns 1 point. For wholesale, every UGX 72,000 earns 1 point. Your spending adds up across orders, and delivery charges do not count. With 7 points you get a free 20 ml bottle in the scent of your choice. To redeem, follow us on Instagram or TikTok. We keep your points on your WhatsApp number and tell you your balance with each receipt. To check it any time, message us on WhatsApp."],
  ["What is the wholesale minimum?", "Wholesale orders start at UGX 288,000. Smaller orders are sold at retail prices."],
] as const;

const formatUgx = (amount: number) => amount.toLocaleString("en-UG");
const mapsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Lulu+Kaya+Perfumes%2C+Bukoto+Kisasi+Rd%2C+Kampala";

export default function BusinessPage() {
  return (
    <main className="landing site-page subpage">
      <section className="sell" id="sell" aria-labelledby="business-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Wholesale and agents</span>
            <h1 id="business-title">Build a perfume business with Lulu Kaya.</h1>
            <p>Buy at wholesale prices and resell at a profit, or join our team as an agent.</p>
          </div>

          <section className="track" id="wholesale-info" aria-labelledby="wholesale-title">
            <h2 id="wholesale-title">Wholesale</h2>
            <p>
              Buy at the wholesale price, sell at the retail price and keep the
              difference. The goal we work towards with every wholesale buyer is
              more than UGX 1 million profit a month.
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
            <p className="fine">
              Prices in UGX. Wholesale orders start at UGX{" "}
              {formatUgx(siteData.wholesaleMinimum)}, which is 4 dozen of 6 ml.
              Smaller orders are sold at retail prices. Mix any scents inside
              your dozens. All seven sizes are available wholesale.
            </p>
            <ShopModeLink className="btn" mode="wholesale">Place a wholesale order</ShopModeLink>
          </section>

          <section className="calc" aria-labelledby="wholesale-calculator-title">
            <h2 id="wholesale-calculator-title">Work out your wholesale profit</h2>
            <p>Wholesale price, retail price and profit per wholesale unit:</p>
            <ul>
              {siteData.sizes.map(({ ml, retail, wholesale, unit }) => (
                <li key={ml}>
                  {ml} ml: buy at UGX {formatUgx(wholesale)}, sell at UGX{" "}
                  {formatUgx(retail)}, profit UGX {formatUgx(retail * unit - wholesale)}{" "}
                  {unit === 12 ? "per dozen" : "per bottle"}.
                </li>
              ))}
            </ul>
          </section>

          <section className="track agentband" id="agents" aria-labelledby="agents-title">
            <h2 id="agents-title">Join our team</h2>
            <p>
              Become a Lulu Kaya agent and earn on the bottles you sell. Students
              are welcome, and training is included. Contact us and we will explain how it works.
            </p>
            <Link className="btn" href="#contact">Contact us to join</Link>
          </section>
        </div>
      </section>

      <section id="gallery" aria-labelledby="gallery-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Gallery</span>
            <h2 id="gallery-title">A look at the range.</h2>
            <p>
              See the shop, new scents and customer picks on{" "}
              <a href="https://www.instagram.com/lulu.kaya.perfumes" target="_blank" rel="noreferrer">Instagram</a>
              {" "}and{" "}
              <a href="https://www.tiktok.com/@lulu.kaya.perfumes" target="_blank" rel="noreferrer">TikTok</a>.
            </p>
          </div>
          <div className="ggrid photos">
            <Image className="wide" src="/reference/img/bottles.jpg" alt="Lulu Kaya perfume bottles in 50 ml, 100 ml and 30 ml" width={1400} height={1061} />
            <Image src="/reference/img/bottle-30ml.jpg" alt="Lulu Kaya 30 ml bottle" width={640} height={800} />
            <Image src="/reference/img/bottle-50ml.jpg" alt="Lulu Kaya 50 ml bottle" width={640} height={800} />
            <Image src="/reference/img/bottle-100ml.jpg" alt="Lulu Kaya 100 ml bottle" width={640} height={800} />
          </div>
        </div>
      </section>

      <section id="reviews" className="reviews" aria-labelledby="reviews-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Testimonials</span>
            <h2 id="reviews-title">What our customers, retailers and agents say.</h2>
          </div>
          <ul className="review-types">
            <li><b>Customers</b><p>{siteData.reviewEmpty.customer}</p></li>
            <li><b>Retailers</b><p>{siteData.reviewEmpty.retailer}</p></li>
            <li><b>Agents</b><p>{siteData.reviewEmpty.agent}</p></li>
          </ul>
          <div className="rempty">
            <p>Bought from Lulu Kaya, or selling with us? Tell us how it is going. We share testimonials here with permission.</p>
            <a className="btn" href={`https://wa.me/${siteData.contact.whatsapp}?text=Hello%20Lulu%20Kaya%2C%20I%20would%20like%20to%20share%20a%20testimonial.`}>Send us your testimonial</a>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title">
        <div className="wrap">
          <div className="sec-head">
            <h2 id="faq-title">FAQ</h2>
          </div>
          <div className="faq">
            {questions.map(([question, answer]) => (
              <details
                key={question}
                id={question.startsWith("How do loyalty") ? "loyalty" : undefined}
                open
              >
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="team" aria-labelledby="team-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Our team</span>
            <h2 id="team-title">The people behind Lulu Kaya.</h2>
          </div>
          <div className="tgrid">
            {team.map(([name, role, image]) => (
              <figure className="tm" key={name}>
                <Image src={`/reference/team/${image}`} alt={name} width={640} height={800} />
                <figcaption><b>{name}</b><span>{role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="training" aria-labelledby="training-title">
        <div className="wrap">
          <div className="two">
            <div className="col" id="trainingcol">
              <span className="label">Get Trained by us</span>
              <h2 id="training-title">We train you to sell at a profit.</h2>
              <p>Training comes with the business. Join online or come to the shop in Bukoto.</p>
              <ul>
                <li>Running a perfume business day to day</li>
                <li>Keeping business money separate from your own</li>
                <li>Selling perfume profitably</li>
              </ul>
              <p>Training happens online or at our shop: Royal Form Building, 1st floor, Bukoto-Kisasi Road, Kampala.</p>
              <div className="trainacts">
                <a
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${siteData.contact.whatsapp}?text=Hello%20Lulu%20Kaya%2C%20I%20would%20like%20to%20join%20your%20training.`}
                >
                  Book training
                </a>
                <Link className="btn ghost" href="#wholesale-info">See wholesale profit</Link>
              </div>
            </div>

            <div className="col" id="contact">
              <span className="label">Contact and visit</span>
              <h2>Bukoto, Kampala.</h2>
              <address className="addr">
                Plot 1871, Block 213, Royal Form Building, 1st floor<br />
                Bukoto (Bukoto-Kisasi Road), Kampala, Uganda<br />
                P.O. Box 209156, Kampala GPO
              </address>
              <dl className="hours">
                <dt>Monday to Saturday</dt><dd>9:00 am to 7:00 pm</dd>
                <dt>Sunday</dt><dd>Closed</dd>
              </dl>
              <dl className="hours">
                <dt>MTN and WhatsApp</dt>
                <dd><a href={`tel:+${siteData.contact.whatsapp}`}>{siteData.contact.phones[0]}</a></dd>
                <dt>Airtel</dt>
                <dd><a href={`tel:${siteData.contact.phones[1].replace(/\s/g, "")}`}>{siteData.contact.phones[1]}</a></dd>
                <dt>Email</dt>
                <dd><a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a></dd>
              </dl>
              <a className="btn" target="_blank" rel="noreferrer" href={mapsUrl}>Get directions to the shop</a>
              <p>Walk in to smell the range, place an order, or ask about wholesale and joining our team.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="follow" aria-labelledby="follow-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Follow us</span>
            <h2 id="follow-title">Join Lulu Kaya on TikTok and Instagram.</h2>
          </div>
          <div className="social">
            {siteData.social.map(([label, href]) => (
              <a className="btn" key={href} href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
