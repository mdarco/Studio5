(function () {
  'use strict';

  angular
      .module('DFApp')
      .controller('PaymentDialogController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'PaymentsService', 'UtilityService', 'toastr'];

  function ctrlFn($rootScope, $scope, $uibModalInstance, PaymentsService, UtilityService, toastr) {
      $scope.model = {};

      $scope.paymentTypes = [
          { Name: 'Jednokratno', ID: 'ONE-TIME' },
          { Name: 'Mesečno', ID: 'Monthly' }
      ];

      $scope.paymentCurrencies = [
          { Name: 'RSD', ID: 'RSD' },
          { Name: 'EUR', ID: 'EUR' }
      ];

      $scope.save = function () {
          var modelValidation = validate();
          if (modelValidation.error) {
              toastr.warning(modelValidation.errorMsg);
              return;
          }

          //$scope.model.DueDate = UtilityService.convertDateToISODateString($scope.model.DueDatePicker);

          PaymentsService.addPayment($scope.model).then(
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
        if (!$scope.model.Name || ($scope.model.Name && $scope.model.Name === '')) {
            return { error: true, errorMsg: 'Naziv je obavezan podatak.' };
        }

        if (!$scope.model.Type || ($scope.model.Type && $scope.model.Type === '')) {
            return { error: true, errorMsg: 'Tip plaćanja je obavezan podatak.' };
        }

        if (!$scope.model.Currency || ($scope.model.Currency && $scope.model.Currency === '')) {
            return { error: true, errorMsg: 'Valuta je obavezan podatak.' };
        }

        if (!$scope.model.Amount || ($scope.model.Amount && $scope.model.Amount === '')) {
            return { error: true, errorMsg: 'Iznos je obavezan podatak.' };
        } else {
            if (!$.isNumeric($scope.model.Amount)) {
                return { error: true, errorMsg: 'Iznos nije ispravan.' };
            }
        }

        if (!$scope.model.DueDate || ($scope.model.DueDate && $scope.model.DueDate === '')) {
            return { error: true, errorMsg: 'Rok za plaćanje je obavezan podatak.' };
        }

        // additional checks
        if (!moment($scope.model.DueDate + 'T00:00:00', moment.ISO_8601).isValid()) {
            return { error: true, errorMsg: 'Rok za plaćanje nije ispravan datum.' };
        }

        if (moment($scope.model.DueDate + 'T00:00:00', moment.ISO_8601) < moment(new Date())) {
            return { error: true, errorMsg: 'Rok za plaćanje ne može biti u prošlosti.' };
        }

        if ($scope.model.InstallmentAmounts && $scope.model.InstallmentAmounts !== '') {
            var installmentAmounts = $scope.model.InstallmentAmounts.split(';');

            if (installmentAmounts.length !== parseInt($scope.model.NumberOfInstallments)) {
                return { error: true, errorMsg: 'Broj iznosa za rate se ne poklapa sa brojem rata.' };
            }

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

            if (!companion.CompanionName || (companion.CompanionName && companions.CompanionName === '')) {
                return { error: true, errorMsg: 'Naziv pratioca je obavezan ako je zadat iznos za pratioca.' };
            }

            if ($scope.model.InstallmentAmountsForCompanion && $scope.model.InstallmentAmountsForCompanion !== '') {
                var installmentAmountsForCompanion = $scope.model.InstallmentAmountsForCompanion.split(';');

                if (installmentAmountsForCompanion.length !== parseInt($scope.model.NumberOfInstallments)) {
                    return { error: true, errorMsg: 'Broj iznosa za rate pratioca se ne poklapa sa brojem rata.' };
                }

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
              case 'error_payments_name_exists':
                  toastr.error('Plaćanje sa datim nazivom već postoji.');
                  break;

              default:
                  toastr.error('Došlo je do greške na serveru prilikom unosa novog plaćanja.');
                  break;
          }
      }

      // date picker support
      //$scope.datePickers = {};
      $scope.openDatePicker = function (pickerFor, event) {
          event.preventDefault();
          event.stopPropagation();

          $scope['datePickerOpened_' + pickerFor] = true;
      };
  }
})();
