import { BRAND, MENU_CATEGORIES, MenuCategory, MenuItem } from "../components/data";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export interface BusinessConfig {
  name: string;
  subtitle: string;
  phone: string;
  phone_raw: string;
  whatsapp_number: string;
  whatsapp_url: string;
  email: string;
  address: string;
  map_url: string;
  map_embed_url: string;
  instagram: string;
  facebook: string;
  youtube: string;
  hours_display: string;
  rating: number;
  reviews_count: string;
  since: string;
  tax_rate: number;
  delivery_fee: number;
  free_delivery_threshold: number;
  packaging_fee: number;
}

export interface OrderItemPayload {
  menu_item_id?: number;
  item_name: string;
  item_type: "veg" | "non-veg";
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: "delivery" | "takeaway" | "dine_in";
  delivery_address?: string;
  table_number?: string;
  special_instructions?: string;
  payment_method: "cod" | "upi_on_delivery" | "cash";
  items: OrderItemPayload[];
}

export interface OrderItemResponse {
  id: number;
  item_name: string;
  item_type: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: "delivery" | "takeaway" | "dine_in";
  delivery_address?: string;
  table_number?: string;
  special_instructions?: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  packaging_fee: number;
  total_amount: number;
  status: string;
  payment_method: string;
  whatsapp_message?: string;
  whatsapp_link?: string;
  google_sheets_synced: boolean;
  created_at: string;
  items: OrderItemResponse[];
}

export interface EnquiryPayload {
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
}

export interface EnquiryResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  status: string;
  whatsapp_link?: string;
  created_at: string;
}

/**
 * Helper to handle fetch requests with graceful error fallback.
 */
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        if (typeof errJson.detail === "string") {
          errorDetail = errJson.detail;
        } else if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map((d: { msg?: string }) => d.msg || "Validation error").join(", ");
        }
      }
    } catch {
      errorDetail = `Request failed with status ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  /** Fetch public business details with static fallback */
  async getConfig(): Promise<BusinessConfig> {
    try {
      return await fetchJson<BusinessConfig>("/api/config");
    } catch (e) {
      console.warn("Could not fetch /api/config, using default brand config.", e);
      return {
        name: BRAND.name,
        subtitle: BRAND.subtitle,
        phone: BRAND.phone,
        phone_raw: BRAND.phoneRaw,
        whatsapp_number: BRAND.phoneRaw,
        whatsapp_url: BRAND.whatsappUrl,
        email: BRAND.email,
        address: BRAND.address,
        map_url: BRAND.mapUrl,
        map_embed_url: BRAND.mapEmbedUrl,
        instagram: BRAND.instagram,
        facebook: BRAND.facebook,
        youtube: BRAND.youtube,
        hours_display: BRAND.hoursDisplay,
        rating: BRAND.rating,
        reviews_count: BRAND.reviewsCount,
        since: BRAND.since,
        tax_rate: 0.05,
        delivery_fee: 30.0,
        free_delivery_threshold: 500.0,
        packaging_fee: 15.0,
      };
    }
  },

  /** Fetch menu categories with items */
  async getCategories(): Promise<MenuCategory[]> {
    try {
      const data = await fetchJson<MenuCategory[]>("/api/menu/categories");
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return MENU_CATEGORIES;
    } catch (e) {
      console.warn("Could not fetch /api/menu/categories, using default menu.", e);
      return MENU_CATEGORIES;
    }
  },

  /** Fetch menu items with optional filters */
  async getMenuItems(params?: { category_id?: string; item_type?: string; query?: string }): Promise<MenuItem[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category_id) queryParams.append("category_id", params.category_id);
      if (params?.item_type) queryParams.append("item_type", params.item_type);
      if (params?.query) queryParams.append("query", params.query);

      const qs = queryParams.toString();
      return await fetchJson<MenuItem[]>(`/api/menu/items${qs ? `?${qs}` : ""}`);
    } catch (e) {
      console.warn("Could not fetch /api/menu/items.", e);
      return [];
    }
  },

  /** Create a new order */
  async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    return await fetchJson<OrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Track order by order number or phone */
  async trackOrders(query: string): Promise<OrderResponse[]> {
    return await fetchJson<OrderResponse[]>(`/api/orders/track?query=${encodeURIComponent(query)}`);
  },

  /** Get specific order by ID or order number */
  async getOrder(orderNumber: string): Promise<OrderResponse> {
    return await fetchJson<OrderResponse>(`/api/orders/${encodeURIComponent(orderNumber)}`);
  },

  /** Submit contact / table reservation enquiry */
  async submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
    return await fetchJson<EnquiryResponse>("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
