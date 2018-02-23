(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('PaymentsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/payments';

        var service = {
            getFiltered: getFiltered,
            getPayment: getPayment,
            addPayment: addPayment
        };

        return service;

        function getFiltered(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getPayment(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.get(url);
        }

        function addPayment(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }
    }
})();
