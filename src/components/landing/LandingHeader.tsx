import { ShoppingCart, Menu, X, User, LogOut, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import SearchDropdown from "@/components/SearchDropdown";
import NotificationBell from "@/components/NotificationBell";
import greenieLogo from "@/assets/greenie-logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { name: "Trang chủ", path: "/" },
  { name: "Sản phẩm", path: "/catalog" },
  { name: "Dịch vụ", path: "/services" },
  { name: "Hướng dẫn", path: "/guide" },
  { name: "Liên hệ", path: "/contact" },
];

const LandingHeader = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-4 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo - Dời sang góc trái */}
          <Link to="/" className="flex-shrink-0">
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
              <span className={`font-display text-xl font-bold whitespace-nowrap ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                GREENIE
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Center Pills - Đầy đủ chữ trên 1 hàng */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : isScrolled
                      ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                      : "text-white/80 hover:text-white hover:bg-white/10"
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
            <SearchDropdown isScrolled={isScrolled} variant="landing" />

            {/* Notification Bell (Admin only) */}
            <NotificationBell />

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Seller Badge & Quick Link */}
                {user.role === 'seller' && (
                  <Link to="/seller">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        isScrolled
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      Seller Center
                    </motion.div>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isScrolled
                          ? "text-foreground hover:bg-muted"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {user.name}
                      {user.role === 'seller' && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                          Seller
                        </Badge>
                      )}
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="w-4 h-4 mr-2" />
                      Tài khoản của tôi
                    </DropdownMenuItem>
                    {user.role === 'seller' && (
                      <DropdownMenuItem onClick={() => navigate('/seller')}>
                        <Store className="w-4 h-4 mr-2" />
                        Seller Center
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : isAdminLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isScrolled
                          ? "text-foreground hover:bg-muted"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Admin
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                        Dashboard
                      </Badge>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Store className="w-4 h-4 mr-2" />
                      Trang admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logoutAdmin();
                        toast.success("Đã đăng xuất Admin!");
                        navigate("/");
                      }}
                      className="text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isScrolled
                        ? "text-foreground hover:bg-muted"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Đăng nhập
                  </motion.button>
                </Link>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:brightness-110 transition-all"
                  >
                    Đăng ký
                  </motion.button>
                </Link>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
              }`}
            >
              <ShoppingCart className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-medium">
                  {getTotalItems()}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full lg:hidden transition-colors ${
                isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isScrolled ? "text-foreground" : "text-white"}`} />
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
            className="fixed top-[72px] left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border p-4 lg:hidden"
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
              {user ? (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                  {/* Seller Quick Link for Mobile */}
                  {user.role === 'seller' && (
                    <Link to="/seller" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full py-3 rounded-lg bg-primary/10 text-primary font-medium flex items-center justify-center gap-2">
                        <Store className="w-4 h-4" />
                        Seller Center
                        <Badge variant="secondary" className="ml-1 text-[10px]">Seller</Badge>
                      </button>
                    </Link>
                  )}
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-lg border border-border text-foreground font-medium flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      {user.name}
                    </button>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-lg bg-destructive text-destructive-foreground font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-lg border border-border text-foreground font-medium">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                      Đăng ký
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingHeader;
