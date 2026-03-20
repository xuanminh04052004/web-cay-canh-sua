import { useState } from 'react';
import { useUser, Order } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, CreditCard, MapPin, Ban, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
  shipping: { label: 'Đang giao', color: 'bg-orange-500', icon: Truck },
  delivered: { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
  "Chờ xử lý": { label: 'Chờ xử lý', color: 'bg-yellow-500', icon: Clock },
  "Đã xác nhận": { label: 'Đã xác nhận', color: 'bg-blue-500', icon: CheckCircle },
  "Đang giao": { label: 'Đang giao', color: 'bg-orange-500', icon: Truck },
  "Đã giao": { label: 'Đã giao', color: 'bg-green-500', icon: CheckCircle },
  "Đã hủy": { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

const cancelReasons = [
  { id: 'change_mind', label: 'Tôi đổi ý, không muốn mua nữa' },
  { id: 'better_price', label: 'Tìm được giá tốt hơn ở nơi khác' },
  { id: 'wrong_product', label: 'Đặt nhầm sản phẩm' },
  { id: 'wrong_address', label: 'Nhập sai địa chỉ giao hàng' },
  { id: 'delivery_time', label: 'Thời gian giao hàng quá lâu' },
  { id: 'other', label: 'Lý do khác' },
];

const OrdersTab = () => {
  const { orders, cancelOrder } = useUser();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const { toast } = useToast();

  // Check if order can be cancelled (only pending or confirmed)
  const canCancelOrder = (status: string) => {
    return status === 'pending' || status === 'confirmed';
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;

    let reason = cancelReasons.find(r => r.id === selectedReason)?.label || '';
    if (selectedReason === 'other' && otherReason.trim()) {
      reason = otherReason.trim();
    }

    if (!reason) {
      toast({
        title: 'Vui lòng chọn lý do',
        description: 'Bạn cần chọn lý do hủy đơn hàng',
        variant: 'destructive',
      });
      return;
    }

    const success = cancelOrder(selectedOrder.id, reason);
    if (success) {
      toast({
        title: 'Đã hủy đơn hàng',
        description: 'Đơn hàng của bạn đã được hủy thành công',
      });
      setShowCancelDialog(false);
      setSelectedOrder(null);
      setSelectedReason('');
      setOtherReason('');
    } else {
      toast({
        title: 'Không thể hủy đơn hàng',
        description: 'Đơn hàng đã được giao hoặc đang trong quá trình vận chuyển',
        variant: 'destructive',
      });
    }
  };

  const openCancelDialog = () => {
    setSelectedReason('');
    setOtherReason('');
    setShowCancelDialog(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng của tôi</CardTitle>
          <CardDescription>Theo dõi và quản lý các đơn hàng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = getStatusConfig(order.status);
                const StatusIcon = config.icon;
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">#{order.id.slice(-6)}</span>
                        <Badge variant="secondary" className={`${config.color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(order.date)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-lg border-2 border-background bg-muted overflow-hidden"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-sm font-medium">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} sản phẩm
                        </p>
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder && !showCancelDialog} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Đơn hàng #{selectedOrder.id.slice(-6)}
                  <Badge variant="secondary" className={`${getStatusConfig(selectedOrder.status).color} text-white`}>
                    {getStatusConfig(selectedOrder.status).label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Đặt ngày {formatDate(selectedOrder.date)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Timeline */}
                <div>
                  <h4 className="font-semibold mb-4">Hành trình đơn hàng</h4>
                  <div className="relative pl-6 space-y-4">
                    {selectedOrder.timeline.map((event, index) => (
                      <div key={index} className="relative">
                        <div className={`absolute -left-6 w-3 h-3 rounded-full ${index === selectedOrder.timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                        {index !== selectedOrder.timeline.length - 1 && (
                          <div className="absolute -left-[18px] top-3 w-0.5 h-full bg-border" />
                        )}
                        <div>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-sm">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancel Reason (if cancelled) */}
                {selectedOrder.status === 'cancelled' && selectedOrder.cancelReason && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      Lý do hủy đơn
                    </h4>
                    <p className="text-sm">{selectedOrder.cancelReason}</p>
                  </div>
                )}

                {/* Products */}
                <div>
                  <h4 className="font-semibold mb-4">Sản phẩm</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ nhận hàng
                  </h4>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.address}
                      {selectedOrder.shippingAddress.ward && `, ${selectedOrder.shippingAddress.ward}`}
                      {selectedOrder.shippingAddress.district && `, ${selectedOrder.shippingAddress.district}`}
                      {selectedOrder.shippingAddress.city && `, ${selectedOrder.shippingAddress.city}`}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Thanh toán
                  </h4>
                  <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                    <span>{selectedOrder.paymentMethod}</span>
                    <Badge variant={selectedOrder.paymentStatus === 'Đã thanh toán' ? 'default' : 'secondary'}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Note */}
                {selectedOrder.note && (
                  <div>
                    <h4 className="font-semibold mb-2">Ghi chú</h4>
                    <p className="p-3 rounded-lg bg-muted/50 text-sm">{selectedOrder.note}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Đóng
                  </Button>
                  {selectedOrder.status === 'shipping' && (
                    <Button>Theo dõi đơn hàng</Button>
                  )}
                  {canCancelOrder(selectedOrder.status) && (
                    <Button variant="destructive" onClick={openCancelDialog} className="flex items-center gap-2">
                      <Ban className="w-4 h-4" />
                      Hủy đơn hàng
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Ban className="w-5 h-5" />
              Hủy đơn hàng
            </DialogTitle>
            <DialogDescription>
              Vui lòng chọn lý do hủy đơn hàng #{selectedOrder?.id.slice(-6)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {cancelReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="flex-1 cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === 'other' && (
              <Textarea
                placeholder="Nhập lý do hủy đơn hàng của bạn..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={!selectedReason || (selectedReason === 'other' && !otherReason.trim())}
            >
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTab;
