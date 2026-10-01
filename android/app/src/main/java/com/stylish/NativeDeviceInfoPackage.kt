package com.stylish

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeStylishDeviceInfoPackage : BaseReactPackage() {

  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    if (name == NativeStylishDeviceInfoSpec.NAME) {
      NativeStylishDeviceInfoModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        NativeStylishDeviceInfoSpec.NAME to
          ReactModuleInfo(
            NativeStylishDeviceInfoSpec.NAME,
            NativeStylishDeviceInfoModule::class.java.name,
            false,
            false,
            false,
            true,
          ),
      )
    }
}