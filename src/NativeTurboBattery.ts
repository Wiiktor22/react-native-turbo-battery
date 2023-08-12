import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { BatteryStatus } from './types';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  getBatteryLevel(): Promise<number>;
  getBatteryState(): Promise<BatteryStatus>;
  getLowPowerState(
    successCallback: (isEnabled: boolean) => void,
    errorCallback: () => void
  ): void;
  getBatteryLevelSync(): Double;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TurboBattery');
