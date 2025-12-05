import React from 'react';
import { Search, Ticket, User } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const getIconColor = (tab: AppTab) => currentTab === tab ? 'text-white' : 'text-gray-500';

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-md border-t border-gray-800 flex justify-around items-center px-6 pb-2 z-50">
      <button onClick={() => onTabChange(AppTab.SEARCH)} className="flex flex-col items-center p-2 w-16">
        <Search className={`w-6 h-6 ${getIconColor(AppTab.SEARCH)}`} />
        <span className={`text-xs mt-1 ${getIconColor(AppTab.SEARCH)}`}>검색</span>
      </button>
      <button onClick={() => onTabChange(AppTab.COUPONS)} className="flex flex-col items-center p-2 w-16">
        <Ticket className={`w-6 h-6 ${getIconColor(AppTab.COUPONS)}`} />
        <span className={`text-xs mt-1 ${getIconColor(AppTab.COUPONS)}`}>내 쿠폰</span>
      </button>
      <button onClick={() => onTabChange(AppTab.PROFILE)} className="flex flex-col items-center p-2 w-16">
        <User className={`w-6 h-6 ${getIconColor(AppTab.PROFILE)}`} />
        <span className={`text-xs mt-1 ${getIconColor(AppTab.PROFILE)}`}>내 정보</span>
      </button>
    </div>
  );
};