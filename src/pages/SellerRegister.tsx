import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Store, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useSeller } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';
import greenielogo from '@/assets/greenie-logo.jpg';

const SellerRegister = () => {
  const navigate = useNavigate();
  const { registerSeller } = useSeller();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    description: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu phải có ít nhất 6 ký tự.',
        variant: 'destructive',
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đồng ý với điều khoản sử dụng.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = registerSeller({
      email: formData.email,
      password: formData.password,
      shopName: formData.shopName,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
    });

    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        toast({
          title: 'Đăng ký thành công!',
          description: 'Tài khoản seller của bạn đã được kích hoạt. Vui lòng đăng nhập để bắt đầu.',
        });
        navigate('/seller/login');
      } else {
        toast({
          title: 'Đăng ký thất bại',
          description: result.error,
          variant: 'destructive',
        });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center p-16 text-center">
          <Store className="w-24 h-24 text-primary mb-8" />
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Trở thành Seller
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Mở shop, đăng sản phẩm, và bắt đầu kinh doanh cây cảnh trên nền tảng GREENIE.
          </p>
          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <span>Đăng ký tài khoản Seller</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <span>Chờ Admin duyệt</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <span>Bắt đầu bán hàng!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-background py-12">
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
              <span className="font-semibold text-lg">Đăng ký Seller</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tạo tài khoản Seller
            </h1>
            <p className="text-muted-foreground mb-8">
              Điền thông tin để mở shop của bạn
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="shopName">Tên Shop *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="VD: Vườn Xanh Garden"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="phone">Số điện thoại *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Quận 1, TP.HCM"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả shop</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Giới thiệu về shop của bạn..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                  Tôi đồng ý với <span className="text-primary cursor-pointer hover:underline">Điều khoản sử dụng</span> và <span className="text-primary cursor-pointer hover:underline">Chính sách bảo mật</span>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký Seller'}
              </Button>
            </form>

            <p className="mt-6 text-center text-muted-foreground">
              Đã có tài khoản Seller?{' '}
              <Link to="/seller/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
