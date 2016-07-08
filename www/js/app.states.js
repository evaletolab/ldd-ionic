'use strict';


// inject deps

// implement service
function LddStates($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.geo', {
    url: '/geo',
    views: {
      'tab-geo': {
        templateUrl: 'templates/geo.html',
        controller: 'GeoCtrl'
      }
    }
  })

  .state('tab.assets', {
    url: '/assets',
    views: {
      'tab-assets': {
        templateUrl: 'templates/assets.html',
        controller: 'AssetsCtrl'
      }
    }
  })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/geo');
}

