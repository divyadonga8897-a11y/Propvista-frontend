export interface City {
  id: string;
  name: string;
  state?: string;
  country: string;
}

export interface ApartmentGalleryImage {
  id: string;
  apartment_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

export interface Apartment {
  id: string;
  city_id: string;
  name: string;
  description?: string;
  address: string;
  cover_image?: string;
  status: string;
  total_floors: number;
  owner_name?: string;
  contact_number?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  builder_name?: string;
  construction_status: string;
  possession_status: string;
  amenities?: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface FlatImage {
  id: string;
  flat_id: string;
  image_url: string;
  image_type?: string;
  caption?: string;
  display_order: number;
}

export interface Flat {
  id: string;
  floor_id: string;
  apartment_id?: string;
  flat_number: string;
  flat_type: string;
  area_sqft: number;
  facing_direction: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  parking_slots: number;
  hall: number;
  kitchen: number;
  dining: number;
  price_buy?: number | null;
  price_rent?: number | null;
  maintenance_fee: number;
  status: string; // Available, Held, Sold, Rented, Reserved
  short_description?: string;
  long_description?: string;
  created_at: string;
  images: FlatImage[];
  floor_number?: number;
  floor_name?: string;
  apartment_name?: string;
  city_name?: string;
}

export interface Floor {
  id: string;
  apartment_id: string;
  floor_number: number;
  floor_name?: string;
  description?: string;
  flats?: Flat[];
}

export interface ApartmentDetail extends Apartment {
  floors: Floor[];
  city: City;
  gallery_images: ApartmentGalleryImage[];
}

export interface DashboardStats {
  total_apartments: number;
  active_apartments: number;
  total_floors: number;
  total_flats: number;
  available_flats: number;
  held_flats: number;
  sold_flats: number;
  rented_flats: number;
  reserved_flats: number;
}
