(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberDocDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', 'MembersService', 'UtilityService', 'WebApiBaseUrl', 'toastr', 'AppParams', 'docTypes', 'memberID', 'userID'];

    function ctrlFn($scope, $uibModalInstance, MembersService, UtilityService, WebApiBaseUrl, toastr, AppParams, docTypes, memberID, userID) {
        $scope.model = {
            File: {},
            DocMetadata: {}
        };

        $scope.docTypes = docTypes;

        //#region ngDropzone

        $scope.dzOptions = {
            autoProcessQueue: false,
            url: WebApiBaseUrl + '/api/members/' + memberID + '/documents',
            paramName: 'dfdoc',
            maxFiles: 1,
            addRemoveLinks: true,

            //previewTemplate: `
            //    <div class="dz-preview dz-file-preview" style="width: 100%;">
            //        <div class="dz-details" style="border: 1px dotted navy; width: 100px; background-color: #ffffe0;">
            //            <div class="dz-filename"><span data-dz-name></span></div>
            //            <div class="dz-size" data-dz-size></div>
            //        </div>
            //        <button class="btn btn-xs btn-danger dz-remove" title="Ukloni dokument" data-dz-remove><i class="fa fa-times"></i>  Ukloni</button>
            //    </div>
            //`,

            dictDefaultMessage: '<h1 style="font-variant: small-caps;"><strong>Kliknite ili prevucite dokument ovde..</strong></h1>',
            dictFallbackMessage: 'Vaš Web browser ne podržava prevlačenje dokumenata.',
            dictInvalidFileType: 'Pogrešan tip datoteke.',
            dictFileTooBig: 'Dokument je preveliki.',
            dictMaxFilesExceeded: 'Prekoračili ste dozvoljen broj dokumenata.',
            dictRemoveFile: 'Ukloni dokument',

            init: function () { },
            accept: function (file, done) {
                // file validation logic can be put here

                // has to be called in order for all the events to work properly
                // done() means everything's ok, done([errorMessage]) signifies error
                done();
            }
        };

        $scope.dzCallbacks = {
            'addedfile': function (file) {
                
            },

            'removedfile': function (file) {
                
            },

            'maxfilesexceeded': function (file) {
                $scope.dzMethods.removeFile(file);
                toastr.warning('Prekoračili ste dozvoljen broj dokumenata.');
            },

            'uploadprogress': function (file, progressPercentage, bytesSent) { },

            'sending': function (file, xhrObject, formData) {
                // fires once for each file

                // send file model along with the real files (documents)
                $scope.model.File.FileName = file.name;
                $scope.model.MemberID = memberID;
                $scope.model.UserID = userID;
                $scope.model.DocMetadata.ExpiryDate = UtilityService.convertDateToISODateString($scope.model.DocMetadata.ExpiryDateForDisplay);

                formData.append("model", JSON.stringify($scope.model));
            },

            'sendingmultiple': function (files, xhrObject, formData) {
                // fires once per processQueue();
            },

            'success': function (file, serverResponse) {
                // fires once for each file
                clearModel();
            },

            'successmultiple': function (files, serverResponse) {
                
            },

            'complete': function (file) { },

            'completemultiple': function (files) {
                // fires once per completed file
            },

            'error': function (file, errorMessage) {
                toastr.error('Došlo je do greške prilikom upisivanja dokumenta.');
            }
        };

        $scope.dzMethods = {};

        function clearModel() {
            $scope.model = {};
            $scope.dzMethods.removeAllFiles();
        }

        //#endregion

        $scope.save = function () {
            $scope.dzMethods.processQueue();

            //var f = document.getElementById('uploadMemberDoc');
            //if (!f.files[0]) {
            //    toastr.warning('Dokument nije izabran.');
            //} else if (!$scope.model.DocumentTypeID) {
            //    toastr.warning('Nije izabrana vrsta dokumenta.');
            //} else if (!$scope.model.DocumentName || $scope.model.DocumentName === '') {
            //    toastr.warning('Niste zadali naziv dokumenta.');
            //} else {
            //    var file = f.files[0];

            //    var fileReader = new FileReader();
            //    fileReader.onloadend = function (event) {
            //        var fileData = event.target.result; // file data URL
            //        _save({ DataUrl: fileData, FileName: file.name });
            //    };

            //    fileReader.readAsDataURL(file);
            //}
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
