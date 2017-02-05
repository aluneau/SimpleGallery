var app = angular.module('gallery', ['ngRoute']);
app.config(function($routeProvider){
  $routeProvider
    .when("/", {templateUrl : "partials/home.html", controller: "GalleryController"})
    .when("/pictures/:folder", {templateUrl : "partials/pictures.html", controller: "PicturesController"})
    .otherwise({redirectTo : "/"});
});


app.factory('PictureFactory', function($http, $q){
  var factory = {
      folders : false,
      getFolders : function(){
          var deferred = $q.defer();
          $http.get('api/getFolders.php')
            .then(function(response){
              factory.folders = response.data;
              deferred.resolve(factory.folders);
            }, function(error){
              deferred.reject("impossible de recuperer les dossiers");
            });
          return deferred.promise;
      },
      isFolderExist: function(folderName){
        var deferred = $q.defer();
        factory.getFolders().then(function(folders){
          var found = false;
          for(var i=0; i<factory.folders.length; i++){
            if(folderName == factory.folders[i]){
              found = true;
            }
          }
          deferred.resolve(found)
        },function(msg){
          deferred.reject(msg);
        });
        return deferred.promise;
      }
    }
    return factory;
});


app.controller("PicturesController", function($scope, PictureFactory, $routeParams, $location){
  PictureFactory.isFolderExist($routeParams.folder).then(function(found){
    if(found){
      $scope.folder = $routeParams.folder;
    }else{
      $location.path('/');
      $location.replace();
    }
  },function(msg){
    $location.path('/');
    $location.replace();
  });
})

app.controller('GalleryController', function($scope, PictureFactory) {
    var galleryCtrl = this;

    PictureFactory.getFolders().then(function(folders){
      $scope.folders = folders;
    }, function(msg){
      alert(msg);
    });
});
