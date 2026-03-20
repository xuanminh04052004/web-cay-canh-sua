import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Minh Tuấn",
    avatar: "👨",
    text: "Tôi rất ấn tượng với chất lượng cây từ cửa hàng này. Mỗi lần mua hàng, cây luôn phát triển tươi tốt và nở hoa rực rỡ.",
  },
  {
    name: "Thu Hương",
    avatar: "👩",
    text: "Mua cây ở đây là một trải nghiệm tuyệt vời. Nhân viên rất nhiệt tình tư vấn cách chăm sóc và chọn cây phù hợp với nhu cầu của tôi.",
  },
  {
    name: "Văn Đức",
    avatar: "👨‍🦱",
    text: "Cây cảnh tôi mua từ cửa hàng này đều rất đẹp và khỏe mạnh. Rất hài lòng với những lựa chọn mà họ cung cấp.",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-cream py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
            Khách hàng đã<br />chia sẻ cảm nhận
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Những đánh giá chân thực từ khách hàng đã tin tưởng và đồng hành cùng chúng tôi.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`bg-card rounded-3xl p-6 max-w-sm card-hover ${
                index === 1 ? "md:-mt-8" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">
                {testimonial.avatar}
              </div>
              <h3 className="font-display text-lg font-medium text-foreground text-center mb-2">
                {testimonial.name}
              </h3>
              <p className="text-muted-foreground text-sm text-center leading-relaxed">
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center"
        >
          <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all">
            <ArrowRight className="w-5 h-5 text-primary-foreground" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
