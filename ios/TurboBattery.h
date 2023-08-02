
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTurboBatterySpec.h"

@interface TurboBattery : NSObject <NativeTurboBatterySpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface TurboBattery : RCTEventEmitter<RCTBridgeModule>
#endif

@end
