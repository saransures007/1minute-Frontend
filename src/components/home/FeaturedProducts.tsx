import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Plus, ShoppingBag, ImageOff } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api/api"; // adjust path as needed

interface Product {
  id: number | string;
  itemName: string;
  itemImage?: string | null;
  price: number | string;
  salesRate?: number;
  category?: string;
  group?: string;
}

const kuromiMessages = [
  "Ooh Ready to Eats! My favorite~ 💜",
  "That looks so yummy! 🥤",
  "Grab one for me too! ✨",
];

const FeaturedProducts = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Improved emoji matcher for "Ready to Eat" category
  const getProductEmoji = (name: string, group: string = ""): string => {
    const productName = name.toLowerCase();
    const groupName = group.toLowerCase();

    if (productName.includes("parota") || productName.includes("paratha")) return "🥟";
    if (productName.includes("pongal") || productName.includes("mix")) return "🍚";
    if (productName.includes("ramen") || productName.includes("noodle")) return "🍜";
    if (productName.includes("maggi")) return "🍝";
    if (productName.includes("cheesy") || productName.includes("cheese")) return "🧀";
    if (productName.includes("chicken")) return "🍗";
    if (productName.includes("spicy")) return "🌶️";
    if (groupName.includes("snack")) return "🥨";
    if (groupName.includes("packed")) return "📦";

    // Default fallbacks
    const defaults = ["🍜", "🥟", "🍝", "🧀", "🍚", "🌯", "🥪", "🍱"];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };
useEffect(() => {
  const fetchProductsWithDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔹 STEP 1: Fetch items list
      const response = await apiService.getItems({
        categoryId: "254656547",
        perPage: 10,
      });

      if (!response.success || !response.data) {
        setError("Failed to load products");
        return;
      }

      // 🔹 Handle array / paginated response
      const itemsArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // 🔹 STEP 2: Fetch full details using item.id
      const detailedItems = await Promise.all(
        itemsArray.map(async (item: any) => {
          try {
            const full = await apiService.getItemById(item.id);
            return full.data || item; // fallback
          } catch (err) {
            console.warn("Failed to fetch full item:", item.id);
            return item; // fallback
          }
        })
      );

      // 🔹 STEP 3: Format products
      const formattedProducts: Product[] = detailedItems.map((item: any) => ({
        id: item.id,
        itemName: item.itemName || item.name,
        itemImage: item.itemImage || item.image,
        price: item.price || item.salesRate || 0,
        salesRate: item.salesRate,
        category: item.category?.name || item.category,
        group: item.group?.name || item.group,
      }));

      // 🔹 STEP 4: Shuffle + pick 6
      const shuffled = [...formattedProducts].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 6));

    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Something went wrong while loading products");
    } finally {
      setLoading(false);
    }
  };

  fetchProductsWithDetails();
}, []);

  return (
    <AnimatedSection className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold">Quick Picks</h2>
            <p className="text-muted-foreground mt-2 text-lg">Grab in 1 minute • Ready to Eat</p>
          </div>

          {/* Kuromi walking character */}
          <div className="hidden md:block relative">
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: [0, 30, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="text-4xl cursor-pointer select-none"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                title="Konnichiwa!"
              >
                🐱
              </motion.span>
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0], x: 0 }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="bg-foreground text-background text-xs px-3 py-2 rounded-2xl rounded-bl-sm whitespace-nowrap font-medium shadow-lg"
              >
                {kuromiMessages[0]}
              </motion.div>
            </motion.div>

            {/* Footprints trail */}
            <div className="absolute -bottom-4 left-0 flex gap-4">
              {[0, 1, 2].map((j) => (
                <motion.span
                  key={j}
                  className="text-xs opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 3, delay: j * 0.3, repeat: Infinity }}
                >
                  🐾
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 h-64 animate-pulse" />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {error}
            </div>
          ) : (
            products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Image or Emoji */}
                  <div className="relative w-20 h-20 flex items-center justify-center bg-muted rounded-xl overflow-hidden">
                    {p.itemImage ? (
                      <img
                        src={p.itemImage}
                        alt={p.itemName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                        <span className="text-6xl transition-transform group-hover:scale-110">
                        {getProductEmoji(p.itemName, p.group || "")}
                      </span>
                    )}
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {p.group || "Drink"}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg line-clamp-2 min-h-[3.2rem]">
                  {p.itemName}
                </h3>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <span className="text-2xl font-bold text-foreground font-display">
                      ₹{Number(p.price).toFixed(0)}
                    </span>
                    {/* {p.salesRate && p.salesRate > 0 && (
                      <p className="text-xs text-muted-foreground">₹{p.salesRate} MRP</p>
                    )} */}
                  </div>

                  {/* <motion.button
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85 }}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center text-primary-foreground shadow-lg opacity-80 group-hover:opacity-100 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button> */}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FeaturedProducts;