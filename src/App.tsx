import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SellerProvider } from "@/contexts/SellerContext";
import CartSidebar from "@/components/CartSidebar";
import WishlistSidebar from "@/components/WishlistSidebar";
import useScrollToTop from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import AIConsultant from "./pages/AIConsultant";
import Guide from "./pages/Guide";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import SellerCenter from "./pages/SellerCenter";
import SellerShop from "./pages/SellerShop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AdminProvider>
          <SellerProvider>
            <CartProvider>
              <WishlistProvider>
                <UserProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <CartSidebar />
                    <WishlistSidebar />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/ai-consultant" element={<AIConsultant />} />
                      <Route path="/guide" element={<Guide />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/seller/login" element={<SellerLogin />} />
                      <Route path="/seller/register" element={<SellerRegister />} />
                      <Route path="/seller" element={<SellerCenter />} />
                      <Route path="/shop/:sellerId" element={<SellerShop />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </UserProvider>
              </WishlistProvider>
            </CartProvider>
          </SellerProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
