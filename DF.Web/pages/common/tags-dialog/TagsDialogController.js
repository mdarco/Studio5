(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('TagsDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'settings', 'tags', 'allTags'];

    function ctrlFn($scope, $uibModalInstance, toastr, settings, tags, allTags) {
        $scope.settings = settings;

        $scope.allTags = allTags.data ? allTags.data : allTags;
        $scope.tags = [];

        if (tags && tags.data && _.isArray(tags.data)) {
            $scope.tags = tags;
        } else if (tags && _.isArray(tags)) {
            $scope.tags = tags;
        }

        $scope.loadTags = function (query) {
            if (settings.AutocompleteFn) {
                return settings.AutocompleteFn(query);
            } else {
                var filteredTags = _.filter($scope.allTags, function (tag) {
                    if (tag[settings.DisplayProperty].toLowerCase().indexOf(query.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                return filteredTags;
            }
        };

        $scope.save = function () {
            $uibModalInstance.close($scope.tags);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
