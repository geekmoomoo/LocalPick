export interface Restaurant {
  id: string;
  name: string;
  category: string;
  distance: number; // in meters
  rating: number;
  reviewCount: number;
}

export interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  discountAmount: number;
  imageUrl: string;
  totalCoupons: number;
  remainingCoupons: number;
  expiresAt: Date;
  restaurant: Restaurant;
}

export enum AppTab {
  SEARCH = 'SEARCH',
  COUPONS = 'COUPONS',
  PROFILE = 'PROFILE'
}