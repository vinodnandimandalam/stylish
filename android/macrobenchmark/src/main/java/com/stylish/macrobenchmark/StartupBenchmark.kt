package com.stylish.macrobenchmark

import androidx.benchmark.macro.CompilationMode
import androidx.benchmark.macro.StartupMode
import androidx.benchmark.macro.StartupTimingMetric
import androidx.benchmark.macro.junit4.MacrobenchmarkRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.uiautomator.By
import androidx.test.uiautomator.Until
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@LargeTest
@RunWith(AndroidJUnit4::class)
class StartupBenchmark {
  @get:Rule
  val benchmarkRule = MacrobenchmarkRule()

  @Test
  fun coldStartupToInteractive() {
    benchmarkRule.measureRepeated(
      packageName = "com.stylish",
      metrics = listOf(StartupTimingMetric()),
      compilationMode = CompilationMode.None(),
      startupMode = StartupMode.COLD,
      iterations = 10,
      setupBlock = {
        pressHome()
      },
      measureBlock = {
        startActivityAndWait()
        check(
          device.wait(
            Until.hasObject(By.res("benchmark-app-ready")),
            15_000,
          ),
        ) {
          "App did not reach its ready state within 15 seconds."
        }
        device.waitForIdle()
      },
    )
  }
}
