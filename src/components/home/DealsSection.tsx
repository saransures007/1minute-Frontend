import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { apiService } from "@/lib/api/api";

const DealsSection = () => {
  const [products, setProducts] = useState<any[]>([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      // ✅ STEP 1: Get items by category
      const res = await apiService.getItems({
        categoryId: "254650647",
      });

      const rawItems = res?.data || [];

      // ✅ STEP 2: Extract variant IDs (300ml only)
      const ids = rawItems?.flatMap((item: any) => {
        if (!item?.isActive) return [];

        return (item.variants || [])
          .filter((v: any) => v.isActive && v.size === "300ml")
          .map((v: any) => v.id);
      });

      const uniqueIds = [...new Set(ids)].filter(Boolean).slice(0, 8);

      // ✅ STEP 3: Fetch each item by ID
      const responses = await Promise.all(
        uniqueIds.map((id: string) =>
          apiService
            .getItemById(id)
            .then((res) => res?.data)
            .catch(() => null)
        )
      );

      // ✅ STEP 4: Filter valid active items
      const items = responses.filter(
        (item: any) => item && item.isActive
      );

      console.log("items",res)

      setProducts(items);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  fetchProducts();
}, []);

  return (
    <AnimatedSection className="py-20 md:py-28">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          Featured 1-Minute Drinks
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-card rounded-2xl p-5 shadow-card border hover:shadow-lg transition-all"
            >
              {/* IMAGE */}
              <img
                src={item.itemImage}
                alt={item.itemName}
                className="w-full aspect-[8/11.4] object-contain mb-4"
              />

              {/* NAME */}
              <h3 className="font-bold text-lg mb-1">
                {item.itemName}
              </h3>

              {/* CATEGORY */}
              <p className="text-xs text-muted-foreground mb-2">
                {item.category}
              </p>

              {/* PRICE */}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  ₹{item.salesRate}
                </span>

                <span
                  className={`text-xs font-semibold ${
                    item.stock > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
};

export default DealsSection;