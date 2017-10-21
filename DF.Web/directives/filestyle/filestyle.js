(function () {
    'use strict';

    angular
        .module('DFApp')
        .directive('filestyle', function () {
            return {
                restrict: 'AC',
                scope: true,
                link: function (scope, element, attrs) {
                    var options = {
                        'input': attrs.input === 'false' ? false : true,
                        'icon': attrs.icon === 'false' ? false : true,
                        'buttonBefore': attrs.buttonBefore === 'true' ? true : false,
                        'disabled': attrs.disabled === 'true' ? true : false,
                        'size': attrs.size,
                        'buttonText': attrs.buttonText,
                        'buttonName': attrs.buttonName,
                        'iconName': attrs.iconName,
                        'badge': attrs.badge === 'false' ? false : true,
                        'placeholder': attrs.placeholder
                    };
                    $(element).filestyle(options);
                }
            };
        });
})();
