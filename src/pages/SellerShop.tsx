import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, MapPin, Phone, Store, Package, MessageCircle, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useSeller } from "@/contexts/SellerContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/data/plants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SellerShop = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { getSellerById, getProductsBySeller } = useSeller();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const seller = sellerId ? getSellerById(sellerId) : undefined;
  const products = sellerId ? getProductsBySeller(sellerId).filter(p => p.status === 'approved') : [];

  if (!seller || seller.status !== 'approved') {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 py-20 text-center">
          <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Shop không tồn tại</h1>
          <p className="text-muted-foreground mb-6">Shop này không tồn tại hoặc chưa được duyệt.</p>
          <Link to="/catalog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Catalog
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: parseInt(product.id.replace('sp_', '')) + 10000, // Offset to match Catalog format
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: product.sellerId,
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const handleToggleWishlist = (product: typeof products[0]) => {
    const numericId = parseInt(product.id.replace('sp_', '')) + 1000;
    toggleWishlist({
      id: numericId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    if (isInWishlist(numericId)) {
      toast.success(`Đã xóa ${product.name} khỏi yêu thích`);
    } else {
      toast.success(`Đã thêm ${product.name} vào yêu thích`);
    }
  };

  // Calculate shop stats
  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const avgRating = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
    : "0";

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link to="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Quay lại Catalog
        </Link>

        {/* Shop Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Shop Logo */}
            <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              {seller.logo ? (
                <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Store className="w-12 h-12 text-primary" />
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{seller.shopName}</h1>
                <Badge variant="default">Đã xác thực</Badge>
              </div>
              {seller.description && (
                <p className="text-muted-foreground mb-3">{seller.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {seller.address}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {seller.phone}
                </span>
              </div>
            </div>

            {/* Shop Stats */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Sản phẩm</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalSold}</p>
                <p className="text-sm text-muted-foreground">Đã bán</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-primary">{avgRating}</span>
                </div>
                <p className="text-sm text-muted-foreground">Đánh giá</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" className="flex-1 md:flex-none">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat với Shop
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              <Heart className="w-4 h-4 mr-2" />
              Theo dõi Shop
            </Button>
          </div>
        </motion.div>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Sản phẩm của Shop</h2>
          <p className="text-muted-foreground">{products.length} sản phẩm</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Shop chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const numericId = parseInt(product.id.replace('sp_', '')) + 1000;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="px-2 py-1 bg-card/90 text-xs rounded-full text-foreground">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button 
                        onClick={() => handleToggleWishlist(product)}
                        className={`p-2 rounded-full transition-colors ${
                          isInWishlist(numericId) 
                            ? "bg-red-500 text-white" 
                            : "bg-card/90 hover:bg-primary hover:text-white"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(numericId) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-foreground font-medium mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{product.rating}</span>
                      <span>•</span>
                      <span>{product.sold} đã bán</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-foreground font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-muted-foreground text-sm line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SellerShop;
