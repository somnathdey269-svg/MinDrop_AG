@echo off
REM Thin wrapper around the shared validator, with toolchain probes enabled.
node scripts\validate-android.mjs --doctor --report-only %*
exit /b %ERRORLEVEL%
