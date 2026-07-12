import apiClient from "@/lib/apiClient";
import {
  City,
  Apartment,
  ApartmentDetail,
  Floor,
  Flat,
  DashboardStats,
  ApartmentGalleryImage,
} from "@/types/real-estate";
import { getFlatById as getMockFlatById } from "@/data/mockData";

const isUUID = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

import type {
  ResidentProfile,
  ResidentProperty,
  MaintenanceBill,
  MaintenanceListResponse,
  RentRecord,
  RentListResponse,
  Announcement,
  Complaint,
  Visitor,
  Vehicle,
  FacilityBooking,
  CommunityRule,
  Document,
  ComplaintUpdateRequest,
  CreateComplaintRequest,
  RegisterVisitorRequest,
  RegisterVehicleRequest,
  BookFacilityRequest,
} from "@/types";

export const apiService = {
  // Cities
  getCities: async (): Promise<City[]> => {
    const { data } = await apiClient.get("/api/v1/cities");
    return data;
  },

  // Apartments
  getApartments: async (params?: {
    city_id?: string;
    search?: string;
    status?: string;
  }): Promise<Apartment[]> => {
    const { data } = await apiClient.get("/api/v1/apartments", { params });
    return data;
  },

  getApartmentById: async (id: string): Promise<ApartmentDetail> => {
    const { data } = await apiClient.get(`/api/v1/apartments/${id}`);
    return data;
  },

  createApartment: async (apartment: Omit<Apartment, "id" | "created_at"> & { city_id: string }): Promise<Apartment> => {
    const { data } = await apiClient.post("/api/v1/apartments", apartment);
    return data;
  },

  updateApartment: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    const { data } = await apiClient.put(`/api/v1/apartments/${id}`, apartment);
    return data;
  },

  deleteApartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/apartments/${id}`);
  },

  activateApartment: async (id: string): Promise<Apartment> => {
    const { data } = await apiClient.patch(`/api/v1/apartments/${id}/activate`);
    return data;
  },

  deactivateApartment: async (id: string): Promise<Apartment> => {
    const { data } = await apiClient.patch(`/api/v1/apartments/${id}/deactivate`);
    return data;
  },

  addApartmentGalleryImage: async (
    apartmentId: string,
    image: { image_url: string; caption?: string; display_order?: number }
  ): Promise<ApartmentGalleryImage> => {
    const { data } = await apiClient.post(`/api/v1/apartments/${apartmentId}/gallery`, image);
    return data;
  },

  deleteApartmentGalleryImage: async (apartmentId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/apartments/${apartmentId}/gallery/${imageId}`);
  },

  // Floors
  getFloorsByApartment: async (apartmentId: string): Promise<Floor[]> => {
    const { data } = await apiClient.get(`/api/v1/apartments/${apartmentId}/floors`);
    return data;
  },

  createFloor: async (apartmentId: string, floorNumber: number, floorName?: string, description?: string): Promise<Floor> => {
    const { data } = await apiClient.post(`/api/v1/apartments/${apartmentId}/floors`, null, {
      params: { floor_number: floorNumber, floor_name: floorName, description },
    });
    return data;
  },

  updateFloor: async (floorId: string, floor: { floor_number?: number; floor_name?: string; description?: string }): Promise<Floor> => {
    const { data } = await apiClient.put(`/api/v1/floors/${floorId}`, floor);
    return data;
  },

  deleteFloor: async (floorId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/floors/${floorId}`);
  },

  // Flats
  getFlats: async (params?: {
    apartment_id?: string;
    floor_id?: string;
    flat_type?: string;
    facing_direction?: string;
    status?: string;
    listing_type?: string;
    sort_by?: string;
  }): Promise<Flat[]> => {
    const { data } = await apiClient.get("/api/v1/flats", { params });
    return data;
  },

  getFlatById: async (id: string): Promise<Flat> => {
    if (!isUUID(id)) {
      const mockFlat = getMockFlatById(id);
      if (mockFlat) return mockFlat;
      throw new Error(`Flat with mock ID ${id} not found`);
    }

    try {
      const { data } = await apiClient.get(`/api/v1/flats/${id}`, {
        timeout: 4000,
        headers: { "X-No-Redirect": "true" }
      });
      return data;
    } catch (err) {
      console.warn("Backend flat fetch failed or timed out. Falling back to local mock data.", err);
      const mockFlat = getMockFlatById(id);
      if (mockFlat) return mockFlat;

      return {
        id,
        floor_id: "7b47b250-9366-4c74-8d48-8eb0db2e2e71",
        flat_number: "102",
        apartment_name: "PropVista Heights",
        apartment_id: "55459b21-88bf-4344-896e-0c4ec3a02ccb",
        floor_name: "First Floor",
        floor_number: 1,
        flat_type: "2BHK",
        facing_direction: "South",
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        parking_slots: 1,
        hall: 1,
        kitchen: 1,
        dining: 1,
        area_sqft: 1050,
        price_buy: 7800000,
        price_rent: 25000,
        maintenance_fee: 2500,
        status: "Available",
        created_at: new Date().toISOString(),
        images: [
          {
            id: "img-1",
            flat_id: id,
            image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
            image_type: "Gallery",
            caption: "Spacious Living Room",
            display_order: 1
          }
        ]
      };
    }
  },

  createFlat: async (floorId: string, flat: Omit<Flat, "id" | "created_at" | "images">): Promise<Flat> => {
    const { data } = await apiClient.post("/api/v1/flats", flat, {
      params: { floor_id: floorId },
    });
    return data;
  },

  updateFlat: async (id: string, flat: Partial<Flat>): Promise<Flat> => {
    const { data } = await apiClient.put(`/api/v1/flats/${id}`, flat);
    return data;
  },

  deleteFlat: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/flats/${id}`);
  },

  changeFlatStatus: async (id: string, status: string): Promise<Flat> => {
    const { data } = await apiClient.patch(`/api/v1/flats/${id}/status`, { status });
    return data;
  },

  duplicateFlat: async (id: string, targetFloorId: string, newFlatNumber: string): Promise<Flat> => {
    const { data } = await apiClient.post(`/api/v1/flats/${id}/duplicate`, {
      target_floor_id: targetFloorId,
      new_flat_number: newFlatNumber,
    });
    return data;
  },

  moveFlat: async (id: string, targetFloorId: string): Promise<Flat> => {
    const { data } = await apiClient.post(`/api/v1/flats/${id}/move`, {
      target_floor_id: targetFloorId,
    });
    return data;
  },

  addFlatImage: async (
    flatId: string,
    image: { image_url: string; image_type?: string; caption?: string; display_order?: number }
  ): Promise<any> => {
    const { data } = await apiClient.post(`/api/v1/flats/${flatId}/images`, null, {
      params: {
        image_url: image.image_url,
        image_type: image.image_type,
        caption: image.caption,
        display_order: image.display_order,
      },
    });
    return data;
  },

  deleteFlatImage: async (flatId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/flats/${flatId}/images/${imageId}`);
  },

  // Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get("/api/v1/apartments/stats");
    return data;
  },

  // ── Bookings & Payments (Stage 3) ──
  holdFlat: async (flatId: string): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/booking/hold", { flat_id: flatId });
    return data;
  },

  createBooking: async (flatId: string, bookingType: "BUY" | "RENT"): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/booking/create", { flat_id: flatId, booking_type: bookingType });
    return data;
  },

  getBookingHistory: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/booking/history");
    return data;
  },

  getBookingById: async (id: string): Promise<any> => {
    const { data } = await apiClient.get(`/api/v1/booking/${id}`);
    return data;
  },

  // ── Resident Access Requests ──
  getResidentAccessRequests: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/resident-access/pending");
    return data;
  },

  getAllResidentAccessRequests: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/resident-access/all");
    return data;
  },

  getMyResidentAccessRequests: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/resident-access/me");
    return data;
  },

  createResidentAccessRequest: async (body: { booking_id: string; flat_id: string; document_id?: string }): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/resident-access/", body);
    return data;
  },

  getCurrentUser: async (): Promise<any> => {
    const { data } = await apiClient.get("/api/v1/auth/me");
    return data;
  },

  approveResidentAccessRequest: async (id: string, remarks: string = ""): Promise<any> => {
    const { data } = await apiClient.post(`/api/v1/resident-access/${id}/approve`, { remarks });
    return data;
  },

  rejectResidentAccessRequest: async (id: string, remarks: string = ""): Promise<any> => {
    const { data } = await apiClient.post(`/api/v1/resident-access/${id}/reject`, { remarks });
    return data;
  },


  cancelBooking: async (id: string): Promise<any> => {
    const { data } = await apiClient.post(`/api/v1/booking/${id}/cancel`);
    return data;
  },

  // ── Site Visits (Stage 6) ──
  getSiteVisits: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/site-visits");
    return data;
  },

  scheduleSiteVisit: async (body: any): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/site-visits", body);
    return data;
  },

  updateSiteVisitStatus: async (id: string, status: string): Promise<any> => {
    const { data } = await apiClient.patch(`/api/v1/site-visits/${id}/status`, null, { params: { status } });
    return data;
  },
  // ── Notifications ──

  getNotifications: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/notifications");
    return data;
  },

  createNotification: async (body: {
    user_id: string;
    title: string;
    message: string;
  }): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/notifications", body);
    return data;
  },

  markNotificationAsRead: async (id: string): Promise<any> => {
    const { data } = await apiClient.put(`/api/v1/notifications/${id}/read`);
    return data;
  },

  markAllNotificationsAsRead: async (): Promise<any> => {
    const { data } = await apiClient.put("/api/v1/notifications/read-all");
    return data;
  },
  // ── Audit Logs (Stage 6) ──
  getAuditLogs: async (limit: number = 100): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/audit-logs", { params: { limit } });
    return data;
  },

  createPaymentOrder: async (
    bookingId: string,
    amount: number,
    paymentType: string = "Advance Booking"
  ): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/payments/create-order", {
      booking_id: bookingId,
      amount,
      payment_type: paymentType,
    });
    return data;
  },

  completePaymentLocal: async (
    bookingId: string,
    amount: number,
    paymentType: string = "Advance Booking"
  ): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/payments/complete-local", {
      booking_id: bookingId,
      amount,
      payment_type: paymentType,
    });
    return data;
  },
  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/payments/verify", {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });
    return data;
  },

  getPaymentHistory: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/api/v1/payments/history");
    return data;
  },

  getResidentProfile: async (): Promise<ResidentProfile> => {
    const { data } = await apiClient.get("/api/v1/resident/profile");
    return data;
  },

  getMyProperty: async (): Promise<ResidentProperty> => {
    const { data } = await apiClient.get("/api/v1/resident/property");
    return data;
  },

  getMaintenanceBills: async (payment_status?: string): Promise<MaintenanceListResponse> => {
    const { data } = await apiClient.get("/api/v1/maintenance", { params: { payment_status } });
    return data;
  },

  payMaintenanceBill: async (billId: string): Promise<any> => {
    const { data } = await apiClient.post("/api/v1/maintenance/pay", { bill_id: billId });
    return data;
  },

  getRentRecords: async (payment_status?: string): Promise<RentListResponse> => {
    const { data } = await apiClient.get("/api/v1/rent", { params: { payment_status } });
    return data;
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    const { data } = await apiClient.get("/api/v1/announcements");
    return data.announcements || [];
  },

  getCommunityFeed: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/api/v1/community-feed");
      return data || [];
    } catch {
      return [];
    }
  },

  createCommunityPost: async (body: { content: string }): Promise<any> => {
    try {
      const { data } = await apiClient.post("/api/v1/community-feed", body);
      return data;
    } catch {
      return null;
    }
  },

  getEmergencyContacts: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/api/v1/emergency-contacts");
      return data || [];
    } catch {
      return [];
    }
  },

  getCommunityEvents: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/api/v1/community-events");
      return data || [];
    } catch {
      return [];
    }
  },

  rsvpEvent: async (eventId: string, body: { status: string }): Promise<any> => {
    try {
      const { data } = await apiClient.post(`/api/v1/community-events/${eventId}/rsvp`, body);
      return data;
    } catch {
      return null;
    }
  },

  createReferral: async (body: any): Promise<any> => {
    try {
      const { data } = await apiClient.post("/api/v1/referrals", body);
      return data;
    } catch {
      return null;
    }
  },

  getCommunityWhatsApp: async (): Promise<any> => {
    try {
      const { data } = await apiClient.get("/api/v1/community-whatsapp");
      return data;
    } catch {
      return null;
    }
  },

  getNoticeBoard: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/api/v1/notice-board");
      return data || [];
    } catch {
      return [];
    }
  },

  getResidentIdCard: async (): Promise<any> => {
    try {
      const { data } = await apiClient.get("/api/v1/resident/id-card");
      return data;
    } catch {
      return null;
    }
  },

  getResidents: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get("/api/v1/residents");
      return data || [];
    } catch {
      return [];
    }
  },

  updateResidentProfile: async (body: any): Promise<any> => {
    try {
      const { data } = await apiClient.put("/api/v1/resident/profile", body);
      return data;
    } catch {
      return null;
    }
  },

  createAnnouncement: async (body: { title: string; content: string; announcement_type: string }): Promise<Announcement> => {
    const { data } = await apiClient.post("/api/v1/announcements", body);
    return data;
  },

  createComplaint: async (body: CreateComplaintRequest): Promise<Complaint> => {
    const { data } = await apiClient.post("/api/v1/complaints", body);
    return data;
  },

  updateComplaint: async (id: string, body: ComplaintUpdateRequest): Promise<Complaint> => {
    const { data } = await apiClient.put(`/api/v1/complaints/${id}`, body);
    return data;
  },

  getComplaintsHistory: async (): Promise<Complaint[]> => {
    const { data } = await apiClient.get("/api/v1/complaints/history");
    return data.complaints || [];
  },

  getVisitors: async (): Promise<Visitor[]> => {
    const { data } = await apiClient.get("/api/v1/visitors");
    return data.visitors || [];
  },

  registerVisitor: async (body: RegisterVisitorRequest): Promise<Visitor> => {
    const { data } = await apiClient.post("/api/v1/visitors", body);
    return data;
  },

  getVehicles: async (): Promise<Vehicle[]> => {
    const { data } = await apiClient.get("/api/v1/vehicles");
    return data;
  },

  registerVehicle: async (body: RegisterVehicleRequest): Promise<Vehicle> => {
    const { data } = await apiClient.post("/api/v1/vehicles", body);
    return data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/vehicles/${id}`);
  },

  getFacilityBookings: async (): Promise<FacilityBooking[]> => {
    const { data } = await apiClient.get("/api/v1/facilities");
    return data.bookings || [];
  },

  bookFacility: async (body: BookFacilityRequest): Promise<FacilityBooking> => {
    const { data } = await apiClient.post("/api/v1/facilities/book", body);
    return data;
  },

  getCommunityRules: async (): Promise<CommunityRule[]> => {
    const { data } = await apiClient.get("/api/v1/community-rules");
    return data;
  },

  getDocuments: async (): Promise<Document[]> => {
    const { data } = await apiClient.get("/api/v1/documents");
    return data;
  },

  // ─── AI Intelligence Layer (Stage 5) ───────────────────────────────────────

  aiChat: async (messages: { role: string; content: string }[]): Promise<{ reply: string; model: string; tokens_used: number }> => {
    const { data } = await apiClient.post("/api/v1/ai/chat", { messages });
    return data;
  },

  aiSearch: async (query: string): Promise<{ results: { type: string; title: string; detail: string; link: string }[]; count: number }> => {
    const { data } = await apiClient.post("/api/v1/ai/search", { query });
    return data;
  },

  aiResidentChat: async (messages: { role: string; content: string }[]): Promise<{ reply: string; model: string; tokens_used: number }> => {
    const { data } = await apiClient.post("/api/v1/ai/resident", { messages });
    return data;
  },

  aiAdminChat: async (messages: { role: string; content: string }[]): Promise<{ reply: string; model: string; tokens_used: number }> => {
    const { data } = await apiClient.post("/api/v1/ai/admin", { messages });
    return data;
  },

  aiAnalyzeComplaint: async (description: string): Promise<{ category: string; priority: string; title: string; summary: string }> => {
    const { data } = await apiClient.post("/api/v1/ai/complaint", { description });
    return data;
  },

  aiGenerateAnnouncement: async (topic: string): Promise<{ title: string; content: string; announcement_type: string }> => {
    const { data } = await apiClient.post("/api/v1/ai/announcement", { topic });
    return data;
  },
};

export default apiService;
