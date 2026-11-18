"use client";

import type { FormEvent } from "react";

type ContactFormProps = {
  whatsappNumber: string;
};

export default function ContactForm({ whatsappNumber }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const text = [
      "Hello Lulu Kaya,",
      "",
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      "",
      message,
    ].join("\n");

    window.location.assign(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
    );
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-name-fields">
        <label className="contact-field">
          <span className="contact-visually-hidden">First Name</span>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            autoComplete="given-name"
            required
          />
        </label>
        <label className="contact-field">
          <span className="contact-visually-hidden">Last Name</span>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="family-name"
            required
          />
        </label>
      </div>
      <label className="contact-field">
        <span className="contact-visually-hidden">Email</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
      </label>
      <label className="contact-field">
        <span className="contact-visually-hidden">Phone</span>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          autoComplete="tel"
        />
      </label>
      <label className="contact-field">
        <span className="contact-visually-hidden">How can we help you?</span>
        <textarea
          name="message"
          placeholder="How can we help you?"
          rows={5}
          required
        />
      </label>
      <div className="contact-form-actions">
        <p>Your message will open in WhatsApp for you to review and send.</p>
        <button className="contact-submit" type="submit">
          Send Message <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
