import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSeller } from '@/contexts/SellerContext';

/**
 * Hook to sync authentication between AuthContext and SellerContext
 * When a user with role 'seller' logs in via AuthContext,
 * automatically log them into SellerContext as well
 */
export const useSellerAuthSync = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentSeller, loginSellerByUserId, logoutSeller } = useSeller();

  useEffect(() => {
    // If user is authenticated with role seller, sync with SellerContext
    if (isAuthenticated && user?.role === 'seller' && !currentSeller) {
      // Try to login seller by user ID
      const result = loginSellerByUserId(user.id);
      if (!result.success) {
        console.log('Seller account not found for user:', user.id);
      }
    }
    
    // If user logs out from AuthContext, also logout from SellerContext
    if (!isAuthenticated && currentSeller) {
      logoutSeller();
    }
  }, [isAuthenticated, user, currentSeller, loginSellerByUserId, logoutSeller]);

  return {
    isSeller: user?.role === 'seller',
    isSellerSynced: !!currentSeller,
    sellerStatus: currentSeller?.status,
  };
};

export default useSellerAuthSync;
