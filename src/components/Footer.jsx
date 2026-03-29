import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { socialLinks } from "../data/socialLinks";

const footerLinks = [
  {
    href: socialLinks.instagram,
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: socialLinks.facebook,
    icon: FaFacebook,
    label: "Facebook",
  },
  {
    href: socialLinks.youtube,
    icon: FaYoutube,
    label: "YouTube",
  },
  {
    href: socialLinks.whatsapp,
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
];

export default function Footer() {
  return (
    <footer className="login-footer">
      <div className="login-footer-copy">
        <p>&copy; All Rights Reserved</p>
        <small>Toll Free: 7743935692</small>
        <small className="login-footer-message">
          Reliable solutions and responsive support for every client.
        </small>
        <span>Follow us on</span>
      </div>

      <div className="login-footer-icons">
        {footerLinks.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className="login-footer-icon"
            >
              <Icon size={22} />
            </a>
          );
        })}
      </div>
    </footer>
  );
}
