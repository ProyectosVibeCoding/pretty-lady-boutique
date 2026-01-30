import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Minus, Plus, Trash2, LogIn } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

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
  "vestido-cocktail-bordo": vestidoCocktail,
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

const CartDrawer = () => {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    isLoading, 
    itemCount, 
    total, 
    updateQuantity, 
    removeItem,
    isAuthenticated 
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-heading text-xl">
            <ShoppingBag className="h-5 w-5" />
            Mi Carrito ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <LogIn className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">
              Iniciá sesión para ver tu carrito
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Necesitás una cuenta para guardar productos en tu carrito
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link to="/auth">Iniciar Sesión</Link>
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              ¡Explorá nuestra colección y encontrá tu próximo look favorito!
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link to="/productos">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const productImage = productImages[item.variant.product.slug];
                  const price = item.variant.product.base_price + (item.variant.price_modifier || 0);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-3 rounded-lg bg-secondary/30"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={item.variant.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl opacity-50">👗</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                          {item.variant.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.variant.color} / {item.variant.size}
                        </p>
                        <p className="font-semibold text-primary text-sm">
                          {formatPrice(price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, Math.min(item.variant.stock, item.quantity + 1))}
                              disabled={item.quantity >= item.variant.stock}
                              className={cn(
                                "w-7 h-7 rounded-md border border-border flex items-center justify-center transition-colors",
                                item.quantity >= item.variant.stock 
                                  ? "opacity-50 cursor-not-allowed" 
                                  : "hover:bg-secondary"
                              )}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Los gastos de envío se calcularán en el checkout
              </p>
              <Button 
                size="lg" 
                className="w-full h-12"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link to="/checkout">
                  Ir al Checkout
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Seguir Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
