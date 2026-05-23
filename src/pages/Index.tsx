import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealsSection from "@/components/home/DealsSection";
import PlansSection from "@/components/home/PlansSection";
import SurpriseZone from "@/components/home/SurpriseZone";
import EnergyZone from "@/components/home/EnergyZone";

const Index = () => (
  <Layout>
    <HeroSection />
    {/* <PlansSection /> */}
    <CategoriesSection />
    <FeaturedProducts />
    <DealsSection />
    <SurpriseZone />
    <EnergyZone />
  </Layout>
);

export default Index;
