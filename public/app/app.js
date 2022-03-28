angular.module('app', ['ngSanitize'])
.constant("moment", moment)
.controller('MainCtrl', function($interval, moment, $window, $scope) {
  var vm = this;

  vm.timers = [];
  vm.startTime = null;
  vm.displayTime = 0;
  vm.myInterval = null;
  vm.watchState = null
  vm.playState = false;

  vm.onInterval = function(){
    if(vm.playState) {
      vm.displayTime = moment.utc(moment(new Date()).diff(new Date(vm.startTime))).valueOf();
      $window.localStorage.setItem("displayTime", vm.displayTime);
    }
  }

  vm.watchLocalStorageEvents = function() {
    $window.addEventListener('storage', function (e) {
      switch (e.key) {
        case "playState":
          if (e.newValue !== e.oldValue) {
            $scope.$apply(function() {
              vm.playState = $window.localStorage.getItem("playState") && $window.localStorage.getItem("playState") === "true" ? true : false;
            });
          }
          break;
        case "timers":
          if (e.newValue !== e.oldValue) {
            $scope.$apply(function() {
              vm.timers = $window.localStorage.getItem("timers") ? JSON.parse($window.localStorage.getItem("timers")) : [];
            });
          }
          break;
        case "displayTime":
          if (e.newValue !== e.oldValue) {
            $scope.$apply(function() {
              vm.displayTime = Number(e.newValue);
            });
          }
          break;
        case "startTime":
          if (e.newValue !== e.oldValue) {
            $scope.$apply(function() {
              vm.startTime = Number(e.newValue);
            });
          }
          break;
        default:
          break;
      }
    },false);
  }

  vm.$onInit = function() {
    vm.timers = $window.localStorage.getItem("timers") ? JSON.parse($window.localStorage.getItem("timers")) : [];
    vm.playState = $window.localStorage.getItem("playState") && $window.localStorage.getItem("playState") === "true" ? true : false;
    vm.displayTime = $window.localStorage.getItem("displayTime") ? Number($window.localStorage.getItem("displayTime")) : 0;
    vm.startTime = Number($window.localStorage.getItem("startTime"));
    if (vm.playState) {
      vm.myInterval = $interval(vm.onInterval, 10);
    }
    vm.watchLocalStorageEvents();
  };

  vm.startTimer = function() {
    vm.playState = !vm.playState;
    $window.localStorage.setItem("playState", vm.playState);
    vm.startTime = $window.localStorage.getItem("displayTime") ? Number(moment(new Date()).diff(vm.displayTime, "milliseconds")) : moment(new Date()).valueOf();
    $window.localStorage.setItem("startTime", vm.startTime);
    if(!vm.myInterval) {
      vm.myInterval = $interval(vm.onInterval, 10);
    }
  };

  vm.stopTimer = function() {
    vm.playState = !vm.playState;
    $window.localStorage.setItem("playState", vm.playState);
  }

  vm.captureLap = function() {
    vm.timers.unshift(vm.displayTime);
    $window.localStorage.setItem("timers", JSON.stringify(vm.timers));
  }

  vm.resetApp = () => {
    vm.timers = [];
    vm.startTime = null;
    vm.displayTime = 0;
    vm.playState = false;
    $interval.cancel(vm.myInterval);
    vm.myInterval = null
    $window.localStorage.setItem("playState", vm.playState);
    $window.localStorage.setItem("startTime", vm.startTime);
    $window.localStorage.setItem("timers", JSON.stringify(vm.timers));
    $window.localStorage.setItem("displayTime", vm.displayTime);

  }

  vm.removeTimer = function(index) {
    vm.timers.splice(index, 1);
    $window.localStorage.setItem("timers", JSON.stringify(vm.timers));
  }

}).filter('ledFormat', function () {
  return function (time, delimiterState) {
    let formatedTime = moment.utc(Number(time)).format("HH:mm:ss.SS").toString();
    let milliSeconds = Number(formatedTime.split(".")[1]);
    return `<div class="flex hours" ng-style="{'background-color':'green'}">
              <div class="number">
                <span>${formatedTime.toString().substring(3, 4)}</span>
                <span>${formatedTime.toString().substring(4, 5)}</span>
              </div>
            </div>
            ${(milliSeconds > 50)? `<div class="colon" >:</div>` : `<div class="colon blink" >:</div>`}
            <div class="flex hours">
              <div class="number">
                <span>${formatedTime.toString().substring(6, 7)}</span>
                <span>${formatedTime.toString().substring(7, 8)}</span>
              </div>
            </div>
            ${(milliSeconds > 50)? `<div class="dot">.</div>` : `<div class="dot blink">.</div>`}
            <div class="flex hours">
              <div class="number">
                <span>${formatedTime.toString().substring(9, 10)}</span>
                <span>${formatedTime.toString().substring(10, 11)}</span>
              </div>
            </div>`;
  }
});
