import type { CapacitorConfig } from "@capacitor/cli";

// APK do Android (npm run apk): o mesmo site estático de out/, com voz e microfone nativos (src/lib/audio/nativo.ts).
const config: CapacitorConfig = {
  appId: "io.github.allanssst.koefirst",
  appName: "KoeFirst",
  webDir: "out",
  backgroundColor: "#11131c",
  android: { allowMixedContent: false },
};

export default config;
