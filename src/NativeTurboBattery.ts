import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { BatteryStatus } from './types';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  getBatteryLevel(): Promise<number>;
  getBatteryState(): Promise<BatteryStatus>;
  getLowPowerState(
    successCallback: (isEnabled: boolean) => void,
    errorCallback: (error: any) => void
  ): void;
  getBatteryLevelSync(): number | null;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TurboBattery');
