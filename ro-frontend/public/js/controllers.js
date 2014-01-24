'use strict';


/* Controllers */

angular.module('roApp.controllers', [])
    .controller('BaseController', ['$scope', '$window', 'brand', 'SessionService', function ($scope, $window, brand, SessionService) {
        $scope.brand = brand;

        $scope.doLogout = function () {
            SessionService.removeSession();
            $window.location = '/';
        };
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

    .controller('CreateLocationController', ['$scope', '$http', 'SessionService', 'Restangular', '$window', function($scope, $http, SessionService, Restangular, $window) {
        $scope.session = SessionService.getSession();



        Restangular.one('getuserid',$scope.session).get()
        .then(function(data) {
            $scope.user = data;
        })

        $scope.$on('event:login-confirmed', function() {
            console.log('event has been broadcast to Home Controller');
            $scope.session = SessionService.getSession();
        });
        $scope.image = null;
        $scope.imageFileName = '';

        $scope.location = Object();
        $scope.address = null;
        $scope.locationName = null;
        $scope.description = null;
        $scope.photos = null;
        $scope.comments = "none";
        $scope.sponsored = null;
        //$scope.user = "JimmyGoop";
        $scope.upVoteCount = 0;
        $scope.downVoteCount = 0;
        $scope.submitted = false;

        $scope.uploadFile = function (files) {
            $scope.location.photos = files[0];
            console.log($scope.location.photos);
        }
        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.location.locationName = $scope.locationName;
                $scope.location.description = $scope.description;
//                $scope.location.city = $scope.city;
//                $scope.location.state = $scope.state;
//                $scope.location.country = $scope.country;
                $scope.location.address = $scope.address;
                //$scope.location.photos = $scope.photos;
                $scope.location.comments = $scope.comments;
                $scope.location.sponsored = $scope.sponsored;
                $scope.location.user = $scope.user;
                $scope.location.upVoteCount = $scope.upVoteCount;
                $scope.location.downVoteCount = $scope.downVoteCount;
//
//                var fd = {};
//                fd["locationName"] = $scope.location.locationName;
//                fd["description"] = $scope.location.description;
//                fd["address"] = $scope.location.address;
////                fd["photos"] = $scope.imageFileName;
//                fd["photos"] = $scope.location.photos;
//                fd["comments"] = $scope.location.comments;
//                fd["sponsored"] = $scope.location.sponsored;
//                fd["user"] = $scope.location.user;
//                fd["upVoteCount"] = $scope.location.upVoteCount;
//                fd["downVoteCount"] = $scope.location.downVoteCount;
//
                var fd = new FormData();
                fd.append("locationName", $scope.location.locationName);
                fd.append("description", $scope.location.description);
                fd.append("address", $scope.location.address);
                fd.append("photos", $scope.location.photos);
                fd.append("comments", $scope.location.comments);
                fd.append("sponsored", $scope.location.sponsored);
                fd.append("user", $scope.location.user);
                fd.append("upVoteCount", $scope.location.upVoteCount);
                fd.append("downVoteCount", $scope.location.downVoteCount);


//                $http({
//                    method: 'POST',
//                    url: 'http://localhost:8001/location',
//                    data: fd
//                }).success(function(response) {
//                        console.log("the form was Successfully Posted!")
//                        $window.location = 'index.html#/accountProfile';
//                }).error(function(response) {
//                    console.log("there was an Error! Run!!")
//                });
                console.log(JSON.stringify(fd));
                $http.post('http://localhost:8001/location', fd, {
                   // withCredentials: true,
                    headers: {'Content-Type': 'application/json' },
                    transformRequest: angular.identity
                }).success(function (response) {
                        $window.location = 'index.html#/home';
                    }).error(function (response) {
                        console.log('Response: ' + response);
                    });

                var fd = {};
                fd["locationName"] = $scope.location.locationName;
                fd["description"] = $scope.location.description;
                fd["address"] = $scope.location.address;
                fd["photos"] = 'http://www.placekitten.com/400/600';
//                fd["photos"] = $scope.location.photos;
                fd["comments"] = $scope.location.comments;
                fd["sponsored"] = $scope.location.sponsored;
                fd["user"] = $scope.location.user;
                fd["upVoteCount"] = $scope.location.upVoteCount;
                fd["downVoteCount"] = $scope.location.downVoteCount;

//                var fd = new FormData();
//                fd.append("locationName", $scope.location.locationName);
//                fd.append("description", $scope.location.description);
//                fd.append("address", $scope.location.address);
//                fd.append("photos", $scope.location.photos);
//                fd.append("comments", $scope.location.comments);
//                fd.append("sponsored", $scope.location.sponsored);
//                fd.append("user", $scope.location.user);
//                fd.append("upVoteCount", $scope.location.upVoteCount);
//                fd.append("downVoteCount", $scope.location.downVoteCount);


                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/location',
                    data: fd
                }).success(function(response) {
                        console.log("the form was Successfully Posted!")
                        $window.location = 'index.html#/accountProfile';
                }).error(function(response) {
                    console.log("there was an Error! Run!!")
                });
//                console.log(JSON.stringify(fd));
//                $http.post('http://localhost:8001/location', fd, {
//                   // withCredentials: true,
//                    headers: {'Content-Type': 'application/json' },
//                    transformRequest: angular.identity
//                }).success(function (response) {
//                        $window.location = 'index.html#/home';
//                    }).error(function (response) {
//                        console.log('Response: ' + response);
//                    });



            }
        }

    }])
    .controller('HomeController', ['$scope', 'SessionService', 'Restangular', function ($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();

        $scope.user = {};

//        $scope.$on('event:login-confirmed', function() {
//            console.log('event has been broadcast to Home Controller');
//            $scope.session = SessionService.getSession();
//        });
        var s = $(".filterbox");
        var pos = s.position();
        $(window).scroll(function() {
            var windowpos = $(window).scrollTop();
            if (windowpos >= pos.top-40) {
                s.addClass("stick");
            } else {
                s.removeClass("stick");
            }
        });
        $scope.locationList = {};
//        Restangular.all('location').get()
//            .then(function(data) {
//                $scope.locationList = data;
//                console.log("Success! you got data");
//                console.log($scope.locationList);
//            })
        Restangular.all('location').getList()
            .then(function (data) {
                $scope.locationList = data;
                console.log("Success! you got data");
                console.log($scope.locationList);
            })
        $scope.upVoteCounter = function(){
            $scope.upVoteCount += 1;
        }

    }])
    .controller('AccountProfileController', ['$scope', 'SessionService', 'Restangular', function($scope, SessionService, Restangular) {
        $scope.session = SessionService.getSession();
        $scope.currentUserInfo = SessionService.getUserSession();

        $scope.user = {};

//        $scope.$on('event:login-confirmed', function() {
//            console.log('event has been broadcast to Home Controller');
//            $scope.session = SessionService.getSession();
//        });

        $scope.userList = {};
        Restangular.all('users').getList()
            .then(function(data) {
                $scope.userList = data;
                console.log("Success! you got data");
                console.log($scope.userList);
            })

    }])

    .controller('addRecipeCtrl', function ($scope, $http, Recipe, $routeParams, Restangular, $window) {

        $scope.recipe = Object();
        $scope.recipeList = null;
        $scope.tag = null;
        $scope.name = null;
        $scope.submitted = false;

        Restangular.all('tags').getList().then(function (response) {
            $scope.tags = response;
        });


        Restangular.all('recipelists').getList().then(function (response) {
            $scope.recipeLists = response;
        });


        $scope.uploadFile = function (files) {
            $scope.recipe.photo = files[0];
            alert(files[0])
        }

        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.recipe.recipe_name = $scope.name;

//                alert($scope.photo);
                $scope.recipe.recipe_description = $scope.description;
                $scope.recipe.recipe_prep_time = $scope.prep;
                $scope.recipe.recipe_cook_time = $scope.cook;
                $scope.recipe.recipe_total_time = $scope.total;
                $scope.recipe.tag = $scope.tag;
                $scope.recipe.recipe_list = $scope.recipeList;
                $scope.recipe.user = 1;
//                Restangular.one('recipes').customPOST($scope.recipe).then(function (data) {
//                    $scope.submitted = true;
//                });

                var fd = new FormData();
                //Take the first selected file
                fd.append("recipe_name", $scope.recipe.recipe_name);
                fd.append("user", 1);
                fd.append("tag", $scope.recipe.tag);
                fd.append("recipe_lists", $scope.recipe.recipe_list);
                fd.append("photo", $scope.recipe.photo);
//                alert($scope.recipe.recipe_list);

                $http.post('http://localhost:8001/recipes', fd, {
//                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (response) {
//                        alert('Success response: ' + response);
                        $window.location = '/app/index.html';
//                        /recipes/:recipeID
                    }).error(function (response) {
//                        alert('Response: ' + response);
                    })


            }
        }

        $scope.addTag = function () {
            $scope.newTag = Object();
            $scope.newTag.tag_name = $scope.newTagName;


            Restangular.one('tags').customPOST($scope.newTag).then(function (response) {
                $scope.tags.push(response);
            })
        };


        $scope.addList = function () {
            $scope.newList = Object();
            $scope.newList.recipe_list_name = $scope.newListName;


            Restangular.one('recipelists').customPOST($scope.newList).then(function (response) {
                $scope.recipeLists.push(response);
            })
        }
    })

    .controller('LocationDetailsController', ['$scope', '$http', 'SessionService', 'Restangular', '$routeParams', function ($scope, $http, SessionService, Restangular, $routeParams) {
        $scope.session = SessionService.getSession();
        $scope.user = {};

        $scope.id = $routeParams.id - 1;

        Restangular.all('location').getList()
            .then(function (locationList) {
                $scope.location = locationList[$scope.id];
            });
//
//        SessionService.success(function(data) {
//            $scope.locationList = data;
//            $scope.location = $scope.locationList[$scope.id];
//            })
        $scope.comment = Object();
        $scope.locationPostID = null;
        $scope.commentText = null;
        $scope.commentDate = null;
        $scope.locationRating = null;
        $scope.user = "Jimmy Goop";

        $scope.save = function () {
            if ($scope.submitted == false) {
                $scope.comment.locationPostID = $scope.locationPostID;
                $scope.comment.commentText = $scope.commentText;
                $scope.comment.locationRating = $scope.locationRating;
                $scope.comment.user = $scope.user;

                var fd = {};
                fd["locationPostID"] = $scope.comment.locationPostID;
                fd["commentText"] = $scope.comment.commentText;
                fd["locationRating"] = $scope.comment.locationRating;
                fd["user"] = $scope.comment.user;

                $http({
                    method: 'POST',
                    url: 'http://localhost:8001/comment',
                    data: fd
                }).success(function (response) {
                        console.log("the form was Successfully Posted!")
                    }).error(function (response) {
                        console.log("there was an Error! Run!!")
                    });
            }
        }
        $scope.commentList = {};
//        Restangular.all('comment').get()
//            .then(function(data) {
//                $scope.commentList = data;
//                console.log("Success! you got data");
//                console.log($scope.locationList);
//            })
        Restangular.all('comment').getList()
            .then(function (data) {
                $scope.commentList = data;
                console.log("Success! you got data");
                console.log($scope.commentList);
            })
    }]);


