"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { apiService } from "@/lib/api/api";

/* -------------------- DEBOUNCE -------------------- */
function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value]);
  return debounced;
}

/* -------------------- CATEGORY ID → ICON MAP -------------------- */
const categoryIconById: Record<number, string> = {
  254650567: "🍟", // Snack
  254668424: "🥛", // Dairy
  254654489: "🍫", // Chocolate
  254650576: "🥤", // Beverages
  254648472: "🛒", // Grocery
  254650579: "🧴", // Personal Care
  254650554: "👕", // Fashion
  254650563: "⚗️", // Chemical Products
};

const getCategoryIcon = (category: any) => {
  if (!category || !category.id) return "📦";
  return categoryIconById[category.id] || "📦";
};

/* -------------------- MAIN -------------------- */
export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [master, setMaster] = useState<any>({
    categories: [],
    groups: [],
  });

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "all",
    groupIds: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  // ✅ pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(filters.search);

  /* -------- LOAD MASTER DATA -------- */
  useEffect(() => {
    const load = async () => {
      const res = await apiService.getMasterData();
      setMaster(res.data);
    };
    load();
  }, []);

  /* -------- LOAD PRODUCTS -------- */
  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, filters.categoryId, filters.groupIds, page, perPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await apiService.getItems({
        itemName: debouncedSearch || undefined,
        categoryId:
          filters.categoryId !== "all"
            ? filters.categoryId
            : undefined,
        groupId:
          filters.groupIds.length > 0
            ? filters.groupIds.join(",")
            : undefined,
        page,
        perPage,
      });

      setProducts(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------- GROUP TOGGLE -------- */
  const toggleGroup = (id: string) => {
    setFilters((prev) => {
      const exists = prev.groupIds.includes(id);
      return {
        ...prev,
        groupIds: exists
          ? prev.groupIds.filter((g) => g !== id)
          : [...prev.groupIds, id],
      };
    });
    setPage(1);
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
     <div className="text-center mb-16">
            <h1 className="text-4xl md:text-4xl font-display font-bold mb-4">
              Search <span className="text-gradient-hero">Products</span> In Our Store
            </h1>
          </div>
        {/* 🔍 SEARCH */}
        <AnimatedSection>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products (milk, boost...)"
              value={filters.search}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }));
                setPage(1);
              }}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </AnimatedSection>

        {/* 📂 CATEGORY DROPDOWN */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select
              value={filters.categoryId}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  categoryId: value,
                }));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-72 h-11">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent className="max-h-72">
                <SelectItem value="all">
                  📦 All Categories
                </SelectItem>

                {master.categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {getCategoryIcon(cat)} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </AnimatedSection>

        {/* 🎯 GROUP CHIPS */}
        <AnimatedSection>
          <div className="flex flex-wrap gap-2 mb-6">
            {master.groups.slice(0, 20).map((group: any) => {
              const active = filters.groupIds.includes(
                String(group.id)
              );

              return (
                <Badge
                  key={group.id}
                  variant={active ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGroup(String(group.id))}
                >
                  {group.name}
                </Badge>
              );
            })}
          </div>
        </AnimatedSection>

        {/* 📦 TABLE */}
        <AnimatedSection>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">

                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Group</th>
                      <th className="p-3">Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3 flex items-center gap-2">
                          {/* <span className="text-xl">
                            {getCategoryIcon(item.category)}
                          </span> */}
                          {item.name}
                        </td>

                        <td className="p-3">
                          {getCategoryIcon(item.category)}{" "}
                          {item.category?.name || "—"}
                        </td>

                        <td className="p-3">
                          {item.group?.name || "—"}
                        </td>

                        <td className="p-3 font-semibold">
                          ₹{item.price || item.sellingPrice || "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">

                {/* PAGE SIZE */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Rows:</span>
                  <Select
                    value={String(perPage)}
                    onValueChange={(v) => {
                      setPerPage(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PAGE NAV */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-sm">
                    Page {page} / {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </AnimatedSection>

      </div>
    </Layout>
  );
}