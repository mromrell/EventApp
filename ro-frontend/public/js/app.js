'use strict';

var roApp = angular.module('roApp', [
        'ngRoute',
        'restangular',
        'roApp.services',
        'roApp.controllers',
        'roApp.constants',
        'roApp.filters',
        'roApp.directives'
    ])
    .config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'partials/home.tpl.html',
                controller: 'HomeController',
                title: 'Home Page'
            })
            .when('/accountProfile', {
                templateUrl: 'partials/accountProfile.html',
                controller: 'AccountProfileController',
                title: 'Account Profile'
            })
            .when('/createLocation', {
                templateUrl: 'partials/createLocation.html',
                controller: 'CreateLocationController',
                title: 'Create a Location'
            })
            .when('/locationDetails/:id', {
                templateUrl: 'partials/locationDetails.html',
                controller: 'LocationDetailsController',
                title: 'Location Details'
            })
            .when('/editLocation/:id', {
                templateUrl: 'partials/editLocation.html',
                controller: 'LocationDetailsController',
                title: 'Edit a Location'
            })
            .when('/login', {
                templateUrl: 'partials/login.tpl.html',
                controller: 'LoginController',
                title: 'Login'
            })
            .when('/register', {
                templateUrl: 'partials/register.html',
                controller: 'RegisterController',
                title: "Create an Account"
            })
            .otherwise({
                redirectTo: '/home'
            });


            RestangularProvider.setBaseUrl("http://localhost:8001/")

            }])

    .run(['$location', '$rootScope', 'baseTitle', '$http', '$cookies', 'SessionService', function ($location, $rootScope, baseTitle, $http, $cookies, SessionService) {
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            // Check to see if the 'title' attribute exists on the route
            if (current.hasOwnProperty('$route')) {
                $rootScope.title = baseTitle + current.$route.title;
            } else {
                $rootScope.title = baseTitle.substring(0, baseTitle.length - 3);
            }

        });
        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];

        if (SessionService.isLoggedIn()) {
            var token = SessionService.getSession();
            $http.defaults.headers.common['Authorization'] = 'Token ' + token;
        }
    }]);