import axios from "axios";

const rawPlants = [
  { id: 1, name: "Cây lưỡi hổ", price: 150000 },
  { id: 2, name: "Cây phú quý", price: 80000 },
];

const API_URL = "https://69bcac962bc2a25b22ac140b.mockapi.io/api/v1/orders";

const sampleOrders = [
  {
    customerName: "Nguyễn Văn A",
    customerPhone: "0905123456",
    customerAddress: "123 Lê Lợi, Quận 1, TP.HCM",
    items: [
      { plantId: rawPlants[0].id, plantName: rawPlants[0].name, quantity: 2, price: rawPlants[0].price },
      { plantId: rawPlants[1].id, plantName: rawPlants[1].name, quantity: 1, price: rawPlants[1].price },
    ],
    total: rawPlants[0].price * 2 + rawPlants[1].price,
    status: "Chờ xử lý",
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    note: "Giao giờ hành chính",
    date: new Date().toISOString().split("T")[0],
  },
  {
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    customerAddress: "456 Nguyễn Huệ, Quận 3, TP.HCM",
    items: [
      { plantId: rawPlants[1].id, plantName: rawPlants[1].name, quantity: 1, price: rawPlants[1].price },
    ],
    total: rawPlants[1].price,
    status: "Đang giao",
    paymentMethod: "Chuyển khoản",
    paymentStatus: "Đã thanh toán",
    note: "Không giao cuối tuần",
    date: new Date().toISOString().split("T")[0],
  },
];

const uploadAllOrders = async () => {
  console.log(`Uploading ${sampleOrders.length} orders...`);
  for (let i = 0; i < sampleOrders.length; i += 1) {
    try {
      const response = await axios.post(API_URL, sampleOrders[i], {
        headers: { "Content-Type": "application/json" },
      });
      console.log(`Success [${i + 1}/${sampleOrders.length}]: ${sampleOrders[i].customerName}, id=${response.data.id}`);
    } catch (error) {
      console.error(`Fail [${i + 1}/${sampleOrders.length}]: ${sampleOrders[i].customerName}`, error);
    }
  }
  console.log("All done.");
};

uploadAllOrders().catch((err) => {
  console.error("Upload orders script failed", err);
  process.exit(1);
});
