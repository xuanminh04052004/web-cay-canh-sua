import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Search,
  Eye,
  Check,
  X,
  Lock,
  Unlock,
  Package,
  ShoppingCart,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSeller, Seller, SellerProduct, SubOrder, AuditLog } from '@/contexts/SellerContext';
import { formatPrice } from '@/data/plants';
import { useToast } from '@/hooks/use-toast';

const AdminSellers = () => {
  const {
    allSellers,
    allSellerProducts,
    allSubOrders,
    auditLogs,
    approveSeller,
    suspendSeller,
    unsuspendSeller,
    getProductsBySeller,
    getOrdersBySeller,
  } = useSeller();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'suspended'>('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [viewMode, setViewMode] = useState<'info' | 'products' | 'orders'>('info');
  const [suspendReason, setSuspendReason] = useState('');
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Filter sellers
  const filteredSellers = allSellers.filter(seller => {
    const matchesSearch = 
      seller.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const approvedCount = allSellers.filter(s => s.status === 'approved').length;
  const suspendedCount = allSellers.filter(s => s.status === 'suspended').length;

  const handleSuspend = (sellerId: string) => {
    if (!suspendReason.trim()) {
      toast({ title: 'Vui lòng nhập lý do khóa!', variant: 'destructive' });
      return;
    }
    suspendSeller(sellerId, suspendReason);
    setSuspendReason('');
    toast({ title: 'Đã khóa seller!' });
  };

  const handleUnsuspend = (sellerId: string) => {
    unsuspendSeller(sellerId);
    toast({ title: 'Đã mở khóa seller!' });
  };

  const getStatusBadge = (status: Seller['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      case 'approved':
        return <Badge variant="default">Đã duyệt</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Đã khóa</Badge>;
    }
  };

  const getOrderStatusBadge = (status: SubOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Chờ xác nhận</Badge>;
      case 'confirmed':
        return <Badge variant="outline">Đã xác nhận</Badge>;
      case 'shipping':
        return <Badge variant="default" className="bg-blue-500">Đang giao</Badge>;
      case 'delivered':
        return <Badge variant="default">Đã giao</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-3xl text-foreground">Quản lý Seller</h1>
          <p className="text-muted-foreground mt-1">{allSellers.length} sellers</p>
        </div>
        <Button variant="outline" onClick={() => setShowAuditLogs(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Audit Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('approved')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('suspended')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/20 rounded-xl">
              <Lock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{suspendedCount}</p>
              <p className="text-sm text-muted-foreground">Đã khóa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'approved', 'suspended'] as const).map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Tất cả' : 
               status === 'approved' ? 'Đang hoạt động' : 'Đã khóa'}
            </Button>
          ))}
        </div>
      </div>

      {/* Sellers List */}
      <div className="space-y-4">
        {filteredSellers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không tìm thấy seller nào</p>
            </CardContent>
          </Card>
        ) : (
          filteredSellers.map((seller, index) => {
            const sellerProducts = getProductsBySeller(seller.id);
            const sellerOrders = getOrdersBySeller(seller.id);
            const totalRevenue = sellerOrders
              .filter(o => o.status === 'delivered')
              .reduce((sum, o) => sum + o.total, 0);

            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Shop Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          {seller.logo ? (
                            <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Store className="w-7 h-7 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">{seller.shopName}</h3>
                            {getStatusBadge(seller.status)}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{seller.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Đăng ký: {new Date(seller.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{sellerProducts.length}</p>
                          <p className="text-muted-foreground">Sản phẩm</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{sellerOrders.length}</p>
                          <p className="text-muted-foreground">Đơn hàng</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-primary">{formatPrice(totalRevenue)}</p>
                          <p className="text-muted-foreground">Doanh thu</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSeller(seller);
                            setViewMode('info');
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {seller.status === 'approved' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Lock className="w-4 h-4 mr-1" />
                                Khóa
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Khóa seller "{seller.shopName}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Seller sẽ không thể đăng nhập hoặc bán hàng. Nhập lý do khóa:
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Textarea
                                placeholder="Lý do khóa..."
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                              />
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSuspendReason('')}>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSuspend(seller.id)}>
                                  Xác nhận khóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {seller.status === 'suspended' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnsuspend(seller.id)}
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            Mở khóa
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Seller Detail Dialog */}
      <Dialog open={!!selectedSeller} onOpenChange={(open) => !open && setSelectedSeller(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Store className="w-6 h-6 text-primary" />
              {selectedSeller?.shopName}
              {selectedSeller && getStatusBadge(selectedSeller.status)}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="info" className="mt-0">
                {selectedSeller && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-foreground">{selectedSeller.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="text-foreground">{selectedSeller.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p className="text-foreground">{selectedSeller.address}</p>
                      </div>
                      {selectedSeller.description && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Mô tả</p>
                          <p className="text-foreground">{selectedSeller.description}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày đăng ký</p>
                        <p className="text-foreground">
                          {new Date(selectedSeller.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {selectedSeller.approvedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày duyệt</p>
                          <p className="text-foreground">
                            {new Date(selectedSeller.approvedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products" className="mt-0">
                {selectedSeller && (
                  <div className="space-y-3">
                    {getProductsBySeller(selectedSeller.id).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        Chưa có sản phẩm
                      </div>
                    ) : (
                      getProductsBySeller(selectedSeller.id).map(product => (
                        <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • Tồn: {product.stock}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
                            <p className="text-xs text-muted-foreground">{product.sold} đã bán</p>
                          </div>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status === 'active' ? 'Đang bán' : product.status === 'inactive' ? 'Ẩn' : 'Chờ duyệt'}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                {selectedSeller && (
                  <div className="space-y-3">
                    {getOrdersBySeller(selectedSeller.id).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        Chưa có đơn hàng
                      </div>
                    ) : (
                      getOrdersBySeller(selectedSeller.id).map(order => (
                        <div key={order.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">#{order.id.slice(-8)}</span>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>{order.customerName} • {order.items.length} sản phẩm</p>
                            <p className="font-medium text-foreground">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <Dialog open={showAuditLogs} onOpenChange={setShowAuditLogs}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audit Log
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Chưa có log nào</p>
              ) : (
                auditLogs.slice(0, 100).map(log => (
                  <div key={log.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{log.action}</span>
                      <Badge variant={log.performedBy === 'admin' ? 'default' : 'secondary'}>
                        {log.performedBy === 'admin' ? 'Admin' : 'Seller'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.performedByName} • {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellers;
