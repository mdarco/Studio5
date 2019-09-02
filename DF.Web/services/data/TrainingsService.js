(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('TrainingsService', serviceFn);

    serviceFn.$inject = ['$http', '$q', 'WebApiBaseUrl'];

    function serviceFn($http, $q, WebApiBaseUrl) {
        var _searchFilter = null;

        var urlRoot = '/api/trainings';

        var service = {
            getSearchFilter: getSearchFilter,
            setSearchFilter: setSearchFilter,

            getFiltered: getFilteredTrainings,
            create: createTraining,
            delete: deleteTraining,

            getMemberPresence: getTrainingMemberPresenceRegistrations,
            updateMemberPresence: updateTrainingMemberPresenceRegistration
        };

        return service;

        //#region Search filter getter and setter

        function getSearchFilter() {
            return _searchFilter;
        }

        function setSearchFilter(filter) {
            _searchFilter = filter;
        }

        //#endregion

        function getFilteredTrainings(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function createTraining(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function deleteTraining(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id;
            return $http.delete(url);
        }

        //#region Member presence

        function getTrainingMemberPresenceRegistrations(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/member-presence?nd=' + Date.now();
            return $http.get(url);
        }

        function updateTrainingMemberPresenceRegistration(model) {
            var url = WebApiBaseUrl + urlRoot + '/' + model.TrainingID + '/member-presence/' + model.MemberID;
            return $http.post(url, model);
        }

        //#endregion
    }
})();
