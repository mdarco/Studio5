(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberPresenceController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$location', '$uibModal', 'TrainingsService', 'AuthenticationService', 'toastr', 'memberPresenceList'];

    function ctrlFn($scope, $location, $uibModal, TrainingsService, AuthenticationService, toastr, memberPresenceList) {
        // var currentUser = AuthenticationService.getCurrentUser();

        var trainingID = null;
        var urlParts = $location.url().split('/');
        if (urlParts && urlParts.length > 0) {
            trainingID = parseInt(urlParts[urlParts.length - 1]);
        }

        $scope.memberPresenceList = memberPresenceList;
        $scope.showGrid = (memberPresenceList && memberPresenceList.length > 0);

        $scope.resolveAbsenceJustifiedDisplayText = function (item) {
            if (!item.IsPresent && item.AbsenceJustified === true) {
                return 'Da';
            }

            if (!item.IsPresent && item.AbsenceJustified === false) {
                return 'Ne';
            }
        };

        $scope.resolveStatusCss = function (item) {
            if (item.IsPresent) {
                return 'label label-success';
            }

            if (!item.IsPresent) {
                if (item.AbsenceJustified) {
                    return 'label label-primary';
                } else {
                    return 'label label-danger';
                }
            }
        };

        $scope.toggleStatus = function (item) {
            let updateStatusObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                IsPresent: !item.IsPresent
            };

            TrainingsService.updateMemberPresence(updateStatusObj).then(() => {
                toastr.success('Status izmenjen.');

                item.IsPresent = !item.IsPresent;
                if (item.IsPresent) {
                    item.AbsenceJustified = true;
                    item.AbsenceNote = null;
                }
            });
        };

        $scope.toggleAbsenceJustified = function (item) {
            let updateObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                AbsenceJustified: !item.AbsenceJustified
            };

            TrainingsService.updateMemberPresence(updateObj).then(() => {
                toastr.success('Status izostanka izmenjen.');
                item.AbsenceJustified = !item.AbsenceJustified;
            });
        };

        $scope.editAbsenceNote = function (item) {
            openTextFieldDialog(item.AbsenceNote).then(
                function (result) {
                    let updateObj = {
                        TrainingID: item.TrainingID,
                        MemberID: item.MemberID,
                        AbsenceNote: result
                    };

                    TrainingsService.updateMemberPresence(updateObj).then(() => {
                        toastr.success('Komentar je izmenjen.');
                        item.AbsenceNote = result;
                    });
                }
            );
        };

        $scope.editTrainingComment = function () {
            openTextFieldDialog().then(
                function (result) {
                    let updateObj = {
                        TrainingID: trainingID,
                        Note: result
                    };

                    TrainingsService.edit(updateObj).then(() => {
                        toastr.success('Komentar je izmenjen.');
                    });
                }
            );
        };

        // helpers
        function openTextFieldDialog(text) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/text-field-dialog/text-field-dialog.html',
                controller: 'TextFieldDialogController',
                resolve: {
                    settings: function () {
                        return {
                            FieldValue: text
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            return dialog.result;
        }

        $scope.backToSearch = function () {
            $location.path('/trainings').search({ back: true });
        };
    }
})();
