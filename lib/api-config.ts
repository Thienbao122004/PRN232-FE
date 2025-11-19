export const API_CONFIG = {
  GATEWAY_URL: "https://localhost:7000",
  USER_SERVICE_URL: "https://localhost:7000",
  RENTAL_PAYMENT_SERVICE_URL: "https://localhost:7000",
  FLEET_SERVICE_URL: "https://localhost:7000",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.GATEWAY_URL}/api/auth/login`,
    REGISTER: `${API_CONFIG.GATEWAY_URL}/api/auth/register`,
    LOGOUT: `${API_CONFIG.GATEWAY_URL}/api/auth/logout`,
  },

  USER: {
    GET_PROFILE: `${API_CONFIG.GATEWAY_URL}/userGateway/profile`,
    GET_PROFILE_BY_ID: (userId: string) => `${API_CONFIG.GATEWAY_URL}/userGateway/profile/${userId}`,
    UPDATE_PROFILE: `${API_CONFIG.GATEWAY_URL}/userGateway/profile`,
    UPLOAD_DOCUMENT: `${API_CONFIG.GATEWAY_URL}/userGateway/documents`,
    GET_VERIFICATION_STATUS: (userId: string) => `${API_CONFIG.GATEWAY_URL}/userGateway/${userId}/verification-status`,
  },
  
  RENTALS: {
    CREATE: `${API_CONFIG.GATEWAY_URL}/api/rental/rentals`,
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/rental/rentals`,
    GET_BY_ID: (rentalId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/rentals/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/rentals/renter/${renterId}`,
    CANCEL: (rentalId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/rentals/${rentalId}/cancel`,
  },
  
  PAYMENTS: {
    CREATE: `${API_CONFIG.GATEWAY_URL}/api/rental/payments`,
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/rental/payments`,
    GET_BY_ID: (paymentId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/payments/${paymentId}`,
    GET_BY_RENTAL: (rentalId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/payments/rental/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/payments/renter/${renterId}`,
  },
  
  FEEDBACKS: {
    CREATE: `${API_CONFIG.GATEWAY_URL}/api/rental/feedbacks`,
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/rental/feedbacks`,
    GET_BY_ID: (feedbackId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/feedbacks/${feedbackId}`,
    GET_BY_RENTAL: (rentalId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/feedbacks/rental/${rentalId}`,
    GET_BY_RENTER: (renterId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/feedbacks/renter/${renterId}`,
  },
  
  // Analytics - Route: /api/rental/{everything} -> Backend: /api/{everything} (Port 7015) - ✅ CẦN Bearer token
  ANALYTICS: {
    GET_RENTER_ANALYTICS: (renterId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/analytics/renter/${renterId}`,
    GET_RENTER_SUMMARY: (renterId: string) => `${API_CONFIG.GATEWAY_URL}/api/rental/analytics/renter/${renterId}/summary`,
  },

  VEHICLES: {
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/fleet/Vehicle`,
    GET_BY_ID: (vehicleId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Vehicle/${vehicleId}`,
    GET_BY_STATUS: (status: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Vehicle/status/${status}`,
    GET_BY_TYPE: (typeId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Vehicle/type/${typeId}`,
    GET_SUMMARY: `${API_CONFIG.GATEWAY_URL}/api/fleet/Vehicle/summary`,
  },

  VEHICLE_TYPES: {
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/fleet/TypeVehicle`,
    GET_BY_ID: (typeId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/TypeVehicle/${typeId}`,
  },

  BRANCHES: {
    GET_ALL: `${API_CONFIG.GATEWAY_URL}/api/fleet/Branch`,
    GET_BY_ID: (branchId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Branch/${branchId}`,
  },

  MAINTENANCE: {
    CREATE: `${API_CONFIG.GATEWAY_URL}/api/fleet/Maintenance`,
    GET_BY_ID: (id: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Maintenance/${id}`,
    GET_BY_VEHICLE: (vehicleId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Maintenance/vehicle/${vehicleId}`,
    GET_UPCOMING: `${API_CONFIG.GATEWAY_URL}/api/fleet/Maintenance/upcoming`,
  },

  RELOCATION: {
    CREATE: `${API_CONFIG.GATEWAY_URL}/api/fleet/Relocation`,
    GET_BY_ID: (id: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Relocation/${id}`,
    GET_BY_VEHICLE: (vehicleId: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Relocation/vehicle/${vehicleId}`,
    GET_BY_STATUS: (status: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Relocation/status/${status}`,
    COMPLETE: (id: string) => `${API_CONFIG.GATEWAY_URL}/api/fleet/Relocation/${id}/complete`,
  },
};

