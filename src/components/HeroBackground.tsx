import { motion, AnimatePresence } from "framer-motion";
import bgShop from "@/assets/bg-shop.jpg";
import bgAbout from "@/assets/bg-about.jpg";
import bgGuide from "@/assets/bg-guide.jpg";

interface HeroBackgroundProps {
  activeSlide: number;
}

const backgrounds = [bgShop, bgAbout, bgGuide];

const HeroBackground = ({ activeSlide }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={backgrounds[activeSlide]}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay" />
      
      {/* Additional dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
};

export default HeroBackground;
