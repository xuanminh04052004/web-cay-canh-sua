import axios from "axios";

// Direct sample data to avoid TypeScript alias parsing in Node script
const rawPlants = [
  {
    name: "Cây lưỡi hổ",
    category: "Trong nhà",
    price: 150000,
    originalPrice: 180000,
    discount: 17,
    image: "https://raw.githubusercontent.com/Tieruz/datasetcaycanh/54d35e7c38618b5ae553a8cb66327945e087006c/luoi-ho.jpg",
    description:
      "Cây lưỡi hổ thanh lọc không khí và cung cấp khí oxi khi đêm về.",
    rating: 4.3,
    reviews: 2,
    sold: 2,
    stock: 10,
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 2-3 tuần/lần",
    humidity: "30-50%",
    temperature: "15-30°C",
    benefits: "Thanh lọc không khí.",
    location: "Phòng ngủ, phòng khách",
  },
  {
    name: "Cây phú quý",
    category: "Trong nhà",
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    image: "https://raw.githubusercontent.com/Tieruz/datasetcaycanh/54d35e7c38618b5ae553a8cb66327945e087006c/phu-quy.jpg",
    description: "Cây có tác dụng lọc không khí rất tốt.",
    rating: 4.0,
    reviews: 1,
    sold: 1,
    stock: 10,
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "18-28°C",
    benefits: "Lọc không khí, giảm bớt khói bụi.",
    location: "Phòng khách, phòng ngủ",
  },
];

const API_URL = "https://69bcac962bc2a25b22ac140b.mockapi.io/api/v1/plants";
const RAW_GITHUB_BASE =
  "https://raw.githubusercontent.com/Tieruz/datasetcaycanh/54d35e7c38618b5ae553a8cb66327945e087006c";

const IMAGE_MAP = {
  "Cây lưỡi hổ": `${RAW_GITHUB_BASE}/luoi-ho.jpg`,
  "Cây phú quý": `${RAW_GITHUB_BASE}/phu-quy.jpg`,
  "Cây kim tiền": `${RAW_GITHUB_BASE}/kim-tien.jpg`,
  "Cây vạn lộc": `${RAW_GITHUB_BASE}/van-loc.jpg`,
  "Cây trầu bà Đế Vương Xanh": `${RAW_GITHUB_BASE}/trau-ba-de-vuong-xanh.jpg`,
  "Cây bình an": `${RAW_GITHUB_BASE}/cay-binh-an.jpg`,
  "Cây trầu bà Thanh Xuân": `${RAW_GITHUB_BASE}/cay-trau-ba-thanh-xuan.jpg`,
  "Cây nho thân gỗ": `${RAW_GITHUB_BASE}/nho-than-go.jpg`,
  "Cây sơ ri": `${RAW_GITHUB_BASE}/so-ri.jpg`,
  "Cây cóc": `${RAW_GITHUB_BASE}/coc.jpg`,
  "Cây cam Nhật": `${RAW_GITHUB_BASE}/cam-nhat.jpg`,
  "Cây Chanh Vàng Mỹ": `${RAW_GITHUB_BASE}/chanh-vang.jpg`,
  "Cây Vú sữa": `${RAW_GITHUB_BASE}/vu-sua.jpg`,
  "Cây bông giấy": `${RAW_GITHUB_BASE}/cay-bong-giay.jpg`,
  "Cây hoa lài": `${RAW_GITHUB_BASE}/cay-hoa-lai.jpg`,
  "Cây chuối mỏ két": `${RAW_GITHUB_BASE}/chuoi-mo-ket.jpg`,
  "Cây tuyết sơn phi hồng": `${RAW_GITHUB_BASE}/tuyet-son-phi-hong.jpg`,
  "Cây kim ngân lượng": `${RAW_GITHUB_BASE}/kim-ngan-luong.jpg`,
  "Cây cúc mâm xôi": `${RAW_GITHUB_BASE}/cuc-mam-xoi.jpg`,
  "Cây tắc kiểng mini": `${RAW_GITHUB_BASE}/cay-tac-kieng-mini.jpg`,
  "Bộ dụng cụ làm vườn": `${RAW_GITHUB_BASE}/dung-cu-lam-vuon.jpg`,
  "Phân bò Tribat": `${RAW_GITHUB_BASE}/phan-bo-tribat.jpg`,
  "Kích rễ N3M": `${RAW_GITHUB_BASE}/kich-re-n3m.jpg`,
  "Vỏ lạc xay": `${RAW_GITHUB_BASE}/vo-lac-xay.jpg`,
  "Đất Akadama Nhật Bản": `${RAW_GITHUB_BASE}/dat-akadama.jpg`,
  "Phân trùn quế cao cấp dạng viên": `${RAW_GITHUB_BASE}/phan-trun-que-cao-cap.jpg`,
  "Phân trùn quế SFARM dạng bột": `${RAW_GITHUB_BASE}/phan-trun-que-sfarm.jpg`,
};

const normalize = (item) => {
  const ratingNum =
    typeof item.rating === "number" ? item.rating : Number(item.rating || 0) || 0;
  const imageUrl =
    item.image && typeof item.image === "string" && item.image.trim().length
      ? item.image
      : IMAGE_MAP[item.name] || "https://via.placeholder.com/400x300?text=Plant+Image";

  return {
    name: item.name || "Unknown",
    category: item.category || "Không xác định",
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    discount: Number(item.discount ?? 0),
    image: imageUrl,
    description: item.description || item.benefits || "",
    rating: ratingNum,
    reviews: Number(item.reviews ?? 0),
    sold: Number(item.sold ?? 0),
    stock: Number(item.stock ?? 0),
    careLevel: item.careLevel || "Dễ",
    light: item.light || "",
    water: item.water || "",
    humidity: item.humidity || "",
    temperature: item.temperature || "",
    benefits: item.benefits || "",
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadAllPlants = async () => {
  console.log(`Uploading ${rawPlants.length} plants...`);
  for (let i = 0; i < rawPlants.length; i += 1) {
    const normalized = normalize(rawPlants[i]);
    try {
      const response = await axios.post(API_URL, normalized, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(
        `[${i + 1}/${rawPlants.length}] Success: ${normalized.name}, mockapi-id=${response.data.id}`
      );
    } catch (error) {
      console.error(`[${i + 1}/${rawPlants.length}] Failed: ${normalized.name}`, error.message || error);
    }
    await delay(200);
  }
  console.log("All done.");
};

uploadAllPlants().catch((err) => {
  console.error("Upload script failed", err);
  process.exit(1);
});
