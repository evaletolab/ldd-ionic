'use strict';



// inject deps
LddPlayer.$inject=['$window','$interval','$q','$log'];

// implement service
function LddPlayer($window, $interval, $q, $log) {

	//
	// Private functions
  function setTimer(player) {
      if (angular.isDefined(player.mediaTimer)) {
        return;
      }

      player.mediaTimer = $interval(function () {
          if (player.mediaDuration < 0) {
              player.mediaDuration = player.media.getDuration();
              if (player.$defer && player.mediaDuration > 0) {
                player.$defer.notify({duration: player.mediaDuration});
              }
          }

          player.media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > -1) {
                    player.mediaPosition = position;
                }
            },
            // error callback
            function (e) {
                console.log('Error getting pos=' + e);
            });

            player.$defer.notify({position: player.mediaPosition});

      }, 1000);
  }

  function clearTimer(player) {
      if (angular.isDefined(player.mediaTimer)) {
          $interval.cancel(player.mediaTimer);
          player.mediaTimer = undefined;
      }
  }


  //
  // Public API
  function LddPlayer(src) {
      var self=this;
      this.$defer=$q.defer();
      this.mediaPosition = -1;
     	this.mediaDuration = -1;
     	this.mediaTimer = undefined;

      this.media = new Media(src,
        function (success) {
            self.$defer.resolve(success);
        }, function (error) {
            self.$defer.reject(error);
        }, function (status) {
            self.media.mediaStatus = status;
            self.$defer.notify({status: self.media.mediaStatus});
        });
  }

  // iOS quirks :
  // -  myMedia.play({ numberOfLoops: 2 }) -> looping
  // -  myMedia.play({ playAudioWhenScreenIsLocked : false })
  LddPlayer.prototype.play = function (options) {

      if (typeof options !== 'object') {
          options = {};
      }

      this.media.play(options);

      setTimer(this);

      return this.$defer.promise;
  };

  LddPlayer.prototype.pause = function () {
      clearTimer(this);
      this.media.pause();
  };

  LddPlayer.prototype.stop  = function () {
      this.media.stop();
  };

  LddPlayer.prototype.release  = function () {
      this.media.release();
      this.media = undefined;
      this.mediaPosition = -1;
      this.mediaDuration = -1;
};

  LddPlayer.prototype.seekTo  = function (timing) {
      this.media.seekTo(timing);
  };

  LddPlayer.prototype.setVolume = function (volume) {
      this.media.setVolume(volume);
  };

  LddPlayer.prototype.startRecord = function () {
      this.media.startRecord();
  };

  LddPlayer.prototype.stopRecord  = function () {
      this.media.stopRecord();
  };

  LddPlayer.prototype.currentTime = function () {
      var q = $q.defer();
      this.media.getCurrentPosition(function (position){
      	q.resolve(position);
      });
      return q.promise;
  };

  LddPlayer.prototype.getDuration = function () {
    var q = $q.defer();
    this.media.getDuration(function (duration){
    	q.resolve(duration);
    });
    return q.promise;
  };


	return LddPlayer;
}

