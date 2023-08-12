export enum BatteryStatus {
  UNKNOWN,
  UNPLUGGED,
  CHARGING,
  FULL,
}

export interface BatteryLevelChangedEventPayload {
  batteryLevel: number;
}

export interface BatteryStateChangedEventPayload {
  batteryState: number;
}

export interface LowPowerStateChangedEventPayload {
  isEnabled: boolean;
}
