import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./contact-form";
import siteData from "../site-data.json";

export const metadata: Metadata = {
  title: "Contact Us | Lulu Kaya",
  description: "Contact Lulu Kaya Perfumes in Bukoto, Kampala.",
};

const address =
  "Royal Form Building, 1st floor, Plot 1871, Block 213, Bukoto-Kisasi Road, Kampala, Uganda";

export default function ContactPage() {
  return (
    <main className="landing site-page subpage">
      <section className="contact-page" aria-labelledby="contact-title">
        <div className="contact-layout">
          <div className="contact-intro">
            <nav className="contact-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">·</span>
              <span aria-current="page">Contact</span>
            </nav>
            <h1 id="contact-title">Contact Lulu Kaya</h1>
            <p className="contact-lead">
              Have a question about our fragrances, an order, or working with us?
              Send us a message and we will be happy to help.
            </p>

            <ul className="contact-methods">
              <li>
                <span className="contact-method-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                </span>
                <div>
                  <span className="contact-method-label">Visit us</span>
                  <address>{address}</address>
                </div>
              </li>
              <li>
                <span className="contact-method-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                </span>
                <div>
                  <span className="contact-method-label">Email</span>
                  <a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a>
                </div>
              </li>
              {siteData.contact.phones.map((phone) => (
                <li key={phone}>
                  <span className="contact-method-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 5 5c0-1.1.9-2 2-2Z" /></svg>
                  </span>
                  <div>
                    <span className="contact-method-label">Call or WhatsApp</span>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="contact-socials">
              <h2>Follow Us On</h2>
              <div>
                {siteData.social.map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="contact-form-card">
            <ContactForm whatsappNumber={siteData.contact.whatsapp} />
          </div>
        </div>
              <section className="homeloc" id="homeloc" aria-labelledby="home-location-title">
        <div className="homeloc-content">
          <span className="label">Our location</span>
          <h2 id="home-location-title">Visit us in Bukoto.</h2>
          <dl className="locrows">
            <dt>Address</dt>
            <dd>Royal Form Building, 1st floor<br />Plot 1871, Block 213<br />Bukoto-Kisasi Road, Kampala</dd>
            <dt>Hours</dt>
            <dd>Monday to Saturday, 9:00 am to 7:00 pm<br />Sunday closed</dd>
            <dt>Post</dt>
            <dd>P.O. Box 209156, Kampala GPO</dd>
          </dl>
        </div>
        <div className="homeloc-map">
          <iframe
            src="https://maps.google.com/maps?q=0.350288%2C32.5981208&z=16&output=embed"
            title="Lulu Kaya Perfumes on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
      </section>
    </main>
  );
}
