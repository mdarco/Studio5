(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('DocPreviewDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', '$sce', 'UtilityService', 'toastr', 'settings'];

    function ctrlFn($scope, $uibModalInstance, $sce, UtilityService, toastr, settings) {
        $scope.docUrl = '';

        if (settings && settings.DocUrl) {
            $scope.docUrl = settings.DocUrl;
            $scope.blobUrl = window.URL.createObjectURL(UtilityService.dataURItoBlob($scope.docUrl));
        }

        $scope.getIframeSrc = function (blobUrl) {
            return $sce.trustAsResourceUrl(blobUrl);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
