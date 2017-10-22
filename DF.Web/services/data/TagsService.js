(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('TagsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/tags';

        var service = {
            
        };

        return service;
    }
})();
