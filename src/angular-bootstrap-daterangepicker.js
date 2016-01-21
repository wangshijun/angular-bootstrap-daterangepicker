/**
 * @license angular-bootstrap-daterangepicker v0.0.1
 * (c) 2013 Luis Farzati http://github.com/wangshijun/angular-bootstrap-daterangepicker
 * License: MIT
 */
(function (angular) {
'use strict';

angular.module('angular-bootstrap-daterangepicker', []).directive('input', function ($compile, $parse) {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function ($scope, $element, $attributes, ngModelCtrl) {
            if ($attributes.type !== 'daterange' || ngModelCtrl === null ) return;

            var options = {};
            options.format = $attributes.format || 'YYYY-MM-DD';
            options.timeZone = $attributes.timeZone || 'Asia/Shanghai';
            options.separator = $attributes.separator || ' - ';
            options.minDate = $attributes.minDate && moment($attributes.minDate);
            options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
            options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
            options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
            options.locale = $attributes.locale && $parse($attributes.locale)($scope);
            options.opens = $attributes.opens && $parse($attributes.opens)($scope);
            options.timePicker = $attributes.timePicker && $parse($attributes.timePicker)($scope);
            options.timePickerIncrement = $attributes.timePickerIncrement && $parse($attributes.timePickerIncrement)($scope);
            options.timePicker12Hour = $attributes.timePicker12Hour && $parse($attributes.timePicker12Hour)($scope);
            options.singleDatePicker = $attributes.singleDatePicker && $parse($attributes.singleDatePicker)($scope);

            ngModelCtrl.$formatters.push(function (modelValue) {
                return modelValue ? [modelValue.startDate.format(options.format), modelValue.endDate.format(options.format)].join(options.separator) : '';
            });

            ngModelCtrl.$parsers.push(function (viewValue) {
                var dates = viewValue.split(options.separator);
                return viewValue ? { startDate: moment(dates[0]), endDate: moment(dates[1]) } : null;
            });

            $scope.$watch($attributes.ngModel, function (modelValue) {
                if (!modelValue || !modelValue.startDate || !modelValue.endDate) {
                    return;
                }
                $element.data('daterangepicker').setStartDate(modelValue.startDate);
                $element.data('daterangepicker').setEndDate(modelValue.endDate);
            });

            $scope.$on('daterangepicker.rangeschange', function () {
                options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
                $element.data('daterangepicker').setOptions(options);
            });

            $element.daterangepicker(options, function(start, end) {
                $scope.$apply(function () {
                    ngModelCtrl.$setViewValue({ startDate: start, endDate: end });
                    ngModelCtrl.$render();
                });
            });
        }
    };
});

})(angular);
