// API Configuration - Chỉ có 2 services đang hoạt động
export const API_CONFIG = {
  USER_SERVICE_URL: "http://localhost:5227",
  RENTAL_PAYMENT_SERVICE_URL: "http://localhost:5035",
};

export const API_ENDPOINTS = {
  // Authentication & User Management (UserService)
  AUTH: {
    LOGIN: `${API_CONFIG.USER_SERVICE_URL}/api/Auth/login`,
    REGISTER: `${API_CONFIG.USER_SERVICE_URL}/api/Auth/register`,
    LOGOUT: `${API_CONFIG.USER_SERVICE_URL}/api/Auth/logout`,
  },

  // User Profile (UserService)
  USER: {
    GET_PROFILE: `${API_CONFIG.USER_SERVICE_URL}/api/user/profile`,
    GET_PROFILE_BY_ID: (userId: string) => `${API_CONFIG.USER_SERVICE_URL}/api/user/profile/${userId}`,
    UPDATE_PROFILE: `${API_CONFIG.USER_SERVICE_URL}/api/user/profile`,
    UPLOAD_DOCUMENT: `${API_CONFIG.USER_SERVICE_URL}/api/user/documents`,
    GET_VERIFICATION_STATUS: (userId: string) => `${API_CONFIG.USER_SERVICE_URL}/api/user/${userId}/verification-status`,
  },
  
  // Rental Orders (RentalPaymentService)
  RENTALS: {
    CREATE: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/rentals`,
    GET_ALL: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/rentals`,
    GET_BY_ID: (rentalId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/rentals/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/rentals/renter/${renterId}`,
    CANCEL: (rentalId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/rentals/${rentalId}/cancel`,
  },
  
  // Payments (RentalPaymentService)
  PAYMENTS: {
    CREATE: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/payments`,
    GET_ALL: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/payments`,
    GET_BY_ID: (paymentId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/payments/${paymentId}`,
    GET_BY_RENTAL: (rentalId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/payments/rental/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/payments/renter/${renterId}`,
  },
  
  // Feedback & Ratings (RentalPaymentService)
  FEEDBACKS: {
    CREATE: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/feedbacks`,
    GET_ALL: `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/feedbacks`,
    GET_BY_ID: (feedbackId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/feedbacks/${feedbackId}`,
    GET_BY_RENTAL: (rentalId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/feedbacks/rental/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/feedbacks/renter/${renterId}`,
  },
  
  // Analytics (RentalPaymentService)
  ANALYTICS: {
    GET_RENTER_ANALYTICS: (renterId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/analytics/renter/${renterId}`,
    GET_RENTER_SUMMARY: (renterId: string) => `${API_CONFIG.RENTAL_PAYMENT_SERVICE_URL}/api/analytics/renter/${renterId}/summary`,
  },
};

