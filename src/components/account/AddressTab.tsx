import { useState } from 'react';
import { useUser, Address } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddressTab = () => {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        ward: address.ward,
        district: address.district,
        city: address.city,
        isDefault: address.isDefault,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      toast({
        title: 'Cập nhật thành công',
        description: 'Địa chỉ đã được cập nhật.',
      });
    } else {
      addAddress(formData);
      toast({
        title: 'Thêm thành công',
        description: 'Địa chỉ mới đã được thêm.',
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    toast({
      title: 'Xóa thành công',
      description: 'Địa chỉ đã được xóa.',
    });
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast({
      title: 'Đặt mặc định',
      description: 'Địa chỉ đã được đặt làm mặc định.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Địa chỉ nhận hàng</CardTitle>
          <CardDescription>Quản lý các địa chỉ nhận hàng của bạn</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
              <DialogDescription>
                Điền thông tin địa chỉ nhận hàng của bạn
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="addr-name">Họ và tên</Label>
                  <Input
                    id="addr-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-phone">Số điện thoại</Label>
                  <Input
                    id="addr-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr-address">Địa chỉ cụ thể</Label>
                <Input
                  id="addr-address"
                  placeholder="Số nhà, tên đường..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="addr-ward">Phường/Xã</Label>
                  <Input
                    id="addr-ward"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-district">Quận/Huyện</Label>
                  <Input
                    id="addr-district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr-city">Tỉnh/Thành phố</Label>
                  <Input
                    id="addr-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addr-default"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
                />
                <Label htmlFor="addr-default" className="text-sm">
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Bạn chưa có địa chỉ nào</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`relative p-4 rounded-lg border ${
                  address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    Mặc định
                  </span>
                )}
                <div className="space-y-2">
                  <div className="font-semibold">{address.name}</div>
                  <div className="text-sm text-muted-foreground">{address.phone}</div>
                  <div className="text-sm">
                    {address.address}, {address.ward}, {address.district}, {address.city}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(address)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Sửa
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Đặt mặc định
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressTab;
