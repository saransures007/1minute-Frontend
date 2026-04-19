import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <img src={logo} alt="1 Minute" className="h-12 brightness-0 invert" />
          <p className="text-sm leading-relaxed text-background/60">
            Find and choose products within 1 minute. Organized for quick decisions, not rushed checkout.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-semibold text-background">Quick Links</h4>
          {[
            { label: "Our Brand", to: "/brand" },
            { label: "Products", to: "/products" },
            // { label: "Quick Food", to: "/quick-food" },
            { label: "Stores", to: "/stores" },
            { label: "Franchise", to: "/franchise" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm text-background/60 hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-semibold text-background">Flagship Store</h4>
          <div className="flex items-start gap-2 text-sm text-background/60">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <span>Plot No. 1, Jawaharlal Nehru Salai, SIDCO Industrial Estate, Guindy, Chennai 600032</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-background/60">
            <Clock className="w-4 h-4 text-primary" />
            <span>8:00 AM – 11:00 PM</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-semibold text-background">Contact</h4>
          <a href="tel:+919944630450" className="flex items-center gap-2 text-sm text-background/60 hover:text-primary transition-colors">
            <Phone className="w-4 h-4 text-primary" /> +91 99446 30450
          </a>
          <a href="mailto:hello@1minutestore.com" className="flex items-center gap-2 text-sm text-background/60 hover:text-primary transition-colors">
            <Mail className="w-4 h-4 text-primary" /> oneminute.store@outlook.com
          </a>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-background/10 text-center text-xs text-background/40">
        © {new Date().getFullYear()} 1 Minute – Grab & Go. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
