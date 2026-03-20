import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSeller } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';
import greenielogo from '@/assets/greenie-logo.jpg';

const SellerLogin = () => {
  const navigate = useNavigate();
  const { loginSeller } = useSeller();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = loginSeller(formData.email, formData.password);

    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        toast({
          title: 'Đăng nhập thành công!',
          description: 'Chào mừng bạn đến với Seller Center.',
        });
        navigate('/seller');
      } else {
        toast({
          title: 'Đăng nhập thất bại',
          description: result.error,
          variant: 'destructive',
        });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Button
            variant="ghost"
            className="mb-8 -ml-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <img src={greenielogo} alt="GREENIE" className="h-10" />
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">Seller Center</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Đăng nhập Seller
            </h1>
            <p className="text-muted-foreground mb-8">
              Quản lý shop và sản phẩm của bạn
            </p>

            <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Demo:</strong> seller1@greenie.com / seller123
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seller@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <p className="mt-6 text-center text-muted-foreground">
              Chưa có tài khoản Seller?{' '}
              <Link to="/seller/register" className="text-primary hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center p-16 text-center">
          <Store className="w-24 h-24 text-primary mb-8" />
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Bán hàng cùng GREENIE
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Tiếp cận hàng ngàn khách hàng yêu cây cảnh. Quản lý shop dễ dàng với Seller Center.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
