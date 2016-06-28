'use strict';

// require('org.flybuy.cordova.background-location-services/www/BackgroundLocationServices');



// inject deps
LddGeoServiceFactory.$inject=['$window','$rootScope','$q','$log'];

// implement service
function LddGeoServiceFactory($window,$rootScope,  $q,$log) {

	//
	// https://github.com/mauron85/cordova-plugin-background-geolocation 
	var bgOptions = {
	  stationaryRadius: 10,
	  distanceFilter: 15,
	  desiredAccuracy: 10,
	  // debug: true,
	  // notificationTitle: 'Background tracking',
	  // notificationText: 'enabled',
	  // notificationIconColor: '#FEDD1E',
	  // notificationIconLarge: 'mappointer_large',
	  // notificationIconSmall: 'mappointer_small',
	  locationProvider: 0,//backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
	  interval: 6000,
	  fastestInterval: 5,
	  activitiesInterval: 10,
	  stopOnTerminate: false,
	  startOnBoot: false,
	  startForeground: true,
	  stopOnStillActivity: true,
	  activityType: 'Fitness',
	  saveBatteryOnBackground: false
	};




	function GeoService(){
		this.deferred=$q.defer();
	}

	GeoService.prototype.init = function(opts) {
    var posOptions = {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
    };
		var deferred=$q.defer();
		var self=this;
		if(!navigator.geolocation){
			return deferred.reject(new Error("Your device does not support Geo Location"));
		}

    // geo location is supported. Call navigator.geolocation.getCurrentPosition and :
    // - resolve the promise with the returned Position object, or
    // - reject the promise with the returned PositionError object, or
    // - time out after 5 seconds
    navigator.geolocation.getCurrentPosition(function(position) {
			deferred.resolve(position);
    	self.configure();
    }, deferred.reject, opts||posOptions);
    return deferred.promise;
	}

	GeoService.prototype.configure = function() {
		if(!backgroundGeoLocation){
			$log.debug('Could not find backgroundGeoLocation service');			
			return;
		}

		var bgGeolocation=backgroundGeoLocation;
		var self=this;
		var callbackSuccess=function(location) {
			$rootScope.$broadcast('geo:position', location);
			bgGeolocation.finish();
		}

		var callbackErr=function(err) {
        console.log('---------------BackgroundGeolocation error'+JSON.stringify(err));
		}
    console.log("--------------geo conf");

		bgGeolocation.configure(callbackSuccess,callbackErr,bgOptions);
		bgGeolocation.start();


	};


/**
function bgConfigure(config) {
  Object.assign(bgOptions, config);
  var options = Object.assign({}, bgOptions);

  if (options.interval) { options.interval *= 1000; }
  if (options.fastestInterval) { options.fastestInterval *= 1000; }
  if (options.activitiesInterval) { options.activitiesInterval *= 1000; }

  if (isStarted) {
    stopTracking();
    backgroundGeolocation.configure(
      setCurrentLocation,
      function (err) { console.log('Error occured', err); },
      options
    );
    startTracking();
  } else {
    backgroundGeolocation.configure(
      setCurrentLocation,
      function (err) { console.log('Error occured', err); },
      options
    );
  }
}

function startTracking() {
  if (isStarted) { return; }

  if (!window.isAndroid) {
    backgroundGeolocation.start(
      function () {
        isStarted = true;
        renderTabBar(isStarted);
      },
      function (err) {
        myApp.alert(err, 'Service start failed');
      }
    );
    return;
  }

  backgroundGeolocation.isLocationEnabled(
    function (enabled) {
      isLocationEnabled = enabled;
      if (enabled) {
        backgroundGeolocation.start();
        isStarted = true;
        renderTabBar(isStarted);
      } else {
        myApp.confirm('Would you like to open settings?', 'Location Services are disabled', function() {
          backgroundGeolocation.showLocationSettings();
        });
      }
    },
    function (error) {
      myApp.alert(error, 'Error detecting status of location settings');
    }
  );
}

function stopTracking() {
  if (!isStarted) { return; }
  backgroundGeolocation.stop();
  isStarted = false;
  renderTabBar(isStarted);
}

function renderTabBar(isStarted) {
  $$('#tabbar').html(Template7.templates.tabbarTemplate({isStarted: isStarted}));
}

function setStationary (location) {
  console.log('[DEBUG] stationary recieved', location);
  var latlng = new google.maps.LatLng(Number(location.latitude), Number(location.longitude));
  var stationaryCircle = new google.maps.Circle({
      fillColor: 'pink',
      fillOpacity: 0.4,
      strokeOpacity: 0,
      map: map,
  });
  stationaryCircle.setCenter(latlng);
  stationaryCircle.setRadius(location.radius);
  stationaryCircles.push(stationaryCircle);
  backgroundGeoLocation.finish();
}

function setCurrentLocation (location) {
    console.log('[DEBUG] location recieved', location);
    if (!currentLocationMarker) {
        currentLocationMarker = new google.maps.Marker({
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: 'gold',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3
            }
        });
        locationAccuracyCircle = new google.maps.Circle({
            fillColor: 'purple',
            fillOpacity: 0.4,
            strokeOpacity: 0,
            map: map
        });
    }
    if (!path) {
        path = new google.maps.Polyline({
            map: map,
            strokeColor: 'blue',
            fillOpacity: 0.4
        });
    }
    var latlng = new google.maps.LatLng(Number(location.latitude), Number(location.longitude));

    if (previousLocation) {
        // Drop a breadcrumb of where we've been.
        locationMarkers.push(new google.maps.Marker({
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3
            },
            map: map,
            position: new google.maps.LatLng(previousLocation.latitude, previousLocation.longitude)
        }));
    } else {
        map.setCenter(latlng);
        if (map.getZoom() < 15) {
            map.setZoom(15);
        }
    }

    // Update our current position marker and accuracy bubble.
    currentLocationMarker.setPosition(latlng);
    locationAccuracyCircle.setCenter(latlng);
    locationAccuracyCircle.setRadius(location.accuracy);

    // Add breadcrumb to current Polyline path.
    path.getPath().push(latlng);
    previousLocation = location;

    backgroundGeoLocation.finish();
}

function onDeviceReady() {
  backgroundGeolocation = window.backgroundGeolocation || window.backgroundGeoLocation || window.universalGeolocation;
  myApp.init();
}
**/



	//
	// plugin location is 
	// - ldd-ionic-webpack/plugins/
	return new GeoService();
}

