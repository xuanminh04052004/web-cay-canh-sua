import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Package, X, Check } from "lucide-react";
import { useAdmin, Order } from "@/contexts/AdminContext";
import { formatPrice } from "@/data/plants";

interface Notification {
  id: number;
  orderId: number;
  customerName: string;
  total: number;
  timestamp: Date;
  read: boolean;
}

const NotificationBell = () => {
  const { orders, isAdminLoggedIn } = useAdmin();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(orders.length);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect new orders
  useEffect(() => {
    if (orders.length > previousOrderCount) {
      // New order(s) added
      const newOrders = orders.slice(0, orders.length - previousOrderCount);
      const newNotifications: Notification[] = newOrders.map((order) => ({
        id: Date.now() + Math.random(),
        orderId: order.id,
        customerName: order.customerName,
        total: order.total,
        timestamp: new Date(),
        read: false,
      }));
      
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 20));
      console.log("🔔 New order notification:", newNotifications);
    }
    setPreviousOrderCount(orders.length);
  }, [orders.length, previousOrderCount]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  // Only show for admin
  if (!isAdminLoggedIn) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground font-medium"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Thông báo</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    title="Đánh dấu tất cả đã đọc"
                  >
                    <Check className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    title="Xóa tất cả"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-border/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${!notification.read ? "bg-primary/20" : "bg-muted"}`}>
                        <Package className={`w-4 h-4 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Đơn hàng mới #{notification.orderId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notification.customerName} đã đặt hàng
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-primary font-medium">
                            {formatPrice(notification.total)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Chưa có thông báo mới
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
