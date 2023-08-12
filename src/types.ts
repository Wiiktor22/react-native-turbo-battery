export enum BatteryStatus {
  UNKNOWN,
  UNPLUGGED,
  CHARGING,
  FULL,
}

export enum TurboBatteryEvents {
  BatteryStateEvent = 'TurboBattery.BatteryStateChangedEvent',
  BatteryLevelEvent = 'TurboBattery.BatteryLevelChangedEvent',
  LowPowerStateEvent = 'TurboBattery.LowPowerModeChangedEvent',
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
