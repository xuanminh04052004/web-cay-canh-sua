import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import CategoriesSection from "@/components/landing/CategoriesSection";
import SelectionSection from "@/components/landing/SelectionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ArticlesSection from "@/components/landing/ArticlesSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import AIFloatingButton from "@/components/AIFloatingButton";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <CategoriesSection />
      <SelectionSection />
      <TestimonialsSection />
      <ArticlesSection />
      <FAQSection />
      <Footer />
      <AIFloatingButton />
    </div>
  );
};

export default Index;
