package com.hardas.musicmine

import android.os.Bundle
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import android.graphics.Color

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // Force the navigation bar to be opaque
    enableEdgeToEdge(
      navigationBarStyle = SystemBarStyle.auto(
        Color.BLACK, // Dark mode background color
        Color.BLACK  // Light mode background color (Change to Color.WHITE if you prefer light)
      )
    )
    super.onCreate(savedInstanceState)
  }
}
