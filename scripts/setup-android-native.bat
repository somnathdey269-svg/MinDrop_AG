@echo off
REM scripts/setup-android-native.bat
REM Windows equivalent of setup-android-native.sh — copies Kotlin plugins from
REM native\android\ into android\app\src\main\java\app\getmindrop\. Idempotent.
setlocal enabledelayedexpansion

set SRC_ROOT=native\android
set DST_ROOT=android\app\src\main\java\app\getmindrop

if not exist "android" (
    echo FAIL: android\ directory not found.
    echo       First-time setup:  npx cap add android
    exit /b 1
)
if not exist "%SRC_ROOT%" (
    echo FAIL: %SRC_ROOT% not found - nothing to copy.
    exit /b 1
)

set COPIED=0
for /d %%D in ("%SRC_ROOT%\*") do (
    set PKG=%%~nxD
    if not exist "%DST_ROOT%\!PKG!" mkdir "%DST_ROOT%\!PKG!"
    for %%F in ("%%D\*.kt") do (
        copy /Y "%%F" "%DST_ROOT%\!PKG!\" >nul
        echo   OK: %%~nxF -^> %DST_ROOT%\!PKG!\
        set /a COPIED+=1
    )
)

if %COPIED%==0 (
    echo   ^(no .kt files found under %SRC_ROOT%^)
    exit /b 0
)

echo.
echo -- MainActivity registration reminder --
echo Custom Capacitor plugins are NOT auto-discovered. Register them in
echo MainActivity.java. See docs\CAPACITOR_BUILD.md.
echo.
echo Quick check - this line must exist inside onCreate^(^):
echo   registerPlugin^(app.getmindrop.places.PlacesBridgePlugin.class^);
echo.
endlocal
exit /b 0
