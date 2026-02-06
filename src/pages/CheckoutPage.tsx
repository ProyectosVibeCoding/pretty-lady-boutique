import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShoppingBag,
  MapPin,
  Loader2,
  Building2,
  Banknote
} from "lucide-react";
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

const SHIPPING_COST = 4500;

const steps = [
  { id: 1, name: "Envío", icon: Truck },
  { id: 2, name: "Pago", icon: CreditCard },
  { id: 3, name: "Confirmación", icon: CheckCircle2 },
];

interface ShippingData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, isAuthenticated, userId, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "transfer">("mercadopago");

  const [orderCompleted, setOrderCompleted] = useState(false);

  // Redirect if not authenticated or cart is empty (but not if order was completed)
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Iniciá sesión para continuar");
      navigate("/auth");
      return;
    }
    if (items.length === 0 && currentStep !== 3 && !orderCompleted) {
      navigate("/productos");
    }
  }, [isAuthenticated, items.length, navigate, currentStep, orderCompleted]);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (profile) {
        setShippingData(prev => ({
          ...prev,
          fullName: profile.full_name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          postalCode: profile.postal_code || "",
        }));
      }
    };
    
    loadProfile();
  }, [userId]);

  const totalWithShipping = total + SHIPPING_COST;
  const progress = (currentStep / steps.length) * 100;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.postalCode) {
      toast.error("Por favor completá todos los campos obligatorios");
      return;
    }
    
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async () => {
    if (!userId) {
      toast.error("Error de autenticación");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          order_number: "", // Will be generated by trigger
          shipping_name: shippingData.fullName,
          shipping_phone: shippingData.phone,
          shipping_address: shippingData.address,
          shipping_city: shippingData.city,
          shipping_postal_code: shippingData.postalCode,
          notes: shippingData.notes,
          subtotal: total,
          shipping_cost: SHIPPING_COST,
          total_amount: totalWithShipping,
          status: paymentMethod === "transfer" ? "awaiting_payment" : "pending",
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_variant_id: item.product_variant_id,
        product_name: item.variant.product.name,
        variant_size: item.variant.size,
        variant_color: item.variant.color,
        quantity: item.quantity,
        unit_price: item.variant.product.base_price + (item.variant.price_modifier || 0),
        total_price: (item.variant.product.base_price + (item.variant.price_modifier || 0)) * item.quantity,
      }));
      
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          amount: totalWithShipping,
          payment_method: paymentMethod,
          status: "pending",
          idempotency_key: `${order.id}-${Date.now()}`,
        });
      
      if (paymentError) throw paymentError;
      
      // If using MercadoPago, simulate the payment process
      if (paymentMethod === "mercadopago") {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update payment status to approved (simulation)
        await supabase
          .from("payments")
          .update({ status: "approved", external_id: `MP-${Date.now()}` })
          .eq("order_id", order.id);
        
        // Update order status
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", order.id);
      }
      
      // Set order completed FIRST to prevent redirect
      setOrderCompleted(true);
      setOrderId(order.id);
      setOrderNumber(order.order_number);
      setCurrentStep(3);
      
      // Clear the cart AFTER setting the step
      await clearCart();
      
      toast.success("¡Pedido realizado con éxito!");
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Error al procesar el pedido");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render cart summary
  const renderCartSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const productImage = productImages[item.variant.product.slug];
          const price = item.variant.product.base_price + (item.variant.price_modifier || 0);
          
          return (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {productImage ? (
                  <img 
                    src={productImage} 
                    alt={item.variant.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl opacity-50">👗</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.variant.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.variant.color} / {item.variant.size}
                </p>
                <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span>{formatPrice(SHIPPING_COST)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totalWithShipping)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render shipping form
  const renderShippingForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Datos de Envío
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo *</Label>
              <Input
                id="fullName"
                value={shippingData.fullName}
                onChange={(e) => setShippingData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingData.phone}
                onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="11 1234-5678"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={shippingData.address}
              onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Calle, número, piso, depto"
              required
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={shippingData.city}
                onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Ciudad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal *</Label>
              <Input
                id="postalCode"
                value={shippingData.postalCode}
                onChange={(e) => setShippingData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="1234"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Input
              id="notes"
              value={shippingData.notes}
              onChange={(e) => setShippingData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Indicaciones para la entrega"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/productos")}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button type="submit" className="flex-1">
              Continuar al Pago
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as "mercadopago" | "transfer")}
          className="space-y-3"
        >
          <div 
            className={cn(
              "flex items-center space-x-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
              paymentMethod === "mercadopago" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setPaymentMethod("mercadopago")}
          >
            <RadioGroupItem value="mercadopago" id="mercadopago" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#009EE3]" />
                <Label htmlFor="mercadopago" className="font-medium cursor-pointer">
                  Mercado Pago
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tarjeta de crédito, débito o dinero en cuenta
              </p>
            </div>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-[#009EE3] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">MP</span>
              </div>
            </div>
          </div>
          
          <div 
            className={cn(
              "flex items-center space-x-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
              paymentMethod === "transfer" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setPaymentMethod("transfer")}
          >
            <RadioGroupItem value="transfer" id="transfer" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="transfer" className="font-medium cursor-pointer">
                  Transferencia Bancaria
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pagá con transferencia y envianos el comprobante
              </p>
            </div>
            <Banknote className="h-6 w-6 text-muted-foreground" />
          </div>
        </RadioGroup>
        
        {/* Shipping Summary */}
        <div className="rounded-xl bg-secondary/30 p-4 space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Envío a:
          </h4>
          <p className="text-sm">{shippingData.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {shippingData.address}, {shippingData.city} ({shippingData.postalCode})
          </p>
          {shippingData.phone && (
            <p className="text-sm text-muted-foreground">Tel: {shippingData.phone}</p>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
            className="flex-1"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Button 
            onClick={handlePaymentSubmit} 
            className="flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Confirmar Pedido
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Render confirmation
  const renderConfirmation = () => (
    <Card className="text-center">
      <CardContent className="pt-8 pb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="font-heading text-2xl font-bold mb-2">¡Gracias por tu compra!</h2>
        <p className="text-muted-foreground mb-6">
          Tu pedido ha sido registrado exitosamente
        </p>
        
        {orderNumber && (
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-muted-foreground">Número de pedido:</span>
            <span className="font-mono font-semibold">{orderNumber}</span>
          </div>
        )}
        
        {paymentMethod === "transfer" ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
              Datos para la transferencia:
            </h4>
            <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <p><span className="font-medium">Banco:</span> Banco Nación</p>
              <p><span className="font-medium">CBU:</span> 0110599520059901234560</p>
              <p><span className="font-medium">Alias:</span> PELU.TIENDA.MP</p>
              <p><span className="font-medium">Titular:</span> Pelusa Tienda SRL</p>
              <p><span className="font-medium">CUIT:</span> 30-12345678-9</p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
              Enviá el comprobante por WhatsApp al +54 11 1234-5678
            </p>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
            <p className="text-green-700 dark:text-green-300 text-sm">
              ✓ Pago procesado correctamente
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-6">
          Te enviaremos un email con los detalles de tu pedido y el seguimiento del envío.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Volver al Inicio</Link>
          </Button>
          <Button asChild>
            <Link to="/productos">Seguir Comprando</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <Progress value={progress} className="h-2 mb-6" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isCurrent ? "bg-primary text-primary-foreground" : 
                    isActive ? "bg-primary/20" : "bg-muted"
                  )}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3">
              {currentStep === 1 && renderShippingForm()}
              {currentStep === 2 && renderPaymentForm()}
              {currentStep === 3 && renderConfirmation()}
            </div>
            
            {/* Cart Summary */}
            {currentStep !== 3 && (
              <div className="lg:col-span-2">
                {renderCartSummary()}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
