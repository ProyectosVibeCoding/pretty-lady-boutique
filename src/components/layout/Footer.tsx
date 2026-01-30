import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import SizeGuideModal from "@/components/product/SizeGuideModal";

const Footer = () => {
  const helpLinks = [
    { label: "Preguntas frecuentes", href: "#" },
    { label: "Envíos y entregas", href: "#" },
    { label: "Cambios y devoluciones", href: "#" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <footer className="bg-muted text-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Pretty Lady</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Moda femenina con estilo y elegancia. Descubrí las últimas tendencias para cada ocasión.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Tienda</h3>
            <nav className="flex flex-col gap-2">
              {["Novedades", "Vestidos", "Blusas", "Pantalones", "Sale"].map((item) => (
                <Link
                  key={item}
                  to={`/categoria/${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Ayuda</h3>
            <nav className="flex flex-col gap-2">
              {helpLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
              {/* Size Guide with Modal */}
              <SizeGuideModal
                trigger={
                  <button className="text-muted-foreground hover:text-primary transition-colors text-sm text-left">
                    Guía de talles
                  </button>
                }
              />
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hola@prettylady.com</span>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Pretty Lady. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
