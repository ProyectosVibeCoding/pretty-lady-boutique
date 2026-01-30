import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingBag, Minus, Plus, Check, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import SizeGuideModal from "@/components/product/SizeGuideModal";

// Import all product images
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

interface ProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

const ProductModal = ({ productId, isOpen, onClose }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem, isAuthenticated, setIsOpen: setCartOpen } = useCart();

  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, categories(name, slug)`)
        .eq("id", productId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId && isOpen,
  });

  // Fetch product variants
  const { data: variants } = useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId && isOpen,
  });

  // Reset selections when modal opens with new product
  useEffect(() => {
    if (isOpen && productId) {
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [isOpen, productId]);

  // Get unique sizes and colors from variants
  const sizes = variants ? [...new Set(variants.map(v => v.size))] : [];
  const colors = variants ? [...new Set(variants.map(v => v.color))] : [];
  const colorHexMap = variants?.reduce((acc, v) => {
    if (v.color_hex) acc[v.color] = v.color_hex;
    return acc;
  }, {} as Record<string, string>) || {};

  // Get selected variant
  const selectedVariant = variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  // Calculate final price
  const finalPrice = product ? product.base_price + (selectedVariant?.price_modifier || 0) : 0;

  // Get stock for selected variant
  const stock = selectedVariant?.stock || 0;

  // Check if selection is complete
  const canAddToCart = selectedSize && selectedColor && stock > 0;

  // Product images (main + gallery simulation)
  const productImage = product ? productImages[product.slug] : null;
  const images = productImage ? [productImage, productImage, productImage] : [];

  const handleAddToCart = async () => {
    if (!canAddToCart || !selectedVariant) {
      toast.error("Seleccioná talle y color antes de agregar al carrito");
      return;
    }
    
    if (!isAuthenticated) {
      toast.error("Iniciá sesión para agregar productos al carrito");
      onClose();
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addItem(selectedVariant.id, quantity);
      toast.success(`${product?.name} agregado al carrito`, {
        description: `Talle: ${selectedSize} | Color: ${selectedColor} | Cantidad: ${quantity}`,
      });
      onClose();
      setCartOpen(true);
    } catch (error) {
      // Error handled in cart hook
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (productLoading || !product) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse text-muted-foreground">Cargando...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="grid lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative bg-secondary/30 p-6 lg:p-8">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-4">
              {productImage ? (
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl opacity-50">👗</span>
                </div>
              )}
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-accent text-accent-foreground">
                    Destacado
                  </Badge>
                )}
                {stock <= 3 && stock > 0 && (
                  <Badge variant="destructive">
                    ¡Últimas unidades!
                  </Badge>
                )}
              </div>

              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isFavorite 
                    ? "bg-red-500 text-white" 
                    : "bg-background/80 backdrop-blur hover:bg-background"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-16 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === idx 
                      ? "border-primary" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 lg:p-8 flex flex-col">
            <DialogHeader className="text-left mb-4">
              {product.categories && (
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                  {product.categories.name}
                </p>
              )}
              <DialogTitle className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Price */}
            <div className="mb-6">
              <p className="font-heading text-3xl font-bold text-primary">
                {formatPrice(finalPrice)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Precio final. Impuestos incluidos.
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-foreground/80 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Separator className="my-4" />

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">Color</span>
                  {selectedColor && (
                    <span className="text-sm text-muted-foreground">{selectedColor}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                        selectedColor === color 
                          ? "border-primary scale-110" 
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ backgroundColor: colorHexMap[color] || "#ccc" }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <Check className={cn(
                          "h-5 w-5",
                          colorHexMap[color]?.toLowerCase() === "#ffffff" || colorHexMap[color]?.toLowerCase() === "#fff" 
                            ? "text-foreground" 
                            : "text-white"
                        )} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">Talle</span>
                  <SizeGuideModal
                    trigger={
                      <button className="text-sm text-primary hover:underline">
                        Guía de talles
                      </button>
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variantForSize = variants?.find(
                      v => v.size === size && (selectedColor ? v.color === selectedColor : true)
                    );
                    const isAvailable = variantForSize && variantForSize.stock > 0;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={cn(
                          "min-w-[48px] h-12 px-4 rounded-lg border-2 font-medium transition-all",
                          selectedSize === size 
                            ? "border-primary bg-primary text-primary-foreground" 
                            : isAvailable
                              ? "border-border hover:border-primary bg-background"
                              : "border-border/50 bg-muted text-muted-foreground line-through cursor-not-allowed"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {selectedSize && selectedColor && (
              <div className="mb-6">
                {stock > 0 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      stock <= 3 ? "bg-orange-500" : "bg-green-500"
                    )} />
                    <span className={stock <= 3 ? "text-orange-600" : "text-green-600"}>
                      {stock <= 3 ? `¡Solo quedan ${stock} unidades!` : `${stock} unidades disponibles`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Sin stock
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <span className="font-medium text-foreground mb-3 block">Cantidad</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock || 10, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg"
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Agregar al carrito
                  </>
                )}
              </Button>
            </div>

            {/* Warning if selection incomplete */}
            {(!selectedSize || !selectedColor) && (
              <p className="text-sm text-muted-foreground text-center mb-6">
                Seleccioná {!selectedColor && "color"}{!selectedColor && !selectedSize && " y "}{!selectedSize && "talle"} para continuar
              </p>
            )}

            <Separator className="my-4" />

            {/* Benefits */}
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Envío gratis</p>
                  <p>En compras superiores a $50.000</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Cambios y devoluciones</p>
                  <p>Hasta 30 días después de tu compra</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Compra segura</p>
                  <p>Tus datos están protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
