

// Assuming Firebase Timestamp, adjust if using native Date
// For simplicity, using Date for createdAt/updatedAt in interfaces,
// but they would typically be Firebase Timestamps when interacting with Firestore.

export interface Product {
  id: string; // Document ID
  name: string;
  description: string;
  category: string;
  supplierId: string; // Reference to Supplier document ID
  supplierName?: string; // Denormalized for display
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string; // Document ID within subcollection
  productId: string; // Parent product ID
  sku: string;
  size: string;
  variety: string;
  purchasePrice: number;
  sellingPrice: number;
  quantityInStock: number;
  lowStockThreshold: number;
  averageDailySales?: number; // For AI reorder suggestions
  leadTimeDays?: number; // For AI reorder suggestions
  imageUrl?: string; // Optional image URL
}

export interface Supplier {
  id: string; // Document ID
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt?: Date; // Added for consistency
}

export interface InvoiceItem {
  productId: string;
  variantId: string;
  productName: string;
  variantDetails: string; // e.g., "50kg, OPC 43"
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string; // Document ID
  invoiceNumber: string;
  customerId?: string; // Optional
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  subTotal: number;
  taxRate?: number; // e.g., 0.05 for 5%
  taxAmount: number;
  grandTotal: number;
  status: "Paid" | "Unpaid" | "Cancelled";
  createdAt: Date;
  updatedAt?: Date; // Added for consistency
  createdBy: string; // User ID of the staff/admin
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "Admin" | "Staff";
}

export interface DashboardStats {
  totalSalesToday: number;
  totalSalesThisWeek: number;
  totalSalesThisMonth: number;
  lowStockProductsCount: number;
  recentInvoicesCount: number;
}
