import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Eye,
  EyeOff,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useSeller, SellerProduct } from '@/contexts/SellerContext';
import { formatPrice, categories } from '@/data/plants';
import { useToast } from '@/hooks/use-toast';

const SellerProducts = () => {
  const { sellerProducts, addProduct, updateProduct, deleteProduct } = useSeller();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    careLevel: 'Dễ' as 'Dễ' | 'Trung bình' | 'Khó',
    light: '',
    water: '',
    humidity: '',
    temperature: '',
    location: '',
    benefits: '',
    image: '/placeholder.svg',
  });

  const filteredProducts = sellerProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      careLevel: 'Dễ',
      light: '',
      water: '',
      humidity: '',
      temperature: '',
      location: '',
      benefits: '',
      image: '/placeholder.svg',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
        variant: 'destructive',
      });
      return;
    }

    const price = parseInt(formData.price);
    const originalPrice = parseInt(formData.originalPrice) || price;
    const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

    addProduct({
      name: formData.name,
      category: formData.category,
      price,
      originalPrice,
      discount,
      stock: parseInt(formData.stock),
      image: formData.image,
      gallery: [],
      description: formData.description,
      careLevel: formData.careLevel,
      light: formData.light,
      water: formData.water,
      humidity: formData.humidity,
      temperature: formData.temperature,
      location: formData.location,
      benefits: formData.benefits,
      status: 'active',
    });

    toast({
      title: 'Thành công',
      description: 'Đã thêm sản phẩm mới.',
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    const price = parseInt(formData.price);
    const originalPrice = parseInt(formData.originalPrice) || price;
    const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

    updateProduct(editingProduct.id, {
      name: formData.name,
      category: formData.category,
      price,
      originalPrice,
      discount,
      stock: parseInt(formData.stock),
      image: formData.image,
      description: formData.description,
      careLevel: formData.careLevel,
      light: formData.light,
      water: formData.water,
      humidity: formData.humidity,
      temperature: formData.temperature,
      location: formData.location,
      benefits: formData.benefits,
    });

    toast({
      title: 'Thành công',
      description: 'Đã cập nhật sản phẩm.',
    });

    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast({
      title: 'Đã xóa',
      description: 'Sản phẩm đã được xóa.',
    });
  };

  const openEditDialog = (product: SellerProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      stock: product.stock.toString(),
      description: product.description,
      careLevel: product.careLevel,
      light: product.light,
      water: product.water,
      humidity: product.humidity,
      temperature: product.temperature,
      location: product.location || '',
      benefits: product.benefits || '',
      image: product.image,
    });
  };

  const toggleProductStatus = (product: SellerProduct) => {
    updateProduct(product.id, {
      status: product.status === 'active' ? 'inactive' : 'active',
    });
    toast({
      title: product.status === 'active' ? 'Đã ẩn sản phẩm' : 'Đã hiển thị sản phẩm',
    });
  };

  /* Removed inner component definition to fix focus loss issue */

  const renderProductForm = () => (
    <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Hình ảnh</Label>
          <div className="mt-2 flex items-center gap-4">
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed hover:bg-muted">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Tải ảnh lên</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="VD: Cây lưỡi hổ cao cấp"
          />
        </div>

        <div>
          <Label htmlFor="category">Danh mục *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c !== 'Tất cả').map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="careLevel">Độ khó chăm sóc</Label>
          <Select
            value={formData.careLevel}
            onValueChange={(value) => setFormData(prev => ({ ...prev, careLevel: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dễ">Dễ</SelectItem>
              <SelectItem value="Trung bình">Trung bình</SelectItem>
              <SelectItem value="Khó">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Giá bán (đ) *</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="150000"
          />
        </div>

        <div>
          <Label htmlFor="originalPrice">Giá gốc (đ)</Label>
          <Input
            id="originalPrice"
            value={formData.originalPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
            placeholder="180000"
          />
        </div>

        <div>
          <Label htmlFor="stock">Tồn kho *</Label>
          <Input
            id="stock"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="10"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Mô tả sản phẩm</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Mô tả chi tiết về sản phẩm..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="light">Ánh sáng</Label>
          <Input
            id="light"
            value={formData.light}
            onChange={(e) => setFormData(prev => ({ ...prev, light: e.target.value }))}
            placeholder="VD: Ít ánh sáng"
          />
        </div>

        <div>
          <Label htmlFor="water">Tưới nước</Label>
          <Input
            id="water"
            value={formData.water}
            onChange={(e) => setFormData(prev => ({ ...prev, water: e.target.value }))}
            placeholder="VD: 2-3 tuần/lần"
          />
        </div>

        <div>
          <Label htmlFor="humidity">Độ ẩm</Label>
          <Input
            id="humidity"
            value={formData.humidity}
            onChange={(e) => setFormData(prev => ({ ...prev, humidity: e.target.value }))}
            placeholder="VD: 30-50%"
          />
        </div>

        <div>
          <Label htmlFor="temperature">Nhiệt độ</Label>
          <Input
            id="temperature"
            value={formData.temperature}
            onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
            placeholder="VD: 15-30°C"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="location">Vị trí đặt</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="VD: Phòng khách, ban công"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="benefits">Công dụng</Label>
          <Textarea
            id="benefits"
            value={formData.benefits}
            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
            placeholder="Các lợi ích của sản phẩm..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý sản phẩm của shop</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            </DialogHeader>
            {renderProductForm()}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={product.status === 'inactive' ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-primary font-semibold mt-1">{formatPrice(product.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Kho: {product.stock}</span>
                        <span className="text-xs text-muted-foreground">|</span>
                        <span className="text-xs text-muted-foreground">Đã bán: {product.sold}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductStatus(product)}
                    >
                      {product.status === 'active' ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Ẩn
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Hiện
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc muốn xóa "{product.name}"? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          {renderProductForm()}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Hủy</Button>
            <Button onClick={handleEditProduct}>Lưu thay đổi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerProducts;
