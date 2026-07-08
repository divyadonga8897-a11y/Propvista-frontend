import apiClient from "@/lib/apiClient";
import type { Apartment, Floor, Flat, ApiResponse } from "@/types";

const BASE = "/api/v1";

// ─── Apartments ───────────────────────────────────────────────
export const apartmentService = {
  /** Fetch all apartments (optionally with city filter) */
  getApartments: async (): Promise<Apartment[]> => {
    const { data } = await apiClient.get(`${BASE}/apartments`);
    return data;
  },

  /** Fetch single apartment with floors + flats */
  getApartmentById: async (id: string): Promise<Apartment> => {
    const { data } = await apiClient.get(`${BASE}/apartments/${id}`);
    return data;
  },

  /** Fetch all flats for an apartment (all floors) */
  getFlats: async (apartmentId: string): Promise<Flat[]> => {
    const { data } = await apiClient.get(`${BASE}/flats`, {
      params: { apartment_id: apartmentId },
    });
    return data;
  },

  /** Fetch a single flat by ID */
  getFlatById: async (flatId: string): Promise<Flat> => {
    const { data } = await apiClient.get(`${BASE}/flats/${flatId}`);
    return data;
  },
};

export default apartmentService;
