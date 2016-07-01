ldd-ionic
=============


## Quick Start

Clone the repository

```bash
$ git clone https://github.com/evaletolab/ldd-ionic.git
```

Install the dependencies

```bash
$ npm install
```

Watch Mode (this will run the webpack dev server)

```bash
$ gulp watch
```

Adding Cordova Plugins

```bash
$ ionic plugin add cordova-plugin-console
$ ionic plugin add cordova-plugin-device
$ ionic plugin add [cordova-plugin-mauron85-background-geolocation](https://github.com/mauron85/cordova-plugin-background-geolocation)
$ ionic plugin add cordova-plugin-whitelist
$ ionic plugin add cordova-plugin-x-socialsharing
$ ionic plugin add ionic-plugin-keyboard
```

Adding Android permission in AndroidManifest.xml
```XML
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
```

Adding Platforms

```bash
$ ionic platform add ios
$ ionic platform add android
```

Build

```bash
$ gulp && ionic build
```

Installing the emulator

* https://docs.genymotion.com/Content/01_Get_Started/Installation.htm

Running in the emulator

```bash
$ ionic run android
```
