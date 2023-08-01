import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { BatteryStatus } from './types';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  getBatteryLevel(): Promise<number>;
  getBatteryState(): Promise<BatteryStatus>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TurboBattery');
