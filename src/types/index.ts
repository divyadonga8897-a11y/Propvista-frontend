// ─── Core Enums ──────────────────────────────────────────────
export type UserRole = "Admin" | "Customer" | "Resident";

export type FlatStatus = "Available" | "Held" | "Sold" | "Rented";
export type BookingType = "Buy" | "Rent";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";
export type MaintenanceStatus = "Paid" | "Pending" | "Overdue";
export type ComplaintStatus = "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
export type PaymentStatus = "Successful" | "Failed" | "Pending";

// ─── Auth ─────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

// ─── Real Estate ──────────────────────────────────────────────
export interface City {
  id: string;
  name: string;
  state?: string;
  country: string;
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
  created_at: string;
  // Virtual / joined
  city?: City;
  floors?: Floor[];
  available_flats?: number;
  total_flats?: number;
  min_price?: number;
}

export interface Floor {
  id: string;
  apartment_id: string;
  floor_number: number;
  description?: string;
  flats?: Flat[];
}

export interface Flat {
  id: string;
  floor_id: string;
  flat_number: string;
  flat_type: string; // Studio, 2BHK, 3BHK, 4BHK
  area_sqft: number;
  facing_direction: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  parking_slots: number;
  price_buy?: number;
  price_rent?: number;
  maintenance_fee: number;
  status: FlatStatus;
  short_description?: string;
  long_description?: string;
  created_at: string;
  images?: FlatImage[];
  // Virtual / joined
  floor_number?: number;
  apartment_name?: string;
  apartment_id?: string;
}

export interface FlatImage {
  id: string;
  flat_id: string;
  image_url: string;
  display_order: number;
}

// ─── Bookings & Payments ──────────────────────────────────────
export interface Booking {
  id: string;
  flat_id: string;
  user_id: string;
  booking_type: BookingType;
  amount_paid: number;
  status: BookingStatus;
  created_at: string;
  flat?: Flat;
}

export interface Payment {
  id: string;
  booking_id: string;
  transaction_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method?: string;
  created_at: string;
}

export interface ResidentProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  flat_id: string;
  flat_number: string;
  apartment_name: string;
  floor_number: number;
  resident_type: string;
  move_in_date?: string;
  status: string;
  agreement_number?: string;
  emergency_contact?: any;
}

export interface ResidentProperty {
  flat_id: string;
  flat_number: string;
  flat_type: string;
  apartment_name: string;
  floor_number: number;
  area_sqft: number;
  facing_direction: string;
  resident_type: string;
  move_in_date?: string;
  maintenance_fee: number;
  agreement_number?: string;
  status: string;
  owner_name?: string;
}

export interface MaintenanceBill {
  id: string;
  resident_id: string;
  flat_id: string;
  flat_number: string;
  apartment_name: string;
  month: number;
  year: number;
  amount: number;
  due_date: string;
  late_fee: number;
  payment_status: string;
  payment_date?: string;
  created_at: string;
}

export interface MaintenanceListResponse {
  records: MaintenanceBill[];
  total: number;
}

export interface RentRecord {
  id: string;
  resident_id: string;
  flat_id: string;
  flat_number: string;
  month: number;
  year: number;
  amount: number;
  due_date: string;
  payment_status: string;
  payment_date?: string;
  outstanding_balance: number;
  created_at: string;
}

export interface RentListResponse {
  records: RentRecord[];
  outstanding_total: number;
  total: number;
}

export interface Announcement {
  id: string;
  apartment_id: string;
  title: string;
  content: string;
  announcement_type: string;
  publish_date?: string;
  created_by?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  apartment_id: string;
  apartment_name: string;
  resident_id: string;
  user_id: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  assigned_to?: string;
  resolution_note?: string;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  resident_id: string;
  visitor_name: string;
  phone?: string;
  purpose?: string;
  visit_date: string;
  visit_time: string;
  approval_status: string;
  qr_code?: string;
  flat_number: string;
  check_in?: string;
  check_out?: string;
}

export interface Vehicle {
  id: string;
  resident_id: string;
  vehicle_type: string;
  vehicle_number: string;
  parking_slot?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  color?: string;
}

export interface FacilityBooking {
  id: string;
  apartment_name: string;
  facility_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  notes?: string;
  status: string;
  created_at: string;
}

export interface CommunityRule {
  id: string;
  apartment_id: string;
  title: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface Document {
  id: string;
  flat_id: string;
  name: string;
  file_url: string;
  doc_type: string; // Agreement, Receipt, etc.
  created_at: string;
}

export interface ComplaintUpdateRequest {
  category?: string;
  priority?: string;
  title?: string;
  description?: string;
}

export interface CreateComplaintRequest {
  category: string;
  priority: string;
  title: string;
  description: string;
}

export interface RegisterVisitorRequest {
  visitor_name: string;
  phone?: string;
  purpose?: string;
  visit_date: string;
  visit_time: string;
}

export interface RegisterVehicleRequest {
  vehicle_type: string;
  vehicle_number: string;
  vehicle_make?: string;
  vehicle_model?: string;
  color?: string;
}

export interface BookFacilityRequest {
  facility_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  notes?: string;
}

// ─── API Responses ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  count?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
