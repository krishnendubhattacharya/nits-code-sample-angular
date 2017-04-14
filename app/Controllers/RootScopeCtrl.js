app.controller("RootScopeCtrl", function ($scope, $location, $rootScope, $http, $state, $window) {
//    $scope.loggedindetails = myAuth.getAdminAuthorisation();
//
//    if ($scope.loggedindetails) {
//        if ($scope.loggedindetails.roleName.toLowerCase() == 'admin') {
//            $location.path("/admin/home");
//        }
//        else if ($scope.loggedindetails.roleName.toLowerCase() == 'staff') {
//            $location.path("/staff/home");
//        }
//    }
//    else {
//        $location.path("/home");
//    }
    
    
    $scope.menuVisible = false;
    $scope.swipeValue = true;

    $scope.showMenu = function () {
        $scope.menuVisible = !$scope.menuVisible;
    };

    

    

    


    

    

    
    
    
    

    
    

    
    


    

    
    if ($window.localStorage["appTitle"] != undefined && $window.localStorage["appTitle"] != null) {
        $rootScope.appTitle = $window.localStorage["appTitle"];

    }
    else {
        $rootScope.appTitle = "angularblank";
    }
    
   
    




});
