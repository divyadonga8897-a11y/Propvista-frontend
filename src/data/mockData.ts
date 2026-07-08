// ============================================================
// PropVista AI — Stage 1 Mock Data
// City: Nandyal, Andhra Pradesh
// Apartments: Happy Homes | Green Valley Residency | Skyline Residency
// ============================================================

import { Flat, FlatImage } from "@/types/real-estate";

export interface Floor {
  id: string;
  apartment_id: string;
  floor_number: number;
  description: string;
  flats: Flat[];
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface NearbyPlace {
  id: string;
  place_name: string;
  category: "School" | "Hospital" | "Shopping" | "Transit" | "Temple" | "Bank";
  distance: number; // in km
}

export interface Apartment {
  id: string;
  name: string;
  description: string;
  address: string;
  cover_image: string;
  status: string;
  total_floors: number;
  owner_name: string;
  city_name: string;
  floors: Floor[];
  amenities: Amenity[];
  nearby_places: NearbyPlace[];
}

// -----------------------------------------------------------------
// Flat image pools
// -----------------------------------------------------------------
const FLAT_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
];

const DIRECTIONS: Flat["facing_direction"][] = [
  "North", "South", "East", "West", "North East", "North West", "South East", "South West"
];

const BHK_PER_FLOOR: Flat["flat_type"][][] = [
  ["2BHK", "2BHK", "3BHK", "2BHK", "3BHK", "2BHK", "2BHK", "3BHK"],
  ["2BHK", "3BHK", "2BHK", "2BHK", "3BHK", "2BHK", "3BHK", "2BHK"],
  ["3BHK", "2BHK", "2BHK", "3BHK", "2BHK", "3BHK", "2BHK", "2BHK"],
];

const STATUSES: Flat["status"][] = ["Available", "Available", "Available", "Held", "Available", "Rented", "Available", "Sold"];

function generateFlats(
  floorId: string, floorNum: number, aptId: string, aptName: string, aptIdx: number
): Flat[] {
  const bhkList = BHK_PER_FLOOR[(floorNum - 1) % 3];
  return Array.from({ length: 8 }, (_, i) => {
    const bhk = bhkList[i];
    const is2 = bhk === "2BHK";
    const dir = DIRECTIONS[(aptIdx * 8 + i) % 8];
    const status = STATUSES[i];
    const priceBuy = 3500000 + (floorNum * 100000) + (i * 50000) + (aptIdx * 200000);
    const priceRent = 8000 + (floorNum * 500) + (i * 200) + (aptIdx * 1000);
    const flatNum = `${floorNum}${String(i + 1).padStart(2, "0")}`;
    const flatId = `flat-${aptId}-f${floorNum}-${i}`;
    return {
      id: flatId,
      floor_id: floorId,
      flat_number: flatNum,
      flat_type: bhk,
      area_sqft: is2 ? 1050 : 1450,
      facing_direction: dir,
      bedrooms: is2 ? 2 : 3,
      bathrooms: 2,
      balconies: is2 ? 1 : 2,
      parking_slots: 1,
      hall: 1,
      kitchen: 1,
      dining: 1,
      created_at: new Date().toISOString(),
      price_buy: priceBuy,
      price_rent: priceRent,
      maintenance_fee: is2 ? 2500 : 3500,
      status,
      short_description: `Spacious ${bhk} flat on Floor ${floorNum} of ${aptName} with ${dir} facing.`,
      long_description: `This ${bhk} apartment at ${aptName} offers a thoughtfully designed layout with ${is2 ? 2 : 3} bedrooms, 2 bathrooms, ${is2 ? "1 balcony" : "2 balconies"}, and 1 parking slot. Featuring ${dir} facing windows, Italian marble flooring, modular kitchen, and premium bathroom fittings. Located in Nandyal, Andhra Pradesh.`,
      images: [
        {
          id: `img-${aptId}-f${floorNum}-${i}-1`,
          flat_id: flatId,
          image_url: FLAT_IMAGES[(i) % 8],
          display_order: 1,
          image_type: "interior",
          caption: "Living Room",
        },
        {
          id: `img-${aptId}-f${floorNum}-${i}-2`,
          flat_id: flatId,
          image_url: FLAT_IMAGES[(i + 1) % 8],
          display_order: 2,
          image_type: "interior",
          caption: "Bedroom",
        },
      ],
      floor_number: floorNum,
      apartment_name: aptName,
      apartment_id: aptId,
    };
  });
}

function generateFloors(aptId: string, aptName: string, aptIdx: number, totalFloors: number): Floor[] {
  return Array.from({ length: totalFloors }, (_, i) => {
    const floorNum = i + 1;
    const floorId = `floor-${aptId}-${floorNum}`;
    return {
      id: floorId,
      apartment_id: aptId,
      floor_number: floorNum,
      description: `Floor ${floorNum} — ${aptName}`,
      flats: generateFlats(floorId, floorNum, aptId, aptName, aptIdx),
    };
  });
}

// -----------------------------------------------------------------
// Three Nandyal Apartments
// -----------------------------------------------------------------
export const MOCK_APARTMENTS: Apartment[] = [
  {
    id: "apt-1",
    name: "Happy Homes",
    description:
      "A warm and vibrant residential community with spacious layouts and modern amenities, designed for comfortable family living in the heart of Nandyal.",
    address: "Survey No. 45, Kurnool Road, Nandyal, Andhra Pradesh - 518501",
    cover_image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    status: "Ready to Move",
    total_floors: 3,
    owner_name: "Sri Venkata Raju Constructions",
    city_name: "Nandyal",
    floors: generateFloors("apt-1", "Happy Homes", 0, 3),
    amenities: [
      { id: "am-hh-1", name: "Children's Play Area", icon: "Gamepad2", description: "Safe fenced outdoor play zone" },
      { id: "am-hh-2", name: "24/7 Security", icon: "Shield", description: "CCTV surveillance and manned entry gate" },
      { id: "am-hh-3", name: "Landscaped Garden", icon: "Leaf", description: "Manicured green lawns and walking paths" },
      { id: "am-hh-4", name: "Community Hall", icon: "Users", description: "Multipurpose hall for events & meetings" },
      { id: "am-hh-5", name: "Reserved Parking", icon: "ParkingSquare", description: "Dedicated covered car parking per flat" },
    ],
    nearby_places: [
      { id: "nb-hh-1", place_name: "Nandyal Public School", category: "School", distance: 0.8 },
      { id: "nb-hh-2", place_name: "Government General Hospital", category: "Hospital", distance: 1.2 },
      { id: "nb-hh-3", place_name: "Nandyal Bus Station", category: "Transit", distance: 1.5 },
      { id: "nb-hh-4", place_name: "Reliance Fresh Supermarket", category: "Shopping", distance: 0.6 },
      { id: "nb-hh-5", place_name: "Sri Lakshmi Temple", category: "Temple", distance: 0.4 },
    ],
  },
  {
    id: "apt-2",
    name: "Green Valley Residency",
    description:
      "An eco-conscious residential township with lush green landscapes, rainwater harvesting, and solar-powered common areas nestled in the tranquil outskirts of Nandyal.",
    address: "Plot No. 12, Green Valley Layout, Srinivasa Nagar, Nandyal, Andhra Pradesh - 518502",
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
    status: "Ready to Move",
    total_floors: 3,
    owner_name: "Green Valley Builders Pvt Ltd",
    city_name: "Nandyal",
    floors: generateFloors("apt-2", "Green Valley Residency", 1, 3),
    amenities: [
      { id: "am-gv-1", name: "Rooftop Solar Grid", icon: "Sun", description: "Clean energy powering common areas" },
      { id: "am-gv-2", name: "Rainwater Harvesting", icon: "Droplets", description: "Sustainable water management system" },
      { id: "am-gv-3", name: "Organic Garden", icon: "Sprout", description: "Community farm for fresh produce" },
      { id: "am-gv-4", name: "Jogging Track", icon: "Footprints", description: "500m tree-shaded running track" },
      { id: "am-gv-5", name: "Power Backup", icon: "Zap", description: "Uninterrupted power supply for all flats" },
    ],
    nearby_places: [
      { id: "nb-gv-1", place_name: "Sri Krishna Degree College", category: "School", distance: 1.0 },
      { id: "nb-gv-2", place_name: "Nandyal Railway Station", category: "Transit", distance: 2.2 },
      { id: "nb-gv-3", place_name: "Big Bazaar Nandyal", category: "Shopping", distance: 1.8 },
      { id: "nb-gv-4", place_name: "SVIMS Hospital", category: "Hospital", distance: 2.5 },
      { id: "nb-gv-5", place_name: "SBI Nandyal Branch", category: "Bank", distance: 0.9 },
    ],
  },
  {
    id: "apt-3",
    name: "Skyline Residency",
    description:
      "A premium luxury development offering panoramic views of Nandyal's skyline. Skyline Residency redefines urban living with world-class finishes and smart home integrations.",
    address: "Opposite Bus Stand, Banaganapalle Road, Nandyal, Andhra Pradesh - 518503",
    cover_image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=60",
    status: "Ready to Move",
    total_floors: 3,
    owner_name: "Skyline Group Developers",
    city_name: "Nandyal",
    floors: generateFloors("apt-3", "Skyline Residency", 2, 3),
    amenities: [
      { id: "am-sk-1", name: "Swimming Pool", icon: "Waves", description: "Temperature-controlled rooftop pool" },
      { id: "am-sk-2", name: "Fully Equipped Gym", icon: "Dumbbell", description: "State-of-the-art fitness studio" },
      { id: "am-sk-3", name: "Smart Home System", icon: "Cpu", description: "App-controlled lights, locks & climate" },
      { id: "am-sk-4", name: "Clubhouse", icon: "Building2", description: "Lounge, snooker, and party hall" },
      { id: "am-sk-5", name: "EV Charging", icon: "BatteryCharging", description: "Electric vehicle charging bays" },
    ],
    nearby_places: [
      { id: "nb-sk-1", place_name: "Nandyal Bus Stand", category: "Transit", distance: 0.2 },
      { id: "nb-sk-2", place_name: "Sai Baba Temple", category: "Temple", distance: 0.5 },
      { id: "nb-sk-3", place_name: "Apollo Pharmacy", category: "Shopping", distance: 0.3 },
      { id: "nb-sk-4", place_name: "Care Hospitals Nandyal", category: "Hospital", distance: 1.1 },
      { id: "nb-sk-5", place_name: "HDFC Bank ATM", category: "Bank", distance: 0.4 },
    ],
  },
];

// -----------------------------------------------------------------
// Flat helper — flattened list across all apartments
// -----------------------------------------------------------------
export const MOCK_FLATS: Flat[] = MOCK_APARTMENTS.reduce<Flat[]>((acc, apt) => {
  apt.floors.forEach((floor) => {
    floor.flats.forEach((flat) => acc.push(flat));
  });
  return acc;
}, []);

// Helper: get apartment by ID
export const getApartmentById = (id: string): Apartment | undefined =>
  MOCK_APARTMENTS.find((a) => a.id === id);

// Helper: get flat by ID
export const getFlatById = (id: string): Flat | undefined =>
  MOCK_FLATS.find((f) => f.id === id);

// Helper: get flats for an apartment
export const getFlatsForApartment = (aptId: string): Flat[] =>
  MOCK_FLATS.filter((f) => f.apartment_id === aptId);

// Status colour mapping for UI chips
export const STATUS_COLORS: Record<Flat["status"], string> = {
  Available: "#22c55e",
  Held: "#f59e0b",
  Booked: "#3b82f6",
  Sold: "#ef4444",
  Rented: "#8b5cf6",
};
