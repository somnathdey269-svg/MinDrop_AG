// DO NOT REPLACE WITH THE STUB FROM android_backup/. Custom Capacitor plugins
// (Alarms, Notify, Places) MUST be registered below or reminders, notification
// listener, and geofences silently stop working. Kotlin sources of truth live
// in native/android/ and are copied by scripts/setup-android-native.sh.
package in.mindrop.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.splashscreen.SplashScreen;

import app.getmindrop.alarms.AlarmsBridgePlugin;
import app.getmindrop.notify.NotifyBridgePlugin;
import app.getmindrop.places.PlacesBridgePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Handle splash screen transitions using Android 12+ SplashScreen API
        SplashScreen.installSplashScreen(this);

        // Register custom Capacitor plugins BEFORE super.onCreate so the
        // WebView bridge exposes them on first JS load.
        registerPlugin(AlarmsBridgePlugin.class);
        registerPlugin(NotifyBridgePlugin.class);
        registerPlugin(PlacesBridgePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
