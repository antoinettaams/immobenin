export interface Property {
  id: number;
  title: string;
  type: string;
  category: "HOUSE" | "OFFICE" | "EVENT";
  subType: string;
  location: string;
  city: string;
  address: string;
  price: number;
  currency: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  wifi: boolean;
  amenities: string[];
  description?: string;
  owner: {
    name: string;
    phone: string;
    email?: string;
  };
  size?: number | null;
  floors?: number | null;
  isPublished: boolean;
  
  // Champs spécifiques
  maxGuests?: number | null;
  employees?: number | null;
  eventCapacity?: number | null;
  parkingSpots?: number | null;
  meetingRooms?: number | null;
  
  // Informations de prix
  cleaningFee?: number | null;
  extraGuestFee?: number | null;
  securityDeposit?: number | null;
  weeklyDiscount?: number | null;
  monthlyDiscount?: number | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}