import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useSeller } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/data/plants';
import { MapPin, CreditCard, Truck, QrCode, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import paymentQR from '@/assets/payment-qr.png';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addresses, getDefaultAddress, addOrder: addUserOrder } = useUser();
  const { addOrder: addAdminOrder } = useAdmin();
  const { addSubOrder } = useSeller();

  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cod'>('transfer');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [note, setNote] = useState('');
  const [transferProof, setTransferProof] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Custom address form
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
  });

  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
      setUseCustomAddress(false);
    } else {
      // No saved addresses, use custom address form
      setUseCustomAddress(true);
    }
  }, [addresses]);

  useEffect(() => {
    // Pre-fill custom address with user info
    if (user) {
      setCustomAddress(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  if (items.length === 0 && !orderSuccess) {
    return (
      <PageLayout showHero={false}>
        <div className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <Button onClick={() => navigate('/catalog')}>Tiếp tục mua sắm</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (orderSuccess) {
    return (
      <PageLayout showHero={false}>
        <div className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4 text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-8">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ để xác nhận đơn hàng trong thời gian sớm nhất.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/catalog')}>Tiếp tục mua sắm</Button>
              <Button variant="outline" onClick={() => navigate('/account')}>Xem đơn hàng</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const shippingFee = 30000;
  const total = getTotalPrice() + shippingFee;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransferProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFullAddress = () => {
    if (useCustomAddress) {
      return `${customAddress.address}, ${customAddress.ward}, ${customAddress.district}, ${customAddress.city}`;
    }
    if (selectedAddress) {
      return `${selectedAddress.address}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`;
    }
    return '';
  };

  const getCustomerName = () => {
    if (useCustomAddress) return customAddress.name;
    if (selectedAddress) return selectedAddress.name;
    return user?.name || '';
  };

  const getCustomerPhone = () => {
    if (useCustomAddress) return customAddress.phone;
    if (selectedAddress) return selectedAddress.phone;
    return user?.phone || '';
  };

  const handleSubmit = async () => {
    // Validation - always allow custom address
    const hasAddress = useCustomAddress
      ? (customAddress.name && customAddress.phone && customAddress.address && customAddress.city)
      : selectedAddress;

    if (!hasAddress) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ thông tin địa chỉ giao hàng',
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'transfer' && !transferProof) {
      toast({
        title: 'Thiếu ảnh chuyển khoản',
        description: 'Vui lòng tải lên ảnh xác nhận chuyển khoản',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const shippingAddress = useCustomAddress ? {
      name: customAddress.name,
      phone: customAddress.phone,
      address: customAddress.address,
      ward: customAddress.ward,
      district: customAddress.district,
      city: customAddress.city,
    } : {
      name: selectedAddress!.name,
      phone: selectedAddress!.phone,
      address: selectedAddress!.address,
      ward: selectedAddress!.ward,
      district: selectedAddress!.district,
      city: selectedAddress!.city,
    };

    // Generate a shared ID for syncing
    const sharedOrderId = Date.now();

    // Chỉ thêm đơn lên Admin khi toàn bộ sản phẩm từ cửa hàng chính Greenie (không có seller)
    const isGreenieOnlyOrder = items.length > 0 && items.every(item => !item.plant.sellerId);
    if (isGreenieOnlyOrder) {
      addAdminOrder({
        id: sharedOrderId,
        customerName: getCustomerName(),
        customerPhone: getCustomerPhone(),
        customerAddress: getFullAddress(),
        items: items.map(item => ({
          plant: item.plant,
          quantity: item.quantity,
        })),
        total,
        status: 'Chờ xử lý',
        paymentMethod: paymentMethod === 'transfer' ? 'Chuyển khoản' : 'COD',
        paymentStatus: paymentMethod === 'transfer' ? 'Đã thanh toán' : 'Chưa thanh toán',
        note,
        transferProof: paymentMethod === 'transfer' ? transferProof : undefined,
      });
    }

    // Add order to User context for customer view
    addUserOrder({
      id: sharedOrderId.toString(),
      date: new Date().toISOString(),
      status: 'pending',
      items: items.map(item => ({
        name: item.plant.name,
        quantity: item.quantity,
        price: item.plant.price,
        image: item.plant.image,
      })),
      total,
      shippingAddress,
      paymentMethod: paymentMethod === 'transfer' ? 'Chuyển khoản' : 'COD',
      paymentStatus: paymentMethod === 'transfer' ? 'Đã thanh toán' : 'Chưa thanh toán',
      note,
    });

    // Group items by sellerId and create SubOrders
    const itemsBySeller = new Map<string, typeof items>();
    items.forEach(item => {
      const sellerId = item.plant.sellerId;
      if (sellerId) {
        if (!itemsBySeller.has(sellerId)) {
          itemsBySeller.set(sellerId, []);
        }
        itemsBySeller.get(sellerId)!.push(item);
      }
    });

    // Create SubOrder for each seller
    itemsBySeller.forEach((sellerItems, sellerId) => {
      const sellerTotal = sellerItems.reduce((sum, item) => sum + item.plant.price * item.quantity, 0);
      const shippingFeePerSeller = shippingFee / itemsBySeller.size; // Distribute shipping fee
      const subOrderTotal = sellerTotal + shippingFeePerSeller;

      addSubOrder({
        orderId: sharedOrderId.toString(),
        sellerId,
        customerName: getCustomerName(),
        customerPhone: getCustomerPhone(),
        customerAddress: getFullAddress(),
        items: sellerItems.map(item => ({
          productId: item.plant.id > 10000 ? `sp_${item.plant.id - 10000}` : item.plant.id.toString(),
          productName: item.plant.name,
          quantity: item.quantity,
          price: item.plant.price,
          image: item.plant.image,
        })),
        total: subOrderTotal,
        status: 'pending',
        note,
      });
    });

    clearCart();
    setOrderSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <PageLayout showHero={false}>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Thanh toán</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Địa chỉ nhận hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAuthenticated && addresses.length > 0 && (
                    <>
                      <RadioGroup value={useCustomAddress ? 'custom' : selectedAddressId} onValueChange={(val) => {
                        if (val === 'custom') {
                          setUseCustomAddress(true);
                        } else {
                          setUseCustomAddress(false);
                          setSelectedAddressId(val);
                        }
                      }}>
                        {addresses.map((addr) => (
                          <div key={addr.id} className={`flex items-start gap-3 p-4 rounded-lg border ${selectedAddressId === addr.id && !useCustomAddress ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value={addr.id} id={addr.id} />
                            <label htmlFor={addr.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Mặc định</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{addr.phone}</p>
                              <p className="text-sm">{addr.address}, {addr.ward}, {addr.district}, {addr.city}</p>
                            </label>
                          </div>
                        ))}
                        <div className={`flex items-start gap-3 p-4 rounded-lg border ${useCustomAddress ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <RadioGroupItem value="custom" id="custom" />
                          <label htmlFor="custom" className="font-medium cursor-pointer">Sử dụng địa chỉ khác</label>
                        </div>
                      </RadioGroup>
                    </>
                  )}

                  {(useCustomAddress || !isAuthenticated || addresses.length === 0) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Họ và tên *</Label>
                        <Input
                          value={customAddress.name}
                          onChange={(e) => setCustomAddress({ ...customAddress, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại *</Label>
                        <Input
                          value={customAddress.phone}
                          onChange={(e) => setCustomAddress({ ...customAddress, phone: e.target.value })}
                          placeholder="0901234567"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Địa chỉ *</Label>
                        <Input
                          value={customAddress.address}
                          onChange={(e) => setCustomAddress({ ...customAddress, address: e.target.value })}
                          placeholder="Số nhà, tên đường..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phường/Xã</Label>
                        <Input
                          value={customAddress.ward}
                          onChange={(e) => setCustomAddress({ ...customAddress, ward: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quận/Huyện</Label>
                        <Input
                          value={customAddress.district}
                          onChange={(e) => setCustomAddress({ ...customAddress, district: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Tỉnh/Thành phố *</Label>
                        <Input
                          value={customAddress.city}
                          onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={(val: 'transfer' | 'cod') => setPaymentMethod(val)}>
                    <div className={`flex items-start gap-3 p-4 rounded-lg border ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="transfer" id="transfer" />
                      <label htmlFor="transfer" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-primary" />
                          <span className="font-medium">Chuyển khoản ngân hàng</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Quét mã QR để chuyển khoản</p>
                      </label>
                    </div>
                    <div className={`flex items-start gap-3 p-4 rounded-lg border ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-primary" />
                          <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </label>
                    </div>
                  </RadioGroup>

                  {/* QR Code Section */}
                  {paymentMethod === 'transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-muted/30 rounded-xl"
                    >
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-lg mb-2">Thông tin chuyển khoản</h3>
                        <p className="text-sm text-muted-foreground">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</p>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-white p-4 rounded-xl">
                          <img src={paymentQR} alt="QR Payment" className="w-48 h-48 object-contain" />
                        </div>
                        <div className="flex-1 space-y-3 text-center md:text-left">
                          <div>
                            <p className="text-sm text-muted-foreground">Ngân hàng</p>
                            <p className="font-semibold text-primary">Vietcombank</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
                            <p className="font-semibold">TRUONG VU QUYNH NHU</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Số tài khoản</p>
                            <p className="font-semibold font-mono text-lg">1020558771</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Số tiền</p>
                            <p className="font-bold text-xl text-primary">{formatPrice(total)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
                            <p className="font-medium">GREENIE {getCustomerPhone()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Upload Proof */}
                      <div className="mt-6">
                        <Label className="mb-2 block">Tải lên ảnh xác nhận chuyển khoản *</Label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {transferProof ? 'Đã tải lên ảnh' : 'Chọn ảnh bill chuyển khoản'}
                            </span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                          {transferProof && (
                            <img src={transferProof} alt="Proof" className="w-16 h-16 object-cover rounded-lg" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Note */}
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.plant.id} className="flex items-center gap-3">
                      <img
                        src={item.plant.image}
                        alt={item.plant.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.plant.name}</p>
                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.plant.price * item.quantity)}</p>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Đang xử lý...
                      </div>
                    ) : (
                      'Đặt hàng'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Checkout;
