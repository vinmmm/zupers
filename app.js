var app = angular.module('zuper', ['ngRoute']).factory('authService', ['AUTH_ENDPOINT','LOGOUT_ENDPOINT','$http','$cookieStore', function(AUTH_ENDPOINT,LOGOUT_ENDPOINT,$http,$cookieStore){
var auth={};
    auth.login=function(username,password){
        return $http.post(AUTH_ENDPOINT,{username:username,
password:password}).then(function(response,status){ auth.user=response.data;
            $cookieStore.put('user',auth.user);
            return auth.user;
        });
    }
    auth.logout=function(){  return $http.post(LOGOUT_ENDPOINT).then(function(response){
            auth.user=undefined;
            $cookieStore.remove('user');
}); }
    return auth;
}]);

app.config(function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  });
  

  $routeProvider.when('/userHome', {
    templateUrl: 'userHome.html',
    controller: 'UserCtrl'
});

  $routeProvider.otherwise({ redirectTo: '/' });
});
app.run(function(authentication, $rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function(evt) {
    if(!authentication.isAuthenticated){ 
      $location.url("/login");
    }
    event.preventDefault();
  });
})



app.controller('LoginCtrl', function($scope, $http, $location, authentication) {
  $scope.login = function() {
    if ($scope.username === 'admin' && $scope.password === 'pass') {
      console.log('successful')
      authentication.isAuthenticated = true;
      authentication.user = { name: $scope.username };
      $location.url("/");
    } else {
      $scope.loginError = "Invalid username/password combination";
      console.log('Login failed..');
    };
  };
});

app.controller('AppCtrl', function($scope, authentication) {
  $scope.templates =
  [
  	{ url: 'login.html' },
  	{ url: 'home.html' },
    {url: 'userHome.html' }
  ];


    $scope.template = $scope.templates[0];
  $scope.login = function (username, password) {
    if ( username === 'ryan' && password === 'pw') {
  		authentication.isAuthenticated = true;
  		$scope.template = $scope.templates[2];
  		$scope.user = username;
    } else {
  		$scope.loginError = "Invalid username/password combination";
    };
  };
  
});

app.controller('HomeCtrl', function($scope, authentication) {
  $scope.user = authentication.user.name;
  
});

app.factory('authentication', function() {
  return {
    isAuthenticated: false,
    user: null
  }
});