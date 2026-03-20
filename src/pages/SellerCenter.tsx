import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Tag,
  MessageCircle,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSeller } from '@/contexts/SellerContext';
import { useAuth } from '@/contexts/AuthContext';
import greenielogo from '@/assets/greenie-logo.jpg';

// Tab components
import SellerDashboard from '@/components/seller/SellerDashboard';
import SellerProducts from '@/components/seller/SellerProducts';
import SellerOrders from '@/components/seller/SellerOrders';
import SellerReviews from '@/components/seller/SellerReviews';
import SellerVouchers from '@/components/seller/SellerVouchers';
import SellerChat from '@/components/seller/SellerChat';
import SellerSettings from '@/components/seller/SellerSettings';
import SellerProfile from '@/components/seller/SellerProfile';

type TabType = 'dashboard' | 'products' | 'orders' | 'reviews' | 'vouchers' | 'chat' | 'settings' | 'profile';

const SellerCenter = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { currentSeller, isSellerLoggedIn, logoutSeller, loginSellerByUserId, getSellerStats, chatConversations } = useSeller();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync auth: auto-login seller when user is logged in with seller role
  useEffect(() => {
    if (user?.role === 'seller' && !currentSeller) {
      loginSellerByUserId(user.id);
    }
  }, [user, currentSeller, loginSellerByUserId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const isAuthenticated = isSellerLoggedIn || (user?.role === 'seller');
    if (!isAuthenticated) {
      navigate('/seller/login');
    }
  }, [isSellerLoggedIn, user, navigate]);

  if (!currentSeller) return null;

  const stats = getSellerStats();
  const unreadChats = chatConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Hồ sơ Shop', icon: UserCircle },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, badge: stats.pendingOrders },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
    { id: 'vouchers', label: 'Khuyến mãi', icon: Tag },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: unreadChats },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const handleLogout = () => {
    logoutSeller();
    if (user?.role === 'seller') {
      authLogout();
    }
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SellerDashboard />;
      case 'profile':
        return <SellerProfile />;
      case 'products':
        return <SellerProducts />;
      case 'orders':
        return <SellerOrders />;
      case 'reviews':
        return <SellerReviews />;
      case 'vouchers':
        return <SellerVouchers />;
      case 'chat':
        return <SellerChat />;
      case 'settings':
        return <SellerSettings />;
      default:
        return <SellerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed lg:relative z-40 h-screen w-[280px] bg-card border-r border-border flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={greenielogo} alt="GREENIE" className="h-8" />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Seller Center</span>
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentSeller.shopName}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSeller.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === item.id ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </motion.aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default SellerCenter;
