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

export const multiply = (a: number, b: number): Promise<number> =>
  TurboBattery.multiply(a, b);

export const getBatteryLevel = async (): Promise<number> =>
  await TurboBattery.getBatteryLevel();

export const getBatteryLevelSync = () => TurboBattery.getBatteryLevelSync();

export const getBatteryState = async (): Promise<BatteryStatus> =>
  await TurboBattery.getBatteryState();

export const getLowPowerState = (
  successCallback: (isEnabled: boolean) => void,
  errorCallback: (error: any) => void
): void => {
  TurboBattery.getLowPowerState(
    (state: { isEnabled: boolean }) => successCallback(state.isEnabled),
    errorCallback
  );
};

export const TurboBatteryEventEmitter = new NativeEventEmitter(TurboBattery);

export * from './types';
