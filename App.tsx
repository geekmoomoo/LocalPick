import React, { useState, useEffect } from 'react';
import { DealScreen } from './components/DealScreen';
import { Navigation } from './components/Navigation';
import { fetchFlashDeals } from './services/dealService';
import { Deal, AppTab } from './types';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.SEARCH);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="bg-neutral-900 min-h-screen w-full flex justify-center items-center">
      {/* Mobile container */}
      <div className="w-full max-w-md h-[100dvh] bg-black relative shadow-2xl overflow-hidden md:rounded-3xl border-gray-800 md:border-4 flex flex-col">
        
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">주변 핫딜 탐색 중...</p>
          </div>
        ) : currentTab === AppTab.SEARCH && deals.length > 0 ? (
          // Scroll Snap Container for "Feed" feel
          <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
            {deals.map((deal) => (
              <div key={deal.id} className="w-full h-full snap-start relative">
                <DealScreen 
                  deal={deal} 
                  onUseCoupon={() => setCurrentTab(AppTab.COUPONS)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder for other tabs */
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-bold mb-2">준비 중입니다</p>
              <p className="text-sm">다른 탭 기능은 개발 중입니다.</p>
            </div>
          </div>
        )}

        {/* Floating Navigation */}
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </div>
  );
};

export default App;