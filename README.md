This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Android storage TurboModule

The Settings screen shows the available space on the filesystem containing the
app's internal files. This is a small example of exposing an Android API to
React Native through a TurboModule:

1. **Define the contract:** [NativeStylishStorage.ts](./src/specs/NativeStylishStorage.ts)
   declares `getAvailableBytes(): Promise<number>` and looks up the module by
   the name `NativeStylishStorage`.
2. **Generate the native contract:** React Native Codegen reads the spec using
   `codegenConfig` in [package.json](./package.json) and generates
   `NativeStylishStorageSpec` under `android/app/build/generated/source/codegen/`.
   The generated Java method receives a `Promise` parameter. Do not edit
   generated files; Codegen recreates them during the Android build.
3. **Implement Android behavior:** [NativeStylishStorageModule.kt](./android/app/src/main/java/com/stylish/NativeStylishStorageModule.kt)
   extends the generated spec and uses Android `StatFs` on `filesDir` to resolve
   the available byte count, or reject the promise if the filesystem cannot be
   inspected. This does not require a storage permission.
4. **Register the module:** [NativeStylishStoragePackage.kt](./android/app/src/main/java/com/stylish/NativeStylishStoragePackage.kt)
   maps the generated module name to the Kotlin implementation. The package is
   added in [MainApplication.kt](./android/app/src/main/java/com/stylish/MainApplication.kt).
5. **Use it in React:** [Settings.tsx](./src/modules/settings/Settings.tsx)
   calls the module, shows a loading or error state, and displays a warning
   when less than 1 GiB is available. The refresh button requests a new reading.

To try it, start Metro, rebuild the Android app with `npm run android`, and
open **Settings**. Native code or registration changes require a native
rebuild; Fast Refresh alone is not enough. To run just Codegen or the focused
UI tests:

```sh
cd android && ./gradlew :app:generateCodegenArtifactsFromSchema
```

```sh
npm test -- --runInBand __tests__/StorageSettings.test.tsx
```

The reading is a snapshot of available filesystem space, not the size of the
product cache or a guarantee that a later write will succeed. It does not
change the app's caching policy. The UI tests mock the native module; use an
Android device or emulator to verify the real native call.

For an interview, explain the problem, then trace the typed TypeScript contract
through Codegen, the Kotlin `StatFs` implementation, package registration, and
the React UI. Mention error handling and why cache writes still need their own
failure handling even when the storage reading looks healthy.

## Android startup macrobenchmark

The `macrobenchmark` module measures cold application startup with AndroidX
Macrobenchmark. `StartupTimingMetric` records time to initial display (TTID)
and time to full display (TTFD). The app reports fully drawn after session
restoration and an additional rendered frame; TTFD is used here as the
time-to-interactive proxy. The Android app exposes a `benchmark-app-ready`
marker after session initialization, and the benchmark waits for it (up to 15
seconds) before ending the measurement. This prevents the splash screen's first
frame from prematurely ending the TTFD measurement.

Run the benchmark on a physical Android device for useful performance numbers:

```sh
adb shell pm clear com.stylish
cd android
./gradlew :macrobenchmark:connectedBenchmarkAndroidTest
```

The benchmark runs 10 cold starts with ART compilation disabled. It starts the
launcher activity, so the current two-second splash delay is included in TTFD;
TTID currently measures the splash screen's first frame. Results and system
traces are written under
`android/macrobenchmark/build/outputs/connected_android_test_additional_output/`.
Keep the device, build variant, and app data state consistent when comparing
results between changes.

For an emulator-only smoke run, opt in to suppress Macrobenchmark's emulator
guard:

```sh
./gradlew :macrobenchmark:connectedBenchmarkAndroidTest -PallowEmulatorBenchmark=true
```

Emulator timings are not representative and should not be used for performance
comparisons.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
