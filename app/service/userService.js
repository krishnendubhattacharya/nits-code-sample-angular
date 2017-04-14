app.service(
    "userService",
    function ($rootScope, $http, $q, Upload) {
        // Return public API.
        return({
            loginDetails: loginDetails,
            forgotPassword: forgotPassword,
            changeforgotPassword:changeforgotPassword,
            getAllUsers: getAllUsers,
            getAllUsersWithRole:getAllUsersWithRole,
            userAdd:userAdd,
            getUser:getUser,
            userEdit:userEdit,
            uploadUsingUpload:uploadUsingUpload,
            getDoctorDetails:getDoctorDetails,
            updateDoctor: updateDoctor,
            getQuestionAnsBasedOnUser: getQuestionAnsBasedOnUser
        });
        // ---
        // PUBLIC METHODS.
        // ---



        function userAdd(item) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"Register",
                data:item,
                headers: { 'Content-Type': 'application/json'}
            });
            return( request.then( handleSuccess, handleError ) );
        }



      
        function userEdit(item) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"UpdateUserDetails",
                data:item,
                headers: { 'Content-Type': 'application/json'}
            });
            return( request.then( handleSuccess, handleError ) );
        }


        function updateDoctor(item) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"UpdateDoctorDetails",
                data:item,
                headers: { 'Content-Type': 'application/json'}
            });
            return( request.then( handleSuccess, handleError ) );
        }

        // User Login
        function loginDetails(email,password) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"user/login",
                data: {
                    "email": email,
                    "password": password
                },
                headers: { 'Content-Type': 'application/json','responsetype':'json' }
            });
            return( request.then( handleSuccess, handleError ) );
        }
        
        function getAllUsers() {
         var request = $http({
         method: "GET",
         url: $rootScope.serviceurl+"GetAllUser?offset=0&limit=20",
         headers: { 'Content-Type': 'application/json','offset':'0','limit':'20' }
         });
         return( request.then( handleSuccess, handleError ) );
         }

        function getAllUsersWithRole(roleName) {
            var request = $http({
                method: "GET",
                url: $rootScope.serviceurl+"GetAllUserWithRole/"+roleName,
                headers: { 'Content-Type': 'application/json','offset':'0','limit':'20' }
            });
            return( request.then( handleSuccess, handleError ) );
        }
      /*  function getUser(user_id,accesstoken) {
            var request = $http({
                method: "GET",
                url: $rootScope.serviceurl+"user/"+user_id,
                headers: { 'Content-Type': 'application/json','offset':'0','limit':'20','accesstoken':accesstoken }
            });
            return( request.then( handleSuccess, handleError ) );
        }*/
        function getUser(user_id) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"GetUserWithRole/"+user_id,
                headers: { 'Content-Type': 'application/json'}
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function getDoctorDetails(user_id) {
            var request = $http({
                method: "GET",
                url: $rootScope.serviceurl+"GetDoctorDetailsByKey/"+user_id,
                headers: { 'Content-Type': 'application/json'}
            });
            return( request.then( handleSuccess, handleError ) );
        }
        // User Login
        function forgotPassword(email) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"user/forgotpassword",
                data: {
                    "email": email,

                },
                headers: { 'Content-Type': 'application/json','responsetype':'json' }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function changeforgotPassword(newpassword,useremail) {
            var request = $http({
                method: "POST",
                url: $rootScope.serviceurl+"user/changeforgotpassword",
                data: {
                    "useremail": useremail,
                    "newpassword": newpassword,

                },
                headers: { 'Content-Type': 'application/json','responsetype':'json' }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function uploadUsingUpload (item) {
            return $q(function(handleSuccess, handleError) {
                Upload.upload({
                    method: 'POST',
                    url: $rootScope.serviceurl+"UpdateUserDetailsWithImage",
                    data: item,
                }).success(function (response) {

                        //console.log(response.ack);

                        handleSuccess(response);
                }).error(function (err) {
                    handleError(err.Message);
                });

            });
        };

        function getQuestionAnsBasedOnUser(userKey) {
            var request = $http({
                method: "GET",
                url: $rootScope.serviceurl + "GetQuestionAnsBasedOnUser/" + userKey,
                headers: { 'Content-Type': 'application/json' }
            });
            return (request.then(handleSuccess, handleError));
        }
        // ---
        // PRIVATE METHODS.
        // ---

        function handleError( response ) {
            if (! angular.isObject( response.data ) ||! response.data.message) {
                return( $q.reject( response.data.Message ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            return( response.data );


        }
    }
);