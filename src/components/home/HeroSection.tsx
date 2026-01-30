import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import collectionImage from "@/assets/hero/collection-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center bg-gradient-to-br from-secondary via-background to-secondary/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-2">
              <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm">
                Nueva Colección
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                Elegancia que{" "}
                <span className="text-primary">Define</span> tu Estilo
              </h1>
            </div>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-xl mx-auto lg:mx-0">
              Descubrí nuestra colección exclusiva de moda femenina, diseñada para realzar tu belleza natural.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="group">
                <Link to="/novedades">
                  Ver Colección
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/sale">Ofertas Especiales</Link>
              </Button>
            </div>
          </div>

          {/* Collection Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={collectionImage} 
                alt="Nueva Colección Pretty Lady"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
