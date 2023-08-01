package com.turbobattery

import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class TurboBatteryModule internal constructor(val context: ReactApplicationContext) :
  TurboBatterySpec(context) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  override fun getBatteryLevel(promise: Promise) {
    val batteryIntent: Intent? = context.applicationContext.registerReceiver(
      null,
      IntentFilter(Intent.ACTION_BATTERY_CHANGED)
    )

    if (batteryIntent == null) {
      promise.reject("Unable to create Battery Intent!")
    }

    val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
    val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1)

    if (level != -1 && level != null && scale != -1 && scale != null) {
      promise.resolve(level / scale.toFloat())
    } else {
      promise.reject("Unable to get battery level!")
    }
  }

  private fun mapBatteryManagerStatusToCustomBatteryEnum(status: Int): Int {
    return when(status) {
      BatteryManager.BATTERY_STATUS_FULL -> BatteryState.FULL.value
      BatteryManager.BATTERY_STATUS_CHARGING -> BatteryState.CHARGING.value
      BatteryManager.BATTERY_STATUS_NOT_CHARGING -> BatteryState.UNPLUGGED.value
      BatteryManager.BATTERY_STATUS_DISCHARGING -> BatteryState.UNPLUGGED.value
      else -> BatteryState.UNKNOWN.value
    }
  }
  @ReactMethod
  override fun getBatteryState(promise: Promise) {
    val batteryIntent: Intent? = context.applicationContext.registerReceiver(
      null,
      IntentFilter(Intent.ACTION_BATTERY_CHANGED)
    )

    if (batteryIntent == null) {
      promise.resolve(BatteryState.UNKNOWN.value)
      return
    }

    val batteryStatus = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
    promise.resolve(mapBatteryManagerStatusToCustomBatteryEnum(batteryStatus))
  }

  companion object {
    const val NAME = "TurboBattery"
  }
}
