import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import greenieLogo from "@/assets/greenie-logo.jpg";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isAdminLoggedIn } = useAdmin();

  // Auto-redirect if already logged in as admin
  if (isAdminLoggedIn) {
    navigate("/admin");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.password) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ email và mật khẩu.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if admin login first (only if email and password match admin credentials)
    const adminResult = loginAdmin(formData.email.trim(), formData.password);
    if (adminResult) {
      toast({
        title: "Đăng nhập Admin thành công!",
        description: "Chào mừng bạn đến trang quản trị.",
      });
      navigate("/admin");
      setIsLoading(false);
      return;
    }

    // Try regular user login
    const result = login(formData.email.trim(), formData.password);

    if (result.success) {
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn trở lại GREENIE.",
      });
      navigate("/account");
    } else {
      toast({
        title: "Đăng nhập thất bại!",
        description: result.error || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={greenieLogo} alt="GREENIE Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-display text-3xl font-bold text-foreground">GREENIE</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-display text-3xl text-foreground mb-2">Chào mừng trở lại</h1>
            <p className="text-muted-foreground">Đăng nhập để tiếp tục mua sắm</p>
            {/* Admin hint removed */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-card border border-border rounded-lg pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-foreground mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-card border border-border rounded-lg pl-12 pr-12 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-foreground">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 glass-card p-8">
          <blockquote className="text-foreground text-lg italic mb-4">
            "GREENIE đã giúp tôi biến căn hộ thành một khu vườn nhỏ. Cây cảnh chất lượng và dịch vụ chăm sóc tuyệt vời!"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary" />
            <div>
              <p className="text-foreground font-medium">Nguyễn Văn A</p>
              <p className="text-sm text-muted-foreground">Khách hàng thân thiết</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
