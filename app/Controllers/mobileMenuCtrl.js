'use strict';
/** 
 * controllers used for the login
 */
app.controller('mobileMenuCtrl', function ($rootScope, $scope, $http, $location, myAuth, $cookieStore) {

    /*$scope.sidemenubar=function() {
        var slideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu'),
            'side': 'right'
        });

        document.querySelector('.js-slideout-toggle').addEventListener('click', function () {
            slideout.toggle();
        });

        document.querySelector('.menu').addEventListener('click', function (eve) {
            if (eve.target.nodeName === 'A') {
                slideout.close();
            }
        });
    };
    $scope.sidemenubar();*/
    $scope.showMember= false;
        $scope.getLoginDetails=function(){
       
        myAuth.updateUserinfo(myAuth.getUserAuthorisation());
        $scope.loggedindetails = myAuth.getUserNavlinks();
        console.log($scope.loggedindetails);
            if($scope.loggedindetails){

                $scope.showMember= true;
            }

        //console.log('nnnnnnnnnnnnn');
         };
         
         $scope.userLogout=function(){
                console.log($scope.loggedindetails);
                //return false;
                $http({
                    method: "POST",
                    url: $rootScope.serviceurl + "users/logout",
                    data: {'userid': $scope.loggedindetails.id},
                        headers: {'Content-Type': 'application/json'},
                }).success(function(data) {
                    
                    
                myAuth.resetUserinfo();
                    $cookieStore.put('users', null);
                    localStorage.setItem('cart', null);
                    myAuth.updateUserinfo(myAuth.getUserAuthorisation());
                    $scope.loggedindetails = myAuth.getUserNavlinks();
                    $scope.loggedindetails = '';
                    $rootScope.$emit('updateLoginDetails');
                    $scope.loggedin = false;                   
                    $scope.notloggedin = true;
                    $scope.showMember= false;
                    $location.path("/");
                    DevExpress.ui.notify({
                            message: "Logout Successfully",
                            position: {
                                my: "center top",
                                at: "center top"
                            }
                        }, "success", 3000);
                    //menuClick();
                });
                
         };
         
        // $scope.getLoginDetails();
         $rootScope.$on('updateLoginDetails',function(){
                 //console.log('called');
                 $scope.getLoginDetails();
                
                 //$scope.$apply();
         });
    $scope.searchAll = function() {
        $scope.sort_field = "id";
        $scope.sort_by = "ASC";
        $scope.page = 1;
        $scope.lines = 10;

        if(typeof $scope.keyword != '' && $scope.type!=''){
            //alert(23);

            $location.path("/searchresult").search({keyword: $scope.keyword,category: $scope.type,sort_field: $scope.sort_field,sort_by: $scope.sort_by,page: $scope.page,lines: $scope.lines});

        }else{
            DevExpress.ui.notify({
                message: "Please enter value for keyword and type",
                position: {
                    my: "center top",
                    at: "center top"
                }
            }, "success", 3000);
        }
        menuClick();
    }

    $scope.catList = function () {

        $http({
            method: "GET",
            url: $rootScope.serviceurl + "getCategories",
        }).success(function (data) {
            $scope.catInfo = data.category;
            console.log($scope.catInfo);

        });
    }
    $scope.catList();

         
   
});

