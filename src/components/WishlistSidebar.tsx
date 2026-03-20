import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

const WishlistSidebar = () => {
  const {
    items,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-display text-xl text-foreground">Yêu thích</h2>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                  {items.length} sản phẩm
                </span>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Chưa có sản phẩm yêu thích</p>
                  <Link
                    to="/catalog"
                    onClick={() => setIsWishlistOpen(false)}
                    className="text-primary hover:underline"
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-4 p-4 bg-muted/30 rounded-xl"
                    >
                      <Link 
                        to={`/product/${item.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link 
                          to={`/product/${item.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-primary font-semibold mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            title="Thêm vào giỏ"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              removeFromWishlist(item.id);
                              toast.success("Đã xóa khỏi danh sách yêu thích");
                            }}
                            className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-3">
                <button
                  onClick={() => {
                    clearWishlist();
                    toast.success("Đã xóa tất cả sản phẩm yêu thích");
                  }}
                  className="w-full py-3 border border-destructive text-destructive rounded-xl font-medium hover:bg-destructive/10 transition-colors"
                >
                  Xóa tất cả
                </button>
                <Link
                  to="/catalog"
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;
