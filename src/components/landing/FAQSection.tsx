import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, HelpCircle, Leaf } from "lucide-react";

const faqs = [
  {
    question: "Tôi mới bắt đầu trồng cây, nên chọn loại cây nào?",
    answer: "Với người mới, bạn nên bắt đầu với các loại cây dễ chăm sóc như: Cây lưỡi hổ, Cây kim tiền, Cây trầu bà, hoặc Cây phú quý. Đây là những cây chịu được điều kiện ánh sáng yếu và không cần tưới nước thường xuyên.",
  },
  {
    question: "Bao lâu thì nên tưới nước cho cây một lần?",
    answer: "Tần suất tưới phụ thuộc vào loại cây, mùa và điều kiện môi trường. Nguyên tắc chung: kiểm tra độ ẩm đất bằng cách chọc ngón tay sâu 2-3cm - nếu đất khô thì tưới. Cây mọng nước tưới 2-3 tuần/lần, cây nhiệt đới 1-2 lần/tuần.",
  },
  {
    question: "Cây của tôi bị vàng lá, phải làm sao?",
    answer: "Lá vàng có thể do nhiều nguyên nhân: tưới quá nhiều nước (lá vàng từ gốc), thiếu nước (lá vàng từ mép), thiếu dinh dưỡng, hoặc thiếu ánh sáng. Hãy kiểm tra độ ẩm đất và điều chỉnh chế độ chăm sóc phù hợp.",
  },
  {
    question: "Greenie có giao hàng tận nơi không?",
    answer: "Có! Greenie giao hàng toàn quốc. Với đơn hàng trong tỉnh Gia Lai, chúng tôi giao trong 1-2 ngày. Đơn hàng liên tỉnh được giao qua các đơn vị vận chuyển uy tín trong 3-5 ngày làm việc.",
  },
  {
    question: "Cây mua về có được bảo hành không?",
    answer: "Greenie cam kết bảo hành cây trong 7 ngày đầu tiên. Nếu cây có vấn đề về sức khỏe do lỗi vận chuyển hoặc chất lượng, chúng tôi sẽ đổi cây mới hoặc hoàn tiền 100%.",
  },
  {
    question: "Làm thế nào để đặt dịch vụ chăm sóc cây?",
    answer: "Bạn có thể liên hệ qua hotline 0906 560 568, Zalo, hoặc đến trực tiếp cửa hàng. Đội ngũ chuyên viên của Greenie sẽ tư vấn và lên lịch chăm sóc phù hợp với nhu cầu của bạn.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="bg-muted/30 py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            Hỗ trợ
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Giải đáp những thắc mắc phổ biến về chăm sóc cây cảnh và dịch vụ của Greenie
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-11 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </p>
          <a
            href="https://zalo.me/0949540305"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:brightness-110 transition-all"
          >
            Liên hệ Zalo ngay
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;