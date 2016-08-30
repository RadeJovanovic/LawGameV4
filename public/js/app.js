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
                            return sceneService.all();
                }]},
                controller: 'selectorController'
            
            })
                        
             .state('game', {
                url:'/game/:sceneid',
                abstract: 'true',
                templateUrl: 'views/game.html',
                controller: 'gameController',
                resolve: {
                    sceneinfo: ['$stateParams', function($stateParams){
                        return $stateParams.id;                 
                    }]
                }
            
            })
        
            .state('game.media', {
                url:'/media',
                template: '',
                controller: 'gameController',
            })
        
            .state('game.question', {
                url:'/question',
                template: 'views/game.qh.html'
            
            })
        
            .state('game.hint', {
                url:'/hint',
                template: 'views/game.qh.html'
            
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

.factory('utilityService', function () {
  return {
    // Util for finding an object by its 'id' property among an array
    findById: function findById(a, id) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return a[i];
      }
      return null;
    },

    };
})

.factory('sceneService', ['$http', 'utilityService', function($http) {
        console.log('The scene http service is working');
        var path = 'https://api.myjson.com/bins/1jzpr';
        var scenes = $http.get(path)
            .then(function (resp) {
              console.log(scenes); //this returns a promise, cf. in the selectorController
              return resp.data;
            });
    //LOOK AT HOW THIS BIT IS IMPLEMENTED
//     $scope.contents = null;
//    $http.get('mainContent.json')
//        .success(function(data) {
//            $scope.contents=data;
//        })
//        .error(function(data,status,error,config){
//            $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
//        });
               
        var factory = {};
        factory.all = function () {
            return scenes;
        };
    
        factory.one = function (id) {
            return scenes
                .then(function(){ //you can daisy-chain functionality using the dot notation
                    return utilityService.findById(scenes, id);
            })
          };
          return factory;
}])


.service('sceneUpdate', function($http) {

    var baseUrl = "http://localhost:8080/"

    this.saveScene = function(newScene) {
        var url = baseUrl + "saveCurrent"
        return $http.post(url, {
            "scene": newScene
        })
    }

    this.getSaved = function() {
        var url = baseUrl + "getSaved"
        return $http.get(url)
    }
})

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

.controller('gameController', '$sceneinfo', function($scope,sceneinfo) {
// USE DEPENDENCY INJECTION TO INJECT THE SCENEINFO
    $scope.isQuestion = true;
    $tateParams.id
})

.controller('editorController', ['$scope',
                        function( $scope) {
    
    console.log("We have entered the editor controller")
    $scope.tagline = 'This is the editor page, from the controller';
    $scope.newScene = {};
                            
    $scope.saveScene = function(){
        
    }
                            
    $scope.saveThisScene = function() { 
        sceneService.saveScene($scope.newScene) //need to pass only the details of the new scene
            .then(saveSuccess, error);
        $scope.newScene = {};
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