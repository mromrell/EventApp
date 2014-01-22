'use strict';


/* Controllers */

angular.module('roApp.controllers', [])
    .controller('BaseController', ['$scope', '$window', 'brand', 'SessionService', function($scope, $window, brand, SessionService) {
        $scope.brand = brand;

        $scope.doLogout = function() {
            SessionService.removeSession();
            $window.location = '/';
        };
    }])
    .controller('DragnDropCtrl', function($scope) {
            $scope.image = null
//            $scope.image = {};
            $scope.imageFileName = ''
        })
    .controller('LoginController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();

        $scope.user = {};

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
    }])
    .controller('CreateLocationController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
//        $scope.session = SessionService.getSession();
//
//        $scope.user = {};

//        $scope.$on('event:login-confirmed', function() {
//            console.log('event has been broadcast to Home Controller');
//            $scope.session = SessionService.getSession();
//        });

    }])
    .controller('HomeController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();

        $scope.user = {};

//        $scope.$on('event:login-confirmed', function() {
//            console.log('event has been broadcast to Home Controller');
//            $scope.session = SessionService.getSession();
//        });

        $scope.locationList = {};
//        Restangular.all('location').get()
//            .then(function(data) {
//                $scope.locationList = data;
//                console.log("Success! you got data");
//                console.log($scope.locationList);
//            })
        Restangular.all('location').getList()
            .then(function(data) {
                $scope.locationList = data;
                console.log("Success! you got data");
                console.log($scope.locationList);
            })

    }])
    .controller('LocationDetailsController', ['$scope', 'SessionService', 'Restangular', '$routeParams', function($scope, SessionService, Restangular, $routeParams) {
        $scope.session = SessionService.getSession();
        $scope.user = {};

        $scope.id = $routeParams.id-1;

        Restangular.all('location').getList()
            .then(function(locationList) {
                $scope.location = locationList[$scope.id];
            })
//
//        SessionService.success(function(data) {
//            $scope.locationList = data;
//            $scope.location = $scope.locationList[$scope.id];
//            })
    }]);




//    // I PULLED IN THIS CONTROLLER From another projects, some for the pieces still need to be updated
//    .controller('LoginController', ['$scope', '$window', 'loginTitle', 'Restangular', 'SessionService', function($scope, $window, loginTitle, Restangular, SessionService) {
//        $scope.user = {}
//
//        $scope.register = function() {
//            $window.location = '/register';
//        }
//
//        $scope.doLogin = function() {
//            console.log('Logging in user: ' + $scope.user.email);
//            var user = {
//                'email': $scope.user.email,
//                'password': $scope.user.password
//            };
//
//            Restangular.all('account/login').customPOST(user)
//                .then(function(data) {
//                    if (data == 'Unauthorized') {
//                        $scope.errorMessage = 'Invalid username and/or password';
//                    } else {
//                        SessionService.saveUserSession(data);
//                        $scope.userSession = data;
//                        $window.location = '/home';
//                    }
//                }), function(response) {
//                    $scope.errorMessage = response;
//                };
//        }
//
//        $scope.hasError = function (field, validation) {
//            if (validation) {
//                return $scope.loginForm[field].$dirty && $scope.loginForm[field].$error[validation];
//            }
//            return $scope.loginForm[field].$dirty && $scope.loginForm[field].$invalid;
//        };
//
//        $scope.loginTitle = loginTitle;
//    }]);