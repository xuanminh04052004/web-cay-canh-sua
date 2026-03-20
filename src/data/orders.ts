export interface OrderApiItem {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    plantId: number;
    plantName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
  paymentMethod: "Chuyển khoản" | "COD";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  note?: string;
  transferProof?: string;
  date: string;
}

const BASE_URL =
  import.meta.env.VITE_MOCKAPI_BASE_URL ||
  "https://69bcac962bc2a25b22ac140b.mockapi.io/api/v1";

export const MOCKAPI_ORDERS_URL = `${BASE_URL}/orders`;

export const fetchOrdersFromApi = async (): Promise<OrderApiItem[]> => {
  const response = await fetch(MOCKAPI_ORDERS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as OrderApiItem[];
};

interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    plantId: number;
    plantName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
  paymentMethod: "Chuyển khoản" | "COD";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  note?: string;
  transferProof?: string;
  date: string;
}

export const createOrderInApi = async (order: CreateOrderPayload): Promise<OrderApiItem> => {
  const response = await fetch(MOCKAPI_ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as OrderApiItem;
};

export const updateOrderStatusInApi = async (
  id: string,
  status: CreateOrderPayload["status"]
): Promise<OrderApiItem> => {
  const response = await fetch(`${MOCKAPI_ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as OrderApiItem;
};

export const updateOrderInApi = async (
  id: string,
  data: Partial<Omit<CreateOrderPayload, "id">>
): Promise<OrderApiItem> => {
  const response = await fetch(`${MOCKAPI_ORDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as OrderApiItem;
};
