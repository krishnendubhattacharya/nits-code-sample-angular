'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        'home': ['app/Controllers/homeCtrl.js'],
    },

    //*** angularJS Modules

    modules: [
        {
            name: 'angularMoment',
            files: ['vendor/moment/angular-moment.min.js']
        },
    ]
});
