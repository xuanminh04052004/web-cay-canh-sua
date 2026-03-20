import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, Plant } from "@/data/plants";
import { useAdmin } from "@/contexts/AdminContext";

const findPlant = (plants: Plant[], id: number) => plants.find((p) => p.id === id);

const buildCollections = (plants: Plant[]) => [
  {
    main: findPlant(plants, 5),
    center: findPlant(plants, 7),
    small: findPlant(plants, 1),
    decorative: findPlant(plants, 14),
  },
  {
    main: findPlant(plants, 2),
    center: findPlant(plants, 6),
    small: findPlant(plants, 3),
    decorative: findPlant(plants, 15),
  },
  {
    main: findPlant(plants, 11),
    center: findPlant(plants, 8),
    small: findPlant(plants, 9),
    decorative: findPlant(plants, 16),
  },
];

const SelectionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products, isLoading, fetchError } = useAdmin();

  if (isLoading) {
    return (
      <section className="bg-background py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">Đang tải bộ sưu tập...</p>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="bg-background py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-destructive">Lỗi: {fetchError}</p>
        </div>
      </section>
    );
  }

  const collections = buildCollections(products);
  const currentCollection = collections[currentIndex] || collections[0] || { main: undefined, center: undefined, small: undefined, decorative: undefined };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">({rating})</span>
    </div>
  );

  return (
    <section ref={ref} className="bg-background py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-start mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              Bộ sưu tập<br />tuyển chọn.
            </h2>
            {/* Carousel indicators */}
            <div className="flex gap-2 mt-4">
              {collections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          key={currentIndex}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Best Plant Card */}
          <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 card-hover">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {currentCollection.main?.category}
              </span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                {currentCollection.main?.careLevel}
              </span>
            </div>
            <Link to={`/product/${currentCollection.main?.id}`}>
              <h3 className="font-display text-2xl font-medium text-foreground mb-2 hover:text-primary transition-colors">
                {currentCollection.main?.name}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {currentCollection.main?.description}
            </p>
            {/* Rating */}
            <RatingStars rating={currentCollection.main?.rating || 0} />
            {/* Price */}
            <div className="flex items-center gap-2 mt-3 mb-4">
              <span className="text-primary font-bold text-lg">
                {formatPrice(currentCollection.main?.price || 0)}
              </span>
              {currentCollection.main?.originalPrice && (
                <span className="text-muted-foreground text-sm line-through">
                  {formatPrice(currentCollection.main.originalPrice)}
                </span>
              )}
              {currentCollection.main?.discount && (
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs font-medium rounded-full">
                  -{currentCollection.main.discount}%
                </span>
              )}
            </div>
            <Link to={`/product/${currentCollection.main?.id}`}>
              <div className="w-full h-48 bg-gradient-to-b from-primary/5 to-primary/10 rounded-2xl overflow-hidden">
                <img 
                  src={currentCollection.main?.image} 
                  alt={currentCollection.main?.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          </motion.div>

          {/* Center - Large Feature */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-3xl p-6 card-hover overflow-hidden relative"
          >
            <Link to={`/product/${currentCollection.center?.id}`} className="block h-full">
              <div className="absolute top-4 left-4 right-4 z-10">
                <h3 className="font-display text-xl font-medium text-foreground mb-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                  {currentCollection.center?.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-primary font-bold">
                    {formatPrice(currentCollection.center?.price || 0)}
                  </span>
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1.5 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{currentCollection.center?.rating}</span>
                  </div>
                </div>
              </div>
              <img 
                src={currentCollection.center?.image} 
                alt={currentCollection.center?.name}
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                style={{ minHeight: '320px' }}
              />
            </Link>
          </motion.div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Small Plant Image */}
            <motion.div
              variants={itemVariants}
              className="bg-primary/5 rounded-3xl p-4 flex-1 card-hover overflow-hidden relative"
            >
              <Link to={`/product/${currentCollection.small?.id}`} className="block h-full">
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="font-medium text-foreground text-sm">{currentCollection.small?.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-primary font-bold text-sm">
                        {formatPrice(currentCollection.small?.price || 0)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{currentCollection.small?.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <img 
                  src={currentCollection.small?.image} 
                  alt={currentCollection.small?.name}
                  className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                  style={{ minHeight: '140px' }}
                />
              </Link>
            </motion.div>

            {/* Decorative Plants Card */}
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 card-hover"
            >
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {currentCollection.decorative?.category}
                </span>
              </div>
              <Link to={`/product/${currentCollection.decorative?.id}`}>
                <h3 className="font-display text-xl font-medium text-foreground mb-2 hover:text-primary transition-colors">
                  {currentCollection.decorative?.name}
                </h3>
              </Link>
              <RatingStars rating={currentCollection.decorative?.rating || 0} />
              <div className="flex items-center gap-2 mt-2 mb-4">
                <span className="text-primary font-bold">
                  {formatPrice(currentCollection.decorative?.price || 0)}
                </span>
                {currentCollection.decorative?.discount && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs font-medium rounded-full">
                    -{currentCollection.decorative.discount}%
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Link to={`/product/${currentCollection.decorative?.id}`}>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl overflow-hidden">
                    <img 
                      src={currentCollection.decorative?.image} 
                      alt={currentCollection.decorative?.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <Link to="/catalog">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Mua ngay
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SelectionSection;