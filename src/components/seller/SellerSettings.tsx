import { useState } from 'react';
import { Store, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSeller } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';

const SellerSettings = () => {
  const { currentSeller, updateSellerProfile } = useSeller();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shopName: currentSeller?.shopName || '',
    phone: currentSeller?.phone || '',
    address: currentSeller?.address || '',
    description: currentSeller?.description || '',
  });

  const handleSave = () => {
    updateSellerProfile(formData);
    toast({ title: 'Đã lưu thay đổi' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cài đặt Shop</h1>
        <p className="text-muted-foreground">Quản lý thông tin shop của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Thông tin Shop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shopName">Tên Shop</Label>
            <Input
              id="shopName"
              value={formData.shopName}
              onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Mô tả Shop</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSettings;
