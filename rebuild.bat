@echo off
REM MinDrop rebuild for Windows — framework-agnostic Android pipeline.
setlocal

echo.
echo ====================================
echo  MinDrop - rebuilding Android app
echo ====================================

if "%REBUILD_SKIP_GIT%"=="1" (echo [1/8] git pull skipped) else (echo [1/8] git pull & call git pull & if errorlevel 1 goto :error)
if "%REBUILD_SKIP_INSTALL%"=="1" (echo [2/8] npm install skipped) else (echo [2/8] npm install & call npm install & if errorlevel 1 goto :error)

echo [3/8] npm run build:android
call npm run build:android
if errorlevel 1 goto :error

echo [4/8] pre-sync validation
call node scripts\validate-android.mjs --phase=pre-sync
if errorlevel 1 goto :error

echo [5/8] ensure android/ platform
if not exist "android" (call npx cap add android & if errorlevel 1 goto :error) else (echo   android\ present)

echo [6/8] self-heal capacitor webDir
call node -e "const fs=require('fs'),p=require('path');const m=p.resolve('.output/android-build-manifest.json');if(!fs.existsSync(m))process.exit(0);const j=JSON.parse(fs.readFileSync(m,'utf8'));const c=fs.readFileSync('capacitor.config.ts','utf8');const mm=c.match(/webDir\s*:\s*[\"'`]([^\"'`]+)[\"'`]/);if(mm&&mm[1]!==j.webDir){fs.writeFileSync('capacitor.config.ts',c.replace(mm[0],'webDir: \"'+j.webDir+'\"'));console.log('  self-heal: '+mm[1]+' -> '+j.webDir);}else{console.log('  webDir already matches');}"
if errorlevel 1 goto :error

echo [7/8] npx cap sync android
call npx cap sync android
if errorlevel 1 goto :error
call scripts\setup-android-native.bat
if errorlevel 1 goto :error

echo [8/8] post-sync validation
call node scripts\validate-android.mjs --phase=post-sync
if errorlevel 1 goto :error

echo.
echo ====================================
echo  DONE  -  npx cap open android
echo ====================================
endlocal
exit /b 0

:error
echo FAILED - see output above
endlocal
exit /b 1
