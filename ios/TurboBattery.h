
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNTurboBatterySpec.h"

@interface TurboBattery : NSObject <NativeTurboBatterySpec>
#else
#import <React/RCTBridgeModule.h>

@interface TurboBattery : NSObject <RCTBridgeModule>
#endif

@end
