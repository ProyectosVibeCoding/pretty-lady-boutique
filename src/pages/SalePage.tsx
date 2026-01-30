import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Percent } from "lucide-react";
import ProductModal from "@/components/product/ProductModal";
import saleBanner from "@/assets/banners/sale-banner.jpg";

// Import product images
import vestidoFloral from "@/assets/products/vestido-floral.jpg";
import blusaSaten from "@/assets/products/blusa-saten.jpg";
import pantalonTiroAlto from "@/assets/products/pantalon-tiro-alto.jpg";
import faldaPlisada from "@/assets/products/falda-plisada.jpg";
import vestidoCocktail from "@/assets/products/vestido-cocktail.jpg";
import blazerLino from "@/assets/products/blazer-lino.jpg";
import vestidoWrap from "@/assets/products/vestido-wrap.jpg";
import vestidoEncaje from "@/assets/products/vestido-encaje.jpg";
import blusaCamisola from "@/assets/products/blusa-camisola.jpg";
import blusaMangasGlobo from "@/assets/products/blusa-mangas-globo.jpg";
import pantalonWideLeg from "@/assets/products/pantalon-wide-leg.jpg";
import pantalonCigarette from "@/assets/products/pantalon-cigarette.jpg";
import faldaLapiz from "@/assets/products/falda-lapiz.jpg";
import faldaLineaA from "@/assets/products/falda-linea-a.jpg";
import collarPerlas from "@/assets/products/collar-perlas.jpg";
import arosDorados from "@/assets/products/aros-dorados.jpg";
import panueloSeda from "@/assets/products/panuelo-seda.jpg";
import braletteEncajeRosa from "@/assets/products/bralette-encaje-rosa.jpg";
import slipSatenNegro from "@/assets/products/slip-saten-negro.jpg";
import bodyEncajeBlanco from "@/assets/products/body-encaje-blanco.jpg";
import conjuntoBordo from "@/assets/products/conjunto-bordo.jpg";
import kimonoSedaRose from "@/assets/products/kimono-seda-rose.jpg";
import vestidoLenceroRosa from "@/assets/products/vestido-lencero-rosa.jpg";
import blusaCropLino from "@/assets/products/blusa-crop-lino.jpg";
import jeanMomFit from "@/assets/products/jean-mom-fit.jpg";

const productImages: Record<string, string> = {
  "vestido-floral-verano": vestidoFloral,
  "blusa-elegante-saten": blusaSaten,
  "pantalon-palazzo-negro": pantalonTiroAlto,
  "falda-midi-plisada": faldaPlisada,
  "vestido-cocktail-negro": vestidoCocktail,
  "blazer-oversize-lino": blazerLino,
  "vestido-wrap-rose": vestidoWrap,
  "vestido-encaje-romantic": vestidoEncaje,
  "camisola-seda-blanca": blusaCamisola,
  "blusa-mangas-globo": blusaMangasGlobo,
  "pantalon-wide-leg-negro": pantalonWideLeg,
  "pantalon-cigarette-crema": pantalonCigarette,
  "falda-lapiz-negra": faldaLapiz,
  "falda-linea-a-crema": faldaLineaA,
  "collar-perla-dorado": collarPerlas,
  "aros-argolla-dorados": arosDorados,
  "panuelo-seda-rose": panueloSeda,
  "bralette-encaje-rosa": braletteEncajeRosa,
  "slip-saten-negro": slipSatenNegro,
  "body-encaje-blanco": bodyEncajeBlanco,
  "conjunto-bordo": conjuntoBordo,
  "kimono-seda-rose": kimonoSedaRose,
  "vestido-lencero-rosa": vestidoLenceroRosa,
  "blusa-crop-lino": blusaCropLino,
  "jean-mom-fit": jeanMomFit,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

const SalePage = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["sale-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, categories(name, slug)`)
        .eq("is_active", true)
        .eq("is_on_sale", true)
        .order("base_price", { ascending: true })
        .limit(12);
      
      if (error) throw error;
      return data;
    },
  });

  const calculateDiscountedPrice = (price: number) => {
    return price * 0.7; // 30% off
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <motion.img 
            src={saleBanner} 
            alt="Sale" 
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.div 
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Percent className="h-5 w-5" />
                <span className="font-semibold">Hasta 30% OFF</span>
              </motion.div>
              <motion.h1 
                className="font-heading text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Sale
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl max-w-xl mx-auto drop-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Ofertas exclusivas por tiempo limitado
              </motion.p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {products?.map((product) => {
                  const productImage = productImages[product.slug];
                  const discountedPrice = calculateDiscountedPrice(product.base_price);
                  return (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className="group text-left"
                    >
                      <div className="relative aspect-[3/4] rounded-xl bg-muted overflow-hidden mb-3">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                            <span className="text-4xl opacity-50">👗</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                          -30%
                        </span>
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" className="flex-1 h-9">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Ver detalle
                          </Button>
                          <Button size="sm" variant="secondary" className="h-9 w-9 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {product.categories && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {product.categories.name}
                          </p>
                        )}
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="font-heading font-semibold text-primary">
                            {formatPrice(discountedPrice)}
                          </p>
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.base_price)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};

export default SalePage;
