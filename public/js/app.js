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
                            return sceneService.all;
                }]},
                controller: 'selectorController'
            
            })
                        
             .state('game', {
                url:'/game/:story/:scene',
                abstract: 'true',
                templateUrl: 'views/game.html',
                controller: 'gameController',
                resolve: {
                    sceneinfo: ['$stateParams', function($stateParams){
                        return $stateParams.story;                 
                    }]
                }
            
            })
        
            .state('game.media', {
                url:'/media',
                template: '<p> This is the media template </p>',
                controller: 'gameController',
                
            })
        
            .state('game.question', {
                url:'/question',
                template: '<p> This is the question template </p>'
            
        })
        
            .state('game.hint', {
                url:'/hint',
                template: '<p>This is the hint template</p>'
            
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

//.factory('contacts', ['$http', 'utils', function ($http, utils) {
//  var path = 'assets/contacts.json';
//    console.log('The contacts service is working');
//  var contacts = $http.get(path).then(function (resp) {
//    console.log(contacts) //this returns a promise
//      return resp.data.contacts;
//  });
//
//  var factory = {};
//  factory.all = function () {
//    return contacts;
//  };
//  factory.get = function (id) {
//    return contacts.then(function(){
//      return utils.findById(contacts, id);
//    })
//  };
//  return factory;
//}])
//
//.factory('utils', function () {
//  return {
//    // Util for finding an object by its 'id' property among an array
//    findById: function findById(a, id) {
//      for (var i = 0; i < a.length; i++) {
//        if (a[i].id == id) return a[i];
//      }
//      return null;
//    },
//
//    };
//})

.factory('sceneService', ['$http', 'utilityService', function($http) {
        console.log('The scene http service is working')
        var path = '../app/models/scenes.json';
        var scenes = $http.get(path).then(function (resp) {
            console.log(scenes);
            return resp.data.scenes;
          });
        
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
//    $state.go('stats');
})

.controller('selectorController', ['$scope', 'resolvedScenes',
                        function(   $scope,   resolvedScenes) {
    
	$scope.tagline = 'This is the selector page and this sentence is coming from the controller';	
    $scope.resolvedScenes = resolvedScenes.value;

}])

.controller('gameController', function($scope) {
// USE DEPENDENCY INJECTION TO INJECT THE SCENEINFO
	$scope.tagline = 'This is the game';	

})


.controller('editorController', function($scope) {

	$scope.tagline = 'This is the editor page';

})

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
            info: '='
        },
        templateUrl: 'js/directives/storyInfo.hmtl'
    };
});