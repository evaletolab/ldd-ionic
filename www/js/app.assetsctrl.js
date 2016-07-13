'use strict';


// inject deps
AssetsCtrl.$inject=['$scope','$rootScope','$cordovaSocialSharing','geoService','LddPlayer','nora','$ionicLoading','$ionicPlatform','$log'];



// implement service
function AssetsCtrl($scope, $rootScope, $cordovaSocialSharing, geoService, LddPlayer, nora, $ionicLoading, $ionicPlatform, $log) {

/**
	{
	  "id": "recR9iMZ5oMYkZSLk",
	  "title": "La traduction du successif du monde extérieur",
	  "audio_file": [
	      {
	          "id": "attNtnDqirCV04aFo",
	          "url": "https://dl.airtable.com/t55hy3XSeGZHUOOS1aQK_la-traduction-du-successif.m4a",
	          "filename": "la-traduction-du-successif.m4a",
	          "size": 2406380,
	          "type": "audio/x-m4a"
	      }
	  ],
	  "doc_url": "http://www.liminaire.fr/spip.php?article1230",
	  "text": "Si vous me demandez ce que c’est, je ne le sais pas. Et plutôt que de mettre en pièces, construire des raccords entre différents plans : éléments de classes et de séries hétérogènes. Une image. Surpris de ce qui apparaît sous la main, sous les yeux, si surpris que l’on se précipite pour aller voir par là, au cas où il y aurait quelque chose. Si vous ne me le demandez pas je le sais. Le plus souvent, c’est le cas. Un sentiment d’arrêt, ou de mouvement amorcé. Pour ainsi dire la traduction du successif du monde extérieur dans la forme de notre sens intérieur, le temps. // Ce qui peut commencer. Tout ce qui précède explique la grande puissance de l’art des sons ou de la musique du fait que celle-ci est pour nous métaphoriquement un temps condensé et si elle le veut, empli au plus haut degré, et du fait qu’elle lie avec la règle de sa progression la plus grande variation dans ce qui se passe en elle. Ce qu’on envisage avec un mélange de peur et d’envie. Et davantage que cela : mystérieusement. ",
	  "image": [
	      {
	          "id": "attEKCbITXNwR2SGw",
	          "url": "https://dl.airtable.com/o0DWg7Y4QiSpc2rKX3GD_Orle%CC%81ans.jpg",
	          "filename": "Orléans.jpg",
	          "size": 1566804,
	          "type": "image/jpeg",
	          "thumbnails": {
	              "small": {
	                  "url": "https://dl.airtable.com/9W3fSn88Sgys6ObNetq7_small_Orle%CC%81ans.jpg",
	                  "width": 54,
	                  "height": 36
	              },
	              "large": {
	                  "url": "https://dl.airtable.com/XW3RdAZ0RBSUYSDobEZH_large_Orle%CC%81ans.jpg",
	                  "width": 256,
	                  "height": 171
	              }
	          }
	      }
	  ]
	}

*/
	$scope.items=[];

	//
	// current media
	var currentMedia;

	//
	// UI state
	$rootScope.options={
		showDelete:false,
		autoPlay:false
	}


	$rootScope.toggle=function() {
		$rootScope.options.autoPlay=!$rootScope.options.autoPlay;

		//
		// play game
		if($rootScope.options.autoPlay===true){
			var current=nora.current_asset();
			while(!current.asset.audio_file){
				current=nora.signal_asset_complete();
			}

  		var item=_.find($scope.items,{id:current.asset.id});

			$scope.play(item);
		}

	}



  $scope.play = function(item) {


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

				// $scope.items[0].id	
				// $scope.items[0].title	
				// $scope.items[0].audio_file[0].url	

	      item.media = new LddPlayer(item.audio_file[0].url);
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
					if($rootScope.options.autoPlay){
						var next=nora.signal_asset_complete();
						if(next.asset){
				  		next=_.find($scope.items,{id:next.asset.id});
							$scope.play(next);
						}
					}

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



	$rootScope.$on('geo:position', function(event,location) {

		// assets_for_current_zone()
		// current_asset()
		// current_zone_id()
		// signal_asset_complete()
		// update_position(position)

		nora.update_position({coords:location})
		$scope.currentZone=nora.current_zone_id();


		nora.assets_for_current_zone().forEach(function(item,i) {
			// console.log('----------------------('+$scope.items.length+') id:'+item.id+' zone:'+$scope.currentZone)
			if(!_.find($scope.items,{id:item.id})&&item.audio_file){
				item.currentZone=$scope.currentZone;
				$scope.items.push(item);
			}

		});



	});



	//
	//  init plateform
	$ionicPlatform.ready(function(){
		$ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });

    geoService.init().finally(function () {
      $ionicLoading.hide();                      
    });		
	});

}

