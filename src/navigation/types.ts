import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RiderTabParamList } from './MainTabsNavigator';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
};

export type MainStackParamList = {
  Home: NavigatorScreenParams<RiderTabParamList> | undefined;
  ProcessingOrderDetail: { orderId: string };
  EarningsDetail: undefined;
  DeliveriesDetail: { earningId?: string };
  Language: undefined;
  VehicleType: undefined;
  BankManagement: undefined;
  WorkSchedule: undefined;
};
