export interface Review {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date?: Date;
}

export interface Host {
  name: string;
  avatar: string;
  isSuperHost?: boolean;
  isIdentityVerified?: boolean;
  guestCount?: number;
  rating?: string;
  reviewCount?: string;
  memberSince?: string;
  description?: string;
}

export interface Lieu {
  id: number;
  titre: string;
  ville: string;
  prix: number;
  type: string;
  photo?: string;
  photos: string[];
  description: string;
  lat: number;
  lng: number;
  note: number;
  equipements: string[];
  host: Host;
  reviews: Review[];
  capacity?: number;
  bedrooms?: number;
  bathrooms?: number;
  locationDescription?: string;
}