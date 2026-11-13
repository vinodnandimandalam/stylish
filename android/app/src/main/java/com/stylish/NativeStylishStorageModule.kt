package com.stylish

import android.os.StatFs
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class NativeStylishStorageModule(
  reactContext: ReactApplicationContext,
) : NativeStylishStorageSpec(reactContext) {

  override fun getAvailableBytes(promise: Promise) {
    try {
      val availableBytes = StatFs(reactApplicationContext.filesDir.absolutePath).availableBytes
      promise.resolve(availableBytes.toDouble())
    } catch (error: IllegalArgumentException) {
      promise.reject("E_STORAGE_UNAVAILABLE", "Could not read available storage.", error)
    } catch (error: SecurityException) {
      promise.reject("E_STORAGE_UNAVAILABLE", "Could not read available storage.", error)
    }
  }
}
