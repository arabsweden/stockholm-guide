export type Category = 
  | 'all'
  | 'historical'
  | 'museums'
  | 'nature'
  | 'palaces'
  | 'views'
  | 'entertainment';

export interface Attraction {
  id: string;
  name: string;
  swedishName: string;
  category: Category;
  categoryLabel: string;
  description: string;
  detailedInfo?: string;
  highlights: string[];
  latitude: number;
  longitude: number;
  address: string;
  metroStation: string;
  estimatedDuration: string;
  bestTimeToVisit: string;
  openingHours: string;
  ticketPrice: string;
  isFree: boolean;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  tags: string[];
  website?: string;
}

export type ViewMode = 'split' | 'map' | 'cards';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}
