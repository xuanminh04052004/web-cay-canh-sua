import { useState, useRef } from 'react';
import { Store, Save, Upload, MapPin, Phone, Mail, FileText, Image as ImageIcon, Warehouse, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSeller } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';

const SellerProfile = () => {
  const { currentSeller, updateSellerProfile } = useSeller();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    shopName: currentSeller?.shopName || '',
    phone: currentSeller?.phone || '',
    email: currentSeller?.email || '',
    address: currentSeller?.address || '',
    warehouseAddress: (currentSeller as any)?.warehouseAddress || '',
    description: currentSeller?.description || '',
    logo: currentSeller?.logo || '',
    banner: (currentSeller as any)?.banner || '',
    businessLicense: (currentSeller as any)?.businessLicense || '',
    taxCode: (currentSeller as any)?.taxCode || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, this would upload to blob storage
      // For now, create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (field: 'logo' | 'banner') => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateSellerProfile(formData);
    toast({ 
      title: 'Cập nhật thành công!',
      description: 'Thông tin shop đã được lưu.'
    });
    
    setIsLoading(false);
  };

  const getStatusBadge = () => {
    switch (currentSeller?.status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Đã duyệt</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Chờ duyệt</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Đã khóa</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hồ sơ Shop</h1>
          <p className="text-muted-foreground">Quản lý thông tin và thương hiệu shop của bạn</p>
        </div>
        {getStatusBadge()}
      </div>

      {currentSeller?.status === 'pending' && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Shop đang chờ duyệt</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vui lòng hoàn thiện đầy đủ thông tin hồ sơ để được duyệt nhanh hơn. 
                  Admin sẽ xem xét và phê duyệt trong vòng 24-48 giờ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shop Banner & Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Hình ảnh Shop
          </CardTitle>
          <CardDescription>Logo và banner hiển thị trên trang shop của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Banner */}
          <div>
            <Label className="mb-2 block">Banner Shop (1200x300 px)</Label>
            <div className="relative">
              {formData.banner ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={formData.banner} 
                    alt="Shop banner" 
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage('banner')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click để tải banner</span>
                </div>
              )}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'banner')}
              />
            </div>
          </div>

          <Separator />

          {/* Logo */}
          <div className="flex items-start gap-6">
            <div>
              <Label className="mb-2 block">Logo Shop</Label>
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-border">
                  <AvatarImage src={formData.logo} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {formData.shopName.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Logo sẽ được hiển thị trên sản phẩm và trang shop của bạn.
                Khuyến nghị sử dụng ảnh vuông với kích thước tối thiểu 200x200 px.
              </p>
              {formData.logo && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-destructive"
                  onClick={() => handleRemoveImage('logo')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa logo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shopName">Tên Shop *</Label>
              <Input
                id="shopName"
                value={formData.shopName}
                onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                placeholder="VD: Cây Cảnh Xanh"
              />
            </div>
            <div>
              <Label htmlFor="email">Email liên hệ</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                  placeholder="0901234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="taxCode">Mã số thuế (nếu có)</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
                placeholder="VD: 0123456789"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả Shop</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Giới thiệu về shop, loại sản phẩm chính, điểm nổi bật..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mô tả tốt giúp khách hàng hiểu rõ hơn về shop của bạn
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Address Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Địa chỉ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Địa chỉ Shop (hiển thị công khai)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="pl-10"
                rows={2}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="warehouseAddress" className="flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              Địa chỉ kho hàng (nơi gửi hàng)
            </Label>
            <Textarea
              id="warehouseAddress"
              value={formData.warehouseAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, warehouseAddress: e.target.value }))}
              rows={2}
              placeholder="Địa chỉ kho hàng để đơn vị vận chuyển lấy hàng"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Địa chỉ này sẽ được sử dụng khi tạo đơn vận chuyển
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business License */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Giấy phép kinh doanh (tùy chọn)
          </CardTitle>
          <CardDescription>
            Cung cấp giấy phép kinh doanh giúp tăng độ tin cậy với khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="businessLicense">Số ĐKKD / GPKD</Label>
            <Input
              id="businessLicense"
              value={formData.businessLicense}
              onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
              placeholder="VD: 41X8XXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-background py-4 border-t">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Hủy thay đổi
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SellerProfile;
