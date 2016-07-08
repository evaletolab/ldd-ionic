'use strict';



// inject deps
LddPlayer.$inject=['$window','$interval','$q','$log'];

// implement service
function LddPlayer($window, $interval, $q, $log) {

	//
	// private functions
  function setTimer(media) {
      if (angular.isDefined(media.mediaTimer)) {
        return;
      }

      media.mediaTimer = $interval(function () {
          if (media.mediaDuration < 0) {
              media.mediaDuration = media.getDuration();
              if (media.$defer && media.mediaDuration > 0) {
                media.$defer.notify({duration: media.mediaDuration});
              }
          }

          media.getCurrentPosition(
            // success callback
            function (position) {
                if (position > -1) {
                    media.mediaPosition = position;
                }
            },
            // error callback
            function (e) {
                console.log('Error getting pos=' + e);
            });

          if (media.$defer) {
            media.$defer.notify({position: media.mediaPosition});
          }

      }, 1000);
  }

  function clearTimer(media) {
      if (angular.isDefined(media.mediaTimer)) {
          $interval.cancel(media.mediaTimer);
          media.mediaTimer = undefined;
      }
  }

  function resetValues(media) {
      media.mediaPosition = -1;
      media.mediaDuration = -1;
  }

  //
  // constructor
  function LddPlayer(src) {
      var self=this;
      this.media = new Media(src,
        function (success) {
            self.media.$defer.resolve(success);
        }, function (error) {
            self.media.$defer.reject(error);
        }, function (status) {
            self.media.mediaStatus = status;
            self.media.$defer.notify({status: self.media.mediaStatus});
        });
      clearTimer(this.media);
      resetValues(this.media);
      this.media.$defer=$q.defer();
  }

  // iOS quirks :
  // -  myMedia.play({ numberOfLoops: 2 }) -> looping
  // -  myMedia.play({ playAudioWhenScreenIsLocked : false })
  LddPlayer.prototype.play = function (options) {

      if (typeof options !== 'object') {
          options = {};
      }

      this.media.play(options);

      setTimer(this.media);

      return this.media.$defer.promise;
  };

  LddPlayer.prototype.pause = function () {
      clearTimer(this.media);
      this.media.pause();
  };

  LddPlayer.prototype.stop  = function () {
      this.media.stop();
  };

  LddPlayer.prototype.release  = function () {
      this.media.release();
      this.media = undefined;
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

