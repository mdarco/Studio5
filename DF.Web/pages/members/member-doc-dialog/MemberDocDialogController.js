(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberDocDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'MembersService', 'UtilityService', 'toastr', 'AppParams', 'docTypes', 'memberID', 'userID'];

    function ctrlFn($scope, $uibModalInstance, MembersService, UtilityService, toastr, AppParams, docTypes, memberID, userID) {
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
            } else if (!$scope.model.DocumentName || $scope.model.DocumentName === '') {
                toastr.warning('Niste zadali naziv dokumenta.');
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
            $scope.model.MemberID = memberID;
            $scope.model.UserID = userID;
            $scope.model.DocMetadata.ExpiryDate = UtilityService.convertDateToISODateString($scope.model.DocMetadata.ExpiryDateForDisplay);

            MembersService.addDocument($scope.model).then(
                function () {
                    if (AppParams.DEBUG) {
                        toastr.success('Dokument uspešno dodat.');
                    }

                    $uibModalInstance.close();
                },
                function (error) {
                    resolveError(error);
                }
            );
        }

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        function resolveError(error) {
            switch (error.statusText) {
                case 'error_member_documents_doc_name_exists':
                    toastr.warning('Dokument sa datim nazivom već postoji.');
                    break;

                default:
                    toastr.error('Došlo je do greške na serveru prilikom unosa dokumenta.');
                    break;
            }
        }

        // date picker support
        $scope.datePickers = {};
        $scope.openDatePicker = function (pickerFor, event) {
            event.preventDefault();
            event.stopPropagation();

            $scope.datePickers['datePickerOpened_' + pickerFor] = true;
        };
    }
})();
