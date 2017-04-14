var app = angular.module("angularblank", ['oc.lazyLoad','ncy-angular-breadcrumb','ui.router','ngRoute','ngTouch',
        'ngSanitize',]);
app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
      // FastClick.attach(document.body);

        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE
        // set below basic information
        
        $rootScope.serviceurl = "http://166.62.40.135:8089/";
        $rootScope.siteurl = "http://166.62.40.135:8091/";
        $rootScope.app = {
            name: 'angularblank', // name of your project
            author: 'kRISHNENDU bHATTACHARYA', // author's name or company name
            description:'angularblank',
            keywords:'angularblank',
            version: '1.0', // current version
            year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
            isMobile: (function () {// true if the browser is a mobile device
                var check = false;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    check = true;
                };
                return check;
            })()
        };

    }]);

angular.module('angularblank').run(['$http',function($http){
   $http.defaults.headers.common.responsetype = 'json';
}])

angular.module('angularblank').filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});


app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES','$locationProvider',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires,$locationProvider) {

     app.controller = $controllerProvider.register;
     app.directive = $compileProvider.directive;
     app.filter = $filterProvider.register;
     app.factory = $provide.factory;
     app.service = $provide.service;
     app.constant = $provide.constant;
     app.value = $provide.value;

        // LAZY MODULES
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

///Remove Hash from URL//////
 //$locationProvider.html5Mode(true).hashPrefix('');
 $locationProvider.hashPrefix('');

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
        $urlRouterProvider.otherwise("/home");
        
    //
    // Set up the states

        $stateProvider
        //Login state
            .state('frontend', {
                url: '',
                templateUrl: 'app/views/app.html',
                abstract :true,
                //resolve: loadSequence('footer')

            })
            
            .state('frontend.home', {
                url: '/home',
                templateUrl: 'app/views/home.html',
                title: 'Home',
                ncyBreadcrumb: {
                    label: 'Home page'
                },
                resolve: loadSequence('home')
            })
            
            .state('frontend.test', {
                url: '/test',
                templateUrl: 'app/views/test.html',
                title: 'Home',
                ncyBreadcrumb: {
                    label: 'test page'
                },
                resolve: loadSequence('home')
            });

function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }]
            };
        }

  }]);
