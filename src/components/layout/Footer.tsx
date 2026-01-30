import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Pretty Lady</h2>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Moda femenina con estilo y elegancia. Descubrí las últimas tendencias para cada ocasión.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
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
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
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
              {[
                "Preguntas frecuentes",
                "Envíos y entregas",
                "Cambios y devoluciones",
                "Guía de talles",
                "Contacto",
              ].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hola@prettylady.com</span>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2024 Pretty Lady. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
