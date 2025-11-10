// API Configuration - 3 services đang hoạt động
export const API_CONFIG = {
  USER_SERVICE_URL: "http://localhost:5227",
  RENTAL_PAYMENT_SERVICE_URL: "http://localhost:5035",
  FLEET_SERVICE_URL: "http://localhost:5142",
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

  // Vehicle & Branch (FleetService - Port 5142)
  VEHICLES: {
    GET_ALL: `${API_CONFIG.FLEET_SERVICE_URL}/api/Vehicle`,
    GET_BY_ID: (vehicleId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Vehicle/${vehicleId}`,
    GET_BY_STATUS: (status: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Vehicle/status/${status}`,
    GET_BY_TYPE: (typeId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Vehicle/type/${typeId}`,
    GET_SUMMARY: `${API_CONFIG.FLEET_SERVICE_URL}/api/Vehicle/summary`,
  },

  VEHICLE_TYPES: {
    GET_ALL: `${API_CONFIG.FLEET_SERVICE_URL}/api/TypeVehicle`,
    GET_BY_ID: (typeId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/TypeVehicle/${typeId}`,
  },

  BRANCHES: {
    GET_ALL: `${API_CONFIG.FLEET_SERVICE_URL}/api/Branch`,
    GET_BY_ID: (branchId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Branch/${branchId}`,
  },

  // Maintenance & Relocation (FleetService - Port 5142)
  MAINTENANCE: {
    CREATE: `${API_CONFIG.FLEET_SERVICE_URL}/api/Maintenance`,
    GET_BY_ID: (id: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Maintenance/${id}`,
    GET_BY_VEHICLE: (vehicleId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Maintenance/vehicle/${vehicleId}`,
    GET_UPCOMING: `${API_CONFIG.FLEET_SERVICE_URL}/api/Maintenance/upcoming`,
  },

  RELOCATION: {
    CREATE: `${API_CONFIG.FLEET_SERVICE_URL}/api/Relocation`,
    GET_BY_ID: (id: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Relocation/${id}`,
    GET_BY_VEHICLE: (vehicleId: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Relocation/vehicle/${vehicleId}`,
    GET_BY_STATUS: (status: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Relocation/status/${status}`,
    COMPLETE: (id: string) => `${API_CONFIG.FLEET_SERVICE_URL}/api/Relocation/${id}/complete`,
  },
};

