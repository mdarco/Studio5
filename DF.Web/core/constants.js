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

        IMAGE_BASE64_SIZE_LIMIT: 1000000,
        IMAGE_FILE_TYPES: ['image/png', 'image/jpeg', 'image/gif'],

        DEBUG: true
    });
})();
