import { API_CONFIG } from '@/lib/api-config'
import { getAuthHeaders } from '@/lib/auth'

export interface VehicleType {
  typeId: string
  typeName: string
  description?: string
  basePricePerHour: number
}

export interface Vehicle {
  vehicleId: string
  plateNumber: string
  chassisNumber?: string
  batteryCapacity: number
  status: string
  typeId: string
  typeName?: string
  manufactureYear: number
  color?: string
  qrCode?: string
}

export interface VehicleCreateRequest {
  plateNumber: string
  chassisNumber?: string
  batteryCapacity: number
  typeId: string
  manufactureYear: number
  color?: string
  qrCode?: string
}

export interface VehicleUpdateRequest {
  plateNumber?: string
  chassisNumber?: string
  batteryCapacity?: number
  status?: string
  typeId?: string
  manufactureYear?: number
  color?: string
  qrCode?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const FLEET_API_BASE = `${API_CONFIG.GATEWAY_URL}/api/fleet`

export const fleetService = {
  // Vehicle APIs
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.json()
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle/${id}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle')
    }

    return response.json()
  },

  async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle/status/${status}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles by status')
    }

    return response.json()
  },

  async createVehicle(data: VehicleCreateRequest): Promise<Vehicle> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create vehicle')
    }

    return response.json()
  },

  async updateVehicle(
    id: string,
    data: VehicleUpdateRequest
  ): Promise<Vehicle> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update vehicle')
    }

    return response.json()
  },

  async deleteVehicle(id: string): Promise<boolean> {
    const response = await fetch(`${FLEET_API_BASE}/Vehicle/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to delete vehicle')
    }

    return true
  },

  // Vehicle Type APIs
  async getAllVehicleTypes(): Promise<VehicleType[]> {
    const response = await fetch(`${FLEET_API_BASE}/TypeVehicle`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle types')
    }

    return response.json()
  },
}
