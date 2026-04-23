import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrandShowcase from "./pages/BrandShowcase";
import ProductCatalog from "./pages/ProductCatalog";
import QuickFoodMenu from "./pages/QuickFoodMenu";
import StoreLocations from "./pages/StoreLocations";
import FranchiseEnquiry from "./pages/FranchiseEnquiry";

import ProductRequest from "./pages/ProductRequest";
import CreateCombo from "./pages/CreateCombo";
import NotFound from "./pages/NotFound";
import GenieAi from "./pages/GenieAi"
import Profile from "./pages/Profile"
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brand" element={<BrandShowcase />} />
          <Route path="/products" element={<ProductCatalog />} />
          {/* <Route path="/quick-food" element={<QuickFoodMenu />} /> */}
          <Route path="/stores" element={<StoreLocations />} />
          <Route path="/franchise" element={<FranchiseEnquiry />} />
          <Route path="/request-product" element={<ProductRequest />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/genieai" element={<GenieAi />} />
          {/* <Route path="/create-combo" element={<CreateCombo />} /> */}
          {/* <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
