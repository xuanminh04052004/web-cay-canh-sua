import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Plant, fetchPlantsFromApi } from "@/data/plants";
import {
  fetchOrdersFromApi,
  createOrderInApi,
  updateOrderStatusInApi,
  updateOrderInApi,
} from "@/data/orders";
import { CartPlant } from "@/contexts/CartContext";

export interface OrderItem {
  plant: CartPlant;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
  paymentMethod: "Chuyển khoản" | "COD";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  date: string;
  note?: string;
  transferProof?: string; // Base64 image of payment proof
}

interface AdminContextType {
  products: Plant[];
  orders: Order[];
  isLoading: boolean;
  fetchError: string | null;
  addProduct: (product: Omit<Plant, "id">) => void;
  updateProduct: (id: number, product: Partial<Plant>) => void;
  deleteProduct: (id: number) => void;
  addOrder: (order: Omit<Order, "date">) => void;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  updatePaymentStatus: (id: number, status: Order["paymentStatus"]) => void;
  deleteOrder: (id: number) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper: lấy CartPlant từ Plant (shop chính Greenie, không có sellerId)
const toCartPlant = (p: Plant): OrderItem["plant"] => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.image,
});

const initialOrders: Order[] = [];

// Admin credentials (mock)
const ADMIN_EMAIL = "caycanhgreenie@gmail.com";
const ADMIN_PASSWORD = "admin123";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Plant[]>(() => {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      try {
        return JSON.parse(saved) as Plant[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("admin_orders");
    if (saved) {
      try {
        return JSON.parse(saved) as Order[];
      } catch {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("admin_logged_in") === "true";
  });

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const fetched = await fetchPlantsFromApi();
        setProducts(fetched);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setFetchError(message);
        console.error("AdminContext fetch products error:", message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersFromApi = await fetchOrdersFromApi();
        setOrders(
          ordersFromApi.map((o) => ({
            id: Number(o.id),
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            customerAddress: o.customerAddress,
            items: o.items.map((item) => ({
              plant: {
                id: item.plantId,
                name: item.plantName,
                price: item.price,
                image: "",
              } as any,
              quantity: item.quantity,
            })),
            total: o.total,
            status: o.status,
            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            date: o.date,
            note: o.note,
            transferProof: o.transferProof,
          }))
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("AdminContext fetch orders error:", message);
      }
    };

    loadOrders();
  }, []);

  // Listen for storage changes (for syncing with user cancellations)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("admin_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("admin_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("admin_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("admin_logged_in", String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const addProduct = (product: Omit<Plant, "id">) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts((prev) => [...prev, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updates: Partial<Plant>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (order: Omit<Order, "date">) => {
    const nextId =
      typeof order.id === "number"
        ? order.id
        : orders.length > 0
        ? Math.max(...orders.map((o) => o.id)) + 1
        : 1;

    const newOrder: Order = {
      ...order,
      id: nextId,
      date: new Date().toISOString().split("T")[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Cập nhật thống kê sản phẩm: tăng số lượng đã bán và giảm tồn kho
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const matchedItem = newOrder.items.find((item) => item.plant.id === p.id);
        if (!matchedItem) return p;

        const newSold = (p.sold || 0) + matchedItem.quantity;
        const newStock =
          typeof p.stock === "number"
            ? Math.max(0, p.stock - matchedItem.quantity)
            : p.stock;

        return { ...p, sold: newSold, stock: newStock };
      })
    );

    createOrderInApi({
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      customerAddress: newOrder.customerAddress,
      items: newOrder.items.map((item) => ({
        plantId: item.plant.id,
        plantName: item.plant.name,
        quantity: item.quantity,
        price: item.plant.price,
      })),
      total: newOrder.total,
      status: newOrder.status,
      paymentMethod: newOrder.paymentMethod,
      paymentStatus: newOrder.paymentStatus,
      note: newOrder.note,
      transferProof: newOrder.transferProof,
      date: newOrder.date,
    }).catch((error) => {
      console.warn("AdminContext: cannot push order to mockapi", error);
    });
  };

  const updateOrderStatus = (id: number, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    updateOrderStatusInApi(id.toString(), status).catch((error) => {
      console.warn("AdminContext: cannot update order status to mockapi", error);
    });
  };

  const updatePaymentStatus = (id: number, paymentStatus: Order["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
    );

    updateOrderInApi(id.toString(), { paymentStatus })
      .catch((error) => {
        console.warn("AdminContext: cannot update payment status to mockapi", error);
      });
  };

  const deleteOrder = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        isLoading,
        fetchError,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
