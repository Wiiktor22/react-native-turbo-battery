package com.turbobattery

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.PowerManager
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback

private val BATTERY_STATE_CHANGED_EVENT_NAME = "TurboBattery.BatteryStateChangedEvent"
private val BATTERY_LEVEL_CHANGED_EVENT_NAME = "TurboBattery.BatteryLevelChangedEvent"
private val BATTERY_POWER_SAVING_CHANGED_EVENT_NAME = "TurboBattery.LowPowerModeChangedEvent"

class TurboBatteryModule internal constructor(val context: ReactApplicationContext) :
  TurboBatterySpec(context) {

  var savedBatteryLevel: Double = 0.0
  var savedBatteryState = BatteryState.UNKNOWN
  var savedPowerSavingEnabled: Boolean = false

  override fun getName(): String {
    return NAME
  }

  init {
    val batteryFilter = IntentFilter()
    batteryFilter.addAction(Intent.ACTION_BATTERY_CHANGED)
    batteryFilter.addAction(Intent.ACTION_POWER_CONNECTED);
    batteryFilter.addAction(Intent.ACTION_POWER_DISCONNECTED);
    batteryFilter.addAction(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED);

    val batteryReceiver = object : BroadcastReceiver() {
      override fun onReceive(internalContext: Context?, intent: Intent?) {
        val currentBatteryStateAsInt = intent?.let { getBatteryStateFromIntent(it) }
        currentBatteryStateAsInt?.let {
          if (it != savedBatteryState.value) {
            savedBatteryState = BatteryState.getStateByInt(it) ?: BatteryState.UNKNOWN

            val params = Arguments.createMap().apply {
              putInt("batteryState", mapBatteryManagerStatusToCustomBatteryStateEnum(it))
            }

            context
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit(BATTERY_STATE_CHANGED_EVENT_NAME, params)
          }
        }

        val currentBatteryLevel = intent?.let { getBatteryLevelFromIntent(it) }
        currentBatteryLevel?.let {
          if (it != savedBatteryLevel) {
            savedBatteryLevel = it
            val params = Arguments.createMap().apply {
              putDouble("batteryLevel", it.toDouble())
            }

            context
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit(BATTERY_LEVEL_CHANGED_EVENT_NAME, params)
          }
        }

        val currentLowPowerState = internalContext?.let { getPowerSavingStateFromContext(it) }
        currentLowPowerState?.let {
          if (it != savedPowerSavingEnabled) {
            savedPowerSavingEnabled = it;
            val params = Arguments.createMap().apply {
              putBoolean("isEnabled", it);
            }

            context
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit(BATTERY_POWER_SAVING_CHANGED_EVENT_NAME, params)
          }
        }
      }
    }

    context.registerReceiver(batteryReceiver, batteryFilter)
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  private fun getBatteryLevelFromIntent(intent: Intent): Double? {
    val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
    val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1)

    return if (level != -1 && level != null && scale != -1 && scale != null) {
      level / scale.toDouble()
    } else {
      null
    }
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

    val calculatedLevel = getBatteryLevelFromIntent(batteryIntent!!)

    if (calculatedLevel != null) {
      savedBatteryLevel = calculatedLevel
      promise.resolve(calculatedLevel)
    } else {
      promise.reject("Unable to get battery level!")
    }
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  override fun getBatteryLevelSync(): Double {
    val batteryIntent: Intent? = context.applicationContext.registerReceiver(
      null,
      IntentFilter(Intent.ACTION_BATTERY_CHANGED)
    ) ?: return -1.0

    return getBatteryLevelFromIntent(batteryIntent!!) ?: -1.0
  }

  private fun mapBatteryManagerStatusToCustomBatteryStateEnum(status: Int): Int {
    return when(status) {
      BatteryManager.BATTERY_STATUS_FULL -> BatteryState.FULL.value
      BatteryManager.BATTERY_STATUS_CHARGING -> BatteryState.CHARGING.value
      BatteryManager.BATTERY_STATUS_NOT_CHARGING -> BatteryState.UNPLUGGED.value
      BatteryManager.BATTERY_STATUS_DISCHARGING -> BatteryState.UNPLUGGED.value
      else -> BatteryState.UNKNOWN.value
    }
  }

  private fun getBatteryStateFromIntent(intent: Intent): Int {
    val batteryStatus = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
    return mapBatteryManagerStatusToCustomBatteryStateEnum(batteryStatus)
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

    val mappedBatteryStatus = getBatteryStateFromIntent(batteryIntent)
    savedBatteryState = BatteryState.getStateByInt(mappedBatteryStatus) ?: BatteryState.UNKNOWN

    promise.resolve(mappedBatteryStatus)
  }

  private fun getPowerSavingStateFromContext(context: Context): Boolean {
    val powerManager = context.applicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
    return powerManager?.isPowerSaveMode ?: false
  }

  @ReactMethod
  override fun getLowPowerState(successCallback: Callback, errorCallback: Callback) {
    try {
      val params = Arguments.createMap().apply {
        putBoolean("isEnabled", getPowerSavingStateFromContext(context))
      }
      successCallback.invoke(params)
    } catch (e: Throwable) {
      errorCallback(e)
    }
  }

  override fun addListener(eventName: String?) = Unit

  override fun removeListeners(count: Double) = Unit

  companion object {
    const val NAME = "TurboBattery"
  }
}
