import { motion } from "framer-motion";
import { ShoppingBag, Users, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationSliderProps {
  activeSlide: number;
  onSlideChange: (index: number) => void;
}

const slides = [
  { id: 0, title: "Shop Now", description: "Explore our collection of premium indoor and outdoor plants", icon: ShoppingBag, accent: "hsl(142, 45%, 45%)", path: "/catalog" },
  { id: 1, title: "About Us", description: "Learn about our mission to bring green into every home", icon: Users, accent: "hsl(35, 40%, 50%)", path: "/services" },
  { id: 2, title: "Plant Guide", description: "Expert care tips and growing guides for all plant types", icon: BookOpen, accent: "hsl(142, 35%, 55%)", path: "/guide" },
];

const NavigationSlider = ({ activeSlide, onSlideChange }: NavigationSliderProps) => {
  const navigate = useNavigate();

  const handleClick = (index: number, path: string) => {
    if (activeSlide === index) {
      navigate(path);
    } else {
      onSlideChange(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="absolute bottom-8 left-0 right-0 z-20 px-6"
    >
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = activeSlide === index;
          return (
            <motion.div
              key={slide.id}
              onClick={() => handleClick(index, slide.path)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`nav-slider-card min-w-[240px] md:min-w-[280px] flex-shrink-0 ${isActive ? "active" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${slide.accent}20` }}
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6" style={{ color: slide.accent }} />
                </motion.div>
                <motion.div animate={{ x: isActive ? 5 : 0, opacity: isActive ? 1 : 0.5 }} transition={{ duration: 0.3 }}>
                  <ArrowRight className="w-5 h-5 text-foreground/60" />
                </motion.div>
              </div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">{slide.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.description}</p>
              <motion.div className="mt-4 h-1 rounded-full overflow-hidden bg-muted/30">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: slide.accent }}
                  initial={{ width: "0%" }}
                  animate={{ width: isActive ? "100%" : "0%" }}
                  transition={{ duration: isActive ? 5 : 0.3, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NavigationSlider;
