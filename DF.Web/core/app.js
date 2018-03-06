(function () {
    'use strict';

    Dropzone.autoDiscover = false;

    var app = angular.module('DFApp', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        //'checklist-model',
        'abnTree',
        'blockUI',
        'ngTable',
        'UserAuth',
        'base64',
        'angularUUID2',
        //'ivh.treeview',
        'toastr',
        'sprintf',
		'ngFileSaver',
        'ngTagsInput',
        'thatisuday.dropzone',
        'purplefox.numeric',
        'ngCacheBuster'
    ]);
})();
