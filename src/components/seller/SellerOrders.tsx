import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSeller, SubOrder } from '@/contexts/SellerContext';
import { formatPrice } from '@/data/plants';
import { useToast } from '@/hooks/use-toast';

const SellerOrders = () => {
  const { sellerOrders, updateOrderStatus } = useSeller();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<SubOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const filteredOrders = sellerOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SubOrder['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const, icon: Clock },
      confirmed: { label: 'Đã xác nhận', variant: 'outline' as const, icon: CheckCircle },
      shipping: { label: 'Đang giao', variant: 'default' as const, icon: Truck },
      delivered: { label: 'Đã giao', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const, icon: XCircle },
    };
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleUpdateStatus = (orderId: string, newStatus: SubOrder['status']) => {
    updateOrderStatus(orderId, newStatus, newStatus === 'shipping' ? trackingNumber : undefined);
    toast({
      title: 'Cập nhật thành công',
      description: `Đơn hàng đã được cập nhật trạng thái.`,
    });
    setTrackingNumber('');
  };

  const getNextStatus = (currentStatus: SubOrder['status']): SubOrder['status'] | null => {
    const flow: Record<SubOrder['status'], SubOrder['status'] | null> = {
      pending: 'confirmed',
      confirmed: 'shipping',
      shipping: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return flow[currentStatus];
  };

  const stats = {
    pending: sellerOrders.filter(o => o.status === 'pending').length,
    confirmed: sellerOrders.filter(o => o.status === 'confirmed').length,
    shipping: sellerOrders.filter(o => o.status === 'shipping').length,
    delivered: sellerOrders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Đơn hàng</h1>
        <p className="text-muted-foreground">Quản lý đơn hàng của shop</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Chờ xử lý', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { label: 'Đã xác nhận', value: stats.confirmed, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Đang giao', value: stats.shipping, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Đã giao', value: stats.delivered, color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn hoặc tên khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{order.items.length} sản phẩm</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {getNextStatus(order.status) && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const nextStatus = getNextStatus(order.status);
                              if (nextStatus === 'shipping') {
                                setViewingOrder(order);
                              } else if (nextStatus) {
                                handleUpdateStatus(order.id, nextStatus);
                              }
                            }}
                          >
                            {order.status === 'pending' && 'Xác nhận'}
                            {order.status === 'confirmed' && 'Giao hàng'}
                            {order.status === 'shipping' && 'Hoàn thành'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{viewingOrder?.id.slice(-6)}</DialogTitle>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Khách hàng</Label>
                  <p className="font-medium">{viewingOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{viewingOrder.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Địa chỉ giao hàng</Label>
                  <p className="text-sm">{viewingOrder.customerAddress}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <Label className="text-muted-foreground mb-2 block">Sản phẩm</Label>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                <span className="font-medium">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(viewingOrder.total)}</span>
              </div>

              {/* Status & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Trạng thái:</Label>
                  {getStatusBadge(viewingOrder.status)}
                </div>

                {viewingOrder.trackingNumber && (
                  <div>
                    <Label className="text-muted-foreground">Mã vận đơn</Label>
                    <p className="font-mono">{viewingOrder.trackingNumber}</p>
                  </div>
                )}

                {viewingOrder.status === 'confirmed' && (
                  <div className="space-y-2">
                    <Label htmlFor="tracking">Mã vận đơn (bắt buộc khi giao hàng)</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="VD: VN123456789"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  {getNextStatus(viewingOrder.status) && (
                    <Button
                      onClick={() => {
                        const nextStatus = getNextStatus(viewingOrder.status);
                        if (nextStatus === 'shipping' && !trackingNumber) {
                          toast({
                            title: 'Lỗi',
                            description: 'Vui lòng nhập mã vận đơn.',
                            variant: 'destructive',
                          });
                          return;
                        }
                        if (nextStatus) {
                          handleUpdateStatus(viewingOrder.id, nextStatus);
                          setViewingOrder(null);
                        }
                      }}
                    >
                      {viewingOrder.status === 'pending' && 'Xác nhận đơn'}
                      {viewingOrder.status === 'confirmed' && 'Bắt đầu giao hàng'}
                      {viewingOrder.status === 'shipping' && 'Xác nhận đã giao'}
                    </Button>
                  )}
                  {viewingOrder.status === 'pending' && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleUpdateStatus(viewingOrder.id, 'cancelled');
                        setViewingOrder(null);
                      }}
                    >
                      Hủy đơn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerOrders;
