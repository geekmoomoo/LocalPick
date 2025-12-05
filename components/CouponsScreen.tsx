import React, { useState } from 'react';
import { Coupon } from '../types';
import { QrCode, X, PartyPopper } from 'lucide-react';

interface CouponsScreenProps {
  coupons: Coupon[];
  onUseCoupon: (couponId: string) => void;
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({ coupons, onUseCoupon }) => {
  const [filter, setFilter] = useState<'AVAILABLE' | 'USED'>('AVAILABLE');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filteredCoupons = coupons.filter(c => c.status === filter);

  // Sort: Recent first
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
      const dateA = a.usedAt || a.claimedAt;
      const dateB = b.usedAt || b.claimedAt;
      return dateB.getTime() - dateA.getTime();
  });

  const handleUseClick = () => {
    // Simple confirmation dialog for the staff
    if (window.confirm("직원이 확인하셨습니까?\n사용 처리는 되돌릴 수 없습니다.")) {
       if (selectedCoupon) {
         onUseCoupon(selectedCoupon.id);
         setSelectedCoupon(null);
       }
    }
  };

  return (
    <div className="w-full h-full bg-black text-white p-6 pb-24 overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-black mb-6 mt-6">내 쿠폰함</h1>
      
      {/* Tabs */}
      <div className="flex p-1 bg-neutral-900 border border-neutral-800 rounded-xl mb-6 sticky top-0 z-10 backdrop-blur-md">
        <button 
          onClick={() => setFilter('AVAILABLE')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${filter === 'AVAILABLE' ? 'bg-neutral-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
        >
          사용 가능 {coupons.filter(c => c.status === 'AVAILABLE').length > 0 && <span className="ml-1 text-red-500">•</span>}
        </button>
        <button 
          onClick={() => setFilter('USED')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${filter === 'USED' ? 'bg-neutral-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
        >
          사용 완료
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {sortedCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-600 gap-4">
            <div className="p-6 bg-neutral-900 rounded-full">
                <QrCode size={40} className="opacity-20" />
            </div>
            <p className="font-medium">
                {filter === 'AVAILABLE' ? '아직 받은 쿠폰이 없어요.' : '사용한 쿠폰이 없습니다.'}
            </p>
          </div>
        ) : (
          sortedCoupons.map(coupon => (
            <div 
              key={coupon.id} 
              onClick={() => filter === 'AVAILABLE' && setSelectedCoupon(coupon)}
              className={`relative bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 transition-all duration-200 
                ${filter === 'AVAILABLE' ? 'cursor-pointer active:scale-[0.98] active:bg-neutral-800' : 'opacity-50 grayscale'}`}
            >
               {/* Left: Image */}
               <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-neutral-800">
                  <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-cover" />
               </div>

               {/* Right: Info */}
               <div className="flex-1 flex flex-col justify-center min-w-0">
                 <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-bold border border-neutral-700">
                        {coupon.restaurantName}
                    </span>
                 </div>
                 <h3 className="font-bold text-lg leading-tight mb-1 truncate text-gray-100">{coupon.title}</h3>
                 <span className="text-xl font-black text-yellow-500">
                    {new Intl.NumberFormat('ko-KR').format(coupon.discountAmount)}<span className="text-sm font-medium text-yellow-500/80">원 할인</span>
                 </span>
                 {filter === 'USED' && (
                     <span className="text-[10px] text-gray-500 mt-1">
                         사용일: {coupon.usedAt?.toLocaleDateString()}
                     </span>
                 )}
               </div>

               {/* Badge for Used */}
               {filter === 'USED' && (
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 border-2 border-gray-600 text-gray-600 font-black text-xs px-2 py-1 rounded rotate-[-15deg]">
                       USED
                   </div>
               )}
            </div>
          ))
        )}
      </div>

      {/* --- Detail Modal (Redemption Screen) --- */}
      {selectedCoupon && (
         <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            {/* Modal Content */}
            <div className="w-full h-[90%] sm:h-auto max-w-sm bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col animate-slide-up">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCoupon(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 z-10 bg-black/20 rounded-full backdrop-blur-sm"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 p-8 flex flex-col items-center text-center overflow-y-auto">
                 {/* Store Name Badge */}
                 <div className="mb-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                    {selectedCoupon.restaurantName}
                 </div>
                 
                 <h2 className="text-2xl font-black text-white leading-tight mb-8 break-keep">
                    {selectedCoupon.title}
                 </h2>

                 {/* QR Code Section */}
                 <div className="w-64 h-64 bg-white rounded-3xl mb-8 flex items-center justify-center relative shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                    <QrCode size={180} className="text-black" strokeWidth={1.5} />
                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-l-4 border-t-4 border-black rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-r-4 border-t-4 border-black rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-l-4 border-b-4 border-black rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-r-4 border-b-4 border-black rounded-br-lg"></div>
                 </div>

                 <p className="text-gray-400 text-sm font-medium mb-2">
                    직원에게 이 화면을 보여주세요
                 </p>
                 <div className="text-3xl font-black text-white">
                    {new Intl.NumberFormat('ko-KR').format(selectedCoupon.discountAmount)}원 할인
                 </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-6 bg-neutral-900 border-t border-neutral-800 safe-area-bottom">
                 <button 
                   onClick={handleUseClick}
                   className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-red-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                 >
                   <PartyPopper size={20} />
                   직원 확인 완료
                 </button>
              </div>

            </div>
         </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 24px); }
      `}</style>
    </div>
  );
};