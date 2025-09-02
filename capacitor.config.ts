import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agriconnect.app',
  appName: 'AgriConnect',
  webDir: 'dist',
  server: {
    url: 'https://e0faff55-0c76-43f2-ad79-6981b1cd15a5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for nearby farmers...",
        cancel: "Cancel",
        availableDevices: "Available Devices",
        noDeviceFound: "No farmers found nearby"
      }
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      permissions: ["camera", "photos"]
    }
  },
  android: {
    allowMixedContent: true,
    permissions: [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN", 
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE"
    ]
  },
  ios: {
    permissions: [
      "NSBluetoothAlwaysUsageDescription",
      "NSBluetoothPeripheralUsageDescription", 
      "NSLocationWhenInUseUsageDescription",
      "NSCameraUsageDescription",
      "NSPhotoLibraryUsageDescription"
    ]
  }
};

export default config;
