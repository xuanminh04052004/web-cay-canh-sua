import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Clock, Star, ChevronRight, Search, Droplets, Sun, ThermometerSun, Scissors, X, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import bgGuide from "@/assets/bg-guide.jpg";
import { searchMatch } from "@/lib/searchUtils";
import { useToast } from "@/hooks/use-toast";

const categories = ["Tất cả", "Cơ bản", "Nâng cao", "Cây trong nhà", "Cây ngoài trời", "Xử lý sâu bệnh"];

interface GuideContent {
  id: number;
  title: string;
  category: string;
  readTime: string;
  difficulty: string;
  image: string;
  excerpt: string;
  icon: React.ElementType;
  content: string;
  source: {
    name: string;
    url: string;
  };
}

const guides: GuideContent[] = [
  {
    id: 1,
    title: "Hướng dẫn tưới nước cho người mới",
    category: "Cơ bản",
    readTime: "5 phút",
    difficulty: "Dễ",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    excerpt: "Tìm hiểu cách tưới nước đúng cách cho từng loại cây cảnh phổ biến.",
    icon: Droplets,
    content: `## Nguyên tắc cơ bản khi tưới nước

**1. Kiểm tra độ ẩm đất trước khi tưới**
Dùng ngón tay cắm sâu khoảng 2-3cm vào đất. Nếu đất còn ẩm, không cần tưới thêm. Nếu đất khô, đã đến lúc tưới nước.

**2. Tưới nước đúng cách**
- Tưới chậm rãi để nước thấm đều vào đất
- Tưới cho đến khi nước chảy ra từ lỗ thoát nước ở đáy chậu
- Tránh để nước đọng trên lá quá lâu

**3. Thời điểm tưới tốt nhất**
- Buổi sáng sớm (6-8h) là thời điểm lý tưởng
- Tránh tưới giữa trưa nắng gắt
- Nếu tưới chiều, hãy tưới trước 16h để lá kịp khô trước tối

**4. Lượng nước phù hợp**
| Loại cây | Tần suất tưới |
|----------|---------------|
| Cây mọng nước | 2-3 tuần/lần |
| Cây nhiệt đới | 1-2 lần/tuần |
| Cây lá xanh | 2-3 lần/tuần |

**5. Dấu hiệu thiếu/thừa nước**
- **Thiếu nước**: Lá héo, vàng từ mép, đất nứt
- **Thừa nước**: Lá vàng từ gốc, rễ thối, có mùi hôi`,
    source: {
      name: "Vuon Cay Xanh - Kỹ thuật tưới cây",
      url: "https://vuoncayxanh.vn/ky-thuat-tuoi-cay-canh/"
    }
  },
  {
    id: 2,
    title: "Ánh sáng phù hợp cho cây trong nhà",
    category: "Cơ bản",
    readTime: "7 phút",
    difficulty: "Dễ",
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400",
    excerpt: "Cách đánh giá và bố trí ánh sáng tối ưu cho cây trồng trong nhà.",
    icon: Sun,
    content: `## Hiểu về nhu cầu ánh sáng của cây

**1. Các mức độ ánh sáng**

- **Ánh sáng mạnh trực tiếp**: Cửa sổ hướng Nam, ánh nắng chiếu trực tiếp 4-6 giờ/ngày
- **Ánh sáng gián tiếp mạnh**: Gần cửa sổ nhưng có rèm che, hoặc cửa hướng Đông/Tây
- **Ánh sáng yếu**: Cách xa cửa sổ 2-3m, góc phòng ít sáng

**2. Cây phù hợp với từng mức ánh sáng**

🌞 **Ánh sáng mạnh:**
- Sen đá, xương rồng
- Cây lưỡi hổ
- Cây cao su

🌤️ **Ánh sáng gián tiếp:**
- Monstera
- Philodendron
- Pothos

🌙 **Ánh sáng yếu:**
- Cây trầu bà
- Cây lưỡi hổ
- Cây dương xỉ

**3. Dấu hiệu cây thiếu/thừa sáng**
- **Thiếu sáng**: Cây vươn dài, lá nhỏ, màu nhạt
- **Thừa sáng**: Lá cháy nắng, vàng, héo

**4. Giải pháp bổ sung ánh sáng**
- Sử dụng đèn LED trồng cây chuyên dụng
- Xoay chậu cây định kỳ để ánh sáng đều`,
    source: {
      name: "Cây Xanh Việt - Hướng dẫn ánh sáng",
      url: "https://cayxanhviet.com.vn/anh-sang-cho-cay-canh/"
    }
  },
  {
    id: 3,
    title: "Chọn đất và chậu cây phù hợp",
    category: "Cơ bản",
    readTime: "8 phút",
    difficulty: "Trung bình",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
    excerpt: "Hướng dẫn chi tiết về cách chọn loại đất và chậu phù hợp.",
    icon: ThermometerSun,
    content: `## Hướng dẫn chọn đất và chậu

**1. Các loại đất trồng phổ biến**

🌱 **Đất trộn sẵn (Potting Mix)**
- Phù hợp: Hầu hết cây trong nhà
- Thành phần: Than bùn, perlite, vermiculite

🌵 **Đất sen đá/xương rồng**
- Phù hợp: Cây mọng nước
- Đặc điểm: Thoát nước nhanh, ít giữ ẩm

🌿 **Đất thủy canh (LECA)**
- Phù hợp: Philodendron, Pothos
- Ưu điểm: Sạch, ít côn trùng

**2. Cách chọn chậu phù hợp**

| Chất liệu | Ưu điểm | Nhược điểm |
|-----------|---------|------------|
| Đất nung | Thoáng khí, thoát nước tốt | Nặng, dễ vỡ |
| Nhựa | Nhẹ, rẻ, giữ ẩm | Kém thoáng khí |
| Gốm | Đẹp, bền | Đắt, nặng |
| Xi măng | Hiện đại, bền | Rất nặng |

**3. Kích thước chậu**
- Chậu mới nên lớn hơn chậu cũ 2-5cm đường kính
- Chậu quá lớn sẽ giữ nước lâu, gây úng rễ

**4. Tầm quan trọng của lỗ thoát nước**
- **BẮT BUỘC** phải có lỗ thoát nước
- Đặt đĩa hứng nước phía dưới
- Đổ nước dư sau 30 phút tưới`,
    source: {
      name: "Vườn Cây Việt - Chọn đất và chậu",
      url: "https://vuoncayviet.com/huong-dan-chon-dat-va-chau-trong-cay/"
    }
  },
  {
    id: 4,
    title: "Kỹ thuật cắt tỉa cây cảnh",
    category: "Nâng cao",
    readTime: "12 phút",
    difficulty: "Khó",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
    excerpt: "Hướng dẫn cắt tỉa đúng cách để cây phát triển khỏe mạnh và đẹp.",
    icon: Scissors,
    content: `## Kỹ thuật cắt tỉa chuyên nghiệp

**1. Tại sao cần cắt tỉa?**
- Kích thích cây phát triển nhánh mới
- Loại bỏ phần bệnh, chết
- Tạo dáng đẹp cho cây
- Kiểm soát kích thước

**2. Dụng cụ cần thiết**
- Kéo cắt cành sắc bén
- Dao ghép cây (cho cành lớn)
- Cồn 70% để khử trùng
- Bột quế hoặc keo liền sẹo

**3. Thời điểm cắt tỉa**
🌸 **Mùa xuân**: Thời điểm tốt nhất, cây đang phát triển mạnh
🍂 **Mùa thu**: Cắt tỉa nhẹ, chuẩn bị cho mùa đông
❄️ **Mùa đông**: Chỉ cắt phần chết/bệnh

**4. Kỹ thuật cắt đúng**

✅ **Nên làm:**
- Cắt xiên 45 độ, cách mắt lá 0.5cm
- Khử trùng dụng cụ trước và sau khi cắt
- Cắt phía trên mắt lá hướng ra ngoài

❌ **Không nên:**
- Cắt quá gần hoặc quá xa mắt lá
- Dùng kéo cùn, gây dập nát
- Cắt quá 1/3 tổng lượng lá

**5. Sau khi cắt tỉa**
- Bôi bột quế vào vết cắt (ngừa nấm)
- Đặt cây nơi thoáng mát 2-3 ngày
- Không tưới nước trực tiếp lên vết cắt`,
    source: {
      name: "Cây Cảnh Việt Nam - Kỹ thuật cắt tỉa",
      url: "https://caycanhvietnam.com/ky-thuat-cat-tia-cay-canh/"
    }
  },
  {
    id: 5,
    title: "Chăm sóc Monstera từ A-Z",
    category: "Cây trong nhà",
    readTime: "15 phút",
    difficulty: "Trung bình",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    excerpt: "Hướng dẫn toàn diện về cách chăm sóc cây Monstera.",
    icon: Book,
    content: `## Hướng dẫn chăm sóc Monstera Deliciosa

**1. Giới thiệu**
Monstera Deliciosa (cây trầu bà lá xẻ) là loại cây nhiệt đới có nguồn gốc từ Trung Mỹ. Được yêu thích nhờ những chiếc lá lớn với lỗ tự nhiên độc đáo.

**2. Điều kiện ánh sáng**
- ☀️ Ánh sáng gián tiếp mạnh
- Tránh ánh nắng trực tiếp (gây cháy lá)
- Có thể chịu được ánh sáng yếu nhưng sẽ chậm lớn

**3. Tưới nước**
- Tưới khi 2-3cm đất mặt khô
- Khoảng 1-2 tuần/lần tùy mùa
- Giảm tưới vào mùa đông

**4. Độ ẩm**
- Ưa độ ẩm cao 60-80%
- Phun sương 2-3 lần/tuần
- Đặt khay đá nước bên dưới

**5. Đất trồng**
- Đất thoát nước tốt
- Công thức: 60% đất + 30% perlite + 10% than củi

**6. Bón phân**
- Phân NPK cân bằng (10-10-10)
- Bón 1 lần/tháng trong mùa sinh trưởng
- Ngừng bón vào mùa đông

**7. Cọc leo**
- Monstera là cây leo, cần cọc để phát triển
- Cọc moss pole giúp rễ khí bám tốt
- Cây sẽ cho lá lớn hơn khi có cọc

**8. Vấn đề thường gặp**
| Triệu chứng | Nguyên nhân | Giải pháp |
|-------------|-------------|-----------|
| Lá vàng | Tưới quá nhiều | Giảm tưới, kiểm tra rễ |
| Lá không xẻ | Thiếu sáng | Di chuyển gần cửa sổ |
| Đầu lá nâu | Thiếu ẩm | Tăng phun sương |`,
    source: {
      name: "Cây Xinh - Chăm sóc Monstera",
      url: "https://cayxinh.vn/cay-trau-ba-la-xe/"
    }
  },
  {
    id: 6,
    title: "Xử lý sâu bệnh thường gặp",
    category: "Xử lý sâu bệnh",
    readTime: "10 phút",
    difficulty: "Trung bình",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    excerpt: "Nhận biết và xử lý các loại sâu bệnh phổ biến trên cây cảnh.",
    icon: ThermometerSun,
    content: `## Nhận biết và xử lý sâu bệnh

**1. Các loại sâu hại phổ biến**

🕷️ **Nhện đỏ (Spider Mites)**
- Dấu hiệu: Mạng nhện mỏng dưới lá, đốm vàng
- Xử lý: Rửa lá với nước xà phòng, tăng độ ẩm

🐛 **Rệp sáp (Mealybugs)**
- Dấu hiệu: Bông trắng ở nách lá, thân
- Xử lý: Chấm cồn 70% vào rệp, cách ly cây

🪲 **Rệp vảy (Scale)**
- Dấu hiệu: Đốm nâu cứng trên thân, lá
- Xử lý: Cạo bỏ bằng tay, xịt dầu neem

🦟 **Bọ trĩ (Thrips)**
- Dấu hiệu: Vệt bạc trên lá, lá biến dạng
- Xử lý: Xịt thuốc trừ sâu sinh học

**2. Bệnh nấm thường gặp**

🍄 **Nấm rễ (Root Rot)**
- Nguyên nhân: Tưới quá nhiều, đất không thoát nước
- Dấu hiệu: Lá vàng, thân mềm, mùi hôi
- Xử lý: Cắt rễ thối, thay đất mới, giảm tưới

🍄 **Đốm lá nấm**
- Dấu hiệu: Đốm nâu/đen trên lá
- Xử lý: Cắt lá bệnh, giảm tưới, tăng thông thoáng

**3. Phòng ngừa**
✅ Kiểm tra cây mới trước khi mang về
✅ Cách ly cây mới 2 tuần
✅ Giữ lá khô, thoáng khí
✅ Không tái sử dụng đất cũ
✅ Vệ sinh dụng cụ định kỳ

**4. Thuốc tự nhiên**
- **Dầu neem**: Diệt nhiều loại sâu
- **Nước xà phòng**: Rệp, nhện đỏ
- **Bột quế**: Ngừa nấm
- **Tỏi ngâm**: Đuổi côn trùng`,
    source: {
      name: "Cây Cảnh Hà Nội - Xử lý sâu bệnh",
      url: "https://caycanhhanoi.vn/xu-ly-sau-benh-cay-canh/"
    }
  },
];


const Guide = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<GuideContent | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("greenie-guide-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("greenie-guide-bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggleBookmark = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(bId => bId !== id));
      toast({
        title: "Đã bỏ lưu",
        description: "Bài viết đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      setBookmarkedIds(prev => [...prev, id]);
      toast({
        title: "Đã lưu bài viết",
        description: "Bạn có thể xem lại trong mục 'Đã lưu'",
      });
    }
  };

  const isBookmarked = (id: number) => bookmarkedIds.includes(id);

  const filteredGuides = guides.filter((guide) => {
    const matchesCategory = activeCategory === "Tất cả" || guide.category === activeCategory;
    const matchesSearch = searchMatch(searchQuery, guide.title, guide.excerpt, guide.category);
    const matchesBookmark = !showBookmarksOnly || bookmarkedIds.includes(guide.id);
    return matchesCategory && matchesSearch && matchesBookmark;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "text-green-400 bg-green-400/20";
      case "Trung bình":
        return "text-yellow-400 bg-yellow-400/20";
      case "Khó":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-foreground mt-6 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-foreground mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
      }
      // Bold text inline
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={index} className="text-foreground/80 mb-2">
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i} className="text-foreground">{part.replace(/\*\*/g, '')}</strong>
                : part
            )}
          </p>
        );
      }
      // Lists
      if (line.startsWith('- ')) {
        return <li key={index} className="text-foreground/80 ml-4 mb-1">{line.replace('- ', '')}</li>;
      }
      // Emoji lists
      if (line.match(/^[🌱🌵🌿🌞🌤️🌙☀️🍂❄️✅❌🕷️🐛🪲🦟🍄🌸]/)) {
        return <p key={index} className="text-foreground/80 mb-2">{line}</p>;
      }
      // Table headers
      if (line.startsWith('|') && line.includes('|')) {
        if (line.includes('---')) return null;
        const cells = line.split('|').filter(c => c.trim());
        const isHeader = index > 0 && lines[index + 1]?.includes('---');
        return (
          <div key={index} className={`grid grid-cols-${cells.length} gap-2 py-2 ${isHeader ? 'border-b border-border font-semibold' : ''}`}>
            {cells.map((cell, i) => (
              <span key={i} className="text-foreground/80 text-sm">{cell.trim()}</span>
            ))}
          </div>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular paragraph
      return <p key={index} className="text-foreground/80 mb-2">{line}</p>;
    });
  };

  return (
    <PageLayout
      showHero
      heroImage={bgGuide}
      heroTitle="Hướng Dẫn Chăm Sóc"
      heroSubtitle="Kiến thức chuyên sâu giúp cây của bạn phát triển khỏe mạnh"
    >
      <div className="container mx-auto px-6 py-12">
        {/* Search & Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm hướng dẫn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-12 bg-card"
              />
            </div>
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                showBookmarksOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground/80 hover:bg-muted border border-border"
              }`}
            >
              {showBookmarksOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              Đã lưu ({bookmarkedIds.length})
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground/80 hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Guides Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, index) => (
              <motion.article
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedGuide(guide)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-card/90 text-xs rounded-full">{guide.category}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(guide.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isBookmarked(guide.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/90 text-foreground hover:bg-card"
                    }`}
                  >
                    {isBookmarked(guide.id) ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-display text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{guide.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {guide.readTime}
                    </span>
                    <button className="flex items-center gap-1 text-primary text-sm hover:underline">
                      Đọc thêm
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuide(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed inset-2 md:inset-4 lg:inset-8 xl:inset-12 bg-card rounded-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative h-48 md:h-64 flex-shrink-0">
                <img
                  src={selectedGuide.image}
                  alt={selectedGuide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">{selectedGuide.category}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(selectedGuide.difficulty)}`}>
                      {selectedGuide.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {selectedGuide.readTime}
                    </span>
                    <button
                      onClick={() => toggleBookmark(selectedGuide.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                        isBookmarked(selectedGuide.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/90 text-foreground hover:bg-card"
                      }`}
                    >
                      {isBookmarked(selectedGuide.id) ? (
                        <>
                          <BookmarkCheck className="w-3 h-3" />
                          Đã lưu
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3 h-3" />
                          Lưu
                        </>
                      )}
                    </button>
                  </div>
                  <h2 className="text-display text-2xl md:text-3xl text-foreground">{selectedGuide.title}</h2>
                </div>
              </div>

              {/* Modal Content - Wider reading area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
                  {renderContent(selectedGuide.content)}
                </div>
              </div>

              {/* Source Footer */}
              <div className="flex-shrink-0 border-t border-border p-4 md:p-6 bg-muted/30">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Nguồn tham khảo:</span>
                    {' '}
                    {selectedGuide.source.name}
                  </div>
                  <a
                    href={selectedGuide.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary text-sm hover:underline bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Xem nguồn gốc
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Guide;
