(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('ReportsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/reports';

        var service = {
            getUnpaidInstallmentsByPeriod: getUnpaidInstallmentsByPeriod,
            getUnpaidInstallmentsByPeriodAndDanceGroup: getUnpaidInstallmentsByPeriodAndDanceGroup,
            getMonthlyPaymentsReport: getMonthlyPaymentsReport
        };

        return service;

        function getUnpaidInstallmentsByPeriod(filter) {
            var url = WebApiBaseUrl + urlRoot + '/unpaid-installments-by-period?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getUnpaidInstallmentsByPeriodAndDanceGroup(filter) {
            var url = WebApiBaseUrl + urlRoot + '/unpaid-installments-by-period-and-dance-group?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getMonthlyPaymentsReport(filter) {
            var url = WebApiBaseUrl + urlRoot + '/monthly-payments?nd=' + Date.now();
            return $http.post(url, filter);
        }
    }
})();
