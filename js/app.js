let app = angular.module('gallery', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: "partials/home.html", controller: "GalleryController"})
        .when("/pictures/:folder", {templateUrl: "partials/pictures.html", controller: "PicturesController"})
        .when("/picture/:folder/:id", {templateUrl: "partials/picture.html", controller: "PictureController"})
        .otherwise({redirectTo: "/"});
});

app.directive('shortcut', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link:  function postLink(scope){
            document.onkeyup= checkKey;
            function checkKey(e){
                scope.$apply(scope.keyPressed(e));
            }
        }
    };
});


app.factory('PictureFactory', function ($http, $q) {
    let factory = {
        folders: false,
        pictures: false,
        getFolders: function () {
            let deferred = $q.defer();
            $http.get('api/getFolders.php')
                .then(function (response) {
                    factory.folders = response.data;
                    deferred.resolve(factory.folders);
                }, function () {
                    deferred.reject("impossible de recuperer les dossiers");
                });
            return deferred.promise;
        },
        isFolderExist: function (folderName) {
            let deferred = $q.defer();
            factory.getFolders().then(function () {
                let found = false;
                for (let i = 0; i < factory.folders.length; i++) {
                    if (folderName == factory.folders[i]) {
                        found = true;
                    }
                }
                deferred.resolve(found)
            }, function (msg) {
                deferred.reject(msg);
            });
            return deferred.promise;
        },
        getPictures: function(folderName){
            let deferred = $q.defer();
            $http.post('api/getPictures.php', {folder: folderName}).then(function (response) {
                factory.pictures = response.data;
                deferred.resolve(factory.pictures);
            }, function () {
                deferred.reject("impossible de récuperer les photos du dossier")
            });
            return deferred.promise;
        },
        getPictureName: function(folderName, id){
            let deferred = $q.defer();
            factory.getPictures(folderName).then(function(pictures){
                for (let i =0; i<pictures.length; i++){
                    if(pictures[i].id == id){
                        deferred.resolve(pictures[i].fileName);
                    }
                }
            }, function(msg){
                deferred.reject(msg);
                alert(msg);
            });
            return deferred.promise;
        }
    };
    return factory;
});

app.controller("PictureController", function($scope, PictureFactory, $routeParams, $location){
    PictureFactory.isFolderExist($routeParams.folder).then(function(){
        $scope.folder = $routeParams.folder;
        $scope.id = $routeParams.id;
        PictureFactory.getPictureName($routeParams.folder, $routeParams.id).then(function(fileName){
            $scope.fileName = fileName;
        }, function(msg){
            alert("msg");
        });

        $scope.keyPressed = function(e) {
            if(e.keyCode==39) {
                e.preventDefault();
                if(($scope.id)<(PictureFactory.pictures.length-1)) {
                    $scope.id++;
                    $location.path("/picture/" + $scope.folder + "/" + $scope.id);
                    $location.replace();
                }
            }else if(e.keyCode==37){
                e.preventDefault();
                if(($scope.id-1) >= 0) {
                    $scope.id--;
                    $location.path("/picture/" + $scope.folder + "/" + $scope.id);
                    $location.replace();
                }
            }
        };
    }, function(){
        $location.path('/');
        $location.replace();
    });
});

app.controller("PicturesController", function ($scope, PictureFactory, $routeParams, $location) {
    PictureFactory.isFolderExist($routeParams.folder).then(function (found) {
        if (found) {
            $scope.folder = $routeParams.folder;
            PictureFactory.getPictures($routeParams.folder).then(function (pictures) {
                $scope.pictures = pictures;
            }, function (msg) {
                alert(msg)
            });
        } else {
            $location.path('/');
            $location.replace();
        }
    }, function () {
        $location.path('/');
        $location.replace();
    });
});

app.controller('GalleryController', function ($scope, PictureFactory) {
    PictureFactory.getFolders().then(function (folders) {
        $scope.folders = folders;
    }, function (msg) {
        alert(msg);
    });
});
