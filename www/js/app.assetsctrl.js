'use strict';


// inject deps
AssetsCtrl.$inject=['$scope','$rootScope','$cordovaSocialSharing','LddPlayer','$ionicLoading','$ionicPlatform','$log'];



// implement service
function AssetsCtrl($scope, $rootScope, $cordovaSocialSharing,LddPlayer, $ionicLoading, $ionicPlatform, $log) {

	$scope.items=[
 	  { 
 	  	id: 10, 
 	  	img:'//passeurdesciences.blog.lemonde.fr/files/2016/07/Dolly_face_closeup-550x367.jpg',
 	  	sound:'https://dl.airtable.com/KPuOSZBPQzOM95k0dT0C_les-pie%CC%80ces-de-puzzle.m4a',
 	  	h:'Sélection scientifique de la semaine',
 	  	p:'Si le juge d’instruction suit ces réquisitions, la banque suisse et sa filiale française seraient jugées en France. Accusées d’y avoir mis en place, dans les années 2000, un système de fraude fiscale généralisée, elles risqueraient une amende colossale.' ,
 	  	position:0
 	  },
 	  { 
 	  	id: 11, 
 	  	img:'//s2.lemde.fr/image/2016/07/08/534x0/4965961_6_c330_2016-07-08-555510a-26224-qlsqrd_b9d64592bedc7fb60649c1d286048f6d.jpg',
 	  	sound:'https://dl.airtable.com/kuXjQYAGSlqR1n05FBCd_l-apparition-d-un-visage.m4a',
 	  	h:'A Segré, toutes les saveurs du swing, en profondeur ou à la sauvette',
 	  	p:'Si le juge d’instruction suit ces réquisitions, la banque suisse et sa filiale française seraient jugées en France. Accusées d’y avoir mis en place, dans les années 2000, un système de fraude fiscale généralisée, elles risqueraient une amende colossale.', 
 	  	position:0
 	  },
 	  { 
 	  	id: 12, 
 	  	img:'http://s1.lemde.fr/image/2016/07/07/534x0/4965301_7_d35a_2016-07-07-f069bb2-17122-vgb7sa_a71bc9bc30751fd85dad66e10a873252.jpg',
 	  	sound:'https://dl.airtable.com/2yVxCML6QDKbmrqXxkEW_la-rencontre-avec-l-amie-d-ale%CC%81as.m4a',
 	  	h:'Sélection scientifique de la semaine',
 	  	p:'Si le juge d’instruction suit ces réquisitions, la banque suisse et sa filiale française seraient jugées en France. Accusées d’y avoir mis en place, dans les années 2000, un système de fraude fiscale généralisée, elles risqueraient une amende colossale.' ,
 	  	position:0
 	  },
 	  {
 	  	id: 13, 
 	  	img:'//passeurdesciences.blog.lemonde.fr/files/2016/07/Dolly_face_closeup-550x367.jpg',
 	  	sound:'https://dl.airtable.com/dEgmqZD9QRu4lGen5o52_une-histoire-a%CC%80-me-raconter.m4a',
 	  	h:'La ristouille ne frappera pas!',
 	  	p:'Si le juge d’instruction suit ces réquisitions, la banque suisse et sa filiale française seraient jugées en France. Accusées d’y avoir mis en place, dans les années 2000, un système de fraude fiscale généralisée, elles risqueraient une amende colossale.', 
 	  	position:0
 	  }
	];

	//
	// index the list
	var map={
		10:0,
		11:1,
		12:2,
		13:3
	};

	//
	// current media
	var currentMedia;

	//
	// UI state
	$rootScope.options={
		showDelete:false,
		autoPlay:false
	}



  $scope.play = function(id) {
  		var item=$scope.items[map[id]];

      //
      // case of pause
			if(item.play){
  			item.play=false;
  			item.pause=true;
  			return item.media.pause();
  		}
  		if(item.pause){
  			item.play=true;
  			item.pause=false;
  			return item.media.play();
  		}


  		//
  		// first time, load player?
      if(!item.media){
	      // $ionicLoading.show({template: 'Loading...'});
	      item.media = new LddPlayer(item.sound);
	      // item.media.$promise.finally(function() {
	      // 	$ionicLoading.hide();
	      // })
      }


      //
      // new media
      if(currentMedia&&currentMedia.stop){
      	currentMedia.media.stop();
      	currentMedia.position=0;
      	currentMedia=false;
      }

      // 
      // anonymous call to keep scope item
      (function(item){
	      item.media.play().then(function(run) {
	      	item.play=false;
	      	item.pause=false;
	      	item.played=true;
	      	item.position=0;
	      	item.duration=0;
	      },function(err) {
	      	console.log('----------'+JSON.stringify(err));
	      },function(update) {
	      	console.log('----------'+item.id+':'+JSON.stringify(update));
	      	if(update.position)item.position=update.position;
	      	if(update.duration)item.duration=update.duration;
	      	if(item.play||item.pause)return;
	      	currentMedia=item;
	      	$scope.items.forEach(function(i) {item.play=false;item.pause=false;});
	      	item.play=true;
	      });
	    })(item);
  }

  // var mediaStatusCallback = function(status) {
  //     if(status == 1) {
  //         $ionicLoading.show({template: 'Loading...'});
  //     } else {
  //         $ionicLoading.hide();
  //     }
  // };


	$rootScope.$on('geo:position', function(event,location) {
		console.log('--------------------',location)
	// {"time":1467127362000,"speed":0,"altitude":376.437225,"bearing":0,"provider":"gps","longitude":6.144768333333333,"debug":false,"latitude":46.20378833333333,"accuracy":1,"locationProvider":0}

	});

	// $ionicPlatform.ready(function(){

	// });

}

