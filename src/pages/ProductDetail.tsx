import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Heart, ShoppingCart, Minus, Plus, Droplets, Sun, Thermometer, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, Plant } from "@/data/plants";
import { useCart } from "@/contexts/CartContext";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useSeller } from "@/contexts/SellerContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { allSellerProducts, getSellerById } = useSeller();
  const { products, isLoading, fetchError } = useAdmin();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-destructive">Lỗi: {fetchError}</p>
      </div>
    );
  }

  let plant: (Plant & { sellerId?: string }) | undefined = products.find((p) => p.id === Number(id));
  let sellerProductId: string | undefined;

  // If not found in static data, check seller products
  if (!plant && id) {
    const rawId = Number(id);
    if (rawId > 10000) {
      sellerProductId = `sp_${rawId - 10000}`;
      const sellerProduct = allSellerProducts.find(p => p.id === sellerProductId);

      if (sellerProduct) {
        // Map seller product to Plant interface
        plant = {
          id: rawId,
          name: sellerProduct.name,
          category: sellerProduct.category as any,
          rating: sellerProduct.rating,
          reviews: sellerProduct.reviews,
          sold: sellerProduct.sold,
          price: sellerProduct.price,
          originalPrice: sellerProduct.originalPrice,
          discount: sellerProduct.discount,
          image: sellerProduct.image || '/placeholder.svg',
          description: sellerProduct.description,
          careLevel: sellerProduct.careLevel as any,
          light: sellerProduct.light,
          water: sellerProduct.water,
          humidity: sellerProduct.humidity,
          temperature: sellerProduct.temperature,
          gallery: sellerProduct.gallery?.length ? sellerProduct.gallery : [sellerProduct.image || '/placeholder.svg'],
          location: sellerProduct.location,
          benefits: sellerProduct.benefits,
          stock: sellerProduct.stock,
          sellerId: sellerProduct.sellerId,
        };
      }
    }
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display text-4xl text-foreground mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/catalog" className="text-primary hover:underline">
            Quay lại danh mục
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      sellerId: plant.sellerId,
    }, quantity);
    toast.success(`Đã thêm ${quantity} ${plant.name} vào giỏ hàng`);
  };

  const careLevelColors = {
    "Dễ": "bg-primary/20 text-primary",
    "Trung bình": "bg-secondary/20 text-secondary",
    "Khó": "bg-destructive/20 text-destructive",
  };

  const relatedPlants = products.filter((p) => p.category === plant.category && p.id !== plant.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <span>/</span>
            <Link to="/catalog" className="hover:text-primary transition-colors">Danh mục</Link>
            <span>/</span>
            <span className="text-foreground">{plant.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden glass-card">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={plant.gallery[activeImage]}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {plant.gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === 0 ? plant.gallery.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === plant.gallery.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-foreground" />
                    </button>
                  </>
                )}

                {/* Discount badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  -{plant.discount}%
                </span>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 p-3 glass rounded-full hover:bg-primary/20 transition-colors">
                  <Heart className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Thumbnails */}
              {plant.gallery.length > 1 && (
                <div className="flex gap-3">
                  {plant.gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${activeImage === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-sm text-muted-foreground">{plant.category}</span>
                <h1 className="text-display text-4xl text-foreground mt-2">{plant.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground font-medium">{plant.rating}</span>
                  <span className="text-muted-foreground">({plant.reviews} đánh giá)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{plant.sold} đã bán</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">{formatPrice(plant.price)}</span>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(plant.originalPrice)}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{plant.description}</p>

              {/* Care Level */}
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Độ khó chăm sóc:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${careLevelColors[plant.careLevel]}`}>
                  {plant.careLevel}
                </span>
              </div>

              {/* Care Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex items-center gap-3">
                  <Sun className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ánh sáng</p>
                    <p className="text-sm text-foreground">{plant.light}</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-3">
                  <Droplets className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tưới nước</p>
                    <p className="text-sm text-foreground">{plant.water}</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-3">
                  <Wind className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Độ ẩm</p>
                    <p className="text-sm text-foreground">{plant.humidity}</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-3">
                  <Thermometer className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nhiệt độ</p>
                    <p className="text-sm text-foreground">{plant.temperature}</p>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-3 glass-card px-4 py-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Minus className="w-5 h-5 text-foreground" />
                  </button>
                  <span className="w-12 text-center text-foreground font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Plus className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedPlants.length > 0 && (
            <section className="mt-16">
              <h2 className="text-display text-2xl text-foreground mb-8">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPlants.map((relatedPlant, index) => (
                  <motion.div
                    key={relatedPlant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/product/${relatedPlant.id}`} className="block glass-card overflow-hidden group">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={relatedPlant.image}
                          alt={relatedPlant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-foreground font-medium">{relatedPlant.name}</h3>
                        <p className="text-primary font-semibold mt-1">{formatPrice(relatedPlant.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
