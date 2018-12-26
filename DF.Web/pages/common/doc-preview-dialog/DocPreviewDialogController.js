(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DocPreviewDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'settings'];

    function ctrlFn($scope, $uibModalInstance, toastr, settings) {
        $scope.docUrl = '';

        if (settings && settings.DocUrl) {
            $scope.docUrl = settings.DocUrl;
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
