import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, CheckCircle, Share2, Heart, ChevronRight, MapPin } from 'lucide-react';
import { Deal } from '../types';

interface DealScreenProps {
  deal: Deal;
  onUseCoupon?: () => void;
}

export const DealScreen: React.FC<DealScreenProps> = ({ deal, onUseCoupon }) => {
  const [remaining, setRemaining] = useState(deal.remainingCoupons);
  const [isTorn, setIsTorn] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  
  // Favorite Button State
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);
  
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
      setTimeLeft(`${hours}시간 ${minStr}분 남음`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [deal.expiresAt]);

  const formattedDiscount = new Intl.NumberFormat('ko-KR').format(deal.discountAmount);

  // --- Toggle Favorite Handler ---
  const toggleFavorite = () => {
      setIsFavorite(prev => !prev);
      if (!isFavorite) {
          setIsHeartPopping(true);
          setTimeout(() => setIsHeartPopping(false), 500); 
      }
  };

  // --- Confetti & Particle Effects ---
  const triggerConfetti = useCallback(() => {
    const colors = ['#fde047', '#facc15', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
    
    // 1. Paper Pieces
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
        const tearX = rect.left + (rect.width * 0.32); 
        const tearY = rect.bottom - 100; // Adjusted for bottom position

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
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        const size = Math.random() * 8 + 4;
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
        const duration = Math.random() * 1500 + 1500;
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

    if (dragX > 100) {
      setIsTorn(true);
      if (navigator.vibrate) navigator.vibrate([30, 50, 80]);
      triggerConfetti();
    } else {
      setDragX(0);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-end overflow-hidden bg-gray-900 select-none"
      ref={containerRef}
      onMouseMove={isDragging ? onMouseMove : undefined}
      onMouseUp={isDragging ? onMouseUp : undefined}
      onMouseLeave={isDragging ? onMouseLeave : undefined}
      onTouchMove={isDragging ? onTouchMove : undefined}
      onTouchEnd={isDragging ? onTouchEnd : undefined}
    >
      
      {/* --- Full Screen Background Image --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={deal.imageUrl} 
          alt={deal.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Top Bar: Share (Notification moved to App.tsx) */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-end items-start z-30">
        <button className="text-white/80 drop-shadow-md active:scale-95 hover:text-white transition-colors">
           <Share2 size={24} />
        </button>
      </div>

      {/* --- Main Content Area (Bottom) --- */}
      <div className="relative z-20 px-6 pb-24 w-full flex flex-col gap-3">
        
        {/* Title */}
        <div className="text-left">
           <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg break-keep">
              {deal.title}
           </h1>
           
           <div className="mt-1 flex items-baseline gap-2">
             <span className="text-yellow-400 font-bold text-3xl drop-shadow-md">{formattedDiscount}원 할인</span>
           </div>
        </div>

        {/* Store Info & Favorite Button Row (Moved Below Price) */}
        <div className="flex justify-between items-center mt-2">
             <div className="flex items-center gap-2 text-white/90 text-sm font-medium drop-shadow-md">
                <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold text-[10px]">{deal.restaurant.category}</span>
                <span className="text-white font-bold">{deal.restaurant.name}</span>
            </div>

            {/* Favorite Button (Pill Style) */}
            <button 
              onClick={toggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 active:scale-95 shadow-sm backdrop-blur-sm
                 ${isFavorite 
                    ? 'bg-red-500/80 border-red-500/30' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                 }
              `}
            >
               <Heart 
                 size={12} 
                 className={`transition-all duration-300
                    ${isFavorite ? 'fill-white text-white' : 'text-white'}
                    ${isHeartPopping ? 'animate-heart-burst' : ''}
                 `} 
               />
               <span className="text-[10px] font-bold text-white">
                 {isFavorite ? '즐겨찾는 매장' : '즐겨찾기 추가'}
               </span>
            </button>
        </div>

        {/* Distance Info (Moved Below Store Info, Right above Coupon) */}
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
             <span className="flex items-center gap-1">
               <MapPin size={10} /> {deal.restaurant.distance}m
             </span>
        </div>

        {/* --- TEAR COUPON UI --- */}
        <div className="relative w-full h-20 shadow-2xl">
            {/* Paper Texture Pattern */}
            <svg width="0" height="0">
              <filter id="paper-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
                  <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
              </filter>
            </svg>
            
            {/* PART 1: LEFT STUB (Static) */}
            <div className={`absolute left-0 top-0 bottom-0 w-[30%] z-10 
              rounded-l-xl overflow-hidden flex flex-col items-center justify-center border-r-2 border-dashed border-gray-300/50
              ${isTorn ? 'bg-gray-200' : 'bg-white coupon-pattern'}
            `}
            style={{
                WebkitMaskImage: 'radial-gradient(circle at 0px 50%, transparent 10px, black 10.5px)',
                maskImage: 'radial-gradient(circle at 0px 50%, transparent 10px, black 10.5px)'
            }}
            >
                 <div className={`text-center w-full px-1 flex flex-col items-center justify-center h-full ${isTorn ? 'opacity-50' : ''}`}>
                    {isTorn ? (
                         <span className="text-xs font-bold text-gray-500">사용<br/>완료</span>
                    ) : (
                        <>
                            <span className="text-[10px] text-gray-500 font-medium mb-0.5">남은수량</span>
                            <span className="text-2xl font-black text-red-600 leading-none">{remaining}</span>
                            {/* Updated Label: Auto width for fit */}
                            <div className="mt-1 px-3 py-1 bg-red-100 text-red-600 text-[9px] font-bold rounded-full animate-pulse">
                                마감임박
                            </div>
                        </>
                    )}
                 </div>
            </div>

            {/* PART 2: RIGHT TICKET (Draggable) */}
            <div 
                className={`absolute left-[30%] top-0 bottom-0 right-0 z-20
                  rounded-r-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none
                  flex items-center justify-between px-4
                  ${isTorn ? 'bg-gray-200' : remaining === 0 ? 'bg-gray-400' : 'bg-white coupon-pattern'}
                `}
                style={{
                    transform: isTorn 
                        ? `translateX(${dragX + 60}px) rotate(${dragX * 0.15}deg) translateY(20px)` 
                        : `translateX(${dragX}px)`,
                    transition: isDragging ? 'none' : 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: isTorn ? 0 : 1,
                    pointerEvents: isTorn ? 'none' : 'auto',
                    WebkitMaskImage: 'radial-gradient(circle at 100% 50%, transparent 10px, black 10.5px)',
                    maskImage: 'radial-gradient(circle at 100% 50%, transparent 10px, black 10.5px)'
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                {/* Dashed line on the left to match stub */}
                <div className="absolute left-0 top-2 bottom-2 w-px border-l border-dashed border-gray-300"></div>

                {remaining === 0 ? (
                    <span className="w-full text-center font-bold text-gray-100 text-lg">선착순 마감되었습니다</span>
                ) : (
                    <>
                        <div className="flex flex-col items-start pl-2">
                            <span className="text-sm font-bold text-gray-900">쿠폰 뜯어서 받기</span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Clock size={10} /> {timeLeft}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {isDragging ? (
                                <span className="text-xs font-bold text-red-500 animate-pulse whitespace-nowrap">계속 당기세요!</span>
                            ) : (
                                <div className="flex items-center text-gray-400">
                                     <ChevronRight size={16} className="animate-flow-arrow" style={{animationDelay:'0ms'}}/>
                                     <ChevronRight size={16} className="animate-flow-arrow" style={{animationDelay:'100ms'}}/>
                                     <ChevronRight size={16} className="animate-flow-arrow" style={{animationDelay:'200ms'}}/>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Success Message Layer (Revealed when torn) */}
            {isTorn && (
                <div className="absolute left-[30%] top-0 bottom-0 right-0 flex flex-col items-center justify-center z-0 animate-fade-in-up">
                     <div className="flex items-center gap-1.5 text-green-400 mb-1">
                         <CheckCircle size={18} className="fill-green-400 text-gray-900" />
                         <span className="text-base font-bold text-white shadow-black drop-shadow-md">쿠폰 발급 완료!</span>
                     </div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onUseCoupon?.(); }}
                        className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-transform"
                     >
                        지금 사용하러 가기
                     </button>
                </div>
            )}
            
        </div>
      </div>

      <style>{`
        .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flowArrow {
            0% { opacity: 0.3; transform: translateX(0); }
            50% { opacity: 1; transform: translateX(3px); color: #ef4444; }
            100% { opacity: 0.3; transform: translateX(0); }
        }
        .animate-flow-arrow { animation: flowArrow 1.5s infinite ease-in-out; }
        @keyframes heartBurst {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
        .animate-heart-burst { animation: heartBurst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        
        /* New Coupon Pattern Animation */
        .coupon-pattern {
            background-color: #ffffff;
            background-image: repeating-linear-gradient(
                45deg,
                #f8fafc,
                #f8fafc 10px,
                #ffffff 10px,
                #ffffff 20px
            );
            background-size: 28px 28px;
            animation: moveStripes 20s linear infinite;
        }
        @keyframes moveStripes {
            from { background-position: 0 0; }
            to { background-position: 56px 0; }
        }
      `}</style>
    </div>
  );
};