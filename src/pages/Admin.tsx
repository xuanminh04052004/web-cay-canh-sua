import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  ShoppingCart,
  DollarSign,
  Leaf,
  Edit,
  Trash2,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Save,
  Eye,
  LogOut,
  Phone,
  MapPin,
  FileText,
  Image,
  Receipt,
  Store,
  TrendingUp,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Plant, formatPrice, categories } from "@/data/plants";
import { useAdmin, Order } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import RevenueChart from "@/components/admin/RevenueChart";
import AdminSellers from "@/components/admin/AdminSellers";
import SellerAnalytics from "@/components/admin/SellerAnalytics";

type TabType = "dashboard" | "products" | "orders" | "sellers" | "seller-analytics" | "analytics" | "settings";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    isAdminLoggedIn,
    logoutAdmin,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Plant | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [viewingTransferProof, setViewingTransferProof] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Omit<Plant, "id">>({
    name: "",
    category: "Trong nhà",
    rating: 4.5,
    reviews: 0,
    sold: 0,
    price: 0,
    originalPrice: 0,
    discount: 0,
    image: "",
    description: "",
    careLevel: "Dễ",
    light: "",
    water: "",
    humidity: "",
    temperature: "",
    gallery: [],
    location: "",
    benefits: "",
    stock: 10,
  });

  // Redirect if not logged in
  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const sidebarItems = [
    { id: "dashboard" as TabType, label: "Tổng quan", icon: LayoutDashboard },
    { id: "products" as TabType, label: "Sản phẩm", icon: Package },
    { id: "orders" as TabType, label: "Đơn hàng", icon: ShoppingCart },
    { id: "sellers" as TabType, label: "Sellers", icon: Store },
    { id: "seller-analytics" as TabType, label: "Thống kê Seller", icon: TrendingUp },
    { id: "analytics" as TabType, label: "Phân tích", icon: BarChart3 },
    { id: "settings" as TabType, label: "Cài đặt", icon: Settings },
  ];

  // Analytics calculations
  const totalRevenue = orders
    .filter((o) => o.status === "Đã giao")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "Chờ xử lý").length;
  const completedOrders = orders.filter((o) => o.status === "Đã giao").length;

  // Calculate best-selling products from real order data
  const productSalesMap = new Map<string, { name: string; image: string; price: number; totalQty: number; totalRevenue: number }>();
  orders.filter((o) => o.status === "Đã giao").forEach((order) => {
    order.items.forEach((item) => {
      const key = item.plant.name;
      const existing = productSalesMap.get(key);
      if (existing) {
        existing.totalQty += item.quantity;
        existing.totalRevenue += item.plant.price * item.quantity;
      } else {
        productSalesMap.set(key, {
          name: item.plant.name,
          image: item.plant.image,
          price: item.plant.price,
          totalQty: item.quantity,
          totalRevenue: item.plant.price * item.quantity,
        });
      }
    });
  });
  const bestSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.totalQty - a.totalQty);

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    prefix = "",
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: React.ElementType;
    prefix?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {prefix}
            {typeof value === "number" ? new Intl.NumberFormat("vi-VN").format(value) : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? "text-primary" : "text-destructive"}`}>
              {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}% so với tháng trước</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/20 rounded-xl">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.status === orderFilter;
  });

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    toast({ title: "Đã cập nhật sản phẩm!" });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({ title: "Vui lòng điền đầy đủ thông tin!", variant: "destructive" });
      return;
    }
    addProduct(newProduct);
    setIsAddingProduct(false);
    setNewProduct({
      name: "",
      category: "Trong nhà",
      rating: 4.5,
      reviews: 0,
      sold: 0,
      price: 0,
      originalPrice: 0,
      discount: 0,
      image: "",
      description: "",
      careLevel: "Dễ",
      light: "",
      water: "",
      humidity: "",
      temperature: "",
      gallery: [],
      location: "",
      benefits: "",
      stock: 10,
    });
    toast({ title: "Đã thêm sản phẩm mới!" });
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProduct(id);
      toast({ title: "Đã xóa sản phẩm!" });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col shrink-0">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
          <span className="font-display text-xl text-foreground">GREENIE</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">caycanhgreenie@gmail.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto flex justify-center">
        <div className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-display text-3xl text-foreground">Tổng quan</h1>
                <p className="text-muted-foreground mt-1">Xem thống kê và hoạt động của cửa hàng</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Doanh thu"
                  value={totalRevenue}
                  icon={DollarSign}
                />
                <StatCard
                  title="Đơn hàng"
                  value={orders.length}
                  icon={ShoppingCart}
                />
                <StatCard
                  title="Chờ xử lý"
                  value={pendingOrders}
                  icon={FileText}
                />
                <StatCard
                  title="Sản phẩm"
                  value={products.length}
                  icon={Leaf}
                />
              </div>

              {/* Recent Orders */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-display text-xl text-foreground">Đơn hàng gần đây</h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-primary hover:underline text-sm"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-muted-foreground text-sm border-b border-border">
                        <th className="pb-3">Khách hàng</th>
                        <th className="pb-3">Sản phẩm</th>
                        <th className="pb-3">Tổng tiền</th>
                        <th className="pb-3">Trạng thái</th>
                        <th className="pb-3">Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-border/50">
                          <td className="py-4 text-foreground">{order.customerName}</td>
                          <td className="py-4 text-muted-foreground">{order.items.length} sản phẩm</td>
                          <td className="py-4 text-foreground font-medium">{formatPrice(order.total)}</td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "Đã giao"
                                  ? "bg-primary/20 text-primary"
                                  : order.status === "Đang giao"
                                  ? "bg-secondary/20 text-secondary-foreground"
                                  : order.status === "Đã hủy"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-display text-3xl text-foreground">Quản lý sản phẩm</h1>
                  <p className="text-muted-foreground mt-1">{products.length} sản phẩm</p>
                </div>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Thêm sản phẩm
                </button>
              </div>

              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">{formatPrice(product.price)}</p>
                      <p className="text-sm text-muted-foreground">{productSalesMap.get(product.name)?.totalQty || 0} đã bán</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-display text-3xl text-foreground">Quản lý đơn hàng</h1>
                <p className="text-muted-foreground mt-1">{orders.length} đơn hàng</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {["all", "Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      orderFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {status === "all" ? "Tất cả" : status}
                  </button>
                ))}
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-muted-foreground text-sm bg-muted/30">
                      <th className="p-4">ID</th>
                      <th className="p-4">Khách hàng</th>
                      <th className="p-4">Sản phẩm</th>
                      <th className="p-4">Tổng tiền</th>
                      <th className="p-4">Thanh toán</th>
                      <th className="p-4">Minh chứng CK</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Ngày</th>
                      <th className="p-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border/50">
                        <td className="p-4 text-foreground">#{order.id}</td>
                        <td className="p-4 text-foreground">{order.customerName}</td>
                        <td className="p-4 text-muted-foreground">{order.items.length} sản phẩm</td>
                        <td className="p-4 text-foreground font-medium">{formatPrice(order.total)}</td>
                        <td className="p-4">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => updatePaymentStatus(order.id, e.target.value as Order["paymentStatus"])}
                            className={`px-3 py-1 rounded-lg text-sm outline-none ${
                              order.paymentStatus === "Đã thanh toán"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <option>Chưa thanh toán</option>
                            <option>Đã thanh toán</option>
                          </select>
                        </td>
                        <td className="p-4">
                          {order.paymentMethod === "Chuyển khoản" ? (
                            order.transferProof ? (
                              <button
                                onClick={() => setViewingTransferProof(order.transferProof!)}
                                className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                Xem
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Chưa có ảnh</span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">COD</span>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                            className="px-3 py-1 bg-muted rounded-lg text-sm text-foreground outline-none"
                          >
                            <option>Chờ xử lý</option>
                            <option>Đang giao</option>
                            <option>Đã giao</option>
                            <option>Đã hủy</option>
                          </select>
                        </td>
                        <td className="p-4 text-muted-foreground">{order.date}</td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Xóa đơn hàng này?")) {
                                deleteOrder(order.id);
                                toast({ title: "Đã xóa đơn hàng!" });
                              }
                            }}
                            className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Không có đơn hàng nào
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Sellers Tab */}
          {activeTab === "sellers" && (
            <motion.div
              key="sellers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminSellers />
            </motion.div>
          )}

          {/* Seller Analytics Tab */}
          {activeTab === "seller-analytics" && (
            <motion.div
              key="seller-analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SellerAnalytics />
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-display text-3xl text-foreground">Phân tích</h1>
                <p className="text-muted-foreground mt-1">Thống kê doanh thu và sản phẩm</p>
              </div>

              {/* Revenue Chart */}
              <RevenueChart orders={orders} />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-display text-xl text-foreground mb-4">Sản phẩm bán chạy</h2>
                  <div className="space-y-4">
                    {bestSellingProducts
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product.name} className="flex items-center gap-4">
                          <span className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary rounded-full font-medium">
                            {index + 1}
                          </span>
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">🌿</div>
                          <div className="flex-1">
                            <p className="text-foreground font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.totalQty} đã bán</p>
                          </div>
                          <p className="text-foreground font-semibold">{formatPrice(product.totalRevenue)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h2 className="text-display text-xl text-foreground mb-4">Thống kê nhanh</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Tổng doanh thu</span>
                      <span className="text-foreground font-semibold">{formatPrice(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Đơn đã hoàn thành</span>
                      <span className="text-primary font-semibold">{completedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Đơn chờ xử lý</span>
                      <span className="text-secondary-foreground font-semibold">{pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Tổng sản phẩm</span>
                      <span className="text-foreground font-semibold">{products.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-display text-3xl text-foreground">Cài đặt</h1>
                <p className="text-muted-foreground mt-1">Quản lý cài đặt cửa hàng</p>
              </div>

              <div className="glass-card p-6 space-y-6">
                <h2 className="text-display text-xl text-foreground">Thông tin cửa hàng</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Tên cửa hàng</label>
                    <input
                      type="text"
                      defaultValue="GREENIE"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email liên hệ</label>
                    <input
                      type="email"
                      defaultValue="caycanhgreenie@gmail.com"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Số điện thoại 1</label>
                    <input
                      type="tel"
                      defaultValue="0906 560 568"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Số điện thoại 2</label>
                    <input
                      type="tel"
                      defaultValue="0949 540 305"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-muted-foreground mb-2">Địa chỉ 1</label>
                    <input
                      type="text"
                      defaultValue="255 Lê Thanh Nghị, phường Quy Nhơn, tỉnh Gia Lai"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-muted-foreground mb-2">Địa chỉ 2</label>
                    <input
                      type="text"
                      defaultValue="487 Nguyễn Thái Học, phường Quy Nhơn Nam, tỉnh Gia Lai"
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={() => toast({ title: "Đã lưu thay đổi!" })}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-display text-xl text-foreground">Chỉnh sửa sản phẩm</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Giá (VND)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Giá gốc</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Danh mục</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.filter(c => c !== "Tất cả").map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Hình ảnh</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập URL hình ảnh..."
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">hoặc</span>
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setEditingProduct({ ...editingProduct, image: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="block w-full px-4 py-3 bg-primary/10 text-primary rounded-xl text-center text-sm font-medium hover:bg-primary/20 transition-colors">
                          Tải ảnh lên
                        </span>
                      </label>
                    </div>
                    {editingProduct.image && (
                      <img src={editingProduct.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Mô tả</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Vị trí phù hợp</label>
                  <textarea
                    value={editingProduct.location || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, location: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="VD: Phòng khách, phòng ngủ, ban công..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Lợi ích</label>
                  <textarea
                    value={editingProduct.benefits || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, benefits: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="VD: Thanh lọc không khí, mang lại may mắn..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Tồn kho</label>
                    <input
                      type="number"
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Mức độ chăm sóc</label>
                    <select
                      value={editingProduct.careLevel}
                      onChange={(e) => setEditingProduct({ ...editingProduct, careLevel: e.target.value as Plant["careLevel"] })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Dễ</option>
                      <option>Trung bình</option>
                      <option>Khó</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Lưu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingProduct(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-display text-xl text-foreground">Thêm sản phẩm mới</h2>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: Monstera Deliciosa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Giá (VND) *</label>
                    <input
                      type="number"
                      value={newProduct.price || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                      placeholder="459000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Giá gốc</label>
                    <input
                      type="number"
                      value={newProduct.originalPrice || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                      placeholder="549000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Danh mục</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.filter(c => c !== "Tất cả").map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Hình ảnh</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập URL hình ảnh..."
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">hoặc</span>
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewProduct({ ...newProduct, image: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="block w-full px-4 py-3 bg-primary/10 text-primary rounded-xl text-center text-sm font-medium hover:bg-primary/20 transition-colors">
                          Tải ảnh lên
                        </span>
                      </label>
                    </div>
                    {newProduct.image && (
                      <img src={newProduct.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Mô tả</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Mô tả về cây..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Vị trí phù hợp</label>
                  <textarea
                    value={newProduct.location || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="VD: Phòng khách, phòng ngủ, ban công..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Lợi ích</label>
                  <textarea
                    value={newProduct.benefits || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, benefits: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="VD: Thanh lọc không khí, mang lại may mắn..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Tồn kho</label>
                    <input
                      type="number"
                      value={newProduct.stock || 10}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Mức độ chăm sóc</label>
                    <select
                      value={newProduct.careLevel}
                      onChange={(e) => setNewProduct({ ...newProduct, careLevel: e.target.value as Plant["careLevel"] })}
                      className="w-full px-4 py-3 bg-muted/30 rounded-xl text-foreground outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Dễ</option>
                      <option>Trung bình</option>
                      <option>Khó</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="flex-1 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Thêm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewingOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingOrder(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-display text-xl text-foreground">Chi tiết đơn hàng #{viewingOrder.id}</h2>
                <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Khách hàng</p>
                    <p className="text-foreground font-medium">{viewingOrder.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="text-foreground font-medium">{viewingOrder.customerPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="text-foreground font-medium">{viewingOrder.customerAddress}</p>
                  </div>
                </div>

                {viewingOrder.note && (
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ghi chú</p>
                      <p className="text-foreground">{viewingOrder.note}</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">Sản phẩm</p>
                  <div className="space-y-3">
                    {viewingOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={item.plant.image}
                          alt={item.plant.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-foreground font-medium">{item.plant.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-foreground font-semibold">
                          {formatPrice(item.plant.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transfer Proof Section */}
                {viewingOrder.paymentMethod === "Chuyển khoản" && (
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Receipt className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium text-foreground">Bill chuyển khoản</p>
                    </div>
                    {viewingOrder.transferProof ? (
                      <div className="relative">
                        <img
                          src={viewingOrder.transferProof}
                          alt="Bill chuyển khoản"
                          className="w-full max-w-sm mx-auto rounded-xl border border-border"
                        />
                        <a
                          href={viewingOrder.transferProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Image className="w-4 h-4" />
                          Xem ảnh đầy đủ
                        </a>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 rounded-xl text-center text-muted-foreground">
                        <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có bill chuyển khoản</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(viewingOrder.total)}</span>
                </div>

                <div className="flex gap-4 text-sm">
                  <div className="flex-1 p-3 bg-muted/30 rounded-xl text-center">
                    <p className="text-muted-foreground">Thanh toán</p>
                    <p className="text-foreground font-medium">{viewingOrder.paymentMethod}</p>
                  </div>
                  <div className="flex-1 p-3 bg-muted/30 rounded-xl text-center">
                    <p className="text-muted-foreground">Trạng thái</p>
                    <p className={`font-medium ${
                      viewingOrder.paymentStatus === "Đã thanh toán" ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {viewingOrder.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingOrder(null)}
                className="w-full mt-6 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Đóng
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Transfer Proof Modal */}
      <AnimatePresence>
        {viewingTransferProof && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setViewingTransferProof(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-display text-lg text-foreground">Minh chứng chuyển khoản</h3>
                  <button
                    onClick={() => setViewingTransferProof(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <img
                  src={viewingTransferProof}
                  alt="Minh chứng chuyển khoản"
                  className="w-full rounded-xl border border-border"
                />
                <button
                  onClick={() => setViewingTransferProof(null)}
                  className="w-full mt-4 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
