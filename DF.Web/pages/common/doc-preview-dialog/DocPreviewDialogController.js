(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DocPreviewDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'settings'];

    function ctrlFn($scope, $uibModalInstance, toastr, settings) {
        $scope.docUrl = '';

        if (settings.DocUrl) {
            $scope.docUrl = settings.DocUrl;
        } else {
            toastr.warning('Dokument nije pronađen.');
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
