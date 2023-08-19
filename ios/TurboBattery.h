
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTurboBatterySpec.h"
#import <React/RCTEventEmitter.h>

@interface TurboBattery : RCTEventEmitter <NativeTurboBatterySpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface TurboBattery : RCTEventEmitter<RCTBridgeModule>
#endif

@end
