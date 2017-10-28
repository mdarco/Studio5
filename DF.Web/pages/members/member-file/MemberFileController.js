(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberFileController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', 'MembersService', 'AuthenticationService', 'AppParams', 'member'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, MembersService, AuthenticationService, AppParams, member) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.member = member;

        //#region Basic data

        $scope.editMember = function (dataType) {
            alert('Work in progress..');
        };

        //#endregion

        //#region Documents

        $scope.documents = [];

        $scope.getDocuments();
        $scope.getDocuments = function () {
            MembersService.getDocuments(member.MemberID).then(
                function (result) {
                    if (result && result.data) {
                        $scope.documents = result.data;

                        if (AppParams.DEBUG) {
                            toastr.success('Dokumenti uspešno učitani.');
                        }
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške na serveru prilikom preuzimanja dokumenata.');
                }
            );
        };

        //#endregion
    }
})();
