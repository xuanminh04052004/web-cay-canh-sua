import { motion, AnimatePresence } from "framer-motion";

interface HeroContentProps {
  activeSlide: number;
}

const slideContent = [
  {
    title: "Bring Nature\nInto Your Home",
    subtitle: "Discover our curated collection of rare and beautiful plants",
  },
  {
    title: "Our Story\nBegins With You",
    subtitle: "Founded by plant lovers, for plant lovers since 2020",
  },
  {
    title: "Learn To Nurture\nYour Green Friends",
    subtitle: "Expert tips and guides for every level of plant parent",
  },
];

const HeroContent = ({ activeSlide }: HeroContentProps) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.h1
            className="hero-title text-foreground mb-6 whitespace-pre-line"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {slideContent[activeSlide].title}
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-foreground/80 font-light max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {slideContent[activeSlide].subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroContent;
