import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Droplets, Sun, ThermometerSun, Scissors, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    author: "Greenie",
    title: "Hướng dẫn tưới nước cho người mới",
    excerpt: "Tìm hiểu cách tưới nước đúng cách cho từng loại cây cảnh phổ biến.",
    readTime: "5 phút",
    category: "Cơ bản",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 2,
    author: "Greenie",
    title: "Ánh sáng phù hợp cho cây trong nhà",
    excerpt: "Cách đánh giá và bố trí ánh sáng tối ưu cho cây trồng trong nhà.",
    readTime: "7 phút",
    category: "Cơ bản",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: 3,
    author: "Greenie",
    title: "Chọn đất và chậu cây phù hợp",
    excerpt: "Hướng dẫn chi tiết về cách chọn loại đất và chậu phù hợp.",
    readTime: "8 phút",
    category: "Cơ bản",
    icon: ThermometerSun,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
    color: "from-green-400 to-teal-400",
  },
  {
    id: 4,
    author: "Greenie",
    title: "Kỹ thuật cắt tỉa cây cảnh",
    excerpt: "Hướng dẫn cắt tỉa để cây phát triển khỏe mạnh và đẹp.",
    readTime: "10 phút",
    category: "Nâng cao",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    color: "from-purple-400 to-pink-400",
  },
];

const ArticlesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-background py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Kiến thức hữu ích
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground">
              Cẩm nang<br />chăm sóc cây
            </h2>
          </div>
          <Link to="/guide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Xem tất cả hướng dẫn
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link to="/guide" className="block">
                {/* Image with overlay */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-4">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${article.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Icon overlay */}
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                      <article.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  {/* Category & Read time */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-xs font-medium text-foreground">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-medium text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:underline">
                  Đọc ngay
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "20+", label: "Bài hướng dẫn" },
            { value: "6", label: "Chủ đề" },
            { value: "100+", label: "Mẹo hữu ích" },
            { value: "Miễn phí", label: "Hoàn toàn" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-2xl bg-card border border-border/50">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;