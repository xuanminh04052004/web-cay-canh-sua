import { motion } from "framer-motion";
import { Leaf, Truck, Scissors, Sprout, Calendar, Shield, Phone, CheckCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import bgAbout from "@/assets/bg-about.jpg";

const services = [
  {
    icon: Leaf,
    title: "Tư vấn cây cảnh",
    description: "Đội ngũ chuyên gia tư vấn miễn phí giúp bạn chọn cây phù hợp với không gian và phong thủy.",
    price: "Miễn phí",
    features: ["Tư vấn online 24/7", "Khảo sát tại nhà", "Thiết kế cảnh quan"],
  },
  {
    icon: Truck,
    title: "Giao hàng & Lắp đặt",
    description: "Giao hàng tận nơi với chậu cây được đóng gói cẩn thận, đảm bảo an toàn cho cây.",
    price: "Từ 50.000đ",
    features: ["Giao hàng nhanh 2h", "Lắp đặt tại nhà", "Đổi trả trong 7 ngày"],
  },
  {
    icon: Scissors,
    title: "Cắt tỉa & Tạo dáng",
    description: "Dịch vụ cắt tỉa chuyên nghiệp giúp cây phát triển khỏe mạnh và có hình dáng đẹp.",
    price: "Từ 200.000đ",
    features: ["Cắt tỉa định kỳ", "Tạo dáng bonsai", "Xử lý sâu bệnh"],
  },
  {
    icon: Sprout,
    title: "Chăm sóc định kỳ",
    description: "Gói dịch vụ chăm sóc cây hàng tháng cho những ai bận rộn hoặc thường xuyên đi công tác.",
    price: "Từ 500.000đ/tháng",
    features: ["Tưới nước định kỳ", "Bón phân theo mùa", "Kiểm tra sức khỏe cây"],
  },
  {
    icon: Shield,
    title: "Bảo hành cây",
    description: "Chương trình bảo hành đặc biệt cho cây mua tại Leafora với đội ngũ hỗ trợ 24/7.",
    price: "Theo gói",
    features: ["Bảo hành 30 ngày", "Đổi cây miễn phí", "Hỗ trợ kỹ thuật"],
  },
];

const packages = [
  {
    name: "Cơ bản",
    price: "500.000",
    period: "/tháng",
    description: "Phù hợp cho căn hộ nhỏ với 1-3 cây",
    features: [
      "Tưới nước 2 lần/tuần",
      "Bón phân 1 lần/tháng",
      "Kiểm tra sức khỏe cây",
      "Hỗ trợ qua điện thoại",
    ],
    highlighted: false,
  },
  {
    name: "Tiêu chuẩn",
    price: "1.200.000",
    period: "/tháng",
    description: "Phù hợp cho văn phòng hoặc nhà có 5-10 cây",
    features: [
      "Tưới nước 4 lần/tuần",
      "Bón phân 3 lần/tháng",
      "Cắt tỉa định kỳ",
      "Xử lý sâu bệnh",
      "Thay chậu khi cần",
      "Hỗ trợ 24/7",
    ],
    highlighted: true,
  },
  {
    name: "Cao cấp",
    price: "2.500.000",
    period: "/tháng",
    description: "Dành cho biệt thự, showroom với trên 10 cây",
    features: [
      "Chăm sóc không giới hạn",
      "Thay cây theo mùa",
      "Thiết kế cảnh quan",
      "Nhân viên chuyên trách",
      "Báo cáo hàng tuần",
      "Ưu tiên xử lý sự cố",
    ],
    highlighted: false,
  },
];

const Services = () => {
  return (
    <PageLayout
      showHero
      heroImage={bgAbout}
      heroTitle="Dịch Vụ Chăm Sóc"
      heroSubtitle="Giải pháp toàn diện cho không gian xanh của bạn"
    >
      <div className="container mx-auto px-6 py-12">
        {/* Services Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-display text-3xl text-foreground mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leafora cung cấp đầy đủ các dịch vụ từ tư vấn, lắp đặt đến chăm sóc dài hạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-display text-xl text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="text-primary font-semibold mb-4">{service.price}</div>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-display text-3xl text-foreground mb-4">Gói chăm sóc định kỳ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lựa chọn gói phù hợp với nhu cầu và ngân sách của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-8 text-center ${
                  pkg.highlighted ? "border-primary ring-2 ring-primary/20 scale-105" : ""
                }`}
              >
                {pkg.highlighted && (
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full mb-4">
                    Phổ biến nhất
                  </span>
                )}
                <h3 className="text-display text-2xl text-foreground mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{pkg.price}đ</span>
                  <span className="text-muted-foreground">{pkg.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-8 text-left">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-medium transition-colors ${
                    pkg.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-card border border-border hover:bg-muted"
                  }`}
                >
                  Chọn gói
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="glass-card p-12 text-center">
            <h2 className="text-display text-3xl text-foreground mb-4">Cần tư vấn thêm?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0123456789"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Gọi ngay: 0123 456 789
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Services;
