import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FBSDKCoreKit  // ✅ Import Facebook SDK

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.moduleName = "raceTheStates"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    // ✅ Initialize Facebook SDK
    ApplicationDelegate.shared.application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // ✅ Ensure this method exists to fix the error
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  // ✅ Handle Facebook Login Redirect
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if ApplicationDelegate.shared.application(app, open: url, options: options) {
      return true
    }
    return RCTLinkingManager.application(app, open: url, options: options)
  }
}

