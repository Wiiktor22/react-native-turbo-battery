package com.turbobattery

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Callback

abstract class TurboBatterySpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun multiply(a: Double, b: Double, promise: Promise)

  abstract fun getBatteryLevel(promise: Promise)

  abstract fun getBatteryLevelSync(): Double
  
  abstract fun getBatteryState(promise: Promise)

  abstract fun getLowPowerState(successCallback: Callback, errorCallback: Callback)

}
