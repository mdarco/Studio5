(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('InstallmentsListDialogController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$location', '$uibModal', '$uibModalInstance', 'MembersService', 'UtilityService', 'AuthenticationService', 'toastr', 'installments', 'context'];

    function ctrlFn($rootScope, $scope, $location, $uibModal, $uibModalInstance, MembersService, UtilityService, AuthenticationService, toastr, installments, context) {
        const SEASON_START_MONTH_DAY = '09-01';

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.installments = installments.data || installments;
        $scope.installmentsSeasonOnly = $scope.installments.filter(item => {
            let seasonStartDate = (new Date()).getFullYear() + '-' + SEASON_START_MONTH_DAY;
            if (moment(item.InstallmentDate) >= moment(seasonStartDate)) {
                return item;
            }
        });

        $scope.member = context.member;

        $scope.installmentsFilter = 'seasonOnly';
        $scope.installmentsToDisplay = $scope.installmentsSeasonOnly;

        $scope.editInstallment = function (installment, dataField) {
            if (dataField !== 'IsCanceled' && dataField !== 'Note' && installment.IsCanceled) {
                toastr.warning('Plaćanje je deaktivirano.');
                return;
            }

            if (dataField === 'IsPaid' || dataField === 'IsCanceled') {
                // boolean fields
                var msg = null;
                var newFieldValue = null;

                if (dataField === 'IsPaid') {
                    if (!installment.IsPaid) {
                        msg = 'Potvrđujete plaćanje?';
                    } else {
                        msg = 'Poništavate plaćanje?';
                    }

                    newFieldValue = !installment.IsPaid;
                } else {
                    if (!installment.IsCanceled) {
                        msg = 'Deaktivirate plaćanje?';
                    } else {
                        msg = 'Aktivirate plaćanje?';
                    }

                    newFieldValue = !installment.IsCanceled;
                }

                bootbox.confirm({
                    message: msg,
                    buttons: {
                        confirm: {
                            label: 'Da',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'Ne',
                            className: 'btn-primary'
                        }
                    },
                    callback: function (confirmResult) {
                        if (confirmResult) {
                            var editObj = {};
                            editObj[dataField] = newFieldValue;

                            MembersService.editMemberPaymentInstallment($scope.member.MemberID, context.paymentID, installment.ID, editObj).then(
                                function () {
                                    toastr.success('Podatak uspešno ažuriran.');
                                    installment[dataField] = newFieldValue;

                                    if (newFieldValue) {
                                        installment.PaymentDate = new Date();
                                    } else {
                                        installment.PaymentDate = null;
                                    }
                                },
                                function (error) {
                                    toastr.error(error.statusText);
                                }
                            );
                        }
                    }
                });
            } else if (dataField === 'PaymentDate') {
                // date field
                if (!installment.IsPaid) {
                    toastr.warning('Plaćanje nije obavljeno.');
                    return;
                }

                openDateFieldDialog(dataField, installment[dataField]).then(
                    function (result) {
                        if (moment(result) < moment()) {
                            var firstDayOfMonth = moment().year() + '-' + (moment().month() + 1) + '-01';
                            if (moment(result) < moment(firstDayOfMonth)) {
                                toastr.warning('Datum plaćanja mora biti u okviru tekućeg meseca.');
                                return;
                            }
                        }

                        var editObj = {};
                        editObj[dataField] = result;

                        MembersService.editMemberPaymentInstallment($scope.member.MemberID, context.paymentID, installment.ID, editObj).then(
                            function () {
                                toastr.success('Podatak uspešno ažuriran.');
                                installment[dataField] = UtilityService.convertISODateStringToDate(result);
                            },
                            function (error) {
                                toastr.error(error.statusText);
                            }
                        );
                    },
                    function (error) { }
                );
            } else {
                // text field
                openTextFieldDialog(dataField, installment[dataField]).then(
                    function (result) {
                        var editObj = {};
                        editObj[dataField] = result;

                        MembersService.editMemberPaymentInstallment($scope.member.MemberID, context.paymentID, installment.ID, editObj).then(
                            function () {
                                toastr.success('Podatak uspešno ažuriran.');
                                installment[dataField] = result;
                            },
                            function (error) {
                                toastr.error(error.statusText);
                            }
                        );
                    },
                    function (error) { }
                );
            }
        };

        $scope.$watch('installmentsFilter', (newFilterValue) => {
            if (newFilterValue === 'seasonOnly') {
                $scope.installmentsToDisplay = $scope.installmentsSeasonOnly;
            }

            if (newFilterValue === 'all') {
                $scope.installmentsToDisplay = $scope.installments;
            }
        });

        $scope.resolveStatusCssClass = function (installment) {
            if (installment.IsPaid) {
                return 'label label-success';
            }

            if (!installment.IsPaid) {
                var today = moment(Date.now());
                var installmentDate = moment(installment.InstallmentDate);

                if (installmentDate > today) {
                    return 'label label-info';
                } else {
                    return 'label label-danger';
                }
            }
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        function openTextFieldDialog(dataField, text) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/text-field-dialog/text-field-dialog.html',
                controller: 'TextFieldDialogController',
                resolve: {
                    settings: function () {
                        return {
                            FieldValue: text,
                            DisplayTitle: 'T-Office',
                            FieldLabel: resolveDataFieldLabel(dataField)
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            return dialog.result;
        }

        function openDateFieldDialog(dataField, date) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/date-dialog/date-dialog.html',
                controller: 'DateDialogController',
                resolve: {
                    settings: function () {
                        return {
                            DisplayTitle: 'T-Office',
                            LabelTitle: 'Datum plaćanja',
                            DateValue: _.isDate(date) ? date : UtilityService.convertISODateStringToDate(date)
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            return dialog.result;
        }

        function resolveDataFieldLabel(dataField) {
            switch (dataField) {
                case 'PaymentDate':
                    return 'Datum plaćanja';

                case 'Note':
                    return 'Komentar';

                default:
                    return '';
            }
        }

        $scope.canAccessIsCanceled = function () {
            return currentUser.UserGroups.includes('ADMIN');
        };
    }
})();
