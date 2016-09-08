angular.module('lawGame', ['ui.router'])

.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
        
        $stateProvider
        
            .state('login', {
                url:'/login',
                templateUrl: 'views/login.html',
                controller: 'loginController'
            })
        
            .state('selector', {
                url:'/selector',
                templateUrl: 'views/selector.html',
                resolve:{
                    resolvedScenes:  ['sceneService',
                        function(sceneService){
                            return allSceneService.all();
                }]},
                controller: 'selectorController'
            
            })
                        
             .state('game', {
                url:'/game/:sceneid',
                templateUrl: 'views/game.html',
                controller: 'gameController',
                resolve: {
                    sceneinfo: ['$stateParams', function($stateParams){
                        return $stateParams.id;                 
                    }]
                }
            })
        
            .state('editor', {
                url:'/editor',
                templateUrl: 'views/editor.html',
                controller: 'editorController'
            })
        
            .state('stats', {
                url:'/stats',
                templateUrl: 'views/statistics.html',
                controller: 'statsController'
            });
    }])

/////////////////SERVICES///////////////////////////

.factory('loginService', ['$http', function($http) {
    //login service code to go here
}])

.service('sceneService', ['$http', function($http) {
    
    var baseUrl = 'http://localhost:8080'
    
    this.saveNew = function(newScene) {
        var url = baseUrl+'/scenes'
        return $http.post(url, {"newScene": newScene});
    }
    
    this.getAll = function() {
        var url = baseUrl+'/scenes';
        return $http.get(url);
    }
    
    this.editOne = function(id, newScene) {
        var url = baseUrl+'/scenes/'+id;
        return $http.put(url, {"story": newScene});
    }
    
    this.deleteOne = function(id){
        var url = baseUrl+'/scenes/'+id;
        return $http.delete(url);
    }
    
    this.findOne = function(id){
        var url = baseUrl+'/scenes/'+id;
        return $http.get(url);
    }
}])

.factory('allSceneService', ['$http', 'utilityService', function($http) {
        console.log('The scene http service is working');
        var path = 'https://api.myjson.com/bins/1jzpr';
        var scenes = $http.get(path)
            .then(function (resp) {
              console.log(scenes); //this returns a promise, cf. in the selectorController
              return resp.data;
            });
               
        var factory = {};
        factory.all = function () {
            return scenes;
        };
    return factory;
}])
    
.factory('singleSceneService', ['$http', 'utilityService', function($http) {
        console.log('The scene http service is working');
        var path = 'https://api.myjson.com/bins/ud7s';
        var scenes = $http.get(path)
            .then(function (resp) {
              console.log(scenes); //this returns a promise, cf. in the selectorController
              return resp.data;
            });
               
        var factory = {};
        factory.all = function () {
            return scenes;
        };
    return factory;
}])

//////////////////CONTROLLERS//////////////////////

.controller('loginController', function($scope) {

	$scope.tagline = 'This is the login page';
    $scope.login = function(){
        console.log('Yay you logged in!!')
    };
})
//
.controller('selectorController', ['$scope', 'resolvedScenes',
                        function(   $scope,   resolvedScenes) {
    console.log('selectorController running')
	$scope.tagline = 'This is the selector page and this sentence is coming from the controller';	
    $scope.resolvedScenes = resolvedScenes;
    console.log("The selector controller is returning:" + resolvedScenes);
}])

.controller('gameController', ['$scope', 'sceneinfo', '$stateParams',
                    function(   $scope,   sceneinfo,   $stateParams) {
// USE DEPENDENCY INJECTION TO INJECT THE SCENEINFO
    $scope.isQuestion = true;
    $stateParams.id;
}])

.controller('editorController', ['$scope', 'sceneService',
                        function( $scope,   sceneService) {
    
    console.log("We have entered the editor controller")
    $scope.tagline = 'This is the editor page, from the controller';
    $scope.newScene = {};
                            
    $scope.saveScene = function(){
        sceneService.saveNew($scope.newScene);
        console.log($scope.newScene);
    }
                            
}])

.controller('statsController', function($scope) {

	$scope.tagline = 'This is the statistics page';

})

/////////////////DIRECTIVES//////////////////////

.directive('playStory', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/playStory.html',
    link: function(scope, element, attrs) {
      scope.buttonText = "Play"
    },
  };
})

.directive('storyInfo', function() {
    return {
        restrict: 'E',
        scope: {
            sceneInfo: '=info'
        },
//        templateUrl: 'js/directives/story-info.hmtl'
        template: '<p> This is storyInfo</p><img class="icon" ng-src="{{sceneInfo.thumbnail}}"><h2 class="title">Title:{{sceneInfo.title}}</h2>'
    };
});