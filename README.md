# [SatVis.space](https://satvis.space)

Satellite orbit visualization and pass prediction.

![Screenshot](https://user-images.githubusercontent.com/1117666/47623704-f0c3e900-db14-11e8-9cf9-7bf13acb267c.png)

## Features
- Calculate posistion and orbit of satellites from TLE
- Set groundstation through geolocation or pick on map
- Calculate passes for groundstation
- Local browser notifications for passes
- Serverless architecture
- Works offline as Progressive Web App

## Built With
- [CesiumJS](https://cesiumjs.org)
- [Satellite.js](https://github.com/shashwatak/satellite-js)
- [Vue.js](https://vuejs.org)
- [Workbox](https://developers.google.com/web/tools/workbox)

## Development

### Setup
Initialize submodules and install npm build dependencies:
```
git submodule update --init
npm install
```

### Run
- `npm run start-dev` for the dev server
- `npm run build` to build the application (output in `dist` folder)
- `npm run serve-prod` to build the application and serve with static webserver

## iOS App
To provide pass notifications on iOS where local browser notifications are [not
supported](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API#Browser_compatibility)
a simple app wraps the webview and handles the scheduling of
[UserNotifications](https://developer.apple.com/documentation/usernotifications).

## License
This project is licensed under the MIT License - see `LICENSE` file for details.

## Acknowledgements
Original version developed for the [MOVE-II CubeSat project](https://www.move2space.de) by Jonathan, Marco and Flo.
