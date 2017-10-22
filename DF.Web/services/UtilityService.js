(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UtilityService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var service = {
            convertISODateStringToDate: convertISODateStringToDate,
            convertDateToISODateString: convertDateToISODateString
        };

        return service;

        function convertISODateStringToDate(isoDateString) {
            if (isoDateString) {
                var isoDateParts = isoDateString.split('T');
                if (isoDateParts && isoDateParts[0]) {
                    var dateParts = isoDateParts[0].split('-');
                    if (dateParts && dateParts.length === 3) {
                        return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    }
                }
            }
        }

        function convertDateToISODateString(date) {
            if (_.isDate(date)) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return year + '-' + month + '-' + day;
            }
        }
    }
})();
