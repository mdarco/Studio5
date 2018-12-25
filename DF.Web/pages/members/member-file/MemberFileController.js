(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('MemberFileController', ctrlFn);

    ctrlFn.$inject = ['$rootScope', '$scope', '$q', '$location', '$timeout', '$uibModal', 'MembersService', 'UtilityService', 'AuthenticationService', 'WebApiBaseUrl', 'toastr', 'AppParams', 'member'];

    function ctrlFn($rootScope, $scope, $q, $location, $timeout, $uibModal, MembersService, UtilityService, AuthenticationService, WebApiBaseUrl, toastr, AppParams, member) {
        // set active menu item
        $("#left-panel nav ul li").removeClass("active");
        $("#menuHome").addClass("active");

        var currentUser = AuthenticationService.getCurrentUser();

        $scope.webApiBaseUrl = WebApiBaseUrl;

        $scope.member = member;
        if (!member.ProfileImage) {
            member.ProfileImage = 'Content/img/no-photo.png';
        } else {
            // fix image orientation if needed
            var imageBlob = UtilityService.dataURItoBlob(member.ProfileImage);
            EXIF.getData(imageBlob, function () {
                var orientation = EXIF.getTag(this, "Orientation");
                switch (orientation) {
                    case 3:
                        angular.element('imgProfileImage').css('transform', 'rotate(180deg)');
                        break;

                    case 6:
                        angular.element('imgProfileImage').css('transform', 'rotate(90deg)');
                        break;

                    case 8:
                        angular.element('imgProfileImage').css('transform', 'rotate(270deg)');
                        break;
                }
            });
        }

        //#region Access rights

        $scope.canAccess = function (type) {
            switch (type.toLowerCase()) {
                case 'member-payments-tab':
                    if (_.includes(currentUser.UserGroups, 'ADMIN')) {
                        return true;
                    }

                    var userPaymentAbilityDanceGroups = currentUser.UserDanceGroups.filter((userDanceGroup) => {
                        return userDanceGroup.HasPaymentAbility === true;
                    }).map((g) => {
                        return g.DanceGroupName.toLowerCase();
                    });
                    var memberDanceGroups = $scope.member.DanceGroups.map((g) => {
                        return g.DanceGroupName.toLowerCase();
                    });
                    return _.intersection(userPaymentAbilityDanceGroups, memberDanceGroups).length > 0;
            }
        };

        //#endregion

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

                case 'ProfileImage':
                    MembersService.edit(member.MemberID, { ProfileImage: $scope.member.ProfileImage }).then(
                        function () {
                            if (AppParams.DEBUG) {
                                toastr.success('Plesač uspešno ažuriran.');
                            }
                        },
                        function (error) {
                            toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                        }
                    );
                    break;

                case 'FirstName':
                    openTextFieldDialog($scope.member.FirstName).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { FirstName: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.FirstName = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'LastName':
                    openTextFieldDialog($scope.member.LastName).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { LastName: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.LastName = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'JMBG':
                    openTextFieldDialog($scope.member.JMBG).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { JMBG: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.JMBG = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'BirthDate':
                    openDateFieldDialog(UtilityService.convertISODateStringToDate($scope.member.BirthDate)).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { BirthDate: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.BirthDate = UtilityService.convertISODateStringToDate(result);
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'BirthPlace':
                    openTextFieldDialog($scope.member.BirthPlace).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { BirthPlace: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.BirthPlace = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'AgeCategory':
                    openComboFieldDialog($scope.member.AgeCategoryID).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { AgeCategoryID: result.Value }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.AgeCategoryID = result.Value;
                                    $scope.member.AgeCategory = result.ValueText;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Address':
                    openTextFieldDialog($scope.member.ContactData.Address).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { ContactData: { Address: result } }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.ContactData.Address = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Email':
                    openTextFieldDialog($scope.member.ContactData.Email).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { ContactData: { Email: result } }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.ContactData.Email = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Phone1':
                    openTextFieldDialog($scope.member.ContactData.Phone1).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { ContactData: { Phone1: result } }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.ContactData.Phone1 = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Phone2':
                    openTextFieldDialog($scope.member.ContactData.Phone2).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { ContactData: { Phone2: result } }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.ContactData.Phone2 = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Phone3':
                    openTextFieldDialog($scope.member.ContactData.Phone3).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { ContactData: { Phone3: result } }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.ContactData.Phone3 = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
                    break;

                case 'Note':
                    openTextFieldDialog($scope.member.Note).then(
                        function (result) {
                            MembersService.edit(member.MemberID, { Note: result }).then(
                                function () {
                                    if (AppParams.DEBUG) {
                                        toastr.success('Plesač uspešno ažuriran.');
                                    }
                                    $scope.member.Note = result;
                                },
                                function (error) {
                                    toastr.error('Došlo je do greške na serveru prilikom ažuriranja.');
                                }
                            );
                        }
                    );
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

                if (!_.includes(AppParams.IMAGE_FILE_TYPES, file.type)) {
                    toastr.warning('Niste izabrali sliku.');
                    return;
                }

                var fileReader = new FileReader();

                var size = file.size;
                var chunk_size = 1024000;
                var chunks = [];

                var offset = 0;
                var chunk_length = 0;

                fileReader.onloadend = function (event) {
                    if (event.target.readyState == FileReader.DONE) {
                        var chunk = event.target.result;
                        chunk_length += chunk.length;
                        chunks.push(chunk);

                        if (offset < size) {
                            offset += chunk_size;

                            var file_slice = file.slice(offset, offset + chunk_size);
                            fileReader.readAsArrayBuffer(file_slice);
                        } else {
                            var fileData = [], fileDataSize = 0;
                            _.each(chunks, c => {
                                var base64chunk = UtilityService.arrayBufferToBase64(c);
                                fileData.push(base64chunk);
                                fileDataSize += base64chunk.length;
                            });

                            if (fileDataSize > AppParams.IMAGE_BASE64_SIZE_LIMIT) {
                                toastr.warning('Slika je prevelika.');
                                return;
                            }

                            $timeout(function () {
                                $scope.member.ProfileImage = 'data:' + file.type + ';base64,' + fileData.join(''); // create dataURL

                                EXIF.getData(file, function () {
                                    var orientation = EXIF.getTag(this, "Orientation");
                                    switch (orientation) {
                                        case 3:
                                            angular.element('imgProfileImage').css('transform', 'rotate(180deg)');
                                            break;

                                        case 6:
                                            angular.element('imgProfileImage').css('transform', 'rotate(90deg)');
                                            break;

                                        case 8:
                                            angular.element('imgProfileImage').css('transform', 'rotate(270deg)');
                                            break;
                                    }
                                    $scope.editMember('ProfileImage');
                                });
                            }, 1000);
                        }
                    }
                };

                var file_slice = file.slice(offset, offset + chunk_size);
                fileReader.readAsArrayBuffer(file_slice);
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

        $scope.previewDocument = function (doc) {
            var dialogOpts = {
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/doc-preview-dialog/doc-preview-dialog.html',
                controller: 'DocPreviewDialogController',
                resolve: {
                    settings: function () {
                        return {
                            // TODO: get doc as byte64 string
                            //string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);
                            //var pdfUrl = "data:application/pdf;base64," + base64String;
                            DocUrl: 'https://pdfobject.com/pdf/sample-3pp.pdf'
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {

                },
                function () {
                    // modal dismissed
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
                    // modal dismissed
                    $scope.getDocuments();
                }
            );
        };

        $scope.deleteDocument = function (doc) {
            bootbox.confirm({
                message: "Da li ste sigurni?",
                buttons: {
                    confirm: {
                        label: 'Da',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Ne',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        // delete doc
                        MembersService.deleteDocument($scope.member.MemberID, doc).then(
                            () => {
                                toastr.success('Dokument uspešno obrisan.');
                                $scope.getDocuments();
                            },
                            (error) => {
                                toastr.error('Došlo je do greške prilikom brisanja dokumenta.');
                            }
                        );
                    }
                }
            });
        };

        $scope.resolveDocumentCssClass = function (doc) {
            if ($scope.documents.length > 0) {
                if (doc.Metadata.ExpiryDate) {
                    var today = moment(Date.now());
                    var expiryDate = moment(doc.Metadata.ExpiryDate);

                    if (expiryDate < today) {
                        return 'df-alert-row';
                    }
                }
            }

            return '';
        };

        //#endregion

        //#region Dance groups

        $scope.danceGroups = [];
        $scope.showDanceGroups = false;

        $scope.getDanceGroups = function () {
            MembersService.getDanceGroups(member.MemberID).then(
                function (result) {
                    if (result && result.data) {
                        $scope.danceGroups = result.data;

                        if (AppParams.DEBUG) {
                            toastr.success('Grupe uspešno učitane.');
                        }

                        $scope.showDanceGroups = ($scope.danceGroups.length > 0);
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške na serveru prilikom preuzimanja grupa.');
                    $scope.danceGroups = [];
                    $scope.showDanceGroups = false;
                }
            );
        };

        $scope.selectDanceGroups = function () {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/tags-dialog/tags-dialog.html',
                controller: 'TagsDialogController',
                resolve: {
                    settings: function () {
                        return {
                            DisplayTitle: 'Grupe',
                            LabelTitle: 'Izaberite grupe',
                            DisplayProperty: 'Name',
                            KeyProperty: 'ID',
                            AddFromAutocompleteOnly: true
                        };
                    },
                    allTags: function (DanceGroupsService) {
                        return DanceGroupsService.getLookup().then(response => {
                            if (response && response.data) {
                                if (!currentUser.UserGroups.includes('ADMIN')) {
                                    var currentUserDanceGroups = currentUser.UserDanceGroups.map(userGroup => {
                                        return userGroup.DanceGroupID;
                                    });

                                    return response.data.filter(group => {
                                        return currentUserDanceGroups.includes(group.ID);
                                    });
                                } else {
                                    return response.data;
                                }
                            }
                            return null;
                        });
                    },
                    tags: function () {
                        var selectedDanceGroups = _.map($scope.danceGroups, function (item) {
                            return {
                                ID: item.DanceGroupID,
                                Name: item.DanceGroupName
                            };
                        });

                        return angular.copy(selectedDanceGroups);
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function (danceGroups) {
                    var model = _.map(danceGroups, function (item) {
                        return {
                            MemberID: member.MemberID,
                            DanceGroupID: item.ID
                        };
                    });

                    MembersService.updateDanceGroups(member.MemberID, model).then(
                        function () {
                            toastr.success('Grupe uspešno ažurirane.');
                            $scope.getDanceGroups();
                        },
                        function (error) {
                            toastr.error('Došlo je do greške na serveru prilikom ažuriranja grupa.');
                        }
                    );
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        //#endregion

        //#region Payments

        $scope.memberPayments = [];
        $scope.showPayments = false;

        $scope.getMemberPayments = function () {
            MembersService.getMemberPayments(member.MemberID).then(
                function (result) {
                    if (result && result.data) {
                        $scope.memberPayments = result.data;

                        if (AppParams.DEBUG) {
                            toastr.success('Plaćanja uspešno učitana.');
                        }

                        $scope.showPayments = ($scope.memberPayments.length > 0);
                    }
                },
                function (error) {
                    toastr.error('Došlo je do greške na serveru prilikom preuzimanja spiska plaćanja.');
                    $scope.memberPayments = [];
                    $scope.showPayments = false;
                }
            );
        };

        $scope.addMemberPayment = function () {
            var regularTransformFn = function (data) {
                return data;
            };

            var colTypeTransformFn = function (data) {
                return (data === 'ONE-TIME') ? 'Jednokratno' : 'Mesečno';
            };

            var colNumberOfInstallmentsTransformFn = function (data) {
                if (!data) {
                    return ' - ';
                }

                return data;
            };

            var paymentsTableStructure = {
                header: ['Naziv', 'Iznos', 'Valuta', 'Tip', 'Br. rata', 'Opis'],
                data: ['Name', 'Amount', 'Currency', 'Type', 'NumberOfInstallments', 'Description'],
                idCol: 'ID',
                dataTransformationFn: {
                    Name: regularTransformFn,
                    Amount: regularTransformFn,
                    Currency: regularTransformFn,
                    Type: colTypeTransformFn,
                    NumberOfInstallments: colNumberOfInstallmentsTransformFn,
                    Description: regularTransformFn
                }
            };

            var dialogOpts = {
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                backdropClick: false,
                templateUrl: 'pages/members/member-payment-dialog/member-payment-dialog.html',
                controller: 'MemberPaymentDialogController',
                resolve: {
                    tableStructure: function () {
                        return paymentsTableStructure;
                    },
                    tableData: function (PaymentsService) {
                        // first exclude already assigned payments
                        var excludeID = _.map($scope.memberPayments, mp => {
                            return mp.Payment.ID;
                        });

                        return PaymentsService.getFiltered({ ExcludeID: excludeID, IsActive: true });
                    },
                    additionalChkboxCol: function () {
                        return null;
                    },
                    tableSelectedData: function () {
                        var payments = _.map($scope.memberPayments, mp => {
                            return mp.Payment;
                        });

                        return _.cloneDeep(payments);
                    },
                    viewSettings: function () {
                        return {
                            dialogTitle: `${$scope.member.FirstName} ${$scope.member.LastName} - novo plaćanje`
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function (models) {
                    MembersService.addMemberPaymentBulk($scope.member.MemberID, models).then(
                        () => {
                            if (AppParams.DEBUG) {
                                toastr.success('Plaćanja uspešno dodeljena.');
                                $scope.getMemberPayments();
                            }
                        },
                        error => {
                            toastr.error('Došlo je do greške prilikom dodeljivanja plaćanja.');
                            toastr.error(error.statusText);
                        }
                    );
                },
                function () {
                    // modal dismissed => do nothing
                }
            );
        };

        $scope.deleteMemberPayment = function (memberPayment) {
            bootbox.confirm({
                message: 'Da li ste sigurni?',
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
                        MembersService.deleteMemberPayment(memberPayment.MemberID, memberPayment.ID).then(
                            () => {
                                if (AppParams.DEBUG) {
                                    toastr.success('Plaćanje uspešno obrisano.');
                                }

                                $scope.getMemberPayments();
                            },
                            error => {
                                toastr.error('Plaćanje se ne može izbrisati - nisu sve rate poništene.');
                            }
                        );
                    }
                }
            });
        };

        $scope.showInstallments = function (memberPayment) {
            var dialogOpts = {
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/members/installments-list-dialog/installments-list-dialog.html',
                controller: 'InstallmentsListDialogController',
                resolve: {
                    installments: function () {
                        return memberPayment.Installments;
                    },
                    context: function () {
                        return {
                            member: angular.copy($scope.member),
                            paymentID: memberPayment.ID
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            dialog.result.then(
                function () {

                },
                function () {
                    // modal dismissed
                }
            );
        };

        $scope.resolveMemberPaymentCssClass = function (memberPayment) {
            var installments = memberPayment.Installments;

            if (installments && installments.length > 0) {
                var isProblematic = false;
                var isCompleted = true;

                // 'return false;' breaks the _.each() loop
                _.each(installments, installment => {
                    if (!installment.IsPaid && !installment.IsCanceled) {
                        isCompleted = false;

                        if (!isProblematic) {
                            var today = moment(Date.now());
                            var installmentDate = moment(installment.InstallmentDate);

                            if (installmentDate < today) {
                                isProblematic = true;
                            }
                        }
                    }
                });

                if (isProblematic) {
                    return 'df-alert-row';
                }

                if (isCompleted) {
                    return 'df-ok-row';
                }
            }

            return '';
        };

        //#endregion

        //#region Helpers

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

        function openDateFieldDialog(date) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/date-dialog/date-dialog.html',
                controller: 'DateDialogController',
                resolve: {
                    settings: function () {
                        return {
                            DisplayTitle: 'Datum rođenja',
                            LabelTitle: 'Izaberite datum rođenja',
                            DateValue: date
                        };
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            return dialog.result;
        }

        function openComboFieldDialog(value) {
            var dialogOpts = {
                backdrop: 'static',
                keyboard: false,
                backdropClick: false,
                templateUrl: 'pages/common/combo-dialog/combo-dialog.html',
                controller: 'ComboDialogController',
                resolve: {
                    settings: function () {
                        return {
                            DisplayTitle: 'Uzrast',
                            ComboLabel: 'Izaberite uzrast',
                            FieldMappings: {
                                idField: 'ID',
                                displayTextField: 'Name'
                            },
                            HideNote: true,
                            ComboValue: value
                        };
                    },
                    comboValues: function (LookupsService) {
                        return LookupsService.getAgeCategories();
                    }
                }
            };

            var dialog = $uibModal.open(dialogOpts);

            return dialog.result;
        }

        $scope.backToSearch = function () {
            $location.path('/members').search({ back: true });
        };

        //#endregion
    }
})();
