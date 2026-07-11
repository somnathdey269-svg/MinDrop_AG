# MinDrop ProGuard rules

# Capacitor bridge classes accessed via reflection from JS
-keep class in.mindrop.app.MainActivity { *; }
-keep class app.getmindrop.alarms.** { *; }
-keep class app.getmindrop.notify.** { *; }
-keep class app.getmindrop.places.** { *; }

# Keep Capacitor plugin annotations + methods invoked by name
-keepclasseswithmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin class *
-keepclassmembers class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
}

# Play Services + kotlin metadata
-keep class com.google.android.gms.location.** { *; }
-keepattributes *Annotation*, InnerClasses, EnclosingMethod, Signature
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# WebView JS interface (Capacitor)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
