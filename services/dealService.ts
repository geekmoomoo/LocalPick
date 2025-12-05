import { Deal } from '../types';

// Updated with high-quality, vertical aspect ratio (9:16) images that look like AI-generated food photography.
const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-001',
    title: '특선 모듬 초밥 12p',
    originalPrice: 22000,
    discountAmount: 7000,
    // Vertical Sushi Platter
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1287&auto=format&fit=crop', 
    totalCoupons: 50,
    remainingCoupons: 3,
    expiresAt: new Date(new Date().getTime() + 3600 * 1000), 
    restaurant: {
      id: 'rest-001',
      name: '상무초밥 본점',
      category: '일식',
      distance: 350,
      rating: 4.9,
      reviewCount: 2350
    }
  },
  {
    id: 'deal-002',
    title: '토마호크 스테이크 세트',
    originalPrice: 128000,
    discountAmount: 40000,
    // Vertical Steak Closeup
    imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 10,
    remainingCoupons: 2,
    expiresAt: new Date(new Date().getTime() + 7200 * 1000),
    restaurant: {
      id: 'rest-002',
      name: '어나더키친 상무점',
      category: '양식',
      distance: 520,
      rating: 4.8,
      reviewCount: 890
    }
  },
  {
    id: 'deal-003',
    title: '수제 담양식 돼지갈비 2인',
    originalPrice: 36000,
    discountAmount: 12000,
    // Grilled Meat Vertical
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 30,
    remainingCoupons: 8,
    expiresAt: new Date(new Date().getTime() + 5400 * 1000),
    restaurant: {
      id: 'rest-003',
      name: '금호동 명가 갈비',
      category: '한식',
      distance: 1200,
      rating: 4.6,
      reviewCount: 432
    }
  },
  {
    id: 'deal-004',
    title: '매운 철판 쭈꾸미 볶음',
    originalPrice: 28000,
    discountAmount: 9000,
    // High quality spicy food image replacing the broken Google Drive link
    imageUrl: 'https://images.unsplash.com/photo-1582538884036-d885ac6e3913?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    totalCoupons: 40,
    remainingCoupons: 15,
    expiresAt: new Date(new Date().getTime() + 9000 * 1000),
    restaurant: {
      id: 'rest-004',
      name: '신쭈꾸미 상무본점',
      category: '한식',
      distance: 450,
      rating: 4.7,
      reviewCount: 1560
    }
  },
  {
    id: 'deal-005',
    title: '딸기 듬뿍 생크림 케이크',
    originalPrice: 42000,
    discountAmount: 15000,
    // Strawberry Cake
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 20,
    remainingCoupons: 5,
    expiresAt: new Date(new Date().getTime() + 2400 * 1000),
    restaurant: {
      id: 'rest-005',
      name: '카페 304',
      category: '카페/디저트',
      distance: 600,
      rating: 4.8,
      reviewCount: 3200
    }
  },
  {
    id: 'deal-006',
    title: '옛날 가마솥 통닭 한마리',
    originalPrice: 21000,
    discountAmount: 6000,
    // Fried Chicken
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 100,
    remainingCoupons: 42,
    expiresAt: new Date(new Date().getTime() + 12000 * 1000),
    restaurant: {
      id: 'rest-006',
      name: '양동통닭 서구점',
      category: '치킨',
      distance: 2100,
      rating: 4.5,
      reviewCount: 512
    }
  },
  {
    id: 'deal-007',
    title: '연어 포케 & 아보카도 샐러드',
    originalPrice: 16000,
    discountAmount: 4500,
    // Salmon Poke Bowl
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 25,
    remainingCoupons: 1,
    expiresAt: new Date(new Date().getTime() + 1200 * 1000),
    restaurant: {
      id: 'rest-007',
      name: '보울레시피 풍암점',
      category: '샐러드',
      distance: 1800,
      rating: 4.7,
      reviewCount: 210
    }
  },
  {
    id: 'deal-008',
    title: '더블 치즈 수제버거 세트',
    originalPrice: 14500,
    discountAmount: 5000,
    // Juicy Burger Vertical
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 60,
    remainingCoupons: 28,
    expiresAt: new Date(new Date().getTime() + 6400 * 1000),
    restaurant: {
      id: 'rest-008',
      name: '프랭크버거 치평점',
      category: '버거',
      distance: 250,
      rating: 4.4,
      reviewCount: 180
    }
  },
  {
    id: 'deal-009',
    title: '화덕 고르곤졸라 피자',
    originalPrice: 19000,
    discountAmount: 8000,
    // Cheesy Pizza Vertical
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 15,
    remainingCoupons: 0, 
    expiresAt: new Date(new Date().getTime() - 1000),
    restaurant: {
      id: 'rest-009',
      name: '로니로티 광주상무점',
      category: '양식',
      distance: 400,
      rating: 4.5,
      reviewCount: 950
    }
  },
  {
    id: 'deal-010',
    title: '얼큰 차돌 짬뽕',
    originalPrice: 13000,
    discountAmount: 4000,
    // Red Spicy Noodle Soup Vertical
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1287&auto=format&fit=crop',
    totalCoupons: 45,
    remainingCoupons: 12,
    expiresAt: new Date(new Date().getTime() + 4800 * 1000),
    restaurant: {
      id: 'rest-010',
      name: '신락원 상무점',
      category: '중식',
      distance: 650,
      rating: 4.6,
      reviewCount: 1120
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