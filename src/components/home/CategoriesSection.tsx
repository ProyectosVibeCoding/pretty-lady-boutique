import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

  const categoryIcons: Record<string, string> = {
    vestidos: "👗",
    blusas: "👚",
    pantalones: "👖",
    faldas: "🎀",
    accesorios: "💎",
  };

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
          {categories?.map((category) => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="group relative aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden shadow-sm hover:shadow-elegant transition-all duration-300"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {categoryIcons[category.slug] || "🛍️"}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground text-center">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-muted-foreground mt-1 text-center line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
