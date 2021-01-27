(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('TrainingSchedulesService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/training-schedules';

        var service = {
            get: getActiveTrainingSchedules,
            getAll: getAllTrainingSchedules,
            create: createTrainingSchedule,
            delete: deleteTrainingSchedule,
            setActive: setActive
        };

        return service;

        function getActiveTrainingSchedules() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getAllTrainingSchedules() {
            var url = WebApiBaseUrl + urlRoot + '/all?nd=' + Date.now();
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

        function setActive(model) {
            var url = `${WebApiBaseUrl}/${urlRoot}/${model.ID}/set-active`;
            return $http.put(url, model);
        }
    }
})();
