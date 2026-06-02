export type VehicleTypeItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  created_at: string;
  updated_at: string;
  isSelected?: boolean;
};

export type SelectedVehicleType = {
  vehicleTypeId: string;
  vehicleTypeName: string;
  vehicleTypeImageUrl: string;
};

export type VehicleTypesResponse = {
  selectedVehicleType: SelectedVehicleType | null;
  vehicleTypes: VehicleTypeItem[];
};

export type VehicleTypesApiResponse =
  | VehicleTypeItem[]
  | VehicleTypesResponse
  | {
      status?: number;
      durationMs?: number;
      data: VehicleTypeItem[];
    };

export type UpdateVehicleTypePayload = {
  vehicleTypeId: string;
};

export type UpdateVehicleTypeData = {
  vehicleTypeId: string;
  vehicleTypeName: string;
};

export type UpdateVehicleTypeResponse = {
  message: string;
  data: UpdateVehicleTypeData;
};
