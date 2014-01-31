'use strict';


/* Controllers */

angular.module('roApp.controllers', [])
    .controller('BaseController', ['$scope', '$window', 'brand', 'SessionService', function ($scope, $window, brand, SessionService) {
        $scope.session = SessionService.getSession();
        $scope.brand = brand;

        $scope.doLogout = function () {
            SessionService.removeSession();
            $window.location = '/';
        };
        $scope.$on('event:login-confirmed', function () {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
    }])
    .controller('DragnDropCtrl', function($scope) {
            $scope.image = null
            $scope.imageFileName = ''
        })
    .controller('LoginController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();
        $scope.user = {};

        $scope.$on('event:login-confirmed', function () {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
    }])
    .controller('RegisterController', ['$scope', '$window', 'Restangular', 'SessionService', function($scope, $window, Restangular, SessionService) {
        $scope.user = {}

        $scope.username = null;
        $scope.password = null;
        $scope.first_name = null;
        $scope.last_name = null;
        $scope.email = null;

        $scope.doRegister = function() {
            $scope.user = {
                'email': $scope.email,
                'password': $scope.password,
                'username': $scope.username,
                'date_joined': new Date(),
                'first_name': $scope.first_name,
                'last_name': $scope.last_name
            };
            Restangular.all('users').customPOST($scope.user)
                .then(function(data) {
                    $window.location = 'index.html#/accountProfile';
                    console.log('Register Success: ' + response);
                }), function(response) {
                    console.log('Register error: ' + response);
                    $scope.errorMessage = response;
                };
        }

        $scope.hasError = function (field, validation) {
            if (validation) {
                return $scope.registerForm[field].$dirty && $scope.registerForm[field].$error[validation];
            }
            return $scope.registerForm[field].$dirty && $scope.registerForm[field].$invalid;
        };
    }])
    .controller('CreateLocationController', ['$scope', '$http', 'SessionService', 'Restangular', '$window', function($scope, $http, SessionService, Restangular, $window) {
        $scope.session = SessionService.getSession();

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
        $scope.image = null;
        $scope.imageFileName = '';
        $scope.location = Object();
        $scope.gps = null;
        $scope.street = "fake Street"; //null;
        $scope.city = "Denver"; //null;
        $scope.state = "Colorado"; //null;
        $scope.country = "USA"; //null;
        $scope.locationName = "Test Place"; //null;
        $scope.description = "Test Place"; //null;
        $scope.photos = null;
        $scope.comments = "none";
        $scope.sponsored = null;
        $scope.voteCount = 0;
        $scope.submitted = false;
        $scope.reliableGPS = false;

        $scope.uploadFile = function (files) {
            $scope.location.photos = files[0];
            console.log($scope.location.photos);
        };

        var pushToServer = function () {
            var fd = new FormData();
            fd.append("locationName", $scope.locationName);
            fd.append("description", $scope.description);
            fd.append("gps", $scope.gps);
            fd.append("street", $scope.street);
            fd.append("city", $scope.city);
            fd.append("state", $scope.state);
            fd.append("country", $scope.country);
            fd.append("photos", $scope.location.photos);
            fd.append("comments", $scope.comments);
            fd.append("sponsored", $scope.sponsored);
            fd.append("user", $scope.session.id);
            fd.append("voteCount", $scope.voteCount);

            $http.post('http://localhost:8001/location', fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (response) {
                    $window.location = 'index.html#/home';
                }).error(function (response) {
                    console.log('Response: ' + response);
                });
        };

        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.reliableGPS = true;

                // Grabs the GPS coordinates if it's not already there --------------------------------------------------------------------------------->
                if ($scope.gps == null){
                    $scope.reliableGPS = false; // determines if the coordinates were manually entered or approximated based on the city
                    var geocoder = new google.maps.Geocoder();
                    var locateMe = $scope.city + ", "+ $scope.state;

                    console.log("Im travelling to: "+locateMe);
                    var geocoderRequest = { address: locateMe };
                    geocoder.geocode(geocoderRequest, function (results, status) {
                        $scope.geoLocater = results;

                        var lng = $scope.geoLocater[0].geometry.location.e;
                        var lat = $scope.geoLocater[0].geometry.location.d;
                        var myLatlng= new google.maps.LatLng(lat, lng);
                        $scope.gps = myLatlng;

                        pushToServer();
    //                    var mapOptions = {
    //                        zoom: 6,
    //                        center: myLatlng
    //                    };
    //                    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //
    //                    var marker = new google.maps.Marker({
    //                        position: myLatlng,
    //                        map: map,
    //                        title: $scope.location.locationName
    //                    });
    //
    //                    if ($scope.location.gps==''){
    //                        $scope.gpsValue = "Appoximated: "+ (lat).toFixed(2) +" "+ (lng).toFixed(2);
    //                        console.log($scope.gpsValue);
    //                    }
    //                    else{
    //                        $scope.gpsValue = $scope.location.gps;
    //                    }
                    });
                }  // Ends Maps the Location --------------------------------------------------------------------------------->

                else{
                    pushToServer();
                }
            }


        }

    }])
    .controller('EditLocationController', ['$scope', '$http', 'SessionService', 'Restangular', '$window', '$routeParams', function($scope, $http, SessionService, Restangular, $window, $routeParams) {
        $scope.session = SessionService.getSession();

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
        $scope.oldLocationName = '';

        $scope.uploadFile = function (files) {
            $scope.location.photos = files[0];
        };

        // this bit is used on the EditLocation Page:
        $scope.update = function () {
            if ($scope.submitted == false) {
                var fd = new FormData();
                fd.append("locationName", $scope.location.locationName);
                fd.append("description", $scope.location.description);
                fd.append("gps", $scope.location.gps);
                fd.append("street", $scope.location.street);
                fd.append("city", $scope.location.city);
                fd.append("state", $scope.location.state);
                fd.append("country", $scope.location.country);
                if ($scope.location.photos.hasOwnProperty('type')) {
                    fd.append("photos", $scope.location.photos);
                }
                fd.append("comments", $scope.location.comments);
                fd.append("sponsored", $scope.location.sponsored);
                fd.append("user", $scope.location.user);
                fd.append("voteCount", $scope.location.voteCount);

                var locationUrl = 'http://localhost:8001/location-detail/' + $routeParams.id;
                $http.put(locationUrl, fd, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
                        $window.location = 'index.html#/locationDetails/' + $scope.location.id;
                    }).error(function (response) {
                        console.log('Response: ' + response);
                    });
            }
        };
        $scope.session = SessionService.getSession();
        //to display images from Home page
        Restangular.one('uploadedimages', $routeParams.id).customGET()
            .then(function (photo_url) {
                $scope.photo_url = photo_url[0];
        });

        Restangular.one('location-detail', $routeParams.id).customGET()
        .then(function (location) {
          $scope.location = location;
          $scope.oldLocationName = $scope.location.locationName;
        });

        $scope.commentText = null;
        $scope.submitted = false;

        // This saves a Comment
        $scope.save = function () {
            if ($scope.submitted == false) {

                var fd = {};
                fd["locationPostID"] = $routeParams.id;
                fd["commentText"] = $scope.commentText;
                fd["user"] = $scope.session.id;

                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/comment',
                    data: fd
                }).success(function (response) {
                        $scope.commentList[$scope.commentList.length] = response;
                        $scope.submitted = true;
                    }).error(function (response) {
                        console.log("there was an Error! Run!!" + response);
                    });
            }
        };
        $scope.countChoculaUp = function(location){
            if (location.voted==null){
                location.voteCount += 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                  console.log(data);
                })
            }
        };
        $scope.countChoculaDown = function(location){
            if (location.voted==null){
                location.voteCount -= 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                  console.log(data);
                })
            }
        };

        $scope.commentList = {};
        Restangular.all('comments-by-location').getList({'locationID':$routeParams.id})
            .then(function (data) {
                $scope.commentList = data;
                console.log("Success! you got data");
                console.log($scope.commentList);
            });

    }])
    .controller('HomeController', ['$scope', 'SessionService', 'Restangular', function ($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();

        $scope.user = {};

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
//        var s = $(".filterbox");
//        var pos = s.position();
//        $(window).scroll(function() {
//            var windowpos = $(window).scrollTop();
//            if (windowpos >= pos.top-40) {
//                s.addClass("stick");
//            } else {
//                s.removeClass("stick");
//            }
//        });
        // for the filters / sorting functionality
        $scope.predicate = '-voteCount';
        $scope.predicate = '-datecreated';

        // allows images to show up on the homepage
        $scope.imagefinder = function () {
            for (var i = 0; i < $scope.locationList.length; i++) {
                Restangular.one('uploadedimages', $scope.locationList[i].id).customGET()
                    .then(function (photo_url) {
                        for (var j = 0; j < $scope.locationList.length; j++) {
                            if ($scope.locationList[j].id == photo_url[1]) {
                                $scope.locationList[j].photo_url = photo_url[0];
                            }
                        }
                    });
            }
        };

        $scope.locationList = {};
        Restangular.all('location').getList()
            .then(function (data) {
                $scope.locationList = data;
                $scope.imagefinder();



            // Maps the Location --------------------------------------------------------------------------------->
            var geocoder = new google.maps.Geocoder();
////            var locateMe = $scope.location.city + ", "+ $scope.location.state;



            var geocoderRequest = { address: "MountainView, CA"  };
            geocoder.geocode(geocoderRequest, function (results, status) {
                $scope.geoLocater = results;
                //do your result related activities here, maybe push the coordinates to the backend for later use, etc.
                console.log($scope.geoLocater[0]);

                var lng = $scope.geoLocater[0].geometry.location.e;
                var lat = $scope.geoLocater[0].geometry.location.d;
                var myLatlng = new google.maps.LatLng(lat, lng);
                var mapOptions = {
                    zoom: 6,
                    center: myLatlng
                };
                var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: "Hello" //$scope.location.locationName
                });
            });
            // Ends Maps the Location --------------------------------------------------------------------------------->


//                var marker = new google.maps.Marker({
//                    position: myLatlng,
//                    map: map,
//                    title: $scope.locationList[4].locationName
//                });

//            // Maps the Location --------------------------------------------------------------------------------->
//                var geocoder = new google.maps.Geocoder();
//
//
//                var locationArray = []; //[chicago,anchorage,mexico,equator,london,johannesburg,kinshasa,sydney];
//                var locationNameArray = []; //['Chicago','Anchorage','Mexico City','The Equator','London','Johannesburg','Kinshasa','Sydney'];
//
//                for (var x = 0; x<10; x++){
//                    var locateMe = $scope.locationList[x].city + ", "+ $scope.locationList[x].state;
//                    console.log(locateMe);
//                    var geocoderRequest = { address: locateMe };
//                    geocoder.geocode(geocoderRequest, function (results, status) {
//                        $scope.geoLocater = results;
//                        //do your result related activities here, maybe push the coordinates to the backend for later use, etc.
//                       // console.log($scope.geoLocater[0]);
//
//                        var lng = $scope.geoLocater[0].geometry.location.e;
//                        var lat = $scope.geoLocater[0].geometry.location.d;
//                        var basicLatlng = new google.maps.LatLng(38.8254535,-97.6321155);
//                        locationArray.push(new google.maps.LatLng(lat, lng));
//                        locationNameArray.push($scope.locationList[x].name);
//
//                        var mapOptions = {
//                            zoom: 3,
//                            center: basicLatlng
//                        };
//                        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
//                        var marker = new google.maps.Marker({
//                            position: myLatlng,
//                            map: map,
//                            title: $scope.locationList[4].locationName
//                        });
//
//                        var coord;
//                        for (coord in locationArray) {
//                            new google.maps.Marker({
//                                position: locationArray[coord],
//                                map: map,
//                                title: locationNameArray[coord]
//                            });
//                        }
//                    });
////                    var kinshasa = new google.maps.LatLng(locateMe);
////                    var sydney = new google.maps.LatLng( -33.867139, 151.207114);
//
//                }
//                console.log(locationArray);
//                console.log(locationNameArray);
//
//
//
//
//            // Ends Maps the Location --------------------------------------------------------------------------------->

            });

        // Saves the Up Votes and down Votes back to the server
        var vote = false;

        $scope.countChoculaUp = function(location){
            if (location.voted==null){
                location.voteCount += 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                })
            }
        };
        $scope.countChoculaDown = function(location){
            if (location.voted==null){
                location.voteCount -= 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                })
            }
        };

        $scope.userList = {};
        Restangular.all('users').getList()
            .then(function (data) {
                $scope.userList = data;
            })
    }])
    .controller('AccountProfileController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();
        $scope.currentUserInfo = SessionService.getSession();

        $scope.myLocationList = [];
        if (SessionService.getUserLocations()){
            $scope.myLocationList=SessionService.getUserLocations();
        }

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();

            Restangular.all('location').getList()
            .then(function (data) {
                $scope.locationList = data;
                for (var i = 0; i < $scope.locationList.length; i++){
                    if ($scope.locationList[i].user==$scope.session.id){
                        $scope.myLocationList.push($scope.locationList[i]);
                        console.log($scope.myLocationList);
                    }
                }
                SessionService.saveUserLocations($scope.myLocationList);
            })
        });
    }])
    .controller('LocationDetailsController', ['$scope', '$http', 'SessionService', 'Restangular', '$routeParams', function ($scope, $http, SessionService, Restangular, $routeParams) {
        $scope.session = SessionService.getSession();
        //to display images from Home page
        Restangular.one('uploadedimages', $routeParams.id).customGET()
            .then(function (photo_url) {
                $scope.photo_url = photo_url[0];
        });

        $scope.gpsValue = "none";

        Restangular.one('location-detail', $routeParams.id).customGET()
        .then(function (location) {
            $scope.location = location;

            // Maps the Location --------------------------------------------------------------------------------->
            var geocoder = new google.maps.Geocoder();
            var locateMe = $scope.location.city + ", "+ $scope.location.state;

            console.log("hey"+locateMe);
            var geocoderRequest = { address: locateMe };
            geocoder.geocode(geocoderRequest, function (results, status) {
                $scope.geoLocater = results;
                //do your result related activities here, maybe push the coordinates to the backend for later use, etc.
                console.log($scope.geoLocater[0]);

                var lng = $scope.geoLocater[0].geometry.location.e;
                var lat = $scope.geoLocater[0].geometry.location.d;
                var myLatlng = new google.maps.LatLng(lat, lng);
                var mapOptions = {
                    zoom: 6,
                    center: myLatlng
                };
                var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: $scope.location.locationName
                });

                if ($scope.location.gps==''){
                    $scope.gpsValue = "Appoximated: "+ (lat).toFixed(2) +" "+ (lng).toFixed(2);
                    console.log($scope.gpsValue);
                }
                else{
                    $scope.gpsValue = $scope.location.gps;
                }
            });
            // Ends Maps the Location --------------------------------------------------------------------------------->
        });


//
//        SessionService.success(function(data) {
//            $scope.locationList = data;
//            $scope.location = $scope.locationList[$scope.id];
//            })
        $scope.commentText = null;
        $scope.submitted = false;

//        console.log('USER: ' + JSON.stringify($scope.session));

        $scope.save = function () {
            if ($scope.submitted == false) {

                var fd = {};
                fd["locationPostID"] = $routeParams.id;
                fd["commentText"] = $scope.commentText;
                fd["user"] = $scope.session.id;

                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/comment',
                    data: fd
                }).success(function (response) {
                        $scope.commentList[$scope.commentList.length] = response;
                        $scope.submitted = true;
                    }).error(function (response) {
                        console.log("there was an Error! Run!!" + response);
                    });
            }
        };
        //to save upvotes and downvotes to server
        var vote = false;


        $scope.countChoculaUp = function(location){
            if (location.voted==null){
                location.voteCount += 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                })
            }
        };
        $scope.countChoculaDown = function(location){
            if (location.voted==null){
                location.voteCount -= 1;
                location.voted = true;
                delete location.photos;
                Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                })
            }
        };

        $scope.commentList = {};
        Restangular.all('comments-by-location').getList({'locationID':$routeParams.id})
            .then(function (data) {
                $scope.commentList = data;
            });
    }]);


