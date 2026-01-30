import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductModal from "@/components/product/ProductModal";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Import product images
import vestidoFloral from "@/assets/products/vestido-floral.jpg";
import blusaSaten from "@/assets/products/blusa-saten.jpg";
import pantalonTiroAlto from "@/assets/products/pantalon-tiro-alto.jpg";
import faldaPlisada from "@/assets/products/falda-plisada.jpg";
import vestidoCocktail from "@/assets/products/vestido-cocktail.jpg";
import vestidoCocktailBordo from "@/assets/products/vestido-cocktail-bordo.jpg";
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
  "vestido-cocktail-bordo": vestidoCocktailBordo,
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

const ProductsPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, categories(name, slug)`)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Todos los Productos</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Todos los Productos
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explorá nuestra colección completa de prendas exclusivas
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {products?.length || 0} productos
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => {
              const productImage = productImages[product.slug];
              
              return (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
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
                    
                    {product.is_featured && (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                        Destacado
                      </span>
                    )}

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
                    <p className="font-heading font-semibold text-primary">
                      {formatPrice(product.base_price)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay productos disponibles.
            </p>
          </div>
        )}
      </main>
      <Footer />

      {/* Product Modal */}
      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};

export default ProductsPage;
