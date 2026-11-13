package com.stylish

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeStylishStoragePackage : BaseReactPackage() {

  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? =
    if (name == NativeStylishStorageSpec.NAME) {
      NativeStylishStorageModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        NativeStylishStorageSpec.NAME to
          ReactModuleInfo(
            NativeStylishStorageSpec.NAME,
            NativeStylishStorageModule::class.java.name,
            false,
            false,
            false,
            true,
          ),
      )
    }
}
