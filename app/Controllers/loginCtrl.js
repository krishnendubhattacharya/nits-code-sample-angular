+'use strict';
/**
 * controllers used for the login
 */
app.controller('loginCtrl', function ($rootScope, $scope, $http, $location,$facebook, myAuth, $cookieStore,ngToast,$stateParams,$timeout) {
    $scope.returnUrl = $stateParams.returnUrl;
    //ngToast.create('a toast message...');
    var user_type = ["Merchant", "Client"];
    $scope.GetAll();
    $scope.GetAll=function(){
        $http({
            method: "GET",
            url: $rootScope.serviceurl+"users/login",
            data: {"email":$scope.email,"password":$scope.password},
            headers: {'Content-Type': 'application/json'},
        }).success(function(data) {
console.log(data);
        });

    }


    $scope.textBox = {
        first_name: {
            placeholder: "Enter First Name",
            mode: "text",
            bindingOptions: { value: 'first_name' },

        },
        last_name: {
            placeholder: "Enter Second Name",
            mode: "text",

        },
        email: {
            placeholder: "Enter Email",
            mode: "email",

        },
        username: {
            placeholder: "Enter Username",
            mode: "text",

        },
        password: {
            placeholder: "Enter Password",
            mode: "password",

        }
    };

    $scope.cartConfPopup = false;
    $scope.popupOptions = {
        width: 'auto',
        height: 'auto',
        contentTemplate: "info",
        showTitle: true,
        title: "Cart",
        dragEnabled: false,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "cartConfPopup",
        }
    };
    //$scope.cartConfPopup = true;

    $scope.validateAndSubmit = function(params) {


        var result = params.validationGroup.validate();
        if(result.isValid) {
            $http({
                method: "POST",
                url: $rootScope.serviceurl+"users/login",
                data: {"email":$scope.email,"password":$scope.password},
                headers: {'Content-Type': 'application/json'},
            }).success(function(data) {
                console.log(data);
                if(data.type == 'success'){
                    $scope.message = data.message;
                    DevExpress.ui.notify({
                        message: $scope.message,
                        position: {
                            my: "center top",
                            at: "center top"
                        }
                    }, "success", 3000);
                    $scope.loggedindetails = '';

                    params.validationGroup.reset();
                    $cookieStore.put('users', data.user_details);
                    $scope.fetched_user_details = data.user_details;
                    $scope.user_username = '';
                    $scope.user_password = '';
                    myAuth.updateUserinfo(myAuth.getUserAuthorisation());
                    $scope.loggedindetails = myAuth.getUserNavlinks();
                    //console.log('hiiiiiiiiii');
                    console.log($scope.loggedindetails);
                    $rootScope.$emit('updateLoginDetails');
                    $scope.loggedin = true;
                    $scope.notloggedin = false;
                    /********************* Getting The Cart ************/

                    if ($scope.loggedindetails && $scope.loggedindetails.user_type_id==2) {
                        $http({
                            method: "GET",
                            url: $rootScope.serviceurl + "getCartByUser/" + $scope.loggedindetails.id,
                            headers: {'Content-Type': 'application/json'}
                        }).success(function (data) {
                            if(data)
                            {
                                $scope.cartItem = JSON.parse(localStorage.getItem('cart'));
                                $scope.existed_cart = data;
                                if(!$scope.cartItem && $scope.existed_cart)
                                {
                                    $scope.keepOldCart();
                                }
                                else if((!$scope.existed_cart || $scope.existed_cart.length==0) && $scope.cartItem)
                                {
                                    $scope.combineCart();
                                }
                                else
                                {
                                    $scope.cartConfPopup = true;
                                }
                            }
                        })
                        $scope.cartItem = JSON.parse(localStorage.getItem('cart'));
                        //if($scope.cartItem)
                        //{
                        //    $scope.cartConfPopup = true;
                        //}
                        //$http({
                        //    method: "POST",
                        //    url: $rootScope.serviceurl + "addToCart",
                        //    headers: {'Content-Type': 'application/json'},
                        //    data:{user_id:$scope.loggedindetails.id,cart:$scope.cartItem}
                        //}).success(function (data) {
                        //    console.log('saved');
                        //    if(data)
                        //    {
                        //       // $cookieStore.put('cart',data);
                        //        localStorage.setItem('cart', JSON.stringify(data));
                        //       // $scope.cartDetails = mFoodCart.get_cart();
                        //        //$scope.getCartDetails();
                        //    }
                        //})
                    }
                    else
                    {
                        $scope.loginRedirect();
                    }

                    /********************* Getting The Cart ************/

                    //console.log($scope.loggedindetails);





                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }

                }else{
                    var message = "Login failed.";
                    DevExpress.ui.notify({
                        message: message,
                        position: {
                            my: "center top",
                            at: "center top"
                        }
                    }, "error", 3000);
                }

            })

            //form.submit();
            //params.validationGroup.reset();
        }
    };


    $scope.loginRedirect = function(){
        //$timeout(function(){
            if($scope.fetched_user_details.is_logged_in == 1){

                $location.path('admin/home');
            }else {
                if($scope.returnUrl) {
                    $location.search('returnUrl', null)
                    $location.path($scope.returnUrl);
                }
                else {
                    $location.path('/');
                }
            }
        //},3100);
    }

    $scope.combineCart = function(){
        if(!$scope.cartItem)
        {
            $scope.cartItem = [];
        }
        $http({
            method: "POST",
            url: $rootScope.serviceurl + "addToCart",
            headers: {'Content-Type': 'application/json'},
            data: {user_id: $scope.loggedindetails.id, cart: $scope.cartItem}
        }).success(function (data) {
            console.log('saved');
            if (data) {
                // $cookieStore.put('cart',data);
                localStorage.setItem('cart', JSON.stringify(data));
                $scope.cartConfPopup = false;
                $scope.loginRedirect();
                // $scope.cartDetails = mFoodCart.get_cart();
                //$scope.getCartDetails();
            }
        })

    }

    $scope.keepOldCart = function(){
        if($scope.existed_cart)
        {
            localStorage.setItem('cart', JSON.stringify($scope.existed_cart));

        }
        $scope.loginRedirect();
    }

    $scope.keepNewCart = function(){
        $http({
            method: "delete",
            url: $rootScope.serviceurl + "deleteCartByUser/" + $scope.loggedindetails.id,
            headers: {'Content-Type': 'application/json'},
        }).success(function (data) {
            $scope.loginRedirect();
        })
    }

    $scope.emailValidationRules = {
        validationRules: [{
            type: "required",
            message: "Email is required"
        }]
    };



    $scope.passwordValidationRules = {
        validationRules: [{
            type: "required",
            message: "Password is required"
        }]
    };

    $scope.fbsignuser = function () {
        $facebook.login().then(function() {
            reset();
        });
    };

    function reset() {
        $facebook.api("/me",{fields: 'id,name,email'}).then(
            function(response) {
                console.log(response);
                $http({
                    method: "POST",
                    url: $rootScope.serviceurl+"fbloginuser",
                    data: {"email":response.email,"id":response.id,"name":response.name},
                    headers: {'Content-Type': 'application/json'},
                }).success(function(data) {
                    console.log(data);
                    if(data.type == 'success'){
                        $scope.loggedindetails = '';
                        var message = data.message;
                        //params.validationGroup.reset();
                        $cookieStore.put('users', data.user_details);
                        $scope.user_username = '';
                        $scope.user_password = '';
                        myAuth.updateUserinfo(myAuth.getUserAuthorisation());
                        $scope.loggedindetails = myAuth.getUserNavlinks();
                        //console.log('hiiiiiiiiii');
                        console.log($scope.loggedindetails);
                        $rootScope.$emit('updateLoginDetails');
                        $scope.loggedin = true;
                        $scope.notloggedin = false;
                        //console.log($scope.loggedindetails);
                        if(data.user_details.user_type_id == 1){
                            $location.path('admin/home');
                        }else {
                            $location.path('/');
                        }
                        DevExpress.ui.notify({
                            message: message,
                            position: {
                                my: "center top",
                                at: "center top"
                            }
                        }, "success", 3000);
                    }else{
                        var message = "Login failed.";
                        DevExpress.ui.notify({
                            message: message,
                            position: {
                                my: "center top",
                                at: "center top"
                            }
                        }, "error", 3000);
                    }

                });
               /* $scope.loading = true;
                $http({
                    method: "POST",
                    url: $rootScope.serviceurl + "users/fbloginuser",
                    data: $.param({'email': response.email,'name':response.name,'fbid':response.id}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).success(function(data) {
                    $scope.loading = false;
                    if (data.msg_type == '0')
                    {
                        $scope.loginalertmessage = true;
                        $scope.alert = myAuth.addAlert('danger', data.msg);
                    }
                    else if(data.msg_type == '1')
                    {
                        $cookieStore.put('users', data.userdetails);

                        $scope.loginalertmessage = true;
                        $scope.alert = myAuth.addAlert('success', data.msg);
                        $scope.user_username = '';
                        $scope.user_password = '';
                        myAuth.updateUserinfo(myAuth.getUserAuthorisation());
                        $scope.loggedindetails = myAuth.getUserNavlinks();
                        $scope.imgtype = $scope.loggedindetails.imgtype;
                        if($scope.loggedindetails.fbid!="")
                        {
                            $scope.headersiteimage = false;
                        }else{
                            $scope.headersiteimage = true;
                        }
                        $scope.loggedin = true;
                        $scope.notloggedin = false;
                        $scope.onlinestatnoti=true;
                        if (data.userdetails.role == 1) {
                            $scope.onlinestat = false;
                        } else {
                            var jsonstatus = {'userid': $scope.loggedindetails.id};
                            socket.emit("mentor_login", jsonstatus);
                            $scope.onlinestat = true;
                            if (data.userdetails.login_status == 1) {
                                var htmls = '<img src="assets/frontend/images/online.png" alt="" style="margin-right:5px; margin-top:-2px;">Instant Session';
                            } else if (data.userdetails.login_status == 2) {
                                var htmls = '<img src="assets/frontend/images/online.png" alt="" style="margin-right:5px; margin-top:-2px;">Online';
                            }
                            else if (data.userdetails.login_status == 3) {
                                var htmls = '<img src="assets/frontend/images/away.png" alt="" style="margin-right:5px; margin-top:-2px;">Away';
                            }
                            else if (data.userdetails.login_status == 4) {
                                var htmls = '<img src="assets/frontend/images/offline.png" alt="" style="margin-right:5px; margin-top:-2px;">Offline';
                            }
                            $("#headstatus").html(htmls + '<span class="caret"></span>');
                        }
                        $('.modal').modal('hide');
                        if (data.userdetails.role == 1)
                        {
                            $location.path("/frontend/dashboard");
                        }
                        else
                        {
                            $location.path("/frontend/mentor-dashboard");
                        }
                        $scope.getnotifications();
                    }
                });*/
            },
            function(err) {
                console.log(err);
                //$scope.alertmessage = true;
                //$scope.alert = myAuth.addAlert('danger', 'Please provide your email.');
            });
    }

});

