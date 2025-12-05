import { Deal } from '../types';

const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-001',
    title: '굴보쌈 정식',
    originalPrice: 15000,
    discountAmount: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop', 
    totalCoupons: 50,
    remainingCoupons: 3,
    expiresAt: new Date(new Date().getTime() + 3600 * 1000),
    restaurant: {
      id: 'rest-001',
      name: '통영 굴마을 본점',
      category: '한식',
      distance: 120,
      rating: 4.8,
      reviewCount: 342
    }
  },
  {
    id: 'deal-002',
    title: '치즈 폭포 피자',
    originalPrice: 24000,
    discountAmount: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    totalCoupons: 30,
    remainingCoupons: 5,
    expiresAt: new Date(new Date().getTime() + 7200 * 1000),
    restaurant: {
      id: 'rest-002',
      name: '피자 팩토리',
      category: '양식',
      distance: 350,
      rating: 4.5,
      reviewCount: 128
    }
  },
  {
    id: 'deal-003',
    title: '프리미엄 초밥 세트',
    originalPrice: 32000,
    discountAmount: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop',
    totalCoupons: 20,
    remainingCoupons: 2,
    expiresAt: new Date(new Date().getTime() + 1800 * 1000),
    restaurant: {
      id: 'rest-003',
      name: '스시 마스터',
      category: '일식',
      distance: 500,
      rating: 4.9,
      reviewCount: 892
    }
  },
  {
    id: 'deal-004',
    title: '수제 버거 더블',
    originalPrice: 12000,
    discountAmount: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop',
    totalCoupons: 100,
    remainingCoupons: 12,
    expiresAt: new Date(new Date().getTime() + 5400 * 1000),
    restaurant: {
      id: 'rest-004',
      name: '버거 스테이션',
      category: '패스트푸드',
      distance: 50,
      rating: 4.3,
      reviewCount: 56
    }
  }
];

export const fetchFlashDeals = async (): Promise<Deal[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DEALS);
    }, 500);
  });
};