(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('DocumentsService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var urlRoot = '/api/documents';
        var urlRoot_docTypes = '/api/doc-types';

        var service = {
            getDocTypesAsLookup: getDocTypesAsLookup,
            manageDocTypes: manageDocTypes,
            deleteDocType: deleteDocType,

            getAllTags: getAllTags,
            getTags: getTags,
            getTagsForAutocomplete: getTagsForAutocomplete,
            insertTags: insertTags
        };

        return service;

        //#region Doc types

        function getDocTypesAsLookup() {
            var url = WebApiBaseUrl + urlRoot_docTypes + '/lookup?nd=' + Date.now();
            return $http.get(url);
        }

        function manageDocTypes(model) {
            var url = WebApiBaseUrl + urlRoot_docTypes;
            return $http.post(url, model);
        }

        function deleteDocType(id) {
            var url = WebApiBaseUrl + urlRoot_docTypes + '/' + id;
            return $http.delete(url);
        }

        //#endregion

        //#region Tags

        function getAllTags() {
            var url = WebApiBaseUrl + urlRoot + '/tags?nd=' + Date.now();
            return $http.get(url);
        }

        function getTags(id) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/tags?nd=' + Date.now();
            return $http.get(url);
        }

        function getTagsForAutocomplete(tagName) {
            var url = WebApiBaseUrl + urlRoot + '/tags/' + tagName + '?nd=' + Date.now();
            return $http.get(url);
        }

        function insertTags(id, tagList) {
            var url = WebApiBaseUrl + urlRoot + '/' + id + '/tags';
            return $http.post(url, tagList);
        }

        //#endregion
    }
})();
