(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberFileController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'MembersService', 'DocumentsService', 'AuthenticationService', 'WebApiBaseUrl', 'toastr', 'AppParams', 'member'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, MembersService, DocumentsService, AuthenticationService, WebApiBaseUrl, toastr, AppParams, member) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;

        $scope.member = member;

        //#region Basic data

        $scope.editMember = function (dataType) {
            alert('Work in progress..');
        };

        //#endregion

        //#region Documents

        $scope.documents = [];
        $scope.showDocuments = false;

        $scope.getDocuments = function () {
            MembersService.getDocuments(member.MemberID).then(
                function (result) {
                    if (result && result.data) {
                        $scope.documents = result.data;

                        if (AppParams.DEBUG) {
                            toastr.success('Dokumenti uspešno učitani.');
                        }

                        $scope.showDocuments = ($scope.documents.length > 0);
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške na serveru prilikom preuzimanja dokumenata.');
                    $scope.documents = [];
                    $scope.showDocuments = false;
                }
            );
        };
        //$scope.getDocuments();

        $scope.addDocument = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/members/member-doc-dialog/member-doc-dialog.html',
                controller: 'MemberDocDialogController',
                resolve: {
                    docTypes: function (DocumentsService) {
                        return DocumentsService.getDocTypesAsLookup().then(
                            function (result) {
                                return result.data;
                            }
                        );
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function (memberDocModel) {
                    memberDocModel.MemberID = member.MemberID;
                    memberDocModel.UserID = currentUser.UserID;

                    MembersService.addDocument(memberDocModel).then(
                        function () {
                            if (AppParams.DEBUG) {
                                toastr.success('Dokument uspešno dodat.');
                            }

                            $scope.getDocuments();
                        },
                        function (error) {
                            toastr.error('Došlo je do greške na serveru prilikom unosa dokumenta.');
                        }
                    );
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        //#endregion
    }
})();
