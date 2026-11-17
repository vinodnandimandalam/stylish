package com.stylish

import com.facebook.react.bridge.ReactApplicationContext

class NativeStylishStartupModule(
  reactContext: ReactApplicationContext,
) : NativeStylishStartupSpec(reactContext) {

  override fun reportAppReady() {
    val activity = getCurrentActivity() ?: return
    activity.runOnUiThread {
      activity.reportFullyDrawn()
    }
  }
}
