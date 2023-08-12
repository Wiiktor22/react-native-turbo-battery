import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { BatteryStatus } from './types';

const LINKING_ERROR =
  `The package 'react-native-turbo-battery' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const TurboBatteryModule = isTurboModuleEnabled
  ? require('./NativeTurboBattery').default
  : NativeModules.TurboBattery;

const TurboBattery = TurboBatteryModule
  ? TurboBatteryModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return TurboBattery.multiply(a, b);
}

export async function getBatteryLevel(): Promise<number | void> {
  try {
    return await TurboBattery.getBatteryLevel();
  } catch (error) {
    console.error(error);
  }
}

export function getBatteryLevelSync() {
  return TurboBattery.getBatteryLevelSync();
}

export async function getBatteryState(): Promise<BatteryStatus> {
  return await TurboBattery.getBatteryState();
}

export function getLowPowerState(
  successCallback: (isEnabled: boolean) => void,
  errorCallback: (error: any) => void
): void {
  const platformSpecificMethod =
    Platform.OS === 'ios'
      ? TurboBattery.getLowPowerModeEnabled
      : TurboBattery.getPowerSavingState;

  platformSpecificMethod(
    (state: { isEnabled: boolean }) => successCallback(state.isEnabled),
    errorCallback
  );
}

export const TurboBatteryEventEmitter = new NativeEventEmitter(TurboBattery);

export * from './types';
