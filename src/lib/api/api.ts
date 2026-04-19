const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  pagination?:T;
  data?: T;
  reply?:string;
}

// ✅ Standard API response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// ✅ Search result type
export interface SearchItem {
  id: string;
  name: string;
  score: number;
  source: "petpooja" | "local";
  votes?: number;
  price?: number;
}



class ApiService {

  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

// 🔥 FIXED request (NO TS ERROR)
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        // "x-device-id": localStorage.deviceId || this.getDeviceId(),
      },
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return response.json();
  }
  // ✅ MASTER DATA (categories + groups)
  async getMasterData() {
    return this.request<{
      data(data: any): unknown;
      categories: any[];
      groups: any[];
    }>("/petpooja/master-data/active");
  }

  // ✅ ITEMS LIST (with filters)
  async getItems(params?: {
    page?: number;
    perPage?: number;
    categoryId?: string;
    groupId?: string;
    itemName?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, val]) => {
        if (val !== undefined && val !== "") {
          acc[key] = String(val);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.request<any>(
      `/petpooja/items${query ? `?${query}` : ""}`
    );
  }

  // ✅ ITEM DETAILS
  async getItemById(id: string) {
    return this.request<any>(`/petpooja/items/${id}`);
  }

  // ✅ STORE STATUS (your previous requirement)
  async getStoreStatus() {
    return this.request("/settings/store-status", {
      method: "GET",
    });
  }

async submitFranchise(data: any) {
  try {
    const response = await this.request("/common/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // ✅ Check HTTP status
    if (!response) {
      throw new Error(`Request failed: ${response}`);
    }

    const result = await response;
    return result;

  } catch (error) {
    console.error("Franchise submit error:", error);
    throw error; // rethrow so UI can handle
  }
}

  // 🔥 ensure deviceId exists
  private getDeviceId() {
    const id = crypto.randomUUID();
    localStorage.deviceId = id;
    return id;
  }

  // 🔍 SEARCH
  async searchProducts(q: string) {
    return this.request<SearchItem[]>(`/product-request/search?q=${q}`);
  }

  // ➕ CREATE REQUEST
async createProductRequest(data: {
  name: string;
  category?: string;
  brand?: string;
  description?: string;
}) {
  return this.request<{
    success: boolean;
    message?: string;
    data?: any;
  }>(`/product-request/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      category: data.category || "",
      brand: data.brand || "",
      description: data.description || ""
    }),
  });
}

  // 👍 VOTE
  async voteProduct(productId: string) {
    return this.request(`/product-request/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
  }

  // 🔥 TRENDING
  async getTrendingRequests() {
    return this.request<any[]>(`/product-request/trending`);
  }

async chat(message: string) {
    if (!message || typeof message !== "string" || message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    return this.request<any>("/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        message: message.trim() 
      }),
    });
  }
  
  // apiService

async searchRequestedProducts(q: string) {
  return this.request(`/product-request/trending/search?q=${q}`);
}
}

export const apiService = new ApiService(API_BASE_URL);