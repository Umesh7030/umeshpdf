import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
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
];

export default function Footer() {
  return (
    <footer className="login-footer">
      <p>&copy; All Rights Reserved</p>

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
