(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('MembersService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/members';

        var service = {
            getFiltered: getFilteredMembers,
            get: getMember,
            create: createMember,
            edit: editMember,

            getDocuments: getDocuments,
            addDocument: addDocument,
            deleteDocument: deleteDocument,

            getDanceGroups: getDanceGroups,
            updateDanceGroups: updateDanceGroups,

            getMemberPayments: getMemberPayments,
            getMemberPaymentInstallments: getMemberPaymentInstallments,
            addMemberPayment: addMemberPayment,
            editMemberPaymentInstallment: editMemberPaymentInstallment
        };

        return service;

        function getFilteredMembers(filter) {
            var url = WebApiBaseUrl + urlRoot + '/filtered?nd=' + Date.now();
            return $http.post(url, filter);
        }

        function getMember(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.get(url);
        }

        function createMember(model) {
            var url = WebApiBaseUrl + urlRoot;
            return $http.post(url, model);
        }

        function editMember(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '?nd=' + Date.now();
            return $http.put(url, model);
        }

        //#region Documents

        function getDocuments(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/documents?nd=' + Date.now();
            return $http.get(url);
        }

        function addDocument(model) {
            var url = WebApiBaseUrl + urlRoot + '/' + model.MemberID + '/documents';
            return $http.post(url, model);
        }

        function deleteDocument(memberID, doc) {
            var url = WebApiBaseUrl + urlRoot + '/' + memberID + '/documents/' + doc.DocumentID;
            return $http.delete(url);
        }

        //#endregion

        //#region Dance groups

        function getDanceGroups(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/dance-groups?nd=' + Date.now();
            return $http.get(url);
        }

        function updateDanceGroups(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/dance-groups';
            return $http.post(url, model);
        }

        //#endregion

        //#region Payments

        function getMemberPayments(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/payments?nd=' + Date.now();
            return $http.get(url);
        }

        function getMemberPaymentInstallments(id, paymentID) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/payments/' + paymentID + 'installments' + '?nd=' + Date.now();
            return $http.get(url);
        }

        function addMemberPayment(id, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/payments';
            return $http.post(url, model);
        }

        function editMemberPaymentInstallment(id, paymentID, installmentID, model) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/payments/' + paymentID + '/installments/' + installmentID;
            return $http.put(url, model);
        }

        //#endregion
    }
})();
