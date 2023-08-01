package com.turbobattery

enum class BatteryState(val value: Int) {
  UNKNOWN(0), UNPLUGGED(1), CHARGING(2), FULL(3);

  companion object {
    fun getStateByInt(value: Int) = values().firstOrNull { it.value == value }
  }
}
