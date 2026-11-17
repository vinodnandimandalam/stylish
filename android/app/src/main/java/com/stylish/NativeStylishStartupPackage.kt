package com.stylish

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeStylishStartupPackage : BaseReactPackage() {

  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    if (name == NativeStylishStartupSpec.NAME) {
      NativeStylishStartupModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        NativeStylishStartupSpec.NAME to
          ReactModuleInfo(
            NativeStylishStartupSpec.NAME,
            NativeStylishStartupModule::class.java.name,
            false,
            false,
            false,
            true,
          ),
      )
    }
}
