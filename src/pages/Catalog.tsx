import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ShoppingCart, Filter, Search, X, Droplets, Sun, Thermometer, Wind, Eye, SlidersHorizontal, ChevronDown, Store } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSeller } from "@/contexts/SellerContext";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import bgShop from "@/assets/bg-shop.jpg";
import { Link } from "react-router-dom";
import { categories, formatPrice, Plant } from "@/data/plants";
import { searchMatch } from "@/lib/searchUtils";
import { Badge } from "@/components/ui/badge";

const priceRanges = [
  { label: "Tất cả giá", min: 0, max: Infinity },
  { label: "Dưới 200K", min: 0, max: 200000 },
  { label: "200K - 400K", min: 200000, max: 400000 },
  { label: "400K - 600K", min: 400000, max: 600000 },
  { label: "Trên 600K", min: 600000, max: Infinity },
];

const careLevels = ["Tất cả", "Dễ", "Trung bình", "Khó"];

const promos = [
  {
    title: "Giảm đến",
    discount: "25%",
    description: "Đơn hàng đầu tiên đến 500K",
    date: "25-29/06/2025",
    bgColor: "from-primary to-primary/80",
    textColor: "text-white",
  },
  {
    title: "Tiết kiệm đến",
    discount: "30%",
    description: "Các sản phẩm được chọn đến 300K",
    date: "01-05/07/2025",
    bgColor: "from-emerald-600 to-emerald-500",
    textColor: "text-white",
  },
  {
    title: "Giảm",
    discount: "20%",
    description: "Cho tất cả đơn hàng tiếp theo",
    date: "06-10/07/2025",
    bgColor: "from-amber-500 to-amber-400",
    textColor: "text-white",
  },
];

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedCareLevel, setSelectedCareLevel] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("default");
  const [productSource, setProductSource] = useState<"all" | "greenie" | "sellers">("all");
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { allSellerProducts, allSellers, getSellerById } = useSeller();
  const { products: plantsData, isLoading, fetchError } = useAdmin();

  if (isLoading) {
    return (
      <PageLayout showHero heroImage={bgShop} heroTitle="Bộ Sưu Tập Cây" heroSubtitle="Khám phá thế giới cây xanh đa dạng và phong phú">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-lg text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </PageLayout>
    );
  }

  if (fetchError) {
    return (
      <PageLayout showHero heroImage={bgShop} heroTitle="Bộ Sưu Tập Cây" heroSubtitle="Khám phá thế giới cây xanh đa dạng và phong phú">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-lg text-destructive">Lỗi: {fetchError}</p>
        </div>
      </PageLayout>
    );
  }

  // Get approved seller products
  const approvedSellerProducts = allSellerProducts.filter(p => {
    const seller = getSellerById(p.sellerId);
    return p.status === 'approved' && seller?.status === 'approved';
  });

  // Convert seller products to Plant format for unified display
  const sellerProductsAsPlants: (Plant & { sellerId?: string; sellerName?: string })[] = approvedSellerProducts.map(sp => ({
    id: parseInt(sp.id.replace('sp_', '')) + 10000, // Offset to avoid ID conflicts
    name: sp.name,
    category: sp.category as Plant['category'],
    rating: sp.rating,
    reviews: sp.reviews,
    sold: sp.sold,
    price: sp.price,
    originalPrice: sp.originalPrice,
    discount: sp.discount,
    image: sp.image || '/placeholder.svg',
    description: sp.description,
    careLevel: sp.careLevel,
    light: sp.light,
    water: sp.water,
    humidity: sp.humidity,
    temperature: sp.temperature,
    gallery: sp.gallery,
    location: sp.location,
    benefits: sp.benefits,
    stock: sp.stock,
    sellerId: sp.sellerId,
    sellerName: getSellerById(sp.sellerId)?.shopName,
  }));

  // Combine products based on source filter
  const allProducts = productSource === "greenie" 
    ? plantsData 
    : productSource === "sellers" 
    ? sellerProductsAsPlants 
    : [...plantsData, ...sellerProductsAsPlants];

  const filteredPlants = allProducts
    .filter((plant) => {
      const matchesCategory = activeCategory === "Tất cả" || plant.category === activeCategory;
      const matchesSearch = searchMatch(searchQuery, plant.name, plant.description, plant.benefits, plant.location);
      const matchesPrice = plant.price >= priceRanges[selectedPriceRange].min && 
                          plant.price <= priceRanges[selectedPriceRange].max;
      const matchesCareLevel = selectedCareLevel === "Tất cả" || plant.careLevel === selectedCareLevel;
      return matchesCategory && matchesSearch && matchesPrice && matchesCareLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "sold":
          return b.sold - a.sold;
        default:
          return 0;
      }
    });

  const handleAddToCart = (plant: typeof allProducts[0]) => {
    addToCart({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      sellerId: 'sellerId' in plant && plant.sellerId ? plant.sellerId : undefined,
    });
    toast.success(`Đã thêm ${plant.name} vào giỏ hàng!`);
  };

  const handleToggleWishlist = (plant: Plant) => {
    toggleWishlist({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      category: plant.category,
    });
    if (isInWishlist(plant.id)) {
      toast.success(`Đã xóa ${plant.name} khỏi yêu thích`);
    } else {
      toast.success(`Đã thêm ${plant.name} vào yêu thích`);
    }
  };

  const careLevelColors = {
    "Dễ": "bg-green-100 text-green-700",
    "Trung bình": "bg-yellow-100 text-yellow-700",
    "Khó": "bg-red-100 text-red-700",
  };

  const activeFiltersCount = [
    selectedPriceRange !== 0,
    selectedCareLevel !== "Tất cả",
    sortBy !== "default",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedPriceRange(0);
    setSelectedCareLevel("Tất cả");
    setSortBy("default");
    setActiveCategory("Tất cả");
    setSearchQuery("");
  };

  return (
    <PageLayout
      showHero
      heroImage={bgShop}
      heroTitle="Bộ Sưu Tập Cây"
      heroSubtitle="Khám phá thế giới cây xanh đa dạng và phong phú"
    >
      <div className="container mx-auto px-6 py-12">
        {/* Search & Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm cây..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-12 bg-card"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-icon flex items-center gap-2 px-4 ${showFilters ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-sm">Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 bg-card rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Bộ lọc nâng cao</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Khoảng giá</label>
                      <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPriceRange(index)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedPriceRange === index
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Care Level */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Mức độ chăm sóc</label>
                      <div className="space-y-2">
                        {careLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedCareLevel(level)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedCareLevel === level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                            }`}
                          >
                            {level === "Tất cả" ? level : (
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  level === "Dễ" ? "bg-green-500" :
                                  level === "Trung bình" ? "bg-yellow-500" : "bg-red-500"
                                }`}></span>
                                {level}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Sắp xếp theo</label>
                      <div className="space-y-2">
                        {[
                          { value: "default", label: "Mặc định" },
                          { value: "price-asc", label: "Giá thấp → cao" },
                          { value: "price-desc", label: "Giá cao → thấp" },
                          { value: "rating", label: "Đánh giá cao nhất" },
                          { value: "sold", label: "Bán chạy nhất" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              sortBy === option.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Product Source Filter */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-muted-foreground">Nguồn:</span>
            {[
              { value: "all", label: "Tất cả" },
              { value: "greenie", label: "🌿 GREENIE" },
              { value: "sellers", label: "🏪 Các Shop" },
            ].map((source) => (
              <button
                key={source.value}
                onClick={() => setProductSource(source.value as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  productSource === source.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground/80 hover:bg-muted"
                }`}
              >
                {source.label}
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-display text-2xl text-foreground">Danh mục</h2>
          </div>
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

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-display text-2xl text-foreground">
              {activeCategory === "Tất cả" ? "Tất cả sản phẩm" : activeCategory}
            </h2>
            <span className="text-muted-foreground text-sm">{filteredPlants.length} sản phẩm</span>
          </div>
          
          {filteredPlants.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">Không tìm thấy sản phẩm phù hợp</p>
              <button
                onClick={clearFilters}
                className="text-primary hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="px-2 py-1 bg-card/90 text-xs rounded-full text-foreground">
                        {plant.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${careLevelColors[plant.careLevel]}`}>
                        {plant.careLevel}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button 
                        onClick={() => handleToggleWishlist(plant)}
                        className={`p-2 rounded-full transition-colors ${
                          isInWishlist(plant.id) 
                            ? "bg-red-500 text-white" 
                            : "bg-card/90 hover:bg-primary hover:text-white"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(plant.id) ? "fill-current" : ""}`} />
                      </button>
                      <button 
                        onClick={() => setSelectedPlant(plant)}
                        className="p-2 bg-card/90 rounded-full hover:bg-primary hover:text-white transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 
                      className="text-foreground font-medium mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      onClick={() => setSelectedPlant(plant)}
                    >
                      {plant.name}
                    </h3>
                    
                    {/* Seller Badge */}
                    {'sellerId' in plant && plant.sellerId && (
                      <Link 
                        to={`/shop/${plant.sellerId}`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-2 transition-colors"
                      >
                        <Store className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{(plant as any).sellerName}</span>
                      </Link>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>
                        {plant.rating} ({plant.reviews})
                      </span>
                      <span>•</span>
                      <span>{plant.sold} đã bán</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded mr-2">
                          -{plant.discount}%
                        </span>
                        <span className="text-foreground font-semibold">{formatPrice(plant.price)}</span>
                        <span className="text-muted-foreground text-sm line-through ml-2">
                          {formatPrice(plant.originalPrice)}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(plant)}
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <img
                  src={selectedPlant.image}
                  alt={selectedPlant.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleToggleWishlist(selectedPlant)}
                    className={`p-2 rounded-full transition-colors ${
                      isInWishlist(selectedPlant.id) 
                        ? "bg-red-500 text-white" 
                        : "bg-card/90 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(selectedPlant.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => setSelectedPlant(null)}
                    className="p-2 bg-card/90 rounded-full hover:bg-card transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-card/90 rounded-full text-sm font-medium">
                    {selectedPlant.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${careLevelColors[selectedPlant.careLevel]}`}>
                    {selectedPlant.careLevel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title & Price */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPlant.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{selectedPlant.rating} ({selectedPlant.reviews} đánh giá)</span>
                      <span>•</span>
                      <span>{selectedPlant.sold} đã bán</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded font-medium">
                        -{selectedPlant.discount}%
                      </span>
                      <span className="text-muted-foreground line-through">
                        {formatPrice(selectedPlant.originalPrice)}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {formatPrice(selectedPlant.price)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mô tả</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedPlant.description}</p>
                </div>

                {/* Location & Benefits */}
                {(selectedPlant.location || selectedPlant.benefits) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedPlant.location && (
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <p className="text-sm text-muted-foreground">Vị trí đặt</p>
                        <p className="text-foreground font-medium">{selectedPlant.location}</p>
                      </div>
                    )}
                    {selectedPlant.benefits && (
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <p className="text-sm text-muted-foreground">Lợi ích</p>
                        <p className="text-foreground font-medium">{selectedPlant.benefits}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Care Requirements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Yêu cầu chăm sóc</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
                      <Sun className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Ánh sáng</p>
                      <p className="text-sm font-medium text-foreground">{selectedPlant.light}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                      <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Tưới nước</p>
                      <p className="text-sm font-medium text-foreground">{selectedPlant.water}</p>
                    </div>
                    <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-center">
                      <Wind className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Độ ẩm</p>
                      <p className="text-sm font-medium text-foreground">{selectedPlant.humidity}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                      <Thermometer className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Nhiệt độ</p>
                      <p className="text-sm font-medium text-foreground">{selectedPlant.temperature}</p>
                    </div>
                  </div>
                </div>

                {/* Stock info */}
                {selectedPlant.stock !== undefined && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      Còn lại: <span className="font-semibold text-foreground">{selectedPlant.stock} sản phẩm</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedPlant);
                      setSelectedPlant(null);
                    }}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </button>
                  <Link
                    to={`/product/${selectedPlant.id}`}
                    className="px-6 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedPlant(null)}
                  >
                    Xem trang sản phẩm
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Catalog;
