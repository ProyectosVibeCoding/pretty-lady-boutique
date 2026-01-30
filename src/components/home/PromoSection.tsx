import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PromoSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const benefitsRef = useRef(null);
  const newsletterRef = useRef(null);
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  const isNewsletterInView = useInView(newsletterRef, { once: true, margin: "-100px" });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const newsletterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 lg:py-24">
      {/* Benefits */}
      <div ref={benefitsRef} className="container mx-auto px-4 mb-16">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isBenefitsInView ? "visible" : "hidden"}
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="text-center p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-default"
            >
              <motion.div 
                className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <benefit.icon className="h-6 w-6 text-accent" />
              </motion.div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Newsletter */}
      <div ref={newsletterRef} className="bg-primary text-primary-foreground py-16 overflow-hidden">
        <motion.div 
          className="container mx-auto px-4"
          variants={newsletterVariants}
          initial="hidden"
          animate={isNewsletterInView ? "visible" : "hidden"}
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 
              className="font-heading text-3xl lg:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isNewsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Unite a Nuestra Comunidad
            </motion.h2>
            <motion.p 
              className="text-primary-foreground/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isNewsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Suscribite para recibir las últimas novedades, ofertas exclusivas y un 10% OFF en tu primera compra.
            </motion.p>
            <motion.form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isNewsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                required
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                >
                  Suscribirme
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSection;
