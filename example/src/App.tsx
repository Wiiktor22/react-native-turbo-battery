import * as React from 'react';

import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import {
  TurboBatteryEventEmitter,
  getBatteryLevel,
  getBatteryState,
  type BatteryStateChangedEventPayload,
  type BatteryLevelChangedEventPayload,
  TurboBatteryEvents,
  getLowPowerState,
  type LowPowerStateChangedEventPayload,
  getBatteryLevelSync,
} from 'react-native-turbo-battery';

export default function App() {
  const [batteryLevel, setBatteryLevel] = React.useState<number | undefined>();
  const [batteryState, setBatteryState] = React.useState<number | undefined>();
  const [lowPowerEnabled, setLowPowerEnabled] = React.useState<
    boolean | undefined
  >();

  React.useEffect(() => {
    getBatteryLevel().then((response) => {
      if (typeof response === 'number') setBatteryLevel(response);
    });
    getBatteryState().then(setBatteryState);

    getLowPowerState(
      (isEnabled) => setLowPowerEnabled(isEnabled),
      (error) => {
        console.log(`Error found reading Low Power State: ${error}`);
        setLowPowerEnabled(undefined);
      }
    );

    const stateEventListener = TurboBatteryEventEmitter.addListener(
      TurboBatteryEvents.BatteryStateEvent,
      (event: BatteryStateChangedEventPayload) => {
        console.log('===== NEW BATTERY STATE EVENT');
        console.log(event);
        setBatteryState(event.batteryState);
      }
    );

    const levelEventListener = TurboBatteryEventEmitter.addListener(
      TurboBatteryEvents.BatteryLevelEvent,
      (event: BatteryLevelChangedEventPayload) => {
        console.log('===== NEW LEVEL EVENT');
        console.log(event);
        setBatteryLevel(event.batteryLevel);
      }
    );

    const lowPowerEventListener = TurboBatteryEventEmitter.addListener(
      TurboBatteryEvents.LowPowerStateEvent,
      (event: LowPowerStateChangedEventPayload) => {
        console.log('===== NEW LOW POWER EVENT');
        console.log(event);
        setLowPowerEnabled(event.isEnabled);
      }
    );

    return () => {
      stateEventListener.remove();
      levelEventListener.remove();
      lowPowerEventListener.remove();
    };
  }, []);

  const testGetBatteryLevelSync = () => {
    Alert.alert(
      'Battery level sync',
      `Battery level sync: ${getBatteryLevelSync()}`
    );
  };

  return (
    <View style={styles.container}>
      <Text>Battery Level: {batteryLevel ?? ''}</Text>
      <Text>Battery State: {batteryState ?? ''}</Text>
      <Text>Low Power State: {String(lowPowerEnabled)}</Text>
      <Button
        title="Test getBatteryLevelSync"
        onPress={testGetBatteryLevelSync}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
