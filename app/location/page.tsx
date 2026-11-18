import siteData from "../site-data.json";

const mapsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Lulu+Kaya+Perfumes%2C+Bukoto+Kisasi+Rd%2C+Kampala";

export default function LocationPage() {
  return (
    <main className="landing site-page subpage">
      <section className="locpage" id="location" aria-labelledby="location-title">
        <div className="wrap">
          <span className="label">Location</span>
          <h1 id="location-title">Visit our shop in Bukoto.</h1>
          <div className="two">
            <div className="col">
              <address className="locaddr">
                Plot 1871, Block 213<br />
                Royal Form Building, 1st floor<br />
                Bukoto (Bukoto-Kisasi Road)<br />
                Kampala, Uganda
              </address>
              <p>P.O. Box 209156, Kampala GPO</p>
              <div className="trainacts">
                <a className="btn" target="_blank" rel="noreferrer" href={mapsUrl}>Get directions</a>
                <a className="btn ghost" href="tel:+256793196848">MTN +256 793 196 848</a>
                <a
                  className="btn wabtn"
                  target="_blank"
                  rel="noreferrer"
                  href="https://wa.me/256793196848?text=Hello%20Lulu%20Kaya%2C%20I%20would%20like%20to%20visit%20your%20shop."
                >
                  WhatsApp us
                </a>
              </div>
            </div>
            <div className="col">
              <dl className="hours">
                <dt>Monday to Saturday</dt>
                <dd>9:00 am to 7:00 pm</dd>
                <dt>Sunday</dt>
                <dd>Closed</dd>
              </dl>
              <dl className="hours">
                <dt>MTN and WhatsApp</dt>
                <dd><a href={`tel:+${siteData.contact.whatsapp}`}>{siteData.contact.phones[0]}</a></dd>
                <dt>Airtel</dt>
                <dd><a href={`tel:${siteData.contact.phones[1].replace(/\s/g, "")}`}>{siteData.contact.phones[1]}</a></dd>
              </dl>
              <p>Walk in to smell the range, pick up your order, or ask about wholesale and joining our team.</p>
            </div>
          </div>
          <section id="contact" aria-labelledby="contact-title">
            <h2 id="contact-title">Contact and directions</h2>
            <address>
              Plot 1871, Block 213, Royal Form Building, 1st floor<br />
              Bukoto (Bukoto-Kisasi Road), Kampala, Uganda<br />
              P.O. Box 209156, Kampala GPO
            </address>
            <dl className="hours">
              <dt>MTN and WhatsApp</dt>
              <dd><a href={`tel:+${siteData.contact.whatsapp}`}>{siteData.contact.phones[0]}</a></dd>
              <dt>Airtel</dt>
              <dd><a href={`tel:${siteData.contact.phones[1].replace(/\s/g, "")}`}>{siteData.contact.phones[1]}</a></dd>
              <dt>Email</dt>
              <dd><a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a></dd>
            </dl>
            <a className="btn" target="_blank" rel="noreferrer" href={mapsUrl}>Get directions to the shop</a>
          </section>
        </div>
      </section>
    </main>
  );
}
