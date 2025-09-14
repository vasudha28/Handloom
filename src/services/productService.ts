const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  productCollection: string; // Changed from 'collection' to match backend schema
  price: number;
  costPerItem: number;
  chargeTax: boolean;
  trackQuantity: boolean;
  quantity: number;
  continueSelling: boolean;
  hasSKU: boolean;
  sku: string;
  barcode: string;
  isPhysicalProduct: boolean;
  weight: number;
  weightUnit: string;
  packageType: string;
  searchTitle: string;
  searchDescription: string;
  variants: ProductVariant[];
  images: string[];
  status?: string;
  productType?: string;
  vendor?: string;
  collections?: string[];
  tags?: string[];
  salesChannels?: {
    onlineStore: boolean;
    pos: boolean;
  };
  markets?: string[];
}

export interface ProductVariant {
  id?: string; // Made optional to match backend schema
  name: string;
  values: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  product?: T;
  products?: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
  details?: string | string[];
  field?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  collection?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ProductService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData: ProductFormData): Promise<ApiResponse<ProductFormData>> {
    return this.makeRequest<ProductFormData>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Get products with pagination and filtering
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<ProductFormData[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.collection) queryParams.append('collection', filters.collection);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    return this.makeRequest<ProductFormData[]>(`/api/products?${queryParams.toString()}`);
  }

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<ProductFormData>> {
    return this.makeRequest<ProductFormData>(`/api/products/${id}`);
  }

  // Get product categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.makeRequest<string[]>('/api/products/categories');
  }

  // Update a product
  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<ApiResponse<ProductFormData>> {
    return this.makeRequest<ProductFormData>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Delete a product
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Get categories method removed to prevent MongoDB connection issues
}

export const productService = new ProductService();
