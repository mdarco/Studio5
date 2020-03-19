(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('TrainingSchedulesService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/training-schedules';

        var service = {
            get: getTrainingSchedules,
            create: createTrainingSchedule,
            delete: deleteTrainingSchedule
        };

        return service;

        function getTrainingSchedules() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function createTrainingSchedule(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function deleteTrainingSchedule(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id;
            return $http.delete(url);
        }
    }
})();
