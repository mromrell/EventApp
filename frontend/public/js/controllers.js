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
    .controller('StripeController', ['$scope', '$location','SessionService', '$routeParams', 'Restangular', function($scope, $location, SessionService, $routeParams, Restangular) {
        $scope.session = SessionService.getSession();
        // This identifies your website in the createToken call below
        Stripe.setPublishableKey('pk_test_nlD3TNsfeNFUUw1Wav8t84nv');

        $scope.showSponsorField = true;
        if ($scope.payment_type = 'Sponsor'){
           $scope.showSponsorField = true;
        }
        if ($scope.payment_type = 'Registration'){
           $scope.showSponsorField = false;
        }

        var stripeResponseHandler = function (status, response) {
            var $form = $('#payment-form');

            if (response.error) {
                // Show the errors on the form
                $form.find('.payment-errors').text(response.error.message);
                $form.find('button').prop('disabled', false);
            } else {

//                // token contains id, last4, and card type
//                var token = response.id;
//                // Insert the token into the form so it gets submitted to the server
//                $form.append($('<input type="hidden" name="stripeToken" />').val(token));
//                // and re-submit
//                $form.get(0).submit();
//
//                var port = ($location.$$port) ? ':' + $location.$$port : '';
//                window.location.href = $location.$$protocol + '://' + $location.$$host + port + '/public/index.html';
//            }

                $scope.sponsor_amount = null;

                if ($scope.payment_type == 'Sponsor'){
                    $scope.payment_amount = null;
                    $scope.sponsor_amount = $scope.enteredSponsorAmount; ///edit this
                }
                else if ($scope.payment_type == 'Registration'){
                    $scope.payment_amount = $scope.location.participantCost;
                    $scope.sponsor_amount = null;
                }

                var d = new Date();
                 var newPayment = {
                    'payment_amount': $scope.payment_amount,
                    'sponsor_amount': $scope.sponsor_amount,
                    'payment_type': $scope.payment_type,
                    'user_id': $scope.session.id,
                    'event_id': $routeParams.id,
                    'datePaid': d.getFullYear() +'-'+ d.getMonth() +'-'+ d.getDate()
                 };

                Restangular.one('payment').customPOST(newPayment)
                    .then(function (data) {
                        console.log("I'm inside the restangular call");
                        // token contains id, last4, and card type
                        var token = response.id;
                        // Insert the token into the form so it gets submitted to the server
                        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
                        // and re-submit
                        $form.get(0).submit();

                        var port = ($location.$$port) ? ':' + $location.$$port : '';
                        window.location.href = $location.$$protocol + '://' + $location.$$host + port + '/public/index.html';

                    }, function (response) {
                        console.log('Response: ' + response);
                    });

                }


        };

        jQuery(function ($) {
            $('#payment-form').submit(function (e) {
                var $form = $(this);

                // Disable the submit button to prevent repeated clicks
                $form.find('button').prop('disabled', true);

                Stripe.createToken($form, stripeResponseHandler);

                // Prevent the form from submitting with the default action
                return false;
            });
        });
    }])
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
    .controller('CreateEventController', ['$scope', 'SessionService', 'Restangular', '$window', function ($scope, SessionService, Restangular, $window) {
        $scope.new_event = {};
        $scope.session = SessionService.getSession();

        $scope.$on('event:login-confirmed', function () {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();

        });

        $scope.uploadFile = function (files) {
            $scope.new_event.photos = files[0];

        };

        $scope.save = function () {

            var newEvent = {
                'user': $scope.session.id,
                'eventName': $scope.new_event.eventName,
                'description': $scope.new_event.description,
                'gpsLng': $scope.new_event.gpsLng,
                'gpsLat': $scope.new_event.gpsLat,
                'reliableGPS': $scope.new_event.reliableGPS,
                'street': $scope.new_event.street,
                'city': $scope.new_event.city,
                'state': $scope.new_event.state,
                'country': $scope.new_event.country,
                'comments': $scope.new_event.comments,
                'sponsored': $scope.new_event.sponsored,
                'forCharity': $scope.new_event.forCharity,
                'totalCost': $scope.new_event.totalCost,
                'participantCost': $scope.new_event.participantCost,
                'linkUrl': $scope.new_event.linkUrl,
                'eventStartDate': $scope.new_event.eventStartDate,
                'eventEndDate': $scope.new_event.eventEndDate,
                'photos': $scope.new_event.photos
            };

            // Grabs the GPS coordinates if it's not already there --------------------------------------------------------------------------------->
            if ($scope.new_event.gpsLat == null || $scope.new_event.gpsLng == null) {
                $scope.new_event.reliableGPS = false; // determines if the coordinates were manually entered or approximated based on the city
                var geocoder = new google.maps.Geocoder();
                var locateMe = $scope.new_event.city + ", " + $scope.new_event.state;

                var geocoderRequest = { address: locateMe };
                geocoder.geocode(geocoderRequest, function (results, status) {
                    $scope.geoLocater = results;
                    $scope.new_event.gpsLng = $scope.geoLocater[0].geometry.location.e;
                    $scope.new_event.gpsLat = $scope.geoLocater[0].geometry.location.d;
                });

            }  // Ends Maps the Location --------------------------------------------------------------------------------->
            Restangular.one('location').customPOST(newEvent)
                .then(function (data) {
                    console.log("I'm inside the restangular call");
                    $window.location = 'index.html#/';
                }, function (response) {
                    console.log('Response: ' + response);
                });
        }
    }])
    .controller('EditLocationController', ['$scope', '$http', 'SessionService', 'Restangular', '$window', '$routeParams', function($scope, $http, SessionService, Restangular, $window, $routeParams) {
        $scope.session = SessionService.getSession();
        console.log($scope.session);

        $scope.$on('event:login-confirmed', function() {
            $scope.session = SessionService.getSession();
        });
        $scope.oldLocationName = '';

        $scope.uploadFile = function (files) {
            $scope.location.photos = files[0];
        };

        var pushToServer = function () {
            var fd = new FormData();
            fd.append("eventName", $scope.location.eventName);
            fd.append("description", $scope.location.description);
            fd.append("gpsLat", $scope.location.gpsLat);
            fd.append("gpsLng", $scope.location.gpsLng);
            fd.append("reliableGPS", $scope.location.reliableGPS);
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
//            var locationUrl = 'http://vast-journey-8108.herokuapp.com/location-detail/' + $routeParams.id;
            $http.put(locationUrl, fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (response) {
                    $window.location = 'index.html#/locationDetails/' + $scope.location.id;
                }).error(function (response) {
                    console.log('Response: ' + response);
                });
        };

        $scope.update = function () {
            if ($scope.submitted == false) {
                $scope.location.reliableGPS = true;

                // Grabs the GPS coordinates if it's not already there --------------------------------------------------------------------------------->
                if ($scope.location.gpsLat == '' || $scope.location.gpsLng == '' || $scope.location.gpsLat == null || $scope.location.gpsLng == null){
                    $scope.location.reliableGPS = false; // determines if the coordinates were manually entered or approximated based on the city
                    var geocoder = new google.maps.Geocoder();
                    var locateMe = $scope.location.city + ", "+ $scope.location.state + ", " + $scope.location.country;

                    console.log("Im travelling to: "+locateMe);
                    var geocoderRequest = { address: locateMe };
                    geocoder.geocode(geocoderRequest, function (results, status) {
                        $scope.geoLocater = results;

                        $scope.location.gpsLng = $scope.geoLocater[0].geometry.location.e;
                        $scope.location.gpsLat = $scope.geoLocater[0].geometry.location.d;
//                        var myLatlng= new google.maps.LatLng(lat, lng);

                        pushToServer();
                    });
                }  // Ends Maps the Location --------------------------------------------------------------------------------->
                else{
                    pushToServer();
                }
            }
        }


        $scope.session = SessionService.getSession();
        //to display images from Home page
        Restangular.one('uploadedimages', $routeParams.id).customGET()
            .then(function (photo_url) {
                $scope.photo_url = photo_url[0];
        });

        Restangular.one('location-detail', $routeParams.id).customGET()
        .then(function (location) {
          $scope.location = location;
          $scope.oldLocationName = $scope.location.eventName;
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
//                    url: 'http://vast-journey-8108.herokuapp.com/comment',
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
    .controller('HomeController', ['$scope', 'mapService', 'SessionService', 'Restangular', '$window', '$routeParams', function ($scope, mapService, SessionService, Restangular, $window, $routeParams) {
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
                if ($routeParams.hasOwnProperty('starred')) {
                   $scope.locationList = [];
                    for (var i =0; i<data.length; i++){
                       if(data[i].starLocation){
                           $scope.locationList.push(data[i]);
                       }
                   }
                }
                else {
                    $scope.locationList = data;
                }
                $scope.imagefinder();
                mapService.main($scope.locationList);
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

        $scope.starLocation = function(location){
            location.starLocation = !location.starLocation;
            delete location.photos;
            Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                    $scope.location.starLocation = data.starLocation;
                })
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
        $scope.myPaymentList = [];

        if (SessionService.getUserLocations()){
            $scope.myLocationList=SessionService.getUserLocations();
        }

        //fd.append("eventName", $scope.location.eventName);
        Restangular.all('payment').getList()
            .then(function (data) {
                $scope.paymentList = data;
                for (var i = 0; i < $scope.paymentList.length; i++){
                    if ($scope.paymentList[i].user_id==$scope.session.id){
                        var eventIdNum = $scope.paymentList[i].event_id - 1;
                        var event={
                            'eventId': $scope.paymentList[i].event_id,
                            'eventName':$scope.myLocationList[eventIdNum].eventName,
                            'description':$scope.myLocationList[eventIdNum].description,
                            'eventStartDate':$scope.myLocationList[eventIdNum].eventStartDate,
                            'totalCost':$scope.myLocationList[eventIdNum].totalCost,
                            'payment_amount':$scope.paymentList[i].payment_amount
                        };
                        $scope.myPaymentList.push(event);
                    }
                }

                console.log($scope.paymentList);
                console.log($scope.myPaymentList);
            });

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();



            Restangular.all('location').getList()
            .then(function (data) {
                $scope.locationList = data;
//
//                if ($scope.session.is_superuser == true || $scope.location.user == $scope.session.id){
//                    $scope.showEdit = "Approved";
//                    }
//                    else{
//                    $scope.showEdit = null;
//                    }
//                if ($scope.location.reliableGPS == false){
//                    $scope.gpsStatus = "These coordinates have been approximated to the city center";
//                    }
//                    else{
//                        $scope.gpsStatus = "These coordinates have been manually entered and should be exact";
//                    }
//
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
        $scope.paymentForm = 'partials/paymentForm.html';

        Restangular.one('uploadedimages', $routeParams.id).customGET()
            .then(function (photo_url) {
                $scope.photo_url = photo_url[0];
        });

        Restangular.one('location-detail', $routeParams.id).customGET()
        .then(function (location) {
            $scope.location = location;

            // this Shows the Edit Event button if you are a logged in as a super user or you are the user that created the event
            /*if ($scope.session.is_superuser == true || $scope.location.user == $scope.session.id){
                $scope.showEdit = "Approved";
                }
                else{
                $scope.showEdit = null;
                }*/
            // This Shows a warning if the GPS coordinantes were not manually entered at the time of the event creation
            if ($scope.location.reliableGPS == false){
                $scope.gpsStatus = "These coordinates have been approximated to the city center";
                }
                else{
                    $scope.gpsStatus = "These coordinates have been manually entered and should be exact";
                }

            // Maps the Location --------------------------------------------------------------------------------->
            var myLatlng = new google.maps.LatLng($scope.location.gpsLat, $scope.location.gpsLng);
            var mapOptions = {
                zoom: 6,
                center: myLatlng
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: $scope.location.eventName
            });
            // Ends Maps the Location --------------------------------------------------------------------------------->

            eventPopulator();

        });

        $scope.uiConfig = {
          calendar:{
            height: 250,
            editable: true,
            header:{
              left: false,
              center: false, //'title',
              right: false
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
          }
        };

        $scope.eventSources = [];

        function eventPopulator(){
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $scope.events = [
              {title: $scope.location.eventName, start: $scope.location.eventStartDate, end: $scope.location.eventEndDate}
//              {title: 'All Day Event',start: new Date(y, m, 1)},
//              {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
//              {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
//              {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
//              {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
//              {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
            ];
            $scope.eventSources.push($scope.events);
        }

        console.log($scope.eventSources);

        $scope.commentText = null;
        $scope.submitted = false;

        $scope.save = function () {
            if ($scope.submitted == false) {

                var fd = {};
                fd["locationPostID"] = $routeParams.id;
                fd["commentText"] = $scope.commentText;
                fd["user"] = $scope.session.id;

                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/comment',
//                    url: 'http://vast-journey-8108.herokuapp.com/comment',
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
        $scope.starLocation = function(location){
            location.starLocation = !location.starLocation;
            delete location.photos;
            Restangular.one('location-detail', location.id).customPUT(location)
                .then(function (data) {
                    $scope.location.starLocation = data.starLocation;
                })
        };
        $scope.commentList = {};
        Restangular.all('comments-by-location').getList({'locationID':$routeParams.id})
            .then(function (data) {
                $scope.commentList = data;
            });
    }]);


