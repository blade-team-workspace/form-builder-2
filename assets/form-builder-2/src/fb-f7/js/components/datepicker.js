;(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Dom7'], factory);
    } else {
        factory(window.Dom7);
    }
}(function ($, undefined) {
    $.formb = $.formb || {};

    $.formb.components = $.formb.components || {};
    var baseComponent = $.formb.baseComponent;

    var component_date = function (kargs) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'f7-icon': 'today'

        };
        this.template =
            '<span class="textarea-group">' +
            '<span>' +
            '<input type="hidden" name="{name}" >' +
            '</span>' +
            '<span class="showValue"></span>' +
            '</span>';
        baseComponent.apply(this, arguments);	// 执行基类的初始化
        var that = this;

        var pickerInline; //picker
        this.__render = function () {

            that.$node = $(that.template.format(that.opts));

            var today = new Date();

            pickerInline = myApp.picker({
                toolbar: false,
                rotateEffect: true,

                value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

                onChange: function (picker, values, displayValues) {
                    var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
                    if (values[1] > daysInMonth) {
                        picker.cols[1].setValue(daysInMonth);
                    }
                },

                formatValue: function (p, values, displayValues) {
                    return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
                },

                cols: [
                    // Months
                    {
                        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                        displayValues: ('January February March April May June July August September October November December').split(' '),
                        textAlign: 'left'
                    },
                    // Days
                    {
                        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                    },
                    // Years
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 1950; i <= 2030; i++) {
                                arr.push(i);
                            }
                            return arr;
                        })(),
                    },
                    // Space divider
                    {
                        divider: true,
                        content: '  '
                    },
                    // Hours
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 0; i <= 23; i++) {
                                arr.push(i);
                            }
                            return arr;
                        })(),
                    },
                    // Divider
                    {
                        divider: true,
                        content: ':'
                    },
                    // Minutes
                    {
                        values: (function () {
                            var arr = [];
                            for (var i = 0; i <= 59; i++) {
                                arr.push(i < 10 ? '0' + i : i);
                            }
                            return arr;
                        })(),
                    }
                ]
            });
        }

        this.editCallback = function (e) {
            myApp.pickerModal(pickerInline);
        }

    }
    $.formb.components.date = component_date;

}));