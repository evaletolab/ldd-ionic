'use strict';


// inject deps
GeoCtrl.$inject=['$scope','$rootScope', '$timeout','geoService','$cordovaSocialSharing','$ionicLoading','$ionicPlatform','$log'];

// implement service
function GeoCtrl($scope, $rootScope, $timeout, geoService, $cordovaSocialSharing, $ionicLoading, $ionicPlatform, $log) {

  var currentLocationMarker, locationAccuracyCircle, path, previousLocation, locationMarkers=[], map;

	function initMap(latlng) {
		if(map) return;
    var mOpts = {
        center: latlng,
        zoom: 18,
        disableDefaultUI: true
    };          
        // mapTypeId: google.maps.MapTypeId.ROADMAP
    map = new google.maps.Map(document.getElementById("map"), mOpts);               
    $scope.map = map; 

    // init tools
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
    path = new google.maps.Polyline({
        map: map,
        strokeColor: 'blue',
        fillOpacity: 0.4
    });

    previousLocation = location;

	}


	$rootScope.$on('geo:position', function(event,location) {
	// {"time":1467127362000,"speed":0,"altitude":376.437225,"bearing":0,"provider":"gps","longitude":6.144768333333333,"debug":false,"latitude":46.20378833333333,"accuracy":1,"locationProvider":0}
		 $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>New position (speed:'+location.speed+')'
     });
       

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
    } 

    // Update our current position marker and accuracy bubble.
    currentLocationMarker.setPosition(latlng);
    locationAccuracyCircle.setCenter(latlng);
    locationAccuracyCircle.setRadius(location.accuracy);

    // Add breadcrumb to current Polyline path.
    path.getPath().push(latlng);
    previousLocation = location;

    $timeout(function() {
    	 $ionicLoading.hide();           
    },2000)





	});



	$ionicPlatform.ready(function(){
		 $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
      });
       


      geoService.init().then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
       		$log.debug('----------init ctrl location' +JSON.stringify(position));

          var myLatlng = new google.maps.LatLng(lat, long);           
          initMap(myLatlng);

        	new google.maps.Marker({
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3
            },
            map: map,
            position: myLatlng
        	});

          $ionicLoading.hide();           
           
      }, function(err) {
          $ionicLoading.hide();
          $log.debug(err);
      });		

      // geoService.configure();
	});

}

