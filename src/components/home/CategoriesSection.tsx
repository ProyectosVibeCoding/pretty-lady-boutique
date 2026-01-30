import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Import category images
import vestidosImg from "@/assets/categories/vestidos.jpg";
import blusasImg from "@/assets/categories/blusas.jpg";
import pantalonesImg from "@/assets/categories/pantalones.jpg";
import faldasImg from "@/assets/categories/faldas.jpg";
import accesoriosImg from "@/assets/categories/accesorios.jpg";
import lenceriaImg from "@/assets/categories/lenceria.jpg";

// Image mapping by slug
const categoryImages: Record<string, string> = {
  vestidos: vestidosImg,
  blusas: blusasImg,
  pantalones: pantalonesImg,
  faldas: faldasImg,
  accesorios: accesoriosImg,
  lenceria: lenceriaImg,
};

const CategoriesSection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("sort_order");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explorá por Categoría
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encontrá exactamente lo que buscás en nuestra colección curada
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories?.map((category) => {
            const categoryImage = categoryImages[category.slug];
            
            return (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant transition-all duration-300"
              >
                {/* Background image */}
                {categoryImage ? (
                  <img 
                    src={categoryImage} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <h3 className="font-heading text-lg font-semibold text-white drop-shadow-md">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-white/80 mt-1 line-clamp-2 drop-shadow">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
