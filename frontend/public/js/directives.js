'use strict';

/* Directives */
angular.module('roApp.directives', [])
    .directive('login', function ($http, $rootScope, SessionService) {
        return {
            restrict: 'A',
            templateUrl: 'partials/login.tpl.html',
            link: function (scope, elem, attrs) {
                elem.bind('submit', function () {
                    console.log('User: ' + scope.username);
                    console.log('Password: ' + scope.password);

                    var user_data = {
                        "username": scope.username,
                        "password": scope.password
                    };

                    $http.post("http://localhost:8001/api-token-auth/", user_data)
//                    $http.post("http://vast-journey-8108.herokuapp.com/", user_data)
                        .success(function (response) {
                            $http.defaults.headers.common['Authorization'] = 'Token ' + response.token;
                            SessionService.saveSession(response.user[0]);
                            $rootScope.$broadcast('event:login-confirmed');
//                            elem.slideUp();
                        });

                });
            }
        }
    })
    .directive('fileDropzone', function() {
            return {
              restrict: 'A',
              scope: {
                file: '=',
                fileName: '='
              },
              link: function(scope, element, attrs) {
                var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
                processDragOverOrEnter = function(event) {
                  if (event != null) {
                    event.preventDefault();
                  }
                  event.dataTransfer.effectAllowed = 'copy';
                  return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function(size) {
                  var _ref;
                  if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                    return true;
                  } else {
                    alert("File must be smaller than " + attrs.maxFileSize + " MB");
                    return false;
                  }
                };
                isTypeValid = function(type) {
                  if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                    return true;
                  } else {
                    alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                    return false;
                  }
                };
                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);
                return element.bind('drop', function(event) {
                  var file, name, reader, size, type;
                  if (event != null) {
                    event.preventDefault();
                  }
                  reader = new FileReader();
                  reader.onload = function(evt) {
                    if (checkSize(size) && isTypeValid(type)) {
                      return scope.$apply(function() {
                        scope.file = evt.target.result;
                        if (angular.isString(scope.fileName)) {
                          return scope.fileName = name;
                        }
                      });
                    }
                  };
                  file = event.dataTransfer.files[0];
                  name = file.name;
                  type = file.type;
                  size = file.size;
                  reader.readAsDataURL(file);
                  return false;
                });
              }
            };
          })
    .directive('loggedIn', ['$rootScope', 'SessionService', function ($rootScope, SessionService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                console.log('Checking if logged in...');
                var prevDisplay = element.css('display');
                var session = SessionService.getSession();
                $rootScope.$watch('session', function () {
                    console.log('session data has changed');
                    if (session == undefined || session == null) {
                        element.css('display', 'none');
                    } else {
                        element.css('display', prevDisplay);
                    }
                })
            }
        }
    }])
    .directive('loggedOut', ['$rootScope', 'SessionService', function ($rootScope, SessionService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var prevDisplay = element.css('display');
                var session = SessionService.getSession();
                $rootScope.$watch('session', function () {
                    if (session != undefined && session != null) {
                        element.css('display', 'none');
                    } else {
                        element.css('display', prevDisplay);
                    }
                })
            }
        }
    }])
    .directive('stripeForm', [ function (e) {
            return {
                restrict: 'A',
                templateUrl: 'partials/stripeForm.tpl.html',
                link: function(scope, elem, attrs) {
                    elem.bind('submit', function() {
                        var handler = StripeCheckout.configure({
                            key: 'pk_test_nlD3TNsfeNFUUw1Wav8t84nv',
                            image: '/Calendar-Icon-blue.png',
                            token: function (token, args) {
                                // Use the token to create the charge with a server-side script.
                            }
                        });

                        handler.open({
                            name: 'Demo Site',
                            description: '2 widgets ($20.00)',
                            amount: 250
                        });
                        e.preventDefault();
                    });
                }
            }
        }]);