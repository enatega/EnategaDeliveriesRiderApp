import apiClient from './apiClient';
import {
  UpdateVehicleTypePayload,
  UpdateVehicleTypeResponse,
  VehicleTypesApiResponse,
  VehicleTypesResponse,
} from './vehicleTypesTypes';

const VEHICLE_TYPES_PATH = '/apps/deliveries/settings/vehicle-types';
const VEHICLE_TYPE_UPDATE_PATH = '/apps/deliveries/settings/vehicle-type';

export const vehicleTypesService = {
  getVehicleTypes: async (): Promise<VehicleTypesResponse> => {
    const response = await apiClient.get<VehicleTypesApiResponse>(VEHICLE_TYPES_PATH);

    if (Array.isArray(response)) {
      return {
        selectedVehicleType: null,
        vehicleTypes: response,
      };
    }

    if ('vehicleTypes' in response) {
      return response;
    }

    return {
      selectedVehicleType: null,
      vehicleTypes: response.data ?? [],
    };
  },
  updateVehicleType: (payload: UpdateVehicleTypePayload) =>
    apiClient.patch<UpdateVehicleTypeResponse>(VEHICLE_TYPE_UPDATE_PATH, payload),
};
