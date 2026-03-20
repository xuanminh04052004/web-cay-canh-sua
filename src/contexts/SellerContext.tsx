import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============= TYPES =============
export interface Seller {
  id: string;
  authUserId?: string; // Link to AuthContext user
  email: string;
  password: string;
  shopName: string;
  phone: string;
  address: string;
  warehouseAddress?: string;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
  approvedAt?: string;
  suspendedAt?: string;
  description?: string;
  logo?: string;
  banner?: string;
  businessLicense?: string;
  taxCode?: string;
}

export interface SellerProduct {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  image: string;
  gallery: string[];
  description: string;
  careLevel: 'Dễ' | 'Trung bình' | 'Khó';
  light: string;
  water: string;
  humidity: string;
  temperature: string;
  location?: string;
  benefits?: string;
  sold: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface SubOrder {
  id: string;
  orderId: string; // Parent order ID
  sellerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  note?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  productId: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface SellerVoucher {
  id: string;
  sellerId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  senderId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ChatConversation {
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface AuditLog {
  id: string;
  sellerId: string;
  action: string;
  details: string;
  performedBy: 'seller' | 'admin';
  performedByName: string;
  createdAt: string;
}

// ============= CONTEXT TYPE =============
interface SellerContextType {
  // Auth
  currentSeller: Seller | null;
  isSellerLoggedIn: boolean;
  loginSeller: (email: string, password: string) => { success: boolean; error?: string };
  loginSellerByUserId: (userId: string) => { success: boolean; error?: string };
  registerSeller: (data: Omit<Seller, 'id' | 'status' | 'createdAt'>) => { success: boolean; error?: string };
  createSellerFromAuth: (userId: string, shopName: string, email: string, phone: string) => { success: boolean; sellerId?: string };
  logoutSeller: () => void;
  updateSellerProfile: (updates: Partial<Seller>) => void;

  // Products
  sellerProducts: SellerProduct[];
  addProduct: (product: Omit<SellerProduct, 'id' | 'sellerId' | 'sold' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  sellerOrders: SubOrder[];
  addSubOrder: (order: Omit<SubOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: SubOrder['status'], trackingNumber?: string) => void;

  // Reviews
  sellerReviews: SellerReview[];
  replyToReview: (reviewId: string, reply: string) => void;

  // Vouchers
  sellerVouchers: SellerVoucher[];
  addVoucher: (voucher: Omit<SellerVoucher, 'id' | 'sellerId' | 'usedCount' | 'createdAt'>) => void;
  updateVoucher: (id: string, updates: Partial<SellerVoucher>) => void;
  deleteVoucher: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  chatConversations: ChatConversation[];
  sendMessage: (customerId: string, customerName: string, message: string) => void;
  markMessagesAsRead: (customerId: string) => void;

  // Stats
  getSellerStats: () => {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalProducts: number;
    averageRating: number;
  };

  // Admin functions
  allSellers: Seller[];
  allSellerProducts: SellerProduct[];
  allSubOrders: SubOrder[];
  auditLogs: AuditLog[];
  approveSeller: (sellerId: string) => void;
  suspendSeller: (sellerId: string, reason: string) => void;
  unsuspendSeller: (sellerId: string) => void;
  getSellerById: (sellerId: string) => Seller | undefined;
  getProductsBySeller: (sellerId: string) => SellerProduct[];
  getOrdersBySeller: (sellerId: string) => SubOrder[];
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

// ============= INITIAL DATA =============
const createInitialProducts = (sellers: Seller[]): SellerProduct[] => {
  const defaultProducts: SellerProduct[] = [
    // === seller_1: Nhà Vườn Minh Phát (cây trong nhà, phong thủy) ===
    {
      id: 'sp_1', sellerId: 'seller_1', name: 'Cây lưỡi hổ cao cấp', category: 'Trong nhà',
      price: 180000, originalPrice: 220000, discount: 18, stock: 25,
      image: '/placeholder.svg', gallery: [], description: 'Cây lưỡi hổ size lớn, thanh lọc không khí hiệu quả. Chậu sứ trắng kèm đĩa hứng.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 2-3 tuần/lần', humidity: '30-50%', temperature: '15-30°C',
      sold: 45, rating: 4.8, reviews: 12, status: 'active', createdAt: '2024-07-01', updatedAt: '2024-07-01',
    },
    {
      id: 'sp_2', sellerId: 'seller_1', name: 'Cây kim tiền phong thủy', category: 'Trong nhà',
      price: 150000, originalPrice: 180000, discount: 17, stock: 30,
      image: '/placeholder.svg', gallery: [], description: 'Cây kim tiền mang lại tài lộc, may mắn. Kèm chậu đất nung thủ công.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 2-3 tuần/lần', humidity: '30-50%', temperature: '15-28°C',
      sold: 78, rating: 4.9, reviews: 25, status: 'active', createdAt: '2024-07-05', updatedAt: '2024-07-05',
    },
    {
      id: 'sp_3', sellerId: 'seller_1', name: 'Cây vạn lộc để bàn', category: 'Trong nhà',
      price: 95000, originalPrice: 120000, discount: 21, stock: 40,
      image: '/placeholder.svg', gallery: [], description: 'Cây vạn lộc mini để bàn làm việc, mang lại vận may và thanh lọc không khí.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '18-28°C',
      sold: 62, rating: 4.7, reviews: 18, status: 'active', createdAt: '2024-08-01', updatedAt: '2024-08-01',
    },

    // === seller_2: Vườn Cây Hạnh Nhi (cây ăn quả mini, sen đá, bonsai) ===
    {
      id: 'sp_4', sellerId: 'seller_2', name: 'Cây cam Nhật Kumquat bonsai', category: 'Ngoài trời',
      price: 950000, originalPrice: 1200000, discount: 21, stock: 10,
      image: '/placeholder.svg', gallery: [], description: 'Cây cam Nhật dáng bonsai, quả sai trĩu, đã uốn tạo dáng 2 năm.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '20-32°C',
      sold: 15, rating: 4.7, reviews: 8, status: 'active', createdAt: '2024-08-10', updatedAt: '2024-08-10',
    },
    {
      id: 'sp_5', sellerId: 'seller_2', name: 'Cây sơ ri trĩu quả', category: 'Ngoài trời',
      price: 520000, originalPrice: 650000, discount: 20, stock: 8,
      image: '/placeholder.svg', gallery: [], description: 'Cây sơ ri đang ra quả, trồng tại vườn Ghềnh Ráng. Quả ngọt, giàu vitamin C.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '22-35°C',
      sold: 22, rating: 4.6, reviews: 10, status: 'active', createdAt: '2024-08-15', updatedAt: '2024-08-15',
    },
    {
      id: 'sp_6', sellerId: 'seller_2', name: 'Cây cóc Thái giống', category: 'Ngoài trời',
      price: 120000, originalPrice: 150000, discount: 20, stock: 15,
      image: '/placeholder.svg', gallery: [], description: 'Cây cóc Thái giống ghép, cho quả to, giòn, ngọt. Ươm tại vườn Hạnh Nhi.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '22-35°C',
      sold: 35, rating: 4.5, reviews: 14, status: 'active', createdAt: '2024-09-01', updatedAt: '2024-09-01',
    },

    // === seller_3: Cây Xanh Bảo Quy Nhơn (cây văn phòng, cây công trình) ===
    {
      id: 'sp_7', sellerId: 'seller_3', name: 'Cây trầu bà Đế Vương Xanh', category: 'Trong nhà',
      price: 120000, originalPrice: 150000, discount: 20, stock: 50,
      image: '/placeholder.svg', gallery: [], description: 'Trầu bà Đế Vương size văn phòng, chậu composite trắng. Giao sỉ từ 10 cây.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '50-70%', temperature: '18-30°C',
      sold: 120, rating: 4.8, reviews: 35, status: 'active', createdAt: '2024-09-05', updatedAt: '2024-09-05',
    },
    {
      id: 'sp_8', sellerId: 'seller_3', name: 'Cây bình an văn phòng', category: 'Trong nhà',
      price: 140000, originalPrice: 170000, discount: 18, stock: 35,
      image: '/placeholder.svg', gallery: [], description: 'Cây bình an size trung, thích hợp đặt quầy lễ tân, phòng họp. Kèm chậu sứ.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '18-28°C',
      sold: 88, rating: 4.7, reviews: 22, status: 'active', createdAt: '2024-09-10', updatedAt: '2024-09-10',
    },
    {
      id: 'sp_9', sellerId: 'seller_3', name: 'Cây bông giấy leo giàn', category: 'Ngoài trời',
      price: 200000, originalPrice: 250000, discount: 20, stock: 20,
      image: '/placeholder.svg', gallery: [], description: 'Bông giấy đã huấn luyện leo giàn, hoa đỏ rực rỡ. Thích hợp thi công tiểu cảnh.',
      careLevel: 'Dễ', light: 'Nhiều ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '20-35°C',
      sold: 45, rating: 4.9, reviews: 15, status: 'active', createdAt: '2024-10-01', updatedAt: '2024-10-01',
    },

    // === seller_4: Hương Garden - Nhà Vườn Gia Lai (lan rừng, cây bản địa) ===
    {
      id: 'sp_10', sellerId: 'seller_4', name: 'Cây nho thân gỗ Gia Lai', category: 'Ngoài trời',
      price: 650000, originalPrice: 800000, discount: 19, stock: 5,
      image: '/placeholder.svg', gallery: [], description: 'Nho thân gỗ trồng tại đất đỏ bazan Gia Lai, cây khỏe, đã ra quả lứa đầu.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '20-35°C',
      sold: 18, rating: 4.6, reviews: 7, status: 'active', createdAt: '2024-10-05', updatedAt: '2024-10-05',
    },
    {
      id: 'sp_11', sellerId: 'seller_4', name: 'Cây Vú sữa Lò Rèn', category: 'Ngoài trời',
      price: 180000, originalPrice: 220000, discount: 18, stock: 12,
      image: '/placeholder.svg', gallery: [], description: 'Giống vú sữa Lò Rèn chính gốc, quả to ngọt. Cây giống 1 năm tuổi, cao 60-80cm.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '22-35°C',
      sold: 28, rating: 4.7, reviews: 11, status: 'active', createdAt: '2024-10-10', updatedAt: '2024-10-10',
    },
    {
      id: 'sp_12', sellerId: 'seller_4', name: 'Cây Chanh Vàng Mỹ giống', category: 'Ngoài trời',
      price: 170000, originalPrice: 200000, discount: 15, stock: 18,
      image: '/placeholder.svg', gallery: [], description: 'Chanh Vàng Mỹ giống ghép, cho quả to, nhiều nước. Ươm tại vườn An Phú, Pleiku.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '20-32°C',
      sold: 32, rating: 4.5, reviews: 9, status: 'active', createdAt: '2024-11-01', updatedAt: '2024-11-01',
    },

    // === seller_5: Thanh's Green Corner (cây mini, terrarium) ===
    {
      id: 'sp_13', sellerId: 'seller_5', name: 'Cây phú quý mini để bàn', category: 'Trong nhà',
      price: 65000, originalPrice: 85000, discount: 24, stock: 60,
      image: '/placeholder.svg', gallery: [], description: 'Cây phú quý mini size 15cm, kèm chậu gốm Nhật xinh xắn. Quà tặng lý tưởng.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '18-28°C',
      sold: 95, rating: 4.9, reviews: 30, status: 'active', createdAt: '2024-11-05', updatedAt: '2024-11-05',
    },
    {
      id: 'sp_14', sellerId: 'seller_5', name: 'Cây trầu bà Thanh Xuân treo', category: 'Trong nhà',
      price: 230000, originalPrice: 280000, discount: 18, stock: 15,
      image: '/placeholder.svg', gallery: [], description: 'Trầu bà Thanh Xuân treo macramé thủ công. Set gồm cây + chậu + dây treo.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '50-70%', temperature: '18-28°C',
      sold: 40, rating: 4.8, reviews: 16, status: 'active', createdAt: '2024-11-10', updatedAt: '2024-11-10',
    },
    {
      id: 'sp_15', sellerId: 'seller_5', name: 'Cây tuyết sơn phi hồng chậu mini', category: 'Ngoài trời',
      price: 85000, originalPrice: 110000, discount: 23, stock: 35,
      image: '/placeholder.svg', gallery: [], description: 'Tuyết sơn phi hồng mini trong chậu terrarium kính. Độc đáo, lạ mắt.',
      careLevel: 'Dễ', light: 'Nhiều ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '20-35°C',
      sold: 55, rating: 4.6, reviews: 20, status: 'active', createdAt: '2024-12-01', updatedAt: '2024-12-01',
    },

    // === seller_6: Vườn Cây Hoàng Long (cây công trình, cây bóng mát) ===
    {
      id: 'sp_16', sellerId: 'seller_6', name: 'Cây hoa lài Gia Lai', category: 'Ngoài trời',
      price: 60000, originalPrice: 80000, discount: 25, stock: 100,
      image: '/placeholder.svg', gallery: [], description: 'Hoa lài trồng đất đỏ bazan, hoa thơm nồng nàn hơn. Bán sỉ từ 20 cây.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới vừa, 3-4 ngày/lần', humidity: '50-70%', temperature: '20-32°C',
      sold: 200, rating: 4.8, reviews: 40, status: 'active', createdAt: '2024-12-05', updatedAt: '2024-12-05',
    },
    {
      id: 'sp_17', sellerId: 'seller_6', name: 'Cây chuối mỏ két công trình', category: 'Ngoài trời',
      price: 70000, originalPrice: 90000, discount: 22, stock: 80,
      image: '/placeholder.svg', gallery: [], description: 'Chuối mỏ két size lớn cho công trình, resort, quán cà phê sân vườn. Giao tận nơi.',
      careLevel: 'Trung bình', light: 'Nhiều ánh sáng', water: 'Tưới nhiều, 2-3 ngày/lần', humidity: '60-80%', temperature: '22-35°C',
      sold: 150, rating: 4.7, reviews: 28, status: 'active', createdAt: '2024-12-10', updatedAt: '2024-12-10',
    },
    {
      id: 'sp_18', sellerId: 'seller_6', name: 'Cây phú quý đại size 1m2', category: 'Trong nhà',
      price: 350000, originalPrice: 450000, discount: 22, stock: 10,
      image: '/placeholder.svg', gallery: [], description: 'Phú quý đại size 1m2 trồng chậu composite. Thích hợp sảnh khách sạn, nhà hàng.',
      careLevel: 'Dễ', light: 'Ít ánh sáng', water: 'Tưới ít, 1-2 tuần/lần', humidity: '40-60%', temperature: '18-28°C',
      sold: 25, rating: 4.9, reviews: 8, status: 'active', createdAt: '2025-01-05', updatedAt: '2025-01-05',
    },
  ];

  return defaultProducts;
};

const createInitialSellers = (): Seller[] => [
  {
    id: 'seller_1',
    email: 'nguyenvanminh.garden@gmail.com',
    password: 'seller123',
    shopName: 'Nhà Vườn Minh Phát',
    phone: '0905 123 456',
    address: 'Thôn Phú Hòa, xã Nhơn Phú, TP. Quy Nhơn, Bình Định',
    warehouseAddress: 'Khu vườn 2000m² tại thôn Phú Hòa, xã Nhơn Phú – cách ngã tư Ông Thọ khoảng 500m về hướng núi',
    status: 'approved',
    createdAt: '2024-06-15',
    approvedAt: '2024-06-17',
    description: 'Nhà vườn chuyên cây cảnh trong nhà & cây phong thủy. Hơn 8 năm kinh nghiệm trồng và chăm sóc cây xanh tại Quy Nhơn. Giao hàng tận nơi trong nội thành.',
    logo: '',
    banner: '',
    taxCode: '4101234567',
  },
  {
    id: 'seller_2',
    email: 'lethihanhnhi99@gmail.com',
    password: 'seller123',
    shopName: 'Vườn Cây Hạnh Nhi',
    phone: '0917 654 321',
    address: 'Tổ 5, KV 7, phường Ghềnh Ráng, TP. Quy Nhơn, Bình Định',
    warehouseAddress: 'Vườn ươm 1500m² cuối đường Hàn Mặc Tử, gần khu du lịch Ghềnh Ráng – phía sau tiệm tạp hóa Bà Sáu',
    status: 'approved',
    createdAt: '2024-07-20',
    approvedAt: '2024-07-22',
    description: 'Chuyên cây ăn quả mini, cây bonsai và sen đá. Tất cả cây được ươm trực tiếp tại vườn, đảm bảo khỏe mạnh và thích nghi tốt với khí hậu miền Trung.',
    logo: '',
    banner: '',
    taxCode: '4101234890',
  },
  {
    id: 'seller_3',
    email: 'tranquocbao.garden@gmail.com',
    password: 'seller123',
    shopName: 'Cây Xanh Bảo Quy Nhơn',
    phone: '0932 789 012',
    address: 'Số 45, đường Tây Sơn, phường Quang Trung, TP. Quy Nhơn, Bình Định',
    warehouseAddress: 'Kho cây tại lô B12, Khu công nghiệp Long Mỹ, xã Phước Mỹ, TP. Quy Nhơn',
    status: 'approved',
    createdAt: '2024-08-10',
    approvedAt: '2024-08-12',
    description: 'Cung cấp sỉ lẻ cây cảnh văn phòng, cây ngoại thất và cây công trình. Nhận thi công sân vườn, tiểu cảnh tại Quy Nhơn và các huyện lân cận.',
    logo: '',
    banner: '',
    businessLicense: 'GP-4101-2024-0045',
    taxCode: '4101567890',
  },
  {
    id: 'seller_4',
    email: 'phamthithuhuong.qn@gmail.com',
    password: 'seller123',
    shopName: 'Hương Garden - Nhà Vườn Gia Lai',
    phone: '0988 345 678',
    address: 'Thôn 3, xã An Phú, TP. Pleiku, Gia Lai',
    warehouseAddress: 'Vườn ươm 3000m² tại thôn 3, xã An Phú, Pleiku – đi từ ngã ba Hoa Lư rẽ phải 1.5km, cổng sắt xanh bên trái',
    status: 'approved',
    createdAt: '2024-09-01',
    approvedAt: '2024-09-03',
    description: 'Nhà vườn gia đình 3 đời tại Gia Lai. Chuyên lan rừng, cây bản địa Tây Nguyên và cây ăn quả nhiệt đới. Ship hàng toàn quốc, đóng gói cẩn thận.',
    logo: '',
    banner: '',
    taxCode: '6001234567',
  },
  {
    id: 'seller_5',
    email: 'vovanthanh.caycanh@gmail.com',
    password: 'seller123',
    shopName: 'Thanh\'s Green Corner',
    phone: '0976 012 345',
    address: 'Số 12, đường Nguyễn Thái Học, phường Lê Lợi, TP. Quy Nhơn, Bình Định',
    warehouseAddress: 'Nhà kho phía sau số 12 Nguyễn Thái Học – ngõ nhỏ bên cạnh quán cà phê Bình Minh, có biển "Thanh Green Corner"',
    status: 'approved',
    createdAt: '2024-10-05',
    approvedAt: '2024-10-07',
    description: 'Shop nhỏ chuyên cây mini để bàn, terrarium và quà tặng cây xanh. Phục vụ khách hàng trẻ, giao nhanh nội thành Quy Nhơn trong 2 giờ.',
    logo: '',
    banner: '',
  },
  {
    id: 'seller_6',
    email: 'nguyenhoanglong.gl@gmail.com',
    password: 'seller123',
    shopName: 'Vườn Cây Hoàng Long',
    phone: '0945 678 901',
    address: 'Thôn Tân Lập, xã Biển Hồ, TP. Pleiku, Gia Lai',
    warehouseAddress: 'Trang trại 5000m² ven hồ Biển Hồ, thôn Tân Lập – cách trung tâm Pleiku 7km theo hướng Bắc, đối diện rẫy cà phê nhà ông Ba Khánh',
    status: 'approved',
    createdAt: '2024-11-12',
    approvedAt: '2024-11-14',
    description: 'Trang trại cây cảnh lớn nhất khu vực Gia Lai. Chuyên cây công trình, cây bóng mát và cây ăn quả. Có đội ngũ kỹ thuật viên tư vấn chăm sóc cây miễn phí.',
    logo: '',
    banner: '',
    businessLicense: 'GP-6001-2024-0123',
    taxCode: '6001567890',
  },
  {
    id: 'seller_7',
    email: 'dothimai.florist@gmail.com',
    password: 'seller123',
    shopName: 'Mai Flower & Plant',
    phone: '0963 456 789',
    address: 'Số 78, đường Trần Hưng Đạo, phường Hải Cảng, TP. Quy Nhơn, Bình Định',
    warehouseAddress: 'Kho hàng tầng trệt chung cư Hưng Phú, 78 Trần Hưng Đạo – lối vào từ cổng phụ bên hông, gần bãi giữ xe',
    status: 'pending',
    createdAt: '2025-01-20',
    description: 'Mới mở shop kết hợp hoa tươi và cây cảnh. Chuyên bó hoa, giỏ quà và cây cảnh mini làm quà tặng dịp lễ Tết.',
  },
];

// ============= SUB-ORDERS =============
// Khởi tạo rỗng — đơn seller chỉ từ Checkout, lưu localStorage để thống kê admin khớp với data đơn hàng
const createInitialSubOrders = (): SubOrder[] => [];

// ============= PROVIDER =============
export const SellerProvider = ({ children }: { children: ReactNode }) => {
  // Sellers
  const [sellers, setSellers] = useState<Seller[]>(() => {
    localStorage.removeItem('sellers');
    return createInitialSellers();
  });

  const [currentSeller, setCurrentSeller] = useState<Seller | null>(() => {
    const saved = localStorage.getItem('currentSeller');
    return saved ? JSON.parse(saved) : null;
  });

  // Products
  const [products, setProducts] = useState<SellerProduct[]>(() => {
    localStorage.removeItem('sellerProducts');
    return createInitialProducts(sellers);
  });

  // SubOrders — load từ localStorage để thống kê seller khớp với data đơn hàng mỗi khi thay đổi
  const [subOrders, setSubOrders] = useState<SubOrder[]>(() => {
    const saved = localStorage.getItem('subOrders');
    return saved ? JSON.parse(saved) : createInitialSubOrders();
  });

  // Reviews
  const [reviews, setReviews] = useState<SellerReview[]>(() => {
    const saved = localStorage.getItem('sellerReviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Vouchers
  const [vouchers, setVouchers] = useState<SellerVoucher[]>(() => {
    const saved = localStorage.getItem('sellerVouchers');
    return saved ? JSON.parse(saved) : [];
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sellerChatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sellerAuditLogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('currentSeller', currentSeller ? JSON.stringify(currentSeller) : '');
  }, [currentSeller]);

  useEffect(() => {
    localStorage.setItem('sellerProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('subOrders', JSON.stringify(subOrders));
  }, [subOrders]);

  useEffect(() => {
    localStorage.setItem('sellerReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sellerVouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('sellerChatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sellerAuditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper: Add audit log
  const addAuditLog = (sellerId: string, action: string, details: string, performedBy: 'seller' | 'admin', performedByName: string) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      sellerId,
      action,
      details,
      performedBy,
      performedByName,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // ============= AUTH =============
  const loginSeller = (email: string, password: string) => {
    const seller = sellers.find(s => s.email.toLowerCase() === email.toLowerCase() && s.password === password);
    if (!seller) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
    }
    if (seller.status === 'pending') {
      return { success: false, error: 'Tài khoản đang chờ duyệt. Vui lòng liên hệ Admin.' };
    }
    if (seller.status === 'suspended') {
      return { success: false, error: 'Tài khoản đã bị khóa. Vui lòng liên hệ Admin.' };
    }
    setCurrentSeller(seller);
    addAuditLog(seller.id, 'LOGIN', 'Đăng nhập thành công', 'seller', seller.shopName);
    return { success: true };
  };

  const registerSeller = (data: Omit<Seller, 'id' | 'status' | 'createdAt'>) => {
    if (sellers.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email đã được đăng ký.' };
    }
    const newSeller: Seller = {
      ...data,
      id: `seller_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSellers(prev => [...prev, newSeller]);
    addAuditLog(newSeller.id, 'REGISTER', 'Đăng ký tài khoản seller mới', 'seller', newSeller.shopName);
    return { success: true };
  };

  // Create seller from AuthContext registration
  const createSellerFromAuth = (userId: string, shopName: string, email: string, phone: string) => {
    // Check if seller already exists with this authUserId
    if (sellers.some(s => s.authUserId === userId)) {
      return { success: false };
    }
    
    const newSeller: Seller = {
      id: `seller_${Date.now()}`,
      authUserId: userId,
      email: email.toLowerCase(),
      password: '', // No password needed - linked to auth user
      shopName,
      phone,
      address: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setSellers(prev => [...prev, newSeller]);
    setCurrentSeller(newSeller);
    addAuditLog(newSeller.id, 'REGISTER_VIA_AUTH', 'Đăng ký seller từ tài khoản người dùng', 'seller', newSeller.shopName);
    return { success: true, sellerId: newSeller.id };
  };

  // Login seller by auth user ID (for linked accounts)
  const loginSellerByUserId = (userId: string) => {
    const seller = sellers.find(s => s.authUserId === userId);
    if (!seller) {
      return { success: false, error: 'Không tìm thấy tài khoản seller.' };
    }
    if (seller.status === 'pending') {
      // Still allow login but with limited access
      setCurrentSeller(seller);
      return { success: true };
    }
    if (seller.status === 'suspended') {
      return { success: false, error: 'Tài khoản đã bị khóa. Vui lòng liên hệ Admin.' };
    }
    setCurrentSeller(seller);
    addAuditLog(seller.id, 'LOGIN', 'Đăng nhập thành công', 'seller', seller.shopName);
    return { success: true };
  };

  const logoutSeller = () => {
    if (currentSeller) {
      addAuditLog(currentSeller.id, 'LOGOUT', 'Đăng xuất', 'seller', currentSeller.shopName);
    }
    setCurrentSeller(null);
    localStorage.removeItem('currentSeller');
  };

  const updateSellerProfile = (updates: Partial<Seller>) => {
    if (!currentSeller) return;
    const updated = { ...currentSeller, ...updates };
    setCurrentSeller(updated);
    setSellers(prev => prev.map(s => s.id === currentSeller.id ? updated : s));
    addAuditLog(currentSeller.id, 'UPDATE_PROFILE', 'Cập nhật thông tin shop', 'seller', currentSeller.shopName);
  };

  // ============= PRODUCTS =============
  const addProduct = (product: Omit<SellerProduct, 'id' | 'sellerId' | 'sold' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'>) => {
    if (!currentSeller) return;
    const newProduct: SellerProduct = {
      ...product,
      id: `sp_${Date.now()}`,
      sellerId: currentSeller.id,
      sold: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    addAuditLog(currentSeller.id, 'ADD_PRODUCT', `Thêm sản phẩm: ${product.name}`, 'seller', currentSeller.shopName);
  };

  const updateProduct = (id: string, updates: Partial<SellerProduct>) => {
    if (!currentSeller) return;
    setProducts(prev => prev.map(p => {
      if (p.id === id && p.sellerId === currentSeller.id) {
        return { ...p, ...updates, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    addAuditLog(currentSeller.id, 'UPDATE_PRODUCT', `Cập nhật sản phẩm ID: ${id}`, 'seller', currentSeller.shopName);
  };

  const deleteProduct = (id: string) => {
    if (!currentSeller) return;
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => !(p.id === id && p.sellerId === currentSeller.id)));
    addAuditLog(currentSeller.id, 'DELETE_PRODUCT', `Xóa sản phẩm: ${product?.name || id}`, 'seller', currentSeller.shopName);
  };

  // ============= ORDERS =============
  const addSubOrder = (order: Omit<SubOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newOrder: SubOrder = {
      ...order,
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setSubOrders(prev => [newOrder, ...prev]);

    // Cập nhật thống kê sản phẩm của seller: tăng số lượng đã bán và giảm tồn kho
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const matchedItem = newOrder.items.find(item => item.productId === p.id);
        if (!matchedItem) return p;

        const newSold = (p.sold || 0) + matchedItem.quantity;
        const newStock =
          typeof p.stock === "number"
            ? Math.max(0, p.stock - matchedItem.quantity)
            : p.stock;

        return { ...p, sold: newSold, stock: newStock };
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: SubOrder['status'], trackingNumber?: string) => {
    if (!currentSeller) return;
    setSubOrders(prev => prev.map(o => {
      if (o.id === orderId && o.sellerId === currentSeller.id) {
        return { ...o, status, trackingNumber: trackingNumber || o.trackingNumber, updatedAt: new Date().toISOString() };
      }
      return o;
    }));
    addAuditLog(currentSeller.id, 'UPDATE_ORDER', `Cập nhật đơn hàng ${orderId}: ${status}`, 'seller', currentSeller.shopName);
  };

  // ============= REVIEWS =============
  const replyToReview = (reviewId: string, reply: string) => {
    if (!currentSeller) return;
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId && r.sellerId === currentSeller.id) {
        return { ...r, reply, repliedAt: new Date().toISOString() };
      }
      return r;
    }));
  };

  // ============= VOUCHERS =============
  const addVoucher = (voucher: Omit<SellerVoucher, 'id' | 'sellerId' | 'usedCount' | 'createdAt'>) => {
    if (!currentSeller) return;
    const newVoucher: SellerVoucher = {
      ...voucher,
      id: `voucher_${Date.now()}`,
      sellerId: currentSeller.id,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVouchers(prev => [...prev, newVoucher]);
    addAuditLog(currentSeller.id, 'ADD_VOUCHER', `Tạo mã giảm giá: ${voucher.code}`, 'seller', currentSeller.shopName);
  };

  const updateVoucher = (id: string, updates: Partial<SellerVoucher>) => {
    if (!currentSeller) return;
    setVouchers(prev => prev.map(v => v.id === id && v.sellerId === currentSeller.id ? { ...v, ...updates } : v));
  };

  const deleteVoucher = (id: string) => {
    if (!currentSeller) return;
    setVouchers(prev => prev.filter(v => !(v.id === id && v.sellerId === currentSeller.id)));
  };

  // ============= CHAT =============
  const sendMessage = (customerId: string, customerName: string, message: string) => {
    if (!currentSeller) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sellerId: currentSeller.id,
      customerId,
      customerName,
      senderId: currentSeller.id,
      message,
      createdAt: new Date().toISOString(),
      read: true,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const markMessagesAsRead = (customerId: string) => {
    if (!currentSeller) return;
    setChatMessages(prev => prev.map(m => {
      if (m.customerId === customerId && m.sellerId === currentSeller.id && m.senderId !== currentSeller.id) {
        return { ...m, read: true };
      }
      return m;
    }));
  };

  // Chat conversations computed
  const chatConversations: ChatConversation[] = currentSeller
    ? Array.from(new Set(chatMessages.filter(m => m.sellerId === currentSeller.id).map(m => m.customerId)))
        .map(customerId => {
          const msgs = chatMessages.filter(m => m.sellerId === currentSeller.id && m.customerId === customerId);
          const lastMsg = msgs[msgs.length - 1];
          return {
            customerId,
            customerName: lastMsg?.customerName || 'Khách hàng',
            lastMessage: lastMsg?.message || '',
            lastMessageAt: lastMsg?.createdAt || '',
            unreadCount: msgs.filter(m => !m.read && m.senderId !== currentSeller.id).length,
          };
        })
        .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    : [];

  // ============= STATS =============
  const getSellerStats = () => {
    if (!currentSeller) {
      return { totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalProducts: 0, averageRating: 0 };
    }
    const myOrders = subOrders.filter(o => o.sellerId === currentSeller.id);
    const myProducts = products.filter(p => p.sellerId === currentSeller.id);
    const myReviews = reviews.filter(r => r.sellerId === currentSeller.id);
    
    return {
      totalRevenue: myOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
      totalOrders: myOrders.length,
      pendingOrders: myOrders.filter(o => o.status === 'pending').length,
      completedOrders: myOrders.filter(o => o.status === 'delivered').length,
      totalProducts: myProducts.length,
      averageRating: myReviews.length > 0 ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length : 0,
    };
  };

  // ============= ADMIN FUNCTIONS =============
  const approveSeller = (sellerId: string) => {
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId) {
        return { ...s, status: 'approved' as const, approvedAt: new Date().toISOString() };
      }
      return s;
    }));
    const seller = sellers.find(s => s.id === sellerId);
    addAuditLog(sellerId, 'APPROVE_SELLER', 'Admin duyệt seller', 'admin', 'Admin');
  };

  const suspendSeller = (sellerId: string, reason: string) => {
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId) {
        return { ...s, status: 'suspended' as const, suspendedAt: new Date().toISOString() };
      }
      return s;
    }));
    addAuditLog(sellerId, 'SUSPEND_SELLER', `Admin khóa seller: ${reason}`, 'admin', 'Admin');
  };

  const unsuspendSeller = (sellerId: string) => {
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId && s.status === 'suspended') {
        return { ...s, status: 'approved' as const, suspendedAt: undefined };
      }
      return s;
    }));
    addAuditLog(sellerId, 'UNSUSPEND_SELLER', 'Admin mở khóa seller', 'admin', 'Admin');
  };

  const getSellerById = (sellerId: string) => sellers.find(s => s.id === sellerId);
  const getProductsBySeller = (sellerId: string) => products.filter(p => p.sellerId === sellerId);
  const getOrdersBySeller = (sellerId: string) => subOrders.filter(o => o.sellerId === sellerId);

  // Current seller's filtered data
  const sellerProducts = currentSeller ? products.filter(p => p.sellerId === currentSeller.id) : [];
  const sellerOrders = currentSeller ? subOrders.filter(o => o.sellerId === currentSeller.id) : [];
  const sellerReviews = currentSeller ? reviews.filter(r => r.sellerId === currentSeller.id) : [];
  const sellerVouchers = currentSeller ? vouchers.filter(v => v.sellerId === currentSeller.id) : [];

  return (
    <SellerContext.Provider value={{
      // Auth
      currentSeller,
      isSellerLoggedIn: !!currentSeller,
      loginSeller,
      loginSellerByUserId,
      registerSeller,
      createSellerFromAuth,
      logoutSeller,
      updateSellerProfile,
      // Products
      sellerProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      // Orders
      sellerOrders,
      addSubOrder,
      updateOrderStatus,
      // Reviews
      sellerReviews,
      replyToReview,
      // Vouchers
      sellerVouchers,
      addVoucher,
      updateVoucher,
      deleteVoucher,
      // Chat
      chatMessages: currentSeller ? chatMessages.filter(m => m.sellerId === currentSeller.id) : [],
      chatConversations,
      sendMessage,
      markMessagesAsRead,
      // Stats
      getSellerStats,
      // Admin
      allSellers: sellers,
      allSellerProducts: products,
      allSubOrders: subOrders,
      auditLogs,
      approveSeller,
      suspendSeller,
      unsuspendSeller,
      getSellerById,
      getProductsBySeller,
      getOrdersBySeller,
    }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};
