app.controller('leftbarCtrl', function ($rootScope, $scope, $http, $location, $stateParams, myAuth,$upload,$timeout) {
    myAuth.updateUserinfo(myAuth.getUserAuthorisation());
    $scope.loggedindetails = myAuth.getUserNavlinks();
    console.log($scope.loggedindetails);
    $scope.fads = false;

    $scope.getImageInfo = function () {
        $http({
            method: "GET",
            url: $rootScope.serviceurl + "user/"+$scope.loggedindetails.id,
            //data: {"email":$scope.email,"password":$scope.password},
            //headers: {'Content-Type': 'application/json'},
        }).success(function (data) {
            //console.log(data);
            //$scope.userInfo =data;
            $scope.user_details = data.user_details;
            $scope.userImagePath = data.user_details.image;
            //console.log($scope.allcat);

            //console.log($scope.userInfo.email);



        });

    }
    $scope.getImageInfo();

    $scope.urlParam = $location.path();
    //console.log($scope.urlParam);

    $scope.uploadResult = [];
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        // for (var i = 0; i < $files.length; i++) {
        var $file = $files;
        //console.log($file);
        $upload.upload({
            url: $rootScope.serviceurl + "profileimageupload",
            file: $file,
            data:{"user_id":$scope.loggedindetails.id},
            method: "POST",
            progress: function(e){}
        }).then(function(response) {
            // file is uploaded successfully
            //console.log($file);
            console.log(response);
            $scope.userImagePath = response.data.user_image_details;
            console.log($scope.userImagePath);

                //$scope.uploadResult.push(response.data);
                //console.log($scope.uploadResult);


        });
        //}
    }

    $scope.getAds = function () {

        $http({
            method: "GET",
            url: $rootScope.serviceurl + "getActiveAdsByLocation/6",
        }).success(function (data) {
            $scope.ads = data.ads;
            $timeout(function(){
                //$scope.fads = true;
                // $('#ca-container').contentcarousel();
                var carousal = $('.owl-carousel1');
                carousal.owlCarousel({
                    autoplay:true,
                    touchDrag:false,
                    loop:true,
                    dots:true,
                    nav:true,
                    navContainerClass:"ca-nav",
                    navText:false,
                    autoplayTimeout:5000,
                    autoplayHoverPause:true,
                    onInitialize: function (event) {
                        if ($('.item > img').length === 1) {
                            this.settings.loop = false;
                            this.settings.nav = false;
                        }},
                    responsive:{
                        0:{
                            items:1
                        },
                        600:{
                            items:1
                        },
                        1000:{
                            items:1
                        }
                    }
                });
            },30);
            //console.log($scope.newPromoInfo);

        });
    }
    $scope.getAds();
    $scope.viewIcon = function () {
        $http({
            method: "GET",
            url: $rootScope.serviceurl + "getIconList",
            //data: {"email":$scope.email,"password":$scope.password},
            //headers: {'Content-Type': 'application/json'},
        }).success(function (data) {
            $scope.allicons = data.icon;
            //console.log($scope.allicons);

        });
    }
    $scope.viewIcon();

});