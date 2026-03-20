import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { formatPrice } from "@/data/plants";

interface SearchDropdownProps {
  isScrolled?: boolean;
  variant?: "landing" | "page";
}

const SearchDropdown = ({ isScrolled = false, variant = "landing" }: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { products } = useAdmin();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const textColor = variant === "landing" && !isScrolled ? "text-white" : "text-foreground";
  const hoverBg = variant === "landing" && !isScrolled ? "hover:bg-white/10" : "hover:bg-muted";

  return (
    <div ref={dropdownRef} className="relative">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className={`p-2 rounded-full transition-colors ${hoverBg}`}
        >
          <Search className={`w-5 h-5 ${textColor}`} />
        </motion.button>
      ) : (
        <motion.div
          initial={{ width: 40, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 40, opacity: 0 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-full text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {filteredProducts.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs text-muted-foreground">
                  Tìm thấy {filteredProducts.length} sản phẩm
                </p>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="text-primary font-semibold text-sm whitespace-nowrap">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
                <Link
                  to={`/catalog?search=${encodeURIComponent(query)}`}
                  onClick={handleClose}
                  className="block px-4 py-3 text-center text-sm text-primary hover:bg-primary/10 transition-colors border-t border-border"
                >
                  Xem tất cả kết quả
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Không tìm thấy sản phẩm "{query}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchDropdown;
