import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Sun, Flower2, Sparkles } from "lucide-react";

// Import local images
import trauBaDeVuongImg from "@/assets/plants/trau-ba-de-vuong-xanh.jpg";
import nhoThanGoImg from "@/assets/plants/nho-than-go.jpg";
import bongGiayImg from "@/assets/plants/cay-bong-giay.jpg";
import kimTienImg from "@/assets/plants/kim-tien.jpg";

const categories = [
  {
    id: 1,
    name: "Cây trong nhà",
    description: "Thanh lọc không khí, tạo không gian xanh mát",
    icon: Home,
    image: trauBaDeVuongImg,
    count: 7,
    color: "from-emerald-500/20 to-emerald-600/10",
    filter: "Trong nhà",
  },
  {
    id: 2,
    name: "Cây ngoài trời",
    description: "Cây ăn quả, cây bóng mát cho sân vườn",
    icon: Sun,
    image: nhoThanGoImg,
    count: 10,
    color: "from-orange-500/20 to-orange-600/10",
    filter: "Ngoài trời",
  },
  {
    id: 3,
    name: "Cây bông hoa",
    description: "Rực rỡ sắc màu, tô điểm không gian",
    icon: Flower2,
    image: bongGiayImg,
    count: 4,
    color: "from-pink-500/20 to-pink-600/10",
    filter: "Ngoài trời",
  },
  {
    id: 4,
    name: "Cây phong thủy",
    description: "Mang lại may mắn, tài lộc cho gia chủ",
    icon: Sparkles,
    image: kimTienImg,
    count: 5,
    color: "from-yellow-500/20 to-yellow-600/10",
    filter: "Trong nhà",
  },
];

const CategoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section ref={ref} className="bg-background py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Khám phá ngay
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Đa dạng các loại cây cảnh phù hợp với mọi không gian sống và nhu cầu của bạn
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link to={`/catalog?category=${encodeURIComponent(category.filter)}`} className="block group">
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-60`} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-xl p-3 transform group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">{category.count} sản phẩm</span>
                      </div>
                      <h3 className="font-medium text-foreground text-sm md:text-base mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/catalog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:brightness-110 transition-all"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
