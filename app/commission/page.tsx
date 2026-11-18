import Link from "next/link";
import siteData from "../site-data.json";

const formatUgx = (amount: number) => amount.toLocaleString("en-UG");

export default function CommissionPage() {
  return (
    <main className="landing site-page subpage">
      <section className="sell" id="commission" aria-labelledby="commission-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="label">Agent commission</span>
            <h1 id="commission-title">Earn on every bottle you sell.</h1>
            <p>Agents sell at our retail prices and earn a fixed commission on each bottle. Students are welcome, and training is included.</p>
          </div>
          <section className="track" aria-labelledby="commission-table-title">
            <h2 id="commission-table-title">Commission per bottle</h2>
            <div className="tablebox">
              <table>
                <thead>
                  <tr><th scope="col">Size</th><th scope="col">Customer pays</th><th scope="col">You earn</th></tr>
                </thead>
                <tbody>
                  {siteData.sizes.map(({ ml, retail }, index) => (
                    <tr key={ml}>
                      <td>{ml} ml</td>
                      <td>{formatUgx(retail)}</td>
                      <td className="gain">{formatUgx(siteData.commission[index])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fine">
              Amounts in UGX, per bottle sold. Example: sell 100 bottles of 6 ml
              in a month and earn UGX 300,000.
            </p>
          </section>
          <section className="track" aria-labelledby="commission-steps-title">
            <h2 id="commission-steps-title">How it works</h2>
            <ol className="steps4">
              <li><b>Pay a UGX 100,000 deposit.</b> It secures the bottles you hold, and you get it back when you leave.</li>
              <li><b>Receive 5 to 10 dozen bottles</b> to sell to your customers.</li>
              <li><b>Sell at the retail price list.</b> Every customer pays the same price.</li>
              <li><b>Get your commission</b> at the end of every month.</li>
            </ol>
            <div className="trainacts">
              <a
                className="btn"
                target="_blank"
                rel="noreferrer"
                href="https://wa.me/256793196848?text=Hello%20Lulu%20Kaya%2C%20I%20would%20like%20to%20become%20an%20agent."
              >
                Become an Agent
              </a>
              <Link className="btn ghost" href="/business#training">Get trained by us</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
