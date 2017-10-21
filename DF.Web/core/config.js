(function () {
    'use strict';

    angular
        .module('DFApp')
        .config(configFn);

    configFn.$inject = ['$locationProvider', 'blockUIConfig', 'tagsInputConfigProvider'];

    function configFn($locationProvider, blockUIConfig, tagsInputConfigProvider) {
        $locationProvider.hashPrefix('');

        // angular-block-ui config
        blockUIConfig.message = 'Molim Vas, sačekajte...';

        tagsInputConfigProvider
            .setDefaults('tagsInput', {
                placeholder: ''
            });
    }
})();
