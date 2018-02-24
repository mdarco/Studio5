(function () {
  'use strict';

  angular
      .module('DFApp')
      .controller('PaymentDialogController', ctrlFn);

  ctrlFn.$inject = ['$scope', '$uibModalInstance', 'PaymentsService', 'UtilityService', 'toastr'];

  function ctrlFn($scope, $uibModalInstance, PaymentssService, UtilityService, toastr) {
      $scope.model = {
          Companions: []
      };

      $scope.save = function () {
          var modelValidation = validate();
          if (modelValidation.error) {
              toastr.warning(modelValidation.errorMsg);
              return;
          }

          // adjust birth date for transfer
          $scope.model.DueDate = UtilityService.convertDateToISODateString($scope.model.DueDatePicker);

          PaymentsService.create($scope.model).then(
              function () {
                  toastr.success('Plaćanje uspešno sačuvano.');
                  $uibModalInstance.close();
              },
              function (error) {
                  resolveErrorMessage(error);
              }
          );
      };

      $scope.close = function () {
          $uibModalInstance.dismiss();
      };

      // helpers
      function validate() {
        // mandatory fields
        if (!$scope.model.Name || ($scope.model.Name && $scope.member.Name === '')) {
            return { error: true, errorMsg: 'Naziv je obavezan podatak.' };
        }

        if (!$scope.model.Type || ($scope.model.Type && $scope.member.Type === '')) {
            return { error: true, errorMsg: 'Tip plaćanja je obavezan podatak.' };
        }

        if (!$scope.model.Currency || ($scope.model.Currency && $scope.member.Currency === '')) {
            return { error: true, errorMsg: 'Valuta je obavezan podatak.' };
        }

        if (!$scope.model.Amount || ($scope.model.Amount && $scope.member.Amount === '')) {
            return { error: true, errorMsg: 'Iznos je obavezan podatak.' };
        } else {
            if (!$.isNumeric($scope.model.Amount)) {
                return { error: true, errorMsg: 'Iznos nije ispravan.' };
            }
        }

        if (!$scope.model.DueDatePicker || ($scope.model.DueDatePicker && $scope.member.DueDatePicker === '')) {
            return { error: true, errorMsg: 'Rok za plaćanje je obavezan podatak.' };
        }

        // additional checks
        if ($scope.model.InstallmentAmounts && $scope.model.InstallmentAmounts !== '') {
            var installmentAmounts = $scope.model.InstallmentAmounts.split(';');
            if (installmentAmounts && installmentAmounts.length > 0) {
                var sum = 0.0;
                _.each(installmentAmounts, (amount) => {
                    if ($.isNumeric(amount)) {
                        sum += (+(amount));
                    } else {
                        return false; // break _.each() loop
                    }
                });

                if (sum < parseFloat($scope.model.Amount)) {
                    return { error: true, errorMsg: 'Suma iznosa rata nije jednaka ukupnoj sumi za plaćanje.' };
                }
            }
        }

        if ($scope.model.AmountForCompanion && $scope.model.AmountForCompanion !== '') {
            if (!$.isNumeric($scope.model.AmountForCompanion)) {
                return { error: true, errorMsg: 'Iznos za pratioca nije ispravan.' };
            }

            if (!$scope.model.Companions.CompanionName || ($scope.model.Companions.CompanionName && $scope.model.Companions.CompanionName === '')) {
                return { error: true, errorMsg: 'Naziv pratioca je obavezan ako je zadat iznos za pratioca.' };
            }

            if ($scope.model.InstallmentAmountsForCompanion && $scope.model.InstallmentAmountsForCompanion !== '') {
                var installmentAmountsForCompanion = $scope.model.InstallmentAmountsForCompanion.split(';');
                if (installmentAmountsForCompanion && installmentAmountsForCompanion.length > 0) {
                    var sum = 0.0;
                    _.each(installmentAmountsForCompanion, (amountForCompanion) => {
                        if ($.isNumeric(amountForCompanion)) {
                            sum += (+(amountForCompanion));
                        } else {
                            return false; // break _.each() loop
                        }
                    });
    
                    if (sum < parseFloat($scope.model.AmountForCompanion)) {
                        return { error: true, errorMsg: 'Suma iznosa rata za pratioca nije jednaka ukupnoj sumi za plaćanje za pratioca.' };
                    }
                }
            }
        }

        return { error: false };
      }

      function resolveErrorMessage(error) {
          switch (error.statusText) {
              case 'error_members_jmbg_exists':
                  toastr.error('Plaćanje sa datim nazivom već postoji.');
                  break;

              default:
                  toastr.error('Došlo je do greške na serveru prilikom unosa novog plaćanja.');
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
