import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, MessageCircle } from "lucide-react";
import greenieLogo from "@/assets/greenie-logo.jpg";

const categoryLinks = [
  { name: "Tất cả danh mục", path: "/catalog" },
  { name: "Cây Cảnh", path: "/catalog" },
  { name: "Cây Ăn Quả", path: "/catalog" },
  { name: "Cây Bông Hoa", path: "/catalog" },
  { name: "Phụ Kiện", path: "/catalog" },
  { name: "Dịch vụ Chăm sóc Cây", path: "/services" },
];

const policyLinks = [
  { name: "Chính sách vận chuyển", path: "#" },
  { name: "Chính sách đổi trả", path: "#" },
  { name: "Hướng dẫn mua hàng", path: "/guide" },
  { name: "Bảo mật thông tin", path: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
        <span className="font-display text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-background/5 whitespace-nowrap translate-y-1/4">
          GREENIE
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={greenieLogo} alt="GREENIE Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-display text-2xl font-bold text-background">Greenie</span>
            </Link>
            <p className="text-background/70 text-sm mb-6 leading-relaxed">
              Không gian xanh dành cho những tâm hồn cần tĩnh lặng. Chuyên cung cấp cây cảnh chất lượng cao với dịch vụ chăm sóc tận tâm.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/people/Greenie/61585730225404"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5 text-background" />
              </a>
              <a
                href="https://zalo.me/0949540305"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-background" />
              </a>
            </div>
          </div>

          {/* Danh mục & Dịch vụ */}
          <div>
            <h4 className="font-medium text-primary mb-4 text-lg">Danh mục & Dịch vụ</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-background/60 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="font-medium text-primary mb-4 text-lg">Chính sách</h4>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-background/60 hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-medium text-primary mb-4 text-lg">Liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">
                  Địa chỉ 1: 255 Lê Thanh Nghị, phường Quy Nhơn, tỉnh Gia Lai
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">
                  Địa chỉ 2: 487 Nguyễn Thái Học, phường Quy Nhơn Nam, tỉnh Gia Lai
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-background/70 text-sm">
                  <p>0906 560 568</p>
                  <p>0949 540 305</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="mailto:caycanhgreenie@gmail.com"
                  className="text-background/70 text-sm hover:text-background transition-colors"
                >
                  caycanhgreenie@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2026 GREENIE. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4 text-background/60 text-sm">
            <Link to="#" className="hover:text-background transition-colors">Điều khoản</Link>
            <Link to="#" className="hover:text-background transition-colors">Riêng tư</Link>
            <Link to="#" className="hover:text-background transition-colors">Cookies</Link>
            <Link to="#" className="hover:text-background transition-colors">Pháp lý</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
