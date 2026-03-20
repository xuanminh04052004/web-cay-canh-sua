import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Menu, X, MessageCircle, Heart, User, LogOut, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import AIFloatingButton from "./AIFloatingButton";
import SearchDropdown from "./SearchDropdown";
import NotificationBell from "./NotificationBell";
import greenieLogo from "@/assets/greenie-logo.jpg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface PageLayoutProps {
  children: ReactNode;
  showHero?: boolean;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const navLinks = [
  { name: "Trang chủ", path: "/" },
  { name: "Sản phẩm", path: "/catalog" },
  { name: "Dịch vụ", path: "/services" },
  { name: "Hướng dẫn", path: "/guide" },
  { name: "Liên hệ", path: "/contact" },
];

const PageLayout = ({ children, showHero = true, heroImage, heroTitle, heroSubtitle }: PageLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems, setIsCartOpen } = useCart();
  const { items: wishlistItems, setIsWishlistOpen } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  // Parallax effect
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Đã đăng xuất',
      description: 'Hẹn gặp lại bạn!',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 bg-background/80 backdrop-blur-md border-b border-border/50"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img 
                src={greenieLogo} 
                alt="GREENIE Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-display text-2xl font-bold text-foreground">
                GREENIE
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Pills style like LandingHeader */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/50 backdrop-blur-sm rounded-full p-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Dropdown */}
            <SearchDropdown variant="page" />

            {/* Notification Bell (Admin only) */}
            <NotificationBell />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlistOpen(true)}
              className="btn-icon relative"
            >
              <Heart className="w-5 h-5 text-foreground" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="btn-icon relative"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-medium">
                  {getTotalItems()}
                </span>
              )}
            </motion.button>

            {/* Seller Center Button */}
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/seller">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-icon"
                  title="Seller Center"
                >
                  <Store className="w-5 h-5 text-foreground" />
                </motion.button>
              </Link>
            )}
            
            {/* User Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-icon flex items-center gap-2"
                >
                  <User className="w-5 h-5 text-foreground" />
                  {isAuthenticated && user?.name && (
                    <span className="hidden lg:inline text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.name.split(' ').pop()}
                    </span>
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="w-4 h-4 mr-2" />
                      Tài khoản của tôi
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      Đăng nhập
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/register')}>
                      Đăng ký
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn-icon"
              >
                <MessageCircle className="w-5 h-5 text-foreground" />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border p-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax */}
      {showHero && heroImage && (
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ 
              backgroundImage: `url(${heroImage})`,
              y: heroY,
            }}
          />
          {/* Darker gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20"
            style={{ opacity: heroOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title text-white mb-4 drop-shadow-lg"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              {heroTitle}
            </motion.h1>
            {heroSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/90 text-lg max-w-2xl drop-shadow-md"
              >
                {heroSubtitle}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className={showHero && heroImage ? "" : "pt-24"}>
        {children}
      </main>

      {/* AI Floating Button */}
      <AIFloatingButton />

      {/* Footer - Same as Landing Footer */}
      <footer className="bg-foreground text-background py-16 px-6 md:px-12 lg:px-20 relative overflow-hidden mt-20">
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
            </div>

            {/* Danh mục & Dịch vụ */}
            <div>
              <h4 className="font-medium text-primary mb-4 text-lg">Danh mục & Dịch vụ</h4>
              <ul className="space-y-2">
                <li><Link to="/catalog" className="text-background/60 hover:text-background text-sm transition-colors">Tất cả danh mục</Link></li>
                <li><Link to="/catalog" className="text-background/60 hover:text-background text-sm transition-colors">Cây Cảnh</Link></li>
                <li><Link to="/catalog" className="text-background/60 hover:text-background text-sm transition-colors">Cây Ăn Quả</Link></li>
                <li><Link to="/catalog" className="text-background/60 hover:text-background text-sm transition-colors">Cây Bông Hoa</Link></li>
                <li><Link to="/services" className="text-background/60 hover:text-background text-sm transition-colors">Dịch vụ Chăm sóc Cây</Link></li>
              </ul>
            </div>

            {/* Chính sách */}
            <div>
              <h4 className="font-medium text-primary mb-4 text-lg">Chính sách</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-background/60 hover:text-background text-sm transition-colors">Chính sách vận chuyển</Link></li>
                <li><Link to="#" className="text-background/60 hover:text-background text-sm transition-colors">Chính sách đổi trả</Link></li>
                <li><Link to="/guide" className="text-background/60 hover:text-background text-sm transition-colors">Hướng dẫn mua hàng</Link></li>
                <li><Link to="#" className="text-background/60 hover:text-background text-sm transition-colors">Bảo mật thông tin</Link></li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="font-medium text-primary mb-4 text-lg">Liên hệ</h4>
              <div className="space-y-3">
                <p className="text-background/70 text-sm">
                  📍 Địa chỉ 1: 255 Lê Thanh Nghị, phường Quy Nhơn, tỉnh Gia Lai
                </p>
                <p className="text-background/70 text-sm">
                  📍 Địa chỉ 2: 487 Nguyễn Thái Học, phường Quy Nhơn Nam, tỉnh Gia Lai
                </p>
                <p className="text-background/70 text-sm">
                  📞 0906 560 568 - 0949 540 305
                </p>
                <a href="mailto:caycanhgreenie@gmail.com" className="text-background/70 text-sm hover:text-background transition-colors block">
                  ✉️ caycanhgreenie@gmail.com
                </a>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
