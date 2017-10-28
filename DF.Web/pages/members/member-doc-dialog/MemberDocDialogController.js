(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberDocDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'toastr', 'docTypes'];

    function ctrlFn($scope, $uibModalInstance, toastr, docTypes) {
        $scope.model = {
            File: {},
            DocMetadata: {}
        };

        $scope.docTypes = docTypes;

        $scope.save = function () {
            var f = document.getElementById('uploadMemberDoc');
            if (!f.files[0]) {
                toastr.warning('Dokument nije izabran.');
            } else if (!$scope.model.DocumentTypeID) {
                toastr.warning('Nije izabrana vrsta dokumenta.');
            } else {
                var file = f.files[0];

                var fileReader = new FileReader();
                fileReader.onloadend = function (event) {
                    var fileData = event.target.result; // file data URL
                    _save({ DataUrl: fileData, FileName: file.name });
                };

                fileReader.readAsDataURL(file);
            }
        };

        function _save(fileData) {
            $scope.model.File.FileName = fileData.FileName;
            $scope.model.File.DataUrl = fileData.DataUrl;
            $uibModalInstance.close($scope.model);
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        // date picker support
        $scope.datePickers = {};
        $scope.openDatePicker = function (pickerFor, event) {
            event.preventDefault();
            event.stopPropagation();

            $scope.datePickers['datePickerOpened_' + pickerFor] = true;
        };
    }
})();
