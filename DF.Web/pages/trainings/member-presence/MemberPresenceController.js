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

        $scope.resolveOnlineStatusCss = function (item) {
            if (item.IsOnline) {
                return 'label label-info';
            }
        };

        $scope.toggleStatus = function (item) {
            let updateStatusObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                IsPresent: !item.IsPresent
            };

            if (!updateStatusObj.IsPresent) {
                updateStatusObj.IsOnline = false;
            }

            TrainingsService.updateMemberPresence(updateStatusObj).then(() => {
                toastr.success('Status izmenjen.');

                item.IsPresent = !item.IsPresent;
                if (item.IsPresent) {
                    item.AbsenceJustified = true;
                    item.AbsenceNote = null;
                } else {
                    item.IsOnline = false;
                }
            });
        };

        $scope.toggleOnlineStatus = function (item) {
            let updateOnlineStatusObj = {
                TrainingID: item.TrainingID,
                MemberID: item.MemberID,
                IsOnline: !item.IsOnline
            };

            if (!item.IsPresent && updateOnlineStatusObj.IsOnline) {
                toastr.warning('Plesač nije prisutan!');
                return;
            }

            TrainingsService.updateMemberPresence(updateOnlineStatusObj).then(() => {
                toastr.success('Onlline status izmenjen.');
                item.IsOnline = !item.IsOnline;
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
            TrainingsService.get(trainingID).then((t) => {
                openTextFieldDialog(t.data.Note).then(
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
            });
        };

        $scope.getPresentMembersCount = function () {
            return memberPresenceList.filter(item => item.IsPresent).length;
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
