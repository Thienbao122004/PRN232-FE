// ==================== RENTAL ORDERS ====================
export interface CreateRentalOrderRequest {
  renterId: string;
  vehicleId: string;
  branchStartId: string;
  branchEndId: string;
  startTime: string; // ISO datetime
  endTime: string;
  estimatedCost: number;
}

export interface RentalOrderResponse {
  rentalId: string;
  renterId: string;
  staffId?: string;
  vehicleId: string;
  vehicleName?: string;
  vehicleImage?: string;
  branchStartId: string;
  branchStartName?: string;
  branchEndId: string;
  branchEndName?: string;
  startTime: string;
  endTime?: string;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
}

export interface RentalHistoryParams {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface CancelRentalRequest {
  reason: string;
}

// ==================== CHECK-IN / CHECK-OUT ====================
export interface CheckInRequest {
  staffId: string;
  odometerReading: number;
  batteryLevel: number;
  notes?: string;
  photos: File[];
}

export interface CheckInResponse {
  checkinId: string;
  rentalId: string;
  datetime: string;
  odometerReading: number;
  batteryLevel: number;
  status: string;
  contractUrl: string;
  message: string;
}

export interface CheckOutRequest {
  staffId: string;
  odometerReading: number;
  batteryLevel: number;
  damageReport?: string;
  notes?: string;
  photos: File[];
}

export interface AdditionalFee {
  type: "low_battery" | "damage" | "late_return" | "other";
  description: string;
  amount: number;
}

export interface CheckOutResponse {
  checkoutId: string;
  rentalId: string;
  datetime: string;
  odometerReading: number;
  batteryLevel: number;
  extraFee: number;
  totalCost: number;
  deposit: number;
  refundAmount: number;
  additionalFees: AdditionalFee[];
  status: string;
  message: string;
}

// ==================== PAYMENTS ====================
export interface CreatePaymentRequest {
  rentalId: string;
  amount: number;
  paymentMethod: "cash" | "credit_card" | "debit_card" | "e_wallet";
}

export interface PaymentResponse {
  paymentId: string;
  rentalId: string;
  amount: number;
  paymentMethod: string;
  paymentTime: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  transactionRef?: string;
}

export interface PaymentHistoryParams {
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// ==================== FEEDBACK ====================
export interface CreateFeedbackRequest {
  renterId: string;
  rentalId: string;
  score: number; // 1-5
  comment: string;
}

export interface FeedbackResponse {
  feedbackId: string;
  renterId: string;
  renterName?: string;
  rentalId: string;
  score: number;
  comment: string;
  createdAt: string;
}

// ==================== ANALYTICS ====================
export interface PersonalAnalytics {
  userId: string;
  totalRentals: number;
  totalSpent: number;
  totalDistance: number;
  totalHours: number;
  averageRating: number;
  favoriteVehicleType: string;
  mostUsedBranch: string;
  peakRentalHours: number[];
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  rentalCount: number;
  totalSpent: number;
  totalDistance: number;
}

export interface AnalyticsParams {
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
}

export interface MonthlySpending {
  month: number;
  monthName: string;
  totalAmount: number;
  rentalCount: number;
  averageCostPerRental: number;
}

// ==================== COMMON RESPONSES ====================
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

