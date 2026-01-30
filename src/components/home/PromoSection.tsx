import { useState } from "react";
import { Truck, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PromoSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "¡Gracias por suscribirte!",
        description: "Recibirás nuestras novedades y ofertas exclusivas.",
      });
      setEmail("");
    }
  };

  const benefits = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En compras mayores a $50.000",
    },
    {
      icon: ShieldCheck,
      title: "Pago Seguro",
      description: "Todas las transacciones protegidas",
    },
    {
      icon: RefreshCw,
      title: "Cambios Fáciles",
      description: "30 días para cambios o devoluciones",
    },
    {
      icon: CreditCard,
      title: "Cuotas Sin Interés",
      description: "Hasta 6 cuotas con tarjeta",
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      {/* Benefits */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="text-center p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Unite a Nuestra Comunidad
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Suscribite para recibir las últimas novedades, ofertas exclusivas y un 10% OFF en tu primera compra.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Suscribirme
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
