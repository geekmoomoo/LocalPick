import React, { useState, useEffect } from 'react';
import { DealScreen } from './components/DealScreen';
import { Navigation } from './components/Navigation';
import { CouponsScreen } from './components/CouponsScreen';
import { fetchFlashDeals } from './services/dealService';
import { Deal, AppTab, Coupon } from './types';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.SEARCH);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBuyer, setRecentBuyer] = useState<string | null>(null);
  
  // My Coupons State
  const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const data = await fetchFlashDeals();
        setDeals(data);
      } catch (error) {
        console.error("Failed to fetch deals", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDeals();
  }, []);

  // Social Proof Ticker
  useEffect(() => {
    const names = ['김*민', '이*서', '박*준', '최*우', '정*윤'];
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        setRecentBuyer(randomName);
        setTimeout(() => setRecentBuyer(null), 3000); 
      }
    }, 8000); 
    return () => clearInterval(interval);
  }, []);

  // Handler: When user tears a coupon
  const handleClaimCoupon = (deal: Deal) => {
    // Check if already claimed
    if (myCoupons.some(c => c.dealId === deal.id && c.status === 'AVAILABLE')) {
        setCurrentTab(AppTab.COUPONS);
        return;
    }

    const newCoupon: Coupon = {
        id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dealId: deal.id,
        title: deal.title,
        restaurantName: deal.restaurant.name,
        discountAmount: deal.discountAmount,
        imageUrl: deal.imageUrl,
        status: 'AVAILABLE',
        claimedAt: new Date(),
        expiresAt: deal.expiresAt
    };

    setMyCoupons(prev => [newCoupon, ...prev]);
    setCurrentTab(AppTab.COUPONS);
  };

  // Handler: When staff confirms usage
  const handleUseCoupon = (couponId: string) => {
    setMyCoupons(prev => prev.map(c => {
        if (c.id === couponId) {
            return { ...c, status: 'USED', usedAt: new Date() };
        }
        return c;
    }));
  };

  return (
    <div className="bg-neutral-900 min-h-screen w-full flex justify-center items-center">
      {/* Mobile container */}
      <div className="w-full max-w-md h-[100dvh] bg-black relative shadow-2xl overflow-hidden md:rounded-3xl border-gray-800 md:border-4 flex flex-col">
        
        {/* Persistent Top Notification Layer */}
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 pointer-events-none z-50 flex justify-between items-start">
          {recentBuyer && currentTab === AppTab.SEARCH ? (
            <div className="animate-fade-in-down pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center border border-white/10 shadow-lg">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span><b>{recentBuyer}</b>님 쿠폰 획득 완료!</span>
              </div>
            </div>
          ) : <div></div>}
        </div>

        {/* Main Content Router */}
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">주변 핫딜 탐색 중...</p>
          </div>
        ) : (
          <div className="w-full h-full pb-20"> {/* Add padding for bottom nav */}
             
             {/* Tab: SEARCH (Feed) */}
             {currentTab === AppTab.SEARCH && (
                 <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
                  {deals.map((deal) => (
                    <div key={deal.id} className="w-full h-full snap-start relative">
                      <DealScreen 
                        deal={deal} 
                        onUseCoupon={() => handleClaimCoupon(deal)}
                      />
                    </div>
                  ))}
                </div>
             )}

             {/* Tab: COUPONS */}
             {currentTab === AppTab.COUPONS && (
                 <CouponsScreen 
                    coupons={myCoupons} 
                    onUseCoupon={handleUseCoupon} 
                 />
             )}

             {/* Tab: PROFILE (Placeholder) */}
             {currentTab === AppTab.PROFILE && (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-neutral-900">
                    <div className="text-center">
                    <p className="text-lg font-bold mb-2">내 정보</p>
                    <p className="text-sm">로그인 기능 준비 중입니다.</p>
                    </div>
                </div>
             )}
          </div>
        )}

        {/* Floating Navigation */}
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Global Styles for Animations */}
        <style>{`
          .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
          @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
};

export default App;