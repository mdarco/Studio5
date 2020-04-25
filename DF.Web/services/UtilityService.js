(function () {
    'use strict';

    angular
        .module('DFApp')
        .factory('UtilityService', serviceFn);

    serviceFn.$inject = ['$http', 'WebApiBaseUrl'];

    function serviceFn($http, WebApiBaseUrl) {
        var service = {
            convertISODateStringToDate: convertISODateStringToDate,
            convertDateToISODateString: convertDateToISODateString,
            getJsDateWeekDayNameInSerbian: getJsDateWeekDayNameInSerbian,

            arrayBufferToBase64: arrayBufferToBase64,
            dataURItoBlob: dataURItoBlob
        };

        return service;

        function convertISODateStringToDate(isoDateString) {
            if (isoDateString) {
                var isoDateParts = isoDateString.split('T');
                if (isoDateParts && isoDateParts[0]) {
                    var dateParts = isoDateParts[0].split('-');
                    if (dateParts && dateParts.length === 3) {
                        return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                    }
                }
            }
        }

        function convertDateToISODateString(date) {
            if (_.isDate(date)) {
                var year = date.getFullYear() + '';

                var month = date.getMonth() + 1 + '';
                if (month.length === 1) {
                    month = '0' + month;
                }

                var day = date.getDate() + '';
                if (day.length === 1) {
                    day = '0' + day;
                }

                return year + '-' + month + '-' + day;
            }
        }

        function getJsDateWeekDayNameInSerbian(date) {
            switch (date.getDay()) {
                case 0:
                    return 'nedelja';

                case 1:
                    return 'ponedeljak';

                case 2:
                    return 'utorak';

                case 3:
                    return 'sreda';

                case 4:
                    return 'četvrtak';

                case 5:
                    return 'petak';

                case 6:
                    return 'subota';
            }
        }

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;

            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            return window.btoa(binary);
        }

        function dataURItoBlob(dataURI) {
            // convert base64 to raw binary data held in a string
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var arrayBuffer = new ArrayBuffer(byteString.length);
            var _ia = new Uint8Array(arrayBuffer);
            for (var i = 0; i < byteString.length; i++) {
                _ia[i] = byteString.charCodeAt(i);
            }

            var dataView = new DataView(arrayBuffer);
            var blob = new Blob([dataView], { type: mimeString });
            return blob;
        }
    }
})();
