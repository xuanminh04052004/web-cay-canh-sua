// Import plant images
import luoiHoImg from "@/assets/plants/luoi-ho.jpg";
import phuQuyImg from "@/assets/plants/phu-quy.jpg";
import kimTienImg from "@/assets/plants/kim-tien.jpg";
import vanLocImg from "@/assets/plants/van-loc.jpg";
import trauBaDeVuongImg from "@/assets/plants/trau-ba-de-vuong-xanh.jpg";
import binhAnImg from "@/assets/plants/cay-binh-an.jpg";
import trauBaThanhXuanImg from "@/assets/plants/cay-trau-ba-thanh-xuan.jpg";
import nhoThanGoImg from "@/assets/plants/nho-than-go.jpg";
import soRiImg from "@/assets/plants/so-ri.jpg";
import cocImg from "@/assets/plants/coc.jpg";
import camNhatImg from "@/assets/plants/cam-nhat.jpg";
import chanhVangImg from "@/assets/plants/chanh-vang.jpg";
import vuSuaImg from "@/assets/plants/vu-sua.jpg";
import bongGiayImg from "@/assets/plants/cay-bong-giay.jpg";
import hoaLaiImg from "@/assets/plants/cay-hoa-lai.jpg";
import chuoiMoKetImg from "@/assets/plants/chuoi-mo-ket.jpg";
import tuyetSonPhiHongImg from "@/assets/plants/tuyet-son-phi-hong.jpg";
import kimNganLuongImg from "@/assets/plants/kim-ngan-luong.jpg";
import cucMamXoiImg from "@/assets/plants/cuc-mam-xoi.jpg";
import tacKiengMiniImg from "@/assets/plants/cay-tac-kieng-mini.jpg";
import dungCuLamVuonImg from "@/assets/plants/dung-cu-lam-vuon.jpg";
import phanBoTribatImg from "@/assets/plants/phan-bo-tribat.jpg";
import kichReN3MImg from "@/assets/plants/kich-re-n3m.jpg";
import voLacXayImg from "@/assets/plants/vo-lac-xay.jpg";
import datAkadamaImg from "@/assets/plants/dat-akadama.jpg";
import phanTrunQueVienImg from "@/assets/plants/phan-trun-que-cao-cap.jpg";
import phanTrunQueSfarmImg from "@/assets/plants/phan-trun-que-sfarm.jpg"

export interface Plant {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  sold: number;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  description: string;
  careLevel: "Dễ" | "Trung bình" | "Khó";
  light: string;
  water: string;
  humidity: string;
  temperature: string;
  gallery: string[];
  location?: string;
  benefits?: string;
  stock?: number;
}

export const plants: Plant[] = [
  // Cây cảnh trong nhà
  {
    id: 1,
    name: "Cây lưỡi hổ",
    category: "Trong nhà",
    rating: 4.3,
    reviews: 2,
    sold: 2,
    price: 150000,
    originalPrice: 180000,
    discount: 17,
    image: luoiHoImg,
    description: "Cây lưỡi hổ thanh lọc không khí và cung cấp khí oxi khi đêm về. Là món quà tặng thích hợp trong các dịp đặc biệt như khai trương, tân gia, sinh nhật, thể hiện lời chúc may mắn, tài lộc và sức khỏe.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 2-3 tuần/lần",
    humidity: "30-50%",
    temperature: "15-30°C",
    gallery: [luoiHoImg],
    location: "Phòng ngủ (không quá gần giường), phòng khách (góc phòng, gần cửa ra vào), ban công, nhà vệ sinh",
    benefits: "Thanh lọc không khí và cung cấp khí oxi khi đêm về. Là món quà tặng thích hợp trong các dịp đặc biệt.",
    stock: 10,
  },
  {
    id: 2,
    name: "Cây phú quý",
    category: "Trong nhà",
    rating: 4.0,
    reviews: 1,
    sold: 1,
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    image: phuQuyImg,
    description: "Cây có tác dụng lọc không khí rất tốt, giảm bớt khói bụi cho môi trường sống trong lành hơn. Trồng cây Phú Quý tại bàn làm việc, cây sẽ lan tỏa nguồn năng lượng tích cực sang cho bạn.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "18-28°C",
    gallery: [phuQuyImg],
    location: "Phòng khách (gần tivi, bàn uống nước), phòng ngủ (cách xa giường)",
    benefits: "Lọc không khí, giảm bớt khói bụi. Lan tỏa nguồn năng lượng tích cực, giúp giải tỏa căng thẳng.",
    stock: 10,
  },
  {
    id: 3,
    name: "Cây kim tiền",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 100000,
    originalPrice: 120000,
    discount: 17,
    image: kimTienImg,
    description: "Cây mang đến vẻ đẹp sang trọng, tươi sáng cho không gian nhà ở và nơi làm việc. Giúp cải thiện sức khỏe của gia chủ.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 2-3 tuần/lần",
    humidity: "30-50%",
    temperature: "15-28°C",
    gallery: [kimTienImg],
    location: "Bên cửa sổ, phòng khách, hành lang, cạnh cửa ra vào, trong phòng làm việc, bàn làm việc",
    benefits: "Mang đến vẻ đẹp sang trọng, tươi sáng. Giúp cải thiện sức khỏe của gia chủ. Là món quà ý nghĩa.",
    stock: 10,
  },
  {
    id: 4,
    name: "Cây vạn lộc",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    image: vanLocImg,
    description: "Trưng bày nhà cửa, văn phòng, bàn làm việc và thường dùng làm quà tặng như lời chúc tốt đẹp cho người nhận. Thanh lọc không khí, tạo nên không gian sạch sẽ, mát mẻ.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "18-28°C",
    gallery: [vanLocImg],
    location: "Gần cửa sổ, trong nhà/văn phòng, phòng khách, phòng ngủ, bàn làm việc",
    benefits: "Trưng bày nhà cửa, văn phòng. Thanh lọc không khí, tạo không gian sạch sẽ, mát mẻ và thoáng mát.",
    stock: 10,
  },
  {
    id: 5,
    name: "Cây trầu bà Đế Vương Xanh",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 100000,
    originalPrice: 130000,
    discount: 23,
    image: trauBaDeVuongImg,
    description: "Được dùng để trang trí, tạo điểm nhấn vô cùng nổi bật cho không gian sống, không gian làm việc. Góp phần thanh lọc và cân bằng độ ẩm không khí.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "50-70%",
    temperature: "18-30°C",
    gallery: [trauBaDeVuongImg],
    location: "Cửa chính, cửa sổ, 2 bên cửa ra vào, ban công, phòng khách, phòng ngủ, bàn làm việc",
    benefits: "Trang trí, tạo điểm nhấn nổi bật. Thanh lọc và cân bằng độ ẩm không khí, loại bỏ chất độc hại.",
    stock: 10,
  },
  {
    id: 6,
    name: "Cây bình an",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 120000,
    originalPrice: 150000,
    discount: 20,
    image: binhAnImg,
    description: "Cây Bình An tượng trưng cho sự hanh thông, tài lộc, giúp gia chủ cầu mong sự thịnh vượng và thành công trong công việc. Thanh lọc không khí rất tốt.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "18-28°C",
    gallery: [binhAnImg],
    location: "Phòng khách, phòng ngủ, bàn làm việc, phòng bếp, ban công, dưới tán cây lớn, gần đèn điện, cửa sổ",
    benefits: "Mang lại may mắn và tài lộc. Thanh lọc không khí, loại bỏ chất độc hại và bụi bẩn.",
    stock: 10,
  },
  {
    id: 7,
    name: "Cây trầu bà Thanh Xuân",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 200000,
    originalPrice: 250000,
    discount: 20,
    image: trauBaThanhXuanImg,
    description: "Cải thiện chất lượng không khí, mang lại bầu không khí trong lành. Tăng cường sự tập trung, hỗ trợ tinh thần tập trung, nâng cao năng suất làm việc.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "50-70%",
    temperature: "18-28°C",
    gallery: [trauBaThanhXuanImg],
    location: "Gần cửa sổ, ban công, tiền sảnh, cửa ra vào, phòng khách, phòng ngủ, bàn làm việc, văn phòng, góc nhà, sảnh lớn",
    benefits: "Cải thiện chất lượng không khí. Tăng cường sự tập trung. Mang lại may mắn và tài lộc.",
    stock: 10,
  },
  // Cây Ăn Quả
  {
    id: 8,
    name: "Cây nho thân gỗ",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 600000,
    originalPrice: 750000,
    discount: 20,
    image: nhoThanGoImg,
    description: "Quả nho thân gỗ chứa hàm lượng vitamin C cao, giúp tăng cường sức đề kháng cho cơ thể. Tăng không gian xanh với tán lá xanh mướt quanh năm.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "20-35°C",
    gallery: [nhoThanGoImg],
    location: "Vị trí đất cao, thoát nước tốt, nhiều nắng, thoáng đãng, tránh ngập úng",
    benefits: "Vitamin C cao, tăng cường sức đề kháng. Tán lá xanh mướt quanh năm, tạo không gian sống xanh mát.",
    stock: 3,
  },
  {
    id: 9,
    name: "Cây sơ ri",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 500000,
    originalPrice: 600000,
    discount: 17,
    image: soRiImg,
    description: "Cây sơ ri không chỉ được sử dụng làm cây ăn quả mang lại giá trị kinh tế cao, mà còn được dùng làm cây cảnh trồng trong sân vườn.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "22-35°C",
    gallery: [soRiImg],
    location: "Nơi có nhiều nắng, đất giàu dinh dưỡng, thoát nước tốt, sân thượng, ban công",
    benefits: "Cây ăn quả giá trị kinh tế cao. Có thể dùng làm cây cảnh, trồng bụi phối kết, tiểu cảnh.",
    stock: 3,
  },
  {
    id: 10,
    name: "Cây cóc",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 100000,
    originalPrice: 120000,
    discount: 17,
    image: cocImg,
    description: "Cung cấp trái cây giàu vitamin C và chất xơ tốt cho sức khỏe, làm đẹp cảnh quan, cải thiện không khí, mang lại ý nghĩa phong thủy tài lộc.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "22-35°C",
    gallery: [cocImg],
    location: "Góc sân, sảnh lớn hoặc gần cửa ra vào có nhiều ánh sáng",
    benefits: "Trái cây giàu vitamin C và chất xơ. Làm đẹp cảnh quan, cải thiện không khí, phong thủy tài lộc.",
    stock: 5,
  },
  {
    id: 11,
    name: "Cây cam Nhật",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 900000,
    originalPrice: 1100000,
    discount: 18,
    image: camNhatImg,
    description: "Cây mang sắc cam tươi sáng, tượng trưng cho tài lộc và hạnh phúc viên mãn. Mùi hương dịu nhẹ của cam giúp thư giãn tinh thần, giảm căng thẳng.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "20-32°C",
    gallery: [camNhatImg],
    location: "Nơi ấm áp, nhiều ánh sáng nhưng không bị nắng gắt trực tiếp",
    benefits: "Tượng trưng cho tài lộc và hạnh phúc. Mùi hương giúp thư giãn. Quả bổ sung vitamin C.",
    stock: 2,
  },
  {
    id: 12,
    name: "Cây Chanh Vàng Mỹ",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 150000,
    originalPrice: 180000,
    discount: 17,
    image: chanhVangImg,
    description: "Quả Chanh Vàng Mỹ có khả năng giúp phá vỡ mỡ và cải thiện chức năng tiêu hóa. Cây còn mang ý nghĩa phong thủy về tài lộc, may mắn và sức khỏe.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "20-32°C",
    gallery: [chanhVangImg],
    location: "Sân vườn nơi nhiều nắng (ít nhất 6-8 tiếng/ngày), thoáng đãng, đất giàu dinh dưỡng",
    benefits: "Giúp phá vỡ mỡ và cải thiện tiêu hóa. Mang ý nghĩa phong thủy về tài lộc, may mắn và sức khỏe.",
    stock: 5,
  },
  {
    id: 13,
    name: "Cây Vú sữa",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 150000,
    originalPrice: 180000,
    discount: 17,
    image: vuSuaImg,
    description: "Vừa cho thu hoạch quả vừa tạo cảnh quan, là cây che bóng mát. Cung cấp oxy, hút chất độc, bụi bặm và làm cho bầu không khí trong lành, mát mẻ.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "22-35°C",
    gallery: [vuSuaImg],
    location: "Sân vườn rộng rãi, thoáng đãng, tránh nơi có gió mạnh",
    benefits: "Thu hoạch quả và tạo cảnh quan. Cung cấp oxy, hút chất độc, bụi bặm, tạo không khí trong lành.",
    stock: 2,
  },
  // Cây Bông Hoa
  {
    id: 14,
    name: "Cây bông giấy",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 150000,
    originalPrice: 180000,
    discount: 17,
    image: bongGiayImg,
    description: "Màu sắc rực rỡ của hoa giấy làm cho không gian sống, khuôn viên nhà trở nên sinh động, tươi tắn. Chắn bụi, giảm ô nhiễm.",
    careLevel: "Dễ",
    light: "Nhiều ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "20-35°C",
    gallery: [bongGiayImg],
    location: "Những nơi nhiều nắng như ban công, cổng nhà hoặc tường rào",
    benefits: "Làm đẹp cảnh quan với màu sắc rực rỡ. Chắn bụi, giảm ô nhiễm. Mang lại bình an, may mắn.",
    stock: 5,
  },
  {
    id: 15,
    name: "Cây hoa lài",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 50000,
    originalPrice: 70000,
    discount: 29,
    image: hoaLaiImg,
    description: "Hương thơm dịu nhẹ, quyến rũ của hoa lài giúp tạo không gian thư giãn và làm tăng thêm vẻ đẹp cho ngôi nhà hoặc khu vườn.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới vừa, 3-4 ngày/lần",
    humidity: "50-70%",
    temperature: "20-32°C",
    gallery: [hoaLaiImg],
    location: "Nơi thoáng đãng, có đầy đủ ánh nắng mặt trời như ban công, sân thượng",
    benefits: "Hương thơm dịu nhẹ tạo không gian thư giãn. Thu hút tài lộc, may mắn, xua tan tà khí.",
    stock: 10,
  },
  {
    id: 16,
    name: "Cây chuối mỏ két",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 50000,
    originalPrice: 70000,
    discount: 29,
    image: chuoiMoKetImg,
    description: "Với hoa màu đỏ, cam, vàng và lá xanh tươi, chuối mỏ két là lựa chọn hoàn hảo để trang trí sân vườn, ban công, công viên.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, 2-3 ngày/lần",
    humidity: "60-80%",
    temperature: "22-35°C",
    gallery: [chuoiMoKetImg],
    location: "Sân vườn, ban công thoáng đãng, có ánh sáng đầy đủ, lối đi, cạnh cửa sổ",
    benefits: "Tạo cảnh quan rực rỡ. Thanh lọc không khí, hấp thụ bụi bẩn. Tạo bóng mát, giảm nhiệt độ xung quanh.",
    stock: 10,
  },
  {
    id: 17,
    name: "Cây tuyết sơn phi hồng",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 100000,
    originalPrice: 120000,
    discount: 17,
    image: tuyetSonPhiHongImg,
    description: "Cây tuyết sơn phi hồng hay còn gọi là cây lá bạc có màu sắc hoa lá đẹp và lạ nên được dùng trồng làm cảnh dọc lối đi, bồn bông hoặc trồng chậu.",
    careLevel: "Dễ",
    light: "Nhiều ánh sáng",
    water: "Tưới ít, 1-2 tuần/lần",
    humidity: "40-60%",
    temperature: "20-35°C",
    gallery: [tuyetSonPhiHongImg],
    location: "Nơi thoáng đãng, nhiều ánh sáng tự nhiên (sân vườn, ban công, cửa sổ)",
    benefits: "Màu sắc hoa lá đẹp và lạ. Dùng trồng làm cảnh dọc lối đi, bồn bông hoặc trồng chậu trưng trước nhà.",
    stock: 10,
  },
  {
    id: 18,
    name: "Cây kim ngân lượng",
    category: "Trong nhà",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 300000,
    originalPrice: 350000,
    discount: 14,
    image: kimNganLuongImg,
    description: "Cây kim ngân lượng là cây phong thuỷ mang ý nghĩa tài lộc, thịnh vượng. Thường được trưng bày trên bàn làm việc, quầy thu ngân hoặc trong phòng khách.",
    careLevel: "Dễ",
    light: "Ít ánh sáng",
    water: "Tưới vừa, 3-4 ngày/lần",
    humidity: "40-60%",
    temperature: "18-30°C",
    gallery: [kimNganLuongImg],
    location: "Bàn làm việc, quầy thu ngân, phòng khách, văn phòng",
    benefits: "Mang ý nghĩa phong thuỷ tài lộc, may mắn. Tạo điểm nhấn trang trí cho không gian.",
    stock: 13,
  },
  {
    id: 19,
    name: "Cúc mâm xôi",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 250000,
    originalPrice: 300000,
    discount: 17,
    image: cucMamXoiImg,
    description: "Cúc mâm xôi là loại hoa thường được dùng trang trí trong dịp Tết với hình dáng tròn đầy tượng trưng cho sự sung túc và may mắn.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới nhiều, mỗi ngày",
    humidity: "50-70%",
    temperature: "20-35°C",
    gallery: [cucMamXoiImg],
    location: "Sân vườn, ban công, trước cửa nhà, trang trí dịp Tết",
    benefits: "Trang trí Tết đẹp mắt, tượng trưng cho sự sung túc và may mắn.",
    stock: 10,
  },
  {
    id: 20,
    name: "Cây tắc kiểng mini",
    category: "Ngoài trời",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 300000,
    originalPrice: 350000,
    discount: 14,
    image: tacKiengMiniImg,
    description: "Cây tắc kiểng mini là loại cây trang trí được ưa chuộng trong dịp Tết. Những quả tắc vàng tượng trưng cho tài lộc, sung túc và may mắn cho gia đình.",
    careLevel: "Trung bình",
    light: "Nhiều ánh sáng",
    water: "Tưới vừa, 2-3 ngày/lần",
    humidity: "50-70%",
    temperature: "20-35°C",
    gallery: [tacKiengMiniImg],
    location: "Trước cửa nhà, phòng khách, ban công, sân vườn, trang trí dịp Tết",
    benefits: "Trang trí Tết đẹp mắt, mang ý nghĩa phong thủy tài lộc và may mắn.",
    stock: 17,
  },
  {
    id: 21,
    name: "Bộ dụng cụ làm vườn",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: dungCuLamVuonImg,
    description: "Bộ dụng cụ làm vườn mini gồm xẻng và cào giúp xới đất, trồng cây và chăm sóc cây cảnh dễ dàng.",
    gallery: [dungCuLamVuonImg],
    benefits: "Hỗ trợ trồng cây, thay đất và chăm sóc cây cảnh.",
    stock: 20,
  },
  {
    id: 22,
    name: "Phân bò Tribat",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: phanBoTribatImg,
    description: "Phân bò Tribat đã qua xử lý giúp bổ sung dinh dưỡng cho đất và giúp cây phát triển khỏe mạnh.",
    gallery: [phanBoTribatImg],
    benefits: "Cung cấp dinh dưỡng hữu cơ, cải tạo đất trồng.",
    stock: 30,
  },
  {
    id: 23,
    name: "Thuốc kích rễ N3M",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: kichReN3MImg,
    description: "Thuốc kích rễ N3M giúp cây ra rễ mạnh, phục hồi cây mới trồng hoặc cây suy yếu.",
    gallery: [kichReN3MImg],
    benefits: "Giúp cây phát triển bộ rễ nhanh và khỏe.",
    stock: 25,
  },
  {
    id: 24,
    name: "Vỏ lạc xay trộn đất",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: voLacXayImg,
    description: "Vỏ lạc xay dùng trộn đất giúp đất tơi xốp, giữ ẩm và tăng độ thoáng khí cho rễ cây.",
    gallery: [voLacXayImg],
    benefits: "Giúp đất tơi xốp và giữ ẩm tốt hơn.",
    stock: 30,
  },
  {
    id: 25,
    name: "Đất Akadama Nhật Bản",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: datAkadamaImg,
    description: "Đất Akadama nhập khẩu từ Nhật Bản, chuyên dùng cho bonsai và cây cảnh cao cấp.",
    gallery: [datAkadamaImg],
    benefits: "Giúp thoát nước tốt và giữ dinh dưỡng cho cây.",
    stock: 15,
  },
  {
    id: 26,
    name: "Phân trùn quế cao cấp dạng viên",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: phanTrunQueVienImg,
    description: "Phân trùn quế cao cấp dạng viên nén giúp cung cấp dinh dưỡng hữu cơ cho cây trồng, giúp cây phát triển khỏe mạnh và bền vững.",
    gallery: [phanTrunQueVienImg],
    benefits: "Cung cấp dinh dưỡng hữu cơ, cải thiện đất và giúp cây phát triển tốt.",
    stock: 20,
  },
  {
    id: 27,
    name: "Phân trùn quế SFARM dạng bột",
    category: "Phụ kiện & Phân bón",
    rating: "N/A",
    reviews: 0,
    sold: 0,
    price: 30000,
    image: phanTrunQueSfarmImg,
    description: "Phân trùn quế SFARM dạng bột là phân hữu cơ tự nhiên giàu dinh dưỡng, giúp cải tạo đất và cung cấp dưỡng chất cho cây trồng.",
    gallery: [phanTrunQueSfarmImg],
    benefits: "Cải tạo đất, bổ sung dinh dưỡng hữu cơ và giúp cây phát triển bền vững.",
    stock: 25,
  }
];

export const categories = [
  "Tất cả",
  "Trong nhà",
  "Ngoài trời",
  "Văn phòng",
  "Ban công",
  "Phòng khách",
  "Cây ăn quả",
  "Cây bông hoa",
  "Phụ kiện & Phân bón",
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export interface PlantApiItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  sold?: number;
  stock?: number;
  image?: string;
  description?: string;
  careLevel?: Plant["careLevel"];
  light?: string;
  water?: string;
  humidity?: string;
  temperature?: string;
  gallery?: string[];
  location?: string;
  benefits?: string;
}

export const MOCKAPI_PLANTS_URL = "https://69bcac962bc2a25b22ac140b.mockapi.io/api/v1/plants";

const RAW_GITHUB_BASE = "https://raw.githubusercontent.com/Tieruz/datasetcaycanh/54d35e7c38618b5ae553a8cb66327945e087006c";

const IMAGE_MAP_BY_NAME: Record<string, string> = {
  "cây lưỡi hổ": `${RAW_GITHUB_BASE}/luoi-ho.jpg`,
  "cây phú quý": `${RAW_GITHUB_BASE}/phu-quy.jpg`,
  "cây kim tiền": `${RAW_GITHUB_BASE}/kim-tien.jpg`,
  "cây vạn lộc": `${RAW_GITHUB_BASE}/van-loc.jpg`,
  "cây trầu bà đế vương xanh": `${RAW_GITHUB_BASE}/trau-ba-de-vuong-xanh.jpg`,
  "cây bình an": `${RAW_GITHUB_BASE}/cay-binh-an.jpg`,
  "cây trầu bà thanh xuân": `${RAW_GITHUB_BASE}/cay-trau-ba-thanh-xuan.jpg`,
  "cây nho thân gỗ": `${RAW_GITHUB_BASE}/nho-than-go.jpg`,
  "cây sơ ri": `${RAW_GITHUB_BASE}/so-ri.jpg`,
  "cây cóc": `${RAW_GITHUB_BASE}/coc.jpg`,
  "cây cam nhật": `${RAW_GITHUB_BASE}/cam-nhat.jpg`,
  "cây chanh vàng mỹ": `${RAW_GITHUB_BASE}/chanh-vang.jpg`,
  "cây vú sữa": `${RAW_GITHUB_BASE}/vu-sua.jpg`,
  "cây bông giấy": `${RAW_GITHUB_BASE}/cay-bong-giay.jpg`,
  "cây hoa lài": `${RAW_GITHUB_BASE}/cay-hoa-lai.jpg`,
  "cây chuối mỏ két": `${RAW_GITHUB_BASE}/chuoi-mo-ket.jpg`,
  "cây tuyết sơn phi hồng": `${RAW_GITHUB_BASE}/tuyet-son-phi-hong.jpg`,
  "cây kim ngân lượng": `${RAW_GITHUB_BASE}/kim-ngan-luong.jpg`,
  "cây cúc mâm xôi": `${RAW_GITHUB_BASE}/cuc-mam-xoi.jpg`,
  "cúc mâm xôi": `${RAW_GITHUB_BASE}/cuc-mam-xoi.jpg`,
  "cây tắc kiểng mini": `${RAW_GITHUB_BASE}/cay-tac-kieng-mini.jpg`,
  "bộ dụng cụ làm vườn": `${RAW_GITHUB_BASE}/dung-cu-lam-vuon.jpg`,
  "dụng cụ làm vườn": `${RAW_GITHUB_BASE}/dung-cu-lam-vuon.jpg`,
  "phân bò tribat": `${RAW_GITHUB_BASE}/phan-bo-tribat.jpg`,
  "thuốc kích rễ n3m": `${RAW_GITHUB_BASE}/kich-re-n3m.jpg`,
  "kích rễ n3m": `${RAW_GITHUB_BASE}/kich-re-n3m.jpg`,
  "vỏ lạc xay": `${RAW_GITHUB_BASE}/vo-lac-xay.jpg`,
  "vỏ lạc xay trộn đất": `${RAW_GITHUB_BASE}/vo-lac-xay.jpg`,
  "đất akadama": `${RAW_GITHUB_BASE}/dat-akadama.jpg`,
  "đất akadama nhật bản": `${RAW_GITHUB_BASE}/dat-akadama.jpg`,
  "phân trùn quế cao cấp dạng viên": `${RAW_GITHUB_BASE}/phan-trun-que-cao-cap.jpg`,
  "phân trùn quế sfarm dạng bột": `${RAW_GITHUB_BASE}/phan-trun-que-sfarm.jpg`,
};

export const mapApiPlantToPlant = (apiPlant: PlantApiItem): Plant => {
  const fallbackImage = apiPlant.image || "/placeholder.svg";
  const normalizedName = apiPlant.name?.trim().toLowerCase();
  const imageFromName = normalizedName ? IMAGE_MAP_BY_NAME[normalizedName] : undefined;
  const finalImage = imageFromName || fallbackImage;

  return {
    id: Number(apiPlant.id),
    name: apiPlant.name || "",
    category: apiPlant.category || "Trong nhà",
    rating: typeof apiPlant.rating === "number" ? apiPlant.rating : 0,
    reviews: typeof apiPlant.reviews === "number" ? apiPlant.reviews : 0,
    sold: typeof apiPlant.sold === "number" ? apiPlant.sold : 0,
    price: Number(apiPlant.price ?? 0),
    originalPrice: Number(apiPlant.originalPrice ?? apiPlant.price ?? 0),
    discount: Number(apiPlant.discount ?? 0),
    image: finalImage,
    description: apiPlant.description || "",
    careLevel: apiPlant.careLevel || "Dễ",
    light: apiPlant.light || "",
    water: apiPlant.water || "",
    humidity: apiPlant.humidity || "",
    temperature: apiPlant.temperature || "",
    gallery:
      apiPlant.gallery && apiPlant.gallery.length
        ? apiPlant.gallery.map((src) => {
            const override = IMAGE_MAP_BY_NAME[apiPlant.name?.trim() ?? ""];
            return override || src;
          })
        : [finalImage],
    location: apiPlant.location || "",
    benefits: apiPlant.benefits || "",
    stock: typeof apiPlant.stock === "number" ? apiPlant.stock : 0,
  };
};

export const fetchPlantsFromApi = async (): Promise<Plant[]> => {
  const response = await fetch(MOCKAPI_PLANTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch plants: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as PlantApiItem[];
  return data.map(mapApiPlantToPlant);
};
