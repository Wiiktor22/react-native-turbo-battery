#import "TurboBattery.h"
#include <Foundation/Foundation.h>

@implementation TurboBattery
{
    bool hasListeners;
}
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
   return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"TurboBattery.BatteryStateChangedEvent", @"TurboBattery.BatteryLevelChangedEvent", @"TurboBattery.LowPowerModeChangedEvent"];
}

- (id)init
{
    if ((self = [super init])) {
        [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(batteryLevelDidChange:)
                                              name:UIDeviceBatteryLevelDidChangeNotification
                                              object: nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(batteryStateDidChange:)
                                              name:UIDeviceBatteryStateDidChangeNotification
                                              object: nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                              selector:@selector(lowPowerModeDidChange:)
                                              name:NSProcessInfoPowerStateDidChangeNotification
                                              object: nil];
    }
    return self;
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(a * b);

    resolve(result);
}

- (NSNumber *) getBatteryLevel {
    return [NSNumber numberWithFloat: [[UIDevice currentDevice] batteryLevel]];
}

RCT_EXPORT_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([self getBatteryLevel]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getBatteryLevelSync) {
    return [self getBatteryLevel];
}

- (int) getBatteryState {
    return [[UIDevice currentDevice] batteryState];
}

RCT_EXPORT_METHOD(getBatteryState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve(@(self.getBatteryState));
}

- (void) batteryLevelDidChange:(NSNotification *)notification {
    if (!hasListeners) {
        return;
    }

    NSNumber * batteryLevel = self.getBatteryLevel;
    [self sendEventWithName:@"TurboBattery.BatteryLevelChangedEvent" body:@{ @"batteryLevel": batteryLevel}];
}

- (void) batteryStateDidChange:(NSNotification *)notification {
    if (!hasListeners) {
        return;
    }

    int batteryState = self.getBatteryState;
    [self sendEventWithName:@"TurboBattery.BatteryStateChangedEvent" body:@{ @"batteryState": @(batteryState)}];
}

- (BOOL) getLowPowerModeEnabled {
    return [[NSProcessInfo processInfo] isLowPowerModeEnabled];
}

RCT_EXPORT_METHOD(getLowPowerState: (RCTResponseSenderBlock)successCallback
                  errorCallback: (RCTResponseSenderBlock)errorCallback)
{
    @try {
        BOOL isEnabled = self.getLowPowerModeEnabled;
        successCallback(@[@{ @"isEnabled": @(isEnabled) }]);
    } @catch (NSException *e) {
        errorCallback(@[e]);
    }
}

- (void) lowPowerModeDidChange:(NSNotification *)notification {
    if (!hasListeners) {
        return;
    }

    BOOL isEnabled = self.getLowPowerModeEnabled;
    [self sendEventWithName:@"TurboBattery.LowPowerModeChangedEvent" body:@{ @"isEnabled": @(isEnabled) }];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTurboBatterySpecJSI>(params);
}
#endif

@end
