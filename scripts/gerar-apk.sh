#!/usr/bin/env bash
# Gera o APK do Android (Capacitor) em apk/KoeFirst.apk: o mesmo site de out/, sem caminho base, com voz e microfone nativos.
# Uso: npm run apk   (precisa do Java 21 e do Android SDK; veja CLAUDE.md)
set -euo pipefail
cd "$(dirname "$0")/.."

export JAVA_HOME="${JAVA_HOME:-$(ls -d "$HOME"/Library/Java/jdk-21*/Contents/Home 2>/dev/null | head -1)}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export KOE_VERSION_CODE=$(git rev-list --count HEAD)
export KOE_VERSION_NAME="1.$KOE_VERSION_CODE"

rm -rf out
NEXT_PUBLIC_BASE_PATH="" NEXT_TELEMETRY_DISABLED=1 npm run build
node scripts/gerar-icones-android.mjs
npx cap sync android
(cd android && ./gradlew -q assembleRelease)

mkdir -p apk
cp android/app/build/outputs/apk/release/app-release.apk apk/KoeFirst.apk
echo "✓ APK: apk/KoeFirst.apk (versão $KOE_VERSION_NAME)"
