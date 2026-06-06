# DIUNotesBuddy App

> The native mobile experience for [diunotesbuddy.live](https://diunotesbuddy.live) — your academic companion at Daffodil International University.

---

## About

**DIUNotesBuddy App** is the official Android application for the DIUNotesBuddy platform. It ports the full web experience of [diunotesbuddy.live](https://diunotesbuddy.live) into a fast, native mobile app built with React Native and Expo.

Whether you're looking for lecture notes, past papers, or course resources — it's all in your pocket now.

---

## Tech Stack

| | |
|---|---|
| **Framework** | [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/) |
| **Navigation** | Expo Router (file-based routing) + React Navigation |

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/oceanmallik/DIUNotesBuddyApp.git
cd DIUNotesBuddyApp

# Install dependencies
npm install
```

Open the project in Android Studio, or use the **Expo Go** app on your Android device by scanning the QR code after starting the dev server.

---


## Related

- 🌐 **Website:** [diunotesbuddy.live](https://diunotesbuddy.live)
- 🏫 **University:** [Daffodil International University](https://diu.edu.bd)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is private and maintained by [@oceanmallik](https://github.com/oceanmallik).


# Local Android Build Guide

This guide documents the exact steps required to successfully compile the release APK for this React Native Expo project natively on Fedora KDE.

## 1. Prerequisites & Environment Setup

React Native and Gradle strictly require **Java 17** and specific Android Native Development Kit (NDK) versions to compile the C++ binaries. Newer Java versions (like Java 24/25) will cause a `major version 69` crash during the Gradle semantic analysis phase.

### Install Java 17 (Eclipse Temurin)
Fedora uses the Adoptium repositories for Java 17. Run these commands:

```bash
sudo dnf install adoptium-temurin-java-repository
sudo dnf install temurin-17-jdk
```

Switch the active system Java and Java Compiler to version 17:
```bash
sudo alternatives --config java
sudo alternatives --config javac
```

### Install Android Studio & Required SDKs
1. Install Android Studio.
2. Open Android Studio -> **SDK Manager** -> **SDK Tools**.
3. Check **Show Package Details** (bottom right).
4. Expand **NDK (Side by side)** and explicitly install version **27.1.12297006** (Without this, the `[CXX1101]` error will occur).

## 2. Generating the Android Folder (Prebuild)

If the `android/` folder is missing (e.g., after a fresh `git clone`), generate the native source code by running:
```bash
npx expo run:android --variant release
```
*Note: This command may end with a "No Android connected device found" error. This is normal and means the build files were generated successfully but couldn't be automatically installed on an emulator.*

## 3. Compiling the APK

To compile the standalone APK file using Gradle:

```bash
cd android
./gradlew assembleRelease
```

Once finished, the generated APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

## 4. Troubleshooting

**Gradle Daemon crashes with "Unsupported class file major version"**
This means Gradle is using the wrong Java version. Ensure `java -version` shows Java 17. Then, kill the stuck daemon and clean the cache:
```bash
cd android
./gradlew --stop
./gradlew clean
./gradlew assembleRelease
```

**Missing source.properties file for NDK**
If the build fails with `[CXX1101] NDK at ... did not have a source.properties file`, open the SDK Manager, uninstall your current NDK, and strictly install version `27.1.12297006`.

## 3. Prepare for release
This is how to generate aap for the project. 
```bash
npx expo prebuild
cd android
./gradlew clean
./gradlew bundleRelease
```
Once finished, the generated APK will be located at:
`android/app/build/outputs/bundle/release/app-release.aab`