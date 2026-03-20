import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Tag,
  Percent,
  Calendar,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSeller, SellerVoucher } from '@/contexts/SellerContext';
import { formatPrice } from '@/data/plants';
import { useToast } from '@/hooks/use-toast';

const SellerVouchers = () => {
  const { sellerVouchers, addVoucher, updateVoucher, deleteVoucher } = useSeller();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<SellerVoucher | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      status: 'active',
    });
  };

  const handleAddVoucher = () => {
    if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
        variant: 'destructive',
      });
      return;
    }

    addVoucher({
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseInt(formData.discountValue),
      minOrderValue: parseInt(formData.minOrderValue) || 0,
      maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : undefined,
      usageLimit: parseInt(formData.usageLimit) || 100,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status as 'active' | 'inactive',
    });
    toast({
      title: 'Thành công',
      description: 'Đã tạo mã giảm giá mới.',
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditVoucher = () => {
    if (!editingVoucher) return;

    updateVoucher(editingVoucher.id, {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseInt(formData.discountValue),
      minOrderValue: parseInt(formData.minOrderValue) || 0,
      maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : undefined,
      usageLimit: parseInt(formData.usageLimit) || 100,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status as 'active' | 'inactive',
    });

    toast({
      title: 'Thành công',
      description: 'Đã cập nhật mã giảm giá.',
    });

    setEditingVoucher(null);
    resetForm();
  };

  const handleDeleteVoucher = (voucherId: string) => {
    deleteVoucher(voucherId);
    toast({
      title: 'Đã xóa',
      description: 'Mã giảm giá đã được xóa.',
    });
  };

  const openEditDialog = (voucher: SellerVoucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue.toString(),
      minOrderValue: voucher.minOrderValue.toString(),
      maxDiscount: voucher.maxDiscount?.toString() || '',
      usageLimit: voucher.usageLimit.toString(),
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      status: voucher.status,
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Đã sao chép mã' });
  };

  const getStatusBadge = (voucher: SellerVoucher) => {
    const now = new Date();
    const end = new Date(voucher.endDate);
    const start = new Date(voucher.startDate);

    if (voucher.status === 'inactive') {
      return <Badge variant="secondary">Tạm dừng</Badge>;
    }
    if (now > end) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (now < start) {
      return <Badge variant="outline">Chưa bắt đầu</Badge>;
    }
    return <Badge variant="default">Đang hoạt động</Badge>;
  };

  // Mock vouchers if empty
  const displayVouchers: SellerVoucher[] = sellerVouchers.length > 0 ? sellerVouchers : [
    {
      id: 'voucher_demo1',
      sellerId: '',
      code: 'GIAMGIA20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 200000,
      maxDiscount: 50000,
      usageLimit: 100,
      usedCount: 25,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: 'voucher_demo2',
      sellerId: '',
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 30000,
      minOrderValue: 150000,
      usageLimit: 50,
      usedCount: 12,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      createdAt: '2024-01-01',
    },
  ];

  const VoucherForm = () => (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="code">Mã giảm giá *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="VD: GIAMGIA20"
          />
        </div>

        <div>
          <Label>Loại giảm giá *</Label>
          <Select
            value={formData.discountType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Phần trăm (%)</SelectItem>
              <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="discountValue">
            Giá trị giảm {formData.discountType === 'percentage' ? '(%)' : '(đ)'} *
          </Label>
          <Input
            id="discountValue"
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
            placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
          />
        </div>

        <div>
          <Label htmlFor="minOrderValue">Đơn tối thiểu (đ)</Label>
          <Input
            id="minOrderValue"
            type="number"
            value={formData.minOrderValue}
            onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
            placeholder="200000"
          />
        </div>

        {formData.discountType === 'percentage' && (
          <div>
            <Label htmlFor="maxDiscount">Giảm tối đa (đ)</Label>
            <Input
              id="maxDiscount"
              type="number"
              value={formData.maxDiscount}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
              placeholder="50000"
            />
          </div>
        )}

        <div>
          <Label htmlFor="usageLimit">Số lượt dùng</Label>
          <Input
            id="usageLimit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
            placeholder="100"
          />
        </div>

        <div>
          <Label htmlFor="startDate">Ngày bắt đầu *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Ngày kết thúc *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>

        <div className="col-span-2 flex items-center justify-between">
          <Label htmlFor="status">Kích hoạt ngay</Label>
          <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Khuyến mãi</h1>
          <p className="text-muted-foreground">Tạo và quản lý mã giảm giá cho shop</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo mã giảm giá
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo mã giảm giá mới</DialogTitle>
            </DialogHeader>
            <VoucherForm />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleAddVoucher}>Tạo mã</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vouchers Grid */}
      {displayVouchers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có mã giảm giá nào</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo mã đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayVouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <CardContent className="p-6 pl-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-bold text-primary">{voucher.code}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(voucher.code)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      {getStatusBadge(voucher)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(voucher)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa mã giảm giá?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa mã "{voucher.code}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVoucher(voucher.id)}>
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Giảm {voucher.discountType === 'percentage' 
                          ? `${voucher.discountValue}%` 
                          : formatPrice(voucher.discountValue)}
                        {voucher.maxDiscount && ` (tối đa ${formatPrice(voucher.maxDiscount)})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span>Đơn tối thiểu: {formatPrice(voucher.minOrderValue)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {new Date(voucher.startDate).toLocaleDateString('vi-VN')} - {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Đã dùng</span>
                      <span className="font-medium">{voucher.usedCount} / {voucher.usageLimit}</span>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingVoucher} onOpenChange={(open) => !open && setEditingVoucher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
          </DialogHeader>
          <VoucherForm />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingVoucher(null)}>Hủy</Button>
            <Button onClick={handleEditVoucher}>Lưu thay đổi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerVouchers;
