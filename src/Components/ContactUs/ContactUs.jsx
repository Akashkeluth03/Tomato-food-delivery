import { useState, useEffect } from "react";
import "./ContactUs.css";
import { assets } from "../../assets/assets";

const ContactUs = ({ setShowContact }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowContact(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [setShowContact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowContact(false);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div
      className="contact-overlay"
      role="presentation"
      onClick={() => setShowContact(false)}
    >
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="contact-close"
          onClick={() => setShowContact(false)}
          aria-label="Close"
        >
          <img src={assets.cross_icon} alt="" />
        </button>

        <div className="contact-title-row">
          <h2 id="contact-heading">Contact us</h2>
          <img src={assets.logo} alt="" className="contact-logo" />
        </div>

        <p className="contact-intro">
          Have a question or feedback? Send us a message — we usually reply within
          one business day.
        </p>

        <div className="contact-details">
          <span>+1-212-456-8620</span>
          <span>contact@tomato.com</span>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="How can we help?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="contact-submit">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
