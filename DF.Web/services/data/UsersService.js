﻿(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UsersService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/settings/users';

        var service = {
            getUsers: getUsers,
            getUserGroups: getUserGroups,
            getUserDanceGroups: getUserDanceGroups,

            manage: manageUser,
            delete: deleteUser,

            addUserToGroups: addUserToGroups,
            addUserToDanceGroups: addUserToDanceGroups,
            setUserDanceGroupsPaymentPermissions: setUserDanceGroupsPaymentPermissions
        };

        return service;

        function getUsers() {
            var url = WebApiBaseUrl + urlRoot + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getUserGroups(user) {
            var url = WebApiBaseUrl + urlRoot + '/' + user.UserID + '/user-groups' + '?nd=' + Date.now();
            return $http.get(url);
        }

        function getUserDanceGroups(user) {
            var url = WebApiBaseUrl + urlRoot + '/' + user.UserID + '/dance-groups' + '?nd=' + Date.now();
            return $http.get(url);
        }

        function manageUser(user) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, user);
        }

        function deleteUser(userID) {
            var url = WebApiBaseUrl + urlRoot + '/' + userID;
            return $http.delete(url);
        }

        function addUserToGroups(user, userGroups) {
            var url = WebApiBaseUrl + urlRoot + '/' + user.UserID + '/user-groups';
            return $http.post(url, userGroups);
        }

        function addUserToDanceGroups(user, userDanceGroups) {
            var url = WebApiBaseUrl + urlRoot + '/' + user.UserID + '/dance-groups';
            return $http.post(url, userDanceGroups);
        }

        function setUserDanceGroupsPaymentPermissions(user, userDanceGroups) {
            var url = WebApiBaseUrl + urlRoot + '/' + user.UserID + '/dance-groups-payment-permissions';
            return $http.post(url, userDanceGroups);
        }
    }
})();
