import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import bgShop from "@/assets/bg-shop.jpg";
import bgAbout from "@/assets/bg-about.jpg";
import bgGuide from "@/assets/bg-guide.jpg";

const slides = [
  {
    background: bgShop,
    title: "GREENIE.",
    subtitle: "Mang màng xanh vào không gian sống. Dịch vụ vệ sinh chuyên nghiệp và thân thiện với môi trường.",
    card: {
      title: "Dịch vụ vệ sinh xanh",
      price: "350.000đ",
      button: "Xem ngay",
      path: "/catalog",
    },
    feature: {
      title: "Sạch sẽ và thân thiện môi trường",
      description: "Giải pháp vệ sinh thông minh cho không gian sống của bạn.",
    },
  },
  {
    background: bgAbout,
    title: "Câu Chuyện\nCủa Chúng Tôi.",
    subtitle: "Được thành lập bởi những người yêu cây, dành cho những người yêu cây từ năm 2020.",
    card: {
      title: "Bộ chăm sóc cây cao cấp",
      price: "480.000đ",
      button: "Về chúng tôi",
      path: "/services",
    },
    feature: {
      title: "Hướng dẫn chăm sóc chuyên nghiệp",
      description: "Học hỏi từ các chuyên gia làm vườn của chúng tôi.",
    },
  },
  {
    background: bgGuide,
    title: "Học Hỏi &\nPhát Triển.",
    subtitle: "Mẹo và hướng dẫn chuyên môn cho mọi cấp độ người chơi cây.",
    card: {
      title: "Tài liệu hướng dẫn đầy đủ",
      price: "Miễn phí",
      button: "Xem hướng dẫn",
      path: "/guide",
    },
    feature: {
      title: "Hướng dẫn chăm sóc toàn diện",
      description: "Từng bước chi tiết để có cây khỏe mạnh.",
    },
  },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentSlide.background}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-24 pb-8">
        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            {/* Left Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6 }}
                className="text-white max-w-2xl"
              >
              <motion.h1
                className="hero-title whitespace-pre-line mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {currentSlide.title}
              </motion.h1>
              <motion.p
                className="text-white/80 text-lg md:text-xl max-w-md mb-8 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {currentSlide.subtitle}
              </motion.p>
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to={currentSlide.card.path}>
                  <button className="btn-primary flex items-center gap-2">
                    {currentSlide.card.button}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  Xem Demo
                </button>
              </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Cards - Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
            {/* Product Card */}
            <div className="glass-dark rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🪴</span>
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-sm">{currentSlide.card.title}</p>
                <p className="text-white text-2xl font-display font-semibold mt-1">
                  {currentSlide.card.price}
                </p>
              </div>
              <Link to={currentSlide.card.path}>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1">
                  {currentSlide.card.button}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            {/* Feature Card */}
            <div className="glass-dark rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="flex-1">
                <h3 className="text-white font-display text-lg font-medium">
                  {currentSlide.feature.title}
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  {currentSlide.feature.description}
                </p>
              </div>
              <div className="w-24 h-16 bg-gradient-to-br from-primary/40 to-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌿</span>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  key={activeSlide}
                />
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeSlide
                    ? "w-8 bg-primary"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
