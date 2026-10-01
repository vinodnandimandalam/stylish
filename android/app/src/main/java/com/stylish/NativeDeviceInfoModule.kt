package com.stylish

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class NativeStylishDeviceInfoModule(
  reactContext: ReactApplicationContext,
) : NativeStylishDeviceInfoSpec(reactContext) {

  override fun getDeviceModel(promise: Promise) {
    promise.resolve(Build.MODEL)
  }
}