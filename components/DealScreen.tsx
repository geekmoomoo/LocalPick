import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, CheckCircle, Share2, Heart, ChevronsRight } from 'lucide-react';
import { Deal } from '../types';

interface DealScreenProps {
  deal: Deal;
  onUseCoupon?: () => void;
}

export const DealScreen: React.FC<DealScreenProps> = ({ deal, onUseCoupon }) => {
  const [remaining, setRemaining] = useState(deal.remainingCoupons);
  const [isTorn, setIsTorn] = useState(false); // Replaces simple isClaimed for visual state
  const [recentBuyer, setRecentBuyer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  
  // Drag Physics State
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time inventory dropping
  useEffect(() => {
    if (isTorn) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1 && Math.random() > 0.8) return prev - 1;
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isTorn]);

  // Simulate "Social Proof" Ticker
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

  // Timer Countdown Logic
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = deal.expiresAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("종료됨");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      
      const minStr = minutes.toString().padStart(2, '0');
      setTimeLeft(`${hours}시 ${minStr}분 남음`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [deal.expiresAt]);

  const formattedDiscount = new Intl.NumberFormat('ko-KR').format(deal.discountAmount);

  // Calculate dates and claim order
  const today = new Date();
  const validPeriod = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ~ ${deal.expiresAt.getFullYear()}년 ${deal.expiresAt.getMonth() + 1}월 ${deal.expiresAt.getDate()}일 까지`;
  const claimOrder = deal.totalCoupons - remaining + 1;

  // --- Confetti & Particle Effects (Ported) ---
  const triggerConfetti = useCallback(() => {
    const colors = ['#fde047', '#facc15', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
    
    // 1. Paper Pieces (From Tear Point)
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
        const tearX = rect.left + (rect.width * 0.32); // 32% split point
        const tearY = rect.top + (rect.height / 2) + 100; // Approximate vertical center of screen or coupon

        for (let i = 0; i < 30; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'fixed';
            piece.style.zIndex = '9999';
            piece.style.pointerEvents = 'none';
            const width = Math.random() * 20 + 8;
            const height = Math.random() * 15 + 5;
            piece.style.width = `${width}px`;
            piece.style.height = `${height}px`;
            piece.style.left = `${tearX + (Math.random() - 0.5) * 50}px`;
            piece.style.top = `${tearY}px`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = '2px';
            document.body.appendChild(piece);

            const angle = (Math.random() - 0.5) * Math.PI;
            const velocity = Math.random() * 300 + 150;
            const vx = Math.cos(angle) * velocity;
            const vy = -Math.random() * 200 - 100;
            const rotation = (Math.random() - 0.5) * 1080;
            const duration = Math.random() * 800 + 600;

            piece.animate([
                { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy + 400}px) rotate(${rotation}deg) scale(0.3)`, opacity: 0 }
            ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });

            setTimeout(() => piece.remove(), duration);
        }
    }

    // 2. Full Screen Confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        const size = Math.random() * 10 + 5;
        const isCircle = Math.random() > 0.5;
        confetti.style.width = `${size}px`;
        confetti.style.height = isCircle ? `${size}px` : `${size * 2}px`;
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.top = '-20px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = isCircle ? '50%' : '2px';
        document.body.appendChild(confetti);

        const drift = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720 - 360;
        const duration = Math.random() * 2000 + 2000;
        const delay = Math.random() * 500;

        confetti.animate([
            { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 50}px) translateX(${drift}px) rotate(${rotation}deg)`, opacity: 0.8 }
        ], { duration, delay, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' });

        setTimeout(() => confetti.remove(), duration + delay);
    }
  }, []);

  // --- Drag Logic ---
  const handleStart = (clientX: number) => {
    if (isTorn || remaining === 0) return;
    setIsDragging(true);
    dragStartX.current = clientX;
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isTorn) return;
    const delta = Math.max(0, clientX - dragStartX.current); // Only drag right
    setDragX(delta);
  };

  const handleEnd = () => {
    if (!isDragging || isTorn) return;
    setIsDragging(false);

    // Threshold to tear (e.g., 100px)
    if (dragX > 100) {
      // TEAR IT!
      setIsTorn(true);
      if (navigator.vibrate) navigator.vibrate([30, 50, 80]);
      triggerConfetti();
    } else {
      // Snap back
      setDragX(0);
    }
  };

  // Mouse Handlers
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gray-900 select-none"
      ref={containerRef}
      onMouseMove={isDragging ? onMouseMove : undefined}
      onMouseUp={isDragging ? onMouseUp : undefined}
      onMouseLeave={isDragging ? onMouseLeave : undefined}
      onTouchMove={isDragging ? onTouchMove : undefined}
      onTouchEnd={isDragging ? onTouchEnd : undefined}
    >
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={deal.imageUrl} 
          alt={deal.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Share Button */}
      <div className="absolute top-6 right-6 z-50">
        <button className="text-white/60 drop-shadow-md transition-transform active:scale-95 p-2 hover:text-white/80">
           <Share2 size={28} />
        </button>
      </div>

      {/* Social Proof */}
      {recentBuyer && (
        <div className="absolute top-4 left-4 z-40 animate-fade-in-down">
          <div className="bg-black/60 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center border border-white/10 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span><b>{recentBuyer}</b>님이 방금 쿠폰을 받았습니다!</span>
          </div>
        </div>
      )}

      {/* Top Spacer */}
      <div className="relative z-10 pt-24 px-6"></div>

      {/* Bottom Content Area */}
      <div className="relative z-20 px-6 pb-28 w-full flex flex-col gap-4">
        
        {/* Title & Discount */}
        <div className="text-left mb-2 pointer-events-none">
           <h1 className="text-4xl font-black text-white leading-tight drop-shadow-lg mb-1">{deal.title}</h1>
           <div className="flex items-center gap-2">
             <span className="text-yellow-400 font-bold text-2xl drop-shadow-md">{formattedDiscount}원 할인</span>
           </div>
        </div>

        {/* Store Info */}
        <div className="flex justify-between items-center text-white/90 text-sm font-medium drop-shadow-md mb-2 pointer-events-none">
            <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs">{deal.restaurant.category}</span>
                <span>{deal.restaurant.name}</span>
                <div className="flex items-center gap-1 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30 ml-1">
                   <Heart size={10} className="fill-red-500 text-red-500" />
                   <span className="text-[10px] font-bold text-red-400">매장 즐겨찾기</span>
                </div>
            </div>
            <span>{deal.restaurant.distance}m</span>
        </div>

        {/* --- COUPON CONTAINER --- */}
        <div className="relative w-full h-24">
            
            {/* PART 1: LEFT STUB (Static) */}
            <div className={`absolute left-0 top-0 bottom-0 w-[32%] z-10 
              rounded-l-lg overflow-hidden drop-shadow-xl flex flex-col items-center justify-center border-r-2 border-dashed border-stone-300
              ${isTorn ? 'bg-stone-300' : 'bg-[#fcfaf4]'}
            `}
            style={{
                WebkitMaskImage: 'radial-gradient(circle at 0px 50%, transparent 12px, black 12.5px)',
                maskImage: 'radial-gradient(circle at 0px 50%, transparent 12px, black 12.5px)'
            }}
            >
                 {/* Paper Texture */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                 
                 {/* Stub Content */}
                 {!isTorn && (
                     <div className="border border-red-600 text-red-600 px-1 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider mb-1 -rotate-2 bg-red-50/50">
                        마감임박
                     </div>
                 )}
                 <div className={`text-[10px] font-medium leading-tight text-center w-full px-1 ${isTorn ? 'text-stone-500' : 'text-stone-600'}`}>
                    {isTorn ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onUseCoupon?.();
                          }}
                          className="w-full flex flex-col items-center justify-center active:scale-95 transition-transform"
                        >
                            <span className="leading-tight text-[11px] font-black text-stone-700 border-b-2 border-stone-700/20 pb-0.5">쿠폰<br/>사용하기</span>
                        </button>
                    ) : (
                        <>
                            잔여수량<br/>
                            <span className="text-xl font-bold font-serif text-red-700">{remaining}</span>
                        </>
                    )}
                 </div>
            </div>

            {/* PART 2: RIGHT TICKET (Draggable) */}
            <div 
                className={`absolute left-[32%] top-0 bottom-0 right-0 z-20
                  rounded-r-lg overflow-hidden drop-shadow-xl cursor-grab active:cursor-grabbing touch-none
                  ${isTorn ? 'bg-stone-300' : remaining === 0 ? 'bg-stone-500' : 'bg-[#fcfaf4]'}
                `}
                style={{
                    transform: isTorn 
                        ? `translateX(${dragX + 40}px) rotate(${dragX * 0.1}deg)` 
                        : `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
                    transition: isDragging ? 'none' : 'opacity 0.4s ease-out, transform 0.4s ease-out',
                    opacity: isTorn ? 0 : 1,
                    pointerEvents: isTorn ? 'none' : 'auto',
                    WebkitMaskImage: 'radial-gradient(circle at 100% 50%, transparent 12px, black 12.5px)',
                    maskImage: 'radial-gradient(circle at 100% 50%, transparent 12px, black 12.5px)'
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Inner Border (Only top, bottom, right) */}
                <div className="absolute inset-1.5 left-0 border-t border-b border-r border-dashed border-stone-300 rounded-r-[4px] pointer-events-none"></div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center h-full w-full pl-2 pr-4">
                    {isTorn ? (
                         <div className="flex items-center gap-2 text-stone-500">
                             <CheckCircle size={24} />
                             <span className="text-xl font-bold">발급완료</span>
                         </div>
                    ) : remaining === 0 ? (
                        <span className="text-xl font-bold text-stone-200">선착순 마감</span>
                    ) : (
                        <div className="text-center w-full">
                            <span className="block text-2xl font-black text-stone-800 tracking-tight select-none">
                                쿠폰 받기
                            </span>
                            <div className="flex items-center justify-center text-[10px] text-stone-500 mt-1 gap-1 select-none">
                                {isDragging ? (
                                    <span className="text-red-500 font-bold animate-pulse">더 당겨주세요!</span>
                                ) : (
                                    <>
                                        <ChevronsRight size={12} className="animate-pulse text-stone-400" />
                                        <span>밀어서 뜯기</span>
                                        <Clock size={10} className="ml-2" />
                                        <span>{timeLeft}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success State Replacement (Transparent background, white text) */}
            {isTorn && (
                <div className="absolute left-[32%] top-0 bottom-0 right-0 flex flex-col items-center justify-center z-0">
                     <div className="flex items-center gap-2 text-white animate-fade-in-up">
                         <CheckCircle size={24} className="text-white drop-shadow-md" />
                         <span className="text-xl font-black drop-shadow-md">쿠폰 사용기간</span>
                     </div>
                     <div className="text-white/80 text-[10px] mt-2 font-medium drop-shadow-md animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        {validPeriod}
                     </div>
                </div>
            )}
            
        </div>
      </div>

      <style>{`
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};