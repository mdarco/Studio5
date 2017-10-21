(function () {
    'use strict';

    var app = angular.module('DFApp');

    app.constant('WebApiBaseUrl', '/DFApi');

    app.constant('AppParams', {
        datePickerOptions: {
            ISO_DATE_FORMAT: 'YYYY-MM-DD',
            DATE_FORMAT: 'YYYY-MM-DD',
            DISPLAY_DATE_FORMAT: 'DD.MM.YYYY',
            startingDay: 1
        },

        DEBUG: true
    });
})();
