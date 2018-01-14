(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberFileController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$timeout', '$uibModal', 'MembersService', 'DocumentsService', 'UtilityService', 'AuthenticationService', 'WebApiBaseUrl', 'toastr', 'AppParams', 'member'];

    function ctrlFn($rootScope, $scope, $location, $timeout, $uibModal, MembersService, DocumentsService, UtilityService, AuthenticationService, WebApiBaseUrl, toastr, AppParams, member) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;

        $scope.member = member;
        if (!member.ProfileImage) {
            member.ProfileImage = 'Content/img/no-photo.png';
        }

        //#region Basic data

        $scope.editMember = function (dataType) {
            switch (dataType) {
                case 'IsActive':
                    var msg_IsActive = $scope.member.IsActive ? 'Deaktivirati plesača?' : 'Aktivirati plesača?';
                    bootbox.confirm({
                        message: msg_IsActive,
                        buttons: {
                            confirm: {
                                label: 'Da',
                                className: 'btn-primary'
                            },
                            cancel: {
                                label: 'Ne',
                                className: 'btn-default'
                            }
                        },
                        callback: function (result) {
                            if (result) {
                                MembersService.edit(member.MemberID, { IsActive: !$scope.member.IsActive }).then(
                                    function () {
                                        if (AppParams.DEBUG) {
                                            toastr.success('Plesač uspešno ažuriran.');
                                        }
                                        $scope.member.IsActive = !$scope.member.IsActive;
                                    },
                                    function (error) {
                                        toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                    }
                                );
                            }
                        }
                    });
                    break;

                case 'IsCompetitor':
                    var msg_IsCompetitor = $scope.member.IsCompetitor ? 'Prebaciti plesača u rekreativce?' : 'Prebaciti plesača u takmičare?';
                    bootbox.confirm({
                        message: msg_IsCompetitor,
                        buttons: {
                            confirm: {
                                label: 'Da',
                                className: 'btn-primary'
                            },
                            cancel: {
                                label: 'Ne',
                                className: 'btn-default'
                            }
                        },
                        callback: function (result) {
                            if (result) {
                                MembersService.edit(member.MemberID, { IsCompetitor: !$scope.member.IsCompetitor }).then(
                                    function () {
                                        if (AppParams.DEBUG) {
                                            toastr.success('Plesač uspešno ažuriran.');
                                        }
                                        $scope.member.IsCompetitor = !$scope.member.IsCompetitor;
                                    },
                                    function (error) {
                                        toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                    }
                                );
                            }
                        }
                    });
                    break;

                default:
                    alert('Work in progress..');
                    break;
            }
        };

        $scope.triggerUploadProfileImage = function () {
            $('#uploadProfileImage').trigger('click');
        };

        // profile image select event
        $('#uploadProfileImage').change(function () {
            var f = document.getElementById('uploadProfileImage');
            if (!f.files[0]) {
                return;
            } else {
                var file = f.files[0];

                var fileReader = new FileReader();
                fileReader.onloadend = function (event) {
                    var fileData = event.target.result; // file data URL
                    //_save({ DataUrl: fileData, FileName: file.name });

                    $timeout(function () { member.ProfileImage = fileData; }, 1000);
                };

                fileReader.readAsDataURL(file);
            }
        });

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
                    },
                    memberID: function () {
                        return member.MemberID;
                    },
                    userID: function () {
                        return currentUser.UserID;
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {
                    $scope.getDocuments();
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        //#endregion
    }
})();
