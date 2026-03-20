import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  note?: string;
  cancelReason?: string;
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: 'male' | 'female' | 'other' | '';
  avatar: string;
}

interface UserContextType {
  profile: UserProfile;
  addresses: Address[];
  orders: Order[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
  addOrder: (order: Omit<Order, 'id' | 'timeline'> & { id?: string }) => void;
  cancelOrder: (orderId: string, reason: string) => boolean;
  refreshOrders: () => void;
}

const defaultAddresses: Address[] = [];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      email: '',
      phone: '',
      birthday: '',
      gender: '' as const,
      avatar: '',
    };
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('userAddresses');
    return saved ? JSON.parse(saved) : defaultAddresses;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('userOrders');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with AuthContext when user logs in/registers
  useEffect(() => {
    if (authUser) {
      setProfile(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        phone: authUser.phone || prev.phone,
      }));
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(orders));
  }, [orders]);

  // Sync with Admin orders
  useEffect(() => {
    const syncOrders = () => {
      const adminOrdersRaw = localStorage.getItem('admin_orders');
      if (!adminOrdersRaw) return;

      try {
        const adminOrders = JSON.parse(adminOrdersRaw); // Type is from AdminContext
        setOrders(prevOrders => {
          let hasChanges = false;
          const newOrders = prevOrders.map(userOrder => {
            // Find matching admin order by ID
            const adminOrder = adminOrders.find((ao: any) => ao.id.toString() === userOrder.id);
            if (adminOrder) {
              // Map Admin status to User status (English keys)
              let newStatus = userOrder.status;
              if (adminOrder.status === 'Chờ xử lý') newStatus = 'pending';
              else if (adminOrder.status === 'Đang giao') newStatus = 'shipping';
              else if (adminOrder.status === 'Đã giao') newStatus = 'delivered';
              else if (adminOrder.status === 'Đã xác nhận') newStatus = 'confirmed'; // Assuming Admin has this or maps similarly
              else if (adminOrder.status === 'Đã hủy') newStatus = 'cancelled';

              if (newStatus !== userOrder.status) {
                hasChanges = true;
                // Add to timeline if changed
                return {
                  ...userOrder,
                  status: newStatus,
                  timeline: [
                    ...userOrder.timeline,
                    {
                      status: adminOrder.status,
                      date: new Date().toLocaleDateString('vi-VN'),
                      description: `Trạng thái cập nhật: ${adminOrder.status}`
                    }
                  ]
                };
              }
            }
            return userOrder;
          });
          return hasChanges ? newOrders : prevOrders;
        });
      } catch (e) {
        console.error("Error syncing admin orders", e);
      }
    };

    window.addEventListener('storage', syncOrders);
    // Poll every few seconds to simulate real-time in single browser
    const interval = setInterval(syncOrders, 2000);

    return () => {
      window.removeEventListener('storage', syncOrders);
      clearInterval(interval);
    };
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    if (newAddress.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const getDefaultAddress = () => addresses.find(a => a.isDefault);

  const addOrder = (order: Omit<Order, 'id' | 'timeline'> & { id?: string }) => {
    const newOrder: Order = {
      ...order,
      id: order.id || Date.now().toString(),
      timeline: [
        {
          status: 'Đặt hàng thành công',
          date: new Date().toLocaleDateString('vi-VN'),
          description: 'Đơn hàng đã được tiếp nhận',
        },
      ],
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    // Only allow cancellation if status is pending or confirmed (not shipping or delivered)
    if (order && (order.status === 'pending' || order.status === 'confirmed')) {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'cancelled' as const,
            cancelReason: reason,
            timeline: [
              ...o.timeline,
              {
                status: 'Đã hủy đơn hàng',
                date: new Date().toLocaleDateString('vi-VN'),
                description: `Lý do: ${reason}`,
              },
            ],
          };
        }
        return o;
      }));

      // Sync with admin orders in localStorage
      const adminOrdersRaw = localStorage.getItem('admin_orders');
      if (adminOrdersRaw) {
        try {
          const adminOrders = JSON.parse(adminOrdersRaw);
          // Find matching order by ID (could be string or number)
          const updatedAdminOrders = adminOrders.map((ao: any) => {
            if (ao.id.toString() === orderId || ao.id === parseInt(orderId)) {
              return { ...ao, status: 'Đã hủy', cancelReason: reason };
            }
            return ao;
          });
          localStorage.setItem('admin_orders', JSON.stringify(updatedAdminOrders));
          // Dispatch storage event to notify AdminContext
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error('Failed to sync admin orders:', e);
        }
      }

      return true;
    }
    return false;
  };

  const refreshOrders = () => {
    const saved = localStorage.getItem('userOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  };

  return (
    <UserContext.Provider value={{
      profile,
      addresses,
      orders,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      getDefaultAddress,
      addOrder,
      cancelOrder,
      refreshOrders,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
