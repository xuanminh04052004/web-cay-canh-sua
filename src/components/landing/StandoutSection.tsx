import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const StandoutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-cream py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6">
              Cây nổi bật<br />của chúng tôi.
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
              Một cây xanh tươi tốt nằm yên bình trên chiếc chậu gốm tráng men xanh tuyệt đẹp.
            </p>
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                Mua ngay
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right Content - Plant Image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 flex justify-center">
              <div className="w-72 h-96 md:w-80 md:h-[28rem] bg-gradient-to-b from-primary/5 to-primary/10 rounded-3xl flex items-center justify-center">
                <span className="text-[12rem] md:text-[14rem]">🌿</span>
              </div>
            </div>

            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-8 -right-4 md:right-0 bg-card rounded-2xl p-4 shadow-lg max-w-xs"
            >
              <p className="text-sm text-muted-foreground">
                Tôn vinh vẻ đẹp độc đáo và sự đa dạng của bộ sưu tập cây nổi bật. Mỗi cây là một minh chứng cho sự kỳ diệu của thế giới tự nhiên.
              </p>
            </motion.div>

            {/* Small Plant Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute bottom-4 -right-4 md:right-8 bg-card rounded-2xl p-3 shadow-lg flex items-center gap-3"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🪴</span>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StandoutSection;
