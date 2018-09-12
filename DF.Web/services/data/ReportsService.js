(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('ReportsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/reports';

        var service = {
            getUnpaidInstallmentsByPeriod: getUnpaidInstallmentsByPeriod
        };

        return service;

        function getUnpaidInstallmentsByPeriod(filter) {
            var url = WebApiBaseUrl + urlRoot + '/unpaid-installments-by-period?nd=' + Date.now();
            return $http.post(url, filter);
        }
    }
})();
