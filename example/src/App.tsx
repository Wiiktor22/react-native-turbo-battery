import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  TurboBatteryEventEmitter,
  getBatteryLevel,
  getBatteryState,
  type BatteryStateChangedEventPayload,
  type BatteryLevelChangedEventPayload,
  TurboBatteryEvents,
} from 'react-native-turbo-battery';

export default function App() {
  const [batteryLevel, setBatteryLevel] = React.useState<number | undefined>();
  const [batteryState, setBatteryState] = React.useState<number | undefined>();

  React.useEffect(() => {
    getBatteryLevel().then((response) => {
      if (typeof response === 'number') setBatteryLevel(response);
    });
    getBatteryState().then(setBatteryState);

    const stateEventListener = TurboBatteryEventEmitter.addListener(
      TurboBatteryEvents.BatteryStateEvent,
      (event: BatteryStateChangedEventPayload) => {
        console.log('===== NEW EVENT');
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

    return () => {
      stateEventListener.remove();
      levelEventListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Battery Level: {batteryLevel}</Text>
      <Text>Battery State: {batteryState}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
