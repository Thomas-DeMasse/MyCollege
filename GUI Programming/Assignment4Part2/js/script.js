/*--
File: style.css
GUI Assignment: Multiplication Table
Thomas DeMasse, UMass Lowell Computer Science, Thomas_DeMasse@student.uml.edu
Copyright (c) 2023 by Thomas DeMasse. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by TD on June 23, 2023 at 11:18 PM */

//Function that creates the HTML element
function generateTable(horizMax, horizMin,
    vertMin, vertMax) {

    var table = document.createElement('table');
    table.id = 'table';
    var rowOne = true;
    var colOne = true;

    for (var row = vertMin - 1; row <= vertMax; row++) {
        var tableRow = document.createElement('tr');

        for (var col = horizMax - 1; col <= horizMin; col++) {
            var cell;
            var cellText;
            if (rowOne) {
                cell = document.createElement('th');
                if (!colOne) {


                    cellText = document.createTextNode(col);
                    cell.appendChild(cellText);
                }
            } else {
                if (colOne) {


                    cell = document.createElement('th');
                    cellText = document.createTextNode(row);
                    cell.appendChild(cellText);

                } else {


                    cell = document.createElement('td');
                    cellText = document.createTextNode(row * col);
                    cell.appendChild(cellText);
                }
            }
            tableRow.appendChild(cell);
            colOne = false;
        }
        table.appendChild(tableRow);
        rowOne = false;
        colOne = true;
    }
    return table;
}

//Function that will output the table
function generate(newElement, parentNode) {
    var oldElement;
    if ((oldElement = document.getElementById(newElement.id)) &&
        oldElement.parentNode === parentNode) {
        parentNode.replaceChild(newElement, oldElement);
    } else {
        parentNode.appendChild(newElement);
    }
}

//Exception handling using JQuery
if (typeof FormHandler == 'undefined') {

    var FormHandler = (function () {

        var tabs = $('#tableTabs').tabs();
        var tabHandles = tabs.find('ul');
        var tabCount = 0;

        var init = function () {

            jQuery.validator.addMethod(
                'compareTo', function (value, element, params) {

                    var num1 = parseInt(value);
                    var num2 = parseInt($('input[name="' + params[0] + '"]').val());

                    if (isNaN(num1) || isNaN(num2)) return true;

                    if (params[2]) {
                        return num1 <= num2;
                    } else {
                        return num1 >= num2;
                    }
                }, 'max value must be >= min value');


            $('form').validate({

                rules: {
                    horizontalMin: {
                        required: true,
                        number: true,
                        step: 1,
                        min: -50,
                        max: 50,
                        compareTo:
                            ['horizontalMax', 'horizontal', true]
                    },
                    horizontalMax: {
                        required: true,
                        number: true,
                        step: 1,
                        min: -50,
                        max: 50,
                        compareTo:
                            ['horizontalMin', 'horizontal', false]
                    },
                    verticalMin: {
                        required: true,
                        number: true,
                        step: 1,
                        min: -50,
                        max: 50,
                        compareTo:
                            ['verticalMax', 'vertical', true]
                    },
                    verticalMax: {
                        required: true,
                        number: true,
                        step: 1,
                        min: -50,
                        max: 50,
                        compareTo:
                            ['verticalMin', 'vertical', false]
                    }
                },

                showErrors: function (error, errorMap) {
                    this.defaultShowErrors();

                    var isMaxError = false;


                    errorMap.forEach(function (error) {

                        if (error.method === 'compareTo') {

                            isMaxError = true;
                            $('#' + error.element.name + '-error').empty();
                            var type = error.element.name.slice(0, -3);
                            $('#' + type + 'Error').html(error.message);
                            $('#' + type + 'Error').removeClass('hidden');
                        }
                    });

                    if (errorMap.length === 0 || !isMaxError) {

                        this.currentElements.each(function (index, element) {
                            var type = element.name.slice(0, -3);
                            $('#' + type + 'Error').empty();
                            $('#' + type + 'Error').addClass('hidden');
                        });
                    }
                },

                messages: {
                    horizontalMin: {
                        required: 'The field cannot be empty',
                        number: 'Value must be an integer.',
                        step: 'No decimals! Integers only!'
                    },
                    horizontalMax: {
                        required: 'The field cannot be empty',
                        number: 'Value must be an integer.',
                        step: 'No decimals! Integers only!'
                    },
                    verticalMin: {
                        required: 'The field cannot be empty',
                        number: 'Value must be an integer.',
                        step: 'No decimals! Integers only!'
                    },
                    verticalMax: {
                        required: 'The field cannot be empty',
                        number: 'Value must be an integer.',
                        step: 'No decimals! Integers only!'
                    }
                },

                //Once all rules are followed create the table
                submitHandler: function (form, event) {
                    event.preventDefault();
                    createTab(form);
                }

            });

            //Slider code 
            $('.slider').slider({
                value: -50,
                min: -50,
                max: 50,
                slide: function (event, ui) {
                    $(this).siblings('input').val(ui.value);
                    $(this).siblings('input').valid();
                },
                change: function (event, ui) {
                    var form = $(this).closest("form")[0];
                    var dynamicForm = form.elements['dynamicFormTab'].checked;
                    if (dynamicForm && $(form).valid()) {
                        updateActiveTab(form);
                    }
                }
            });

            $('input[type="number"]').on('input', function (event) {
                $(this).siblings('.slider').slider('value', $(this).val());
                var form = $(this).closest("form")[0];
                var dynamicForm = form.elements['dynamicFormTab'].checked;
                if (dynamicForm && $(form).valid()) {
                    updateActiveTab(form);
                }
            });

        };

        tabs.on('click', '.tabClose', function () {

            var li = $(this).closest('li');
            var index = li.index();
            var activeIndex = tabs.tabs('option', 'active');
            $(li.find('a').attr('href')).remove();
            li.remove();
            tabs.tabs('refresh');
            var remaining = tabHandles.find('li').length;
            if (remaining === 0) {
                toggleTabVisibility(false);
            } else if (activeIndex === index) {
                if (remaining <= index) {
                    index = remaining - 1;
                }
                tabs.tabs('option', 'active', index);
            }
        });

        $('#removeAllTabs').on('click', function () {
            tabHandles.empty();
            tabs.find(":not(:first-child)").remove();
            tabs.tabs('refresh');
            toggleTabVisibility(false);
        });

        $('#removeTabsRight').on('click', function () {
            var activeIndex = tabs.tabs('option', 'active');
            var numTabs = tabHandles.find('li').length;
            if (activeIndex == numTabs - 1) {
                alert('No tabs to the right of the active tab to remove.');
            } else {
                removeTabsToSide(activeIndex, true);
            }
        });

        $('#removeTabsLeft').on('click', function () {
            var activeIndex = tabs.tabs('option', 'active');
            if (activeIndex == 0) {
                alert('No tabs to the left of the active tab to remove.');
            } else {
                removeTabsToSide(activeIndex, false);
            }
        });


        var removeTabsToSide = function (activeIndex, toRight) {
            var tabHandlesList = tabHandles.find('li');
            var end = activeIndex;
            var start = 0;
            if (toRight) {
                end = tabHandlesList.length;
                start = activeIndex + 1;
            }
            for (var i = start; i < end; i++) {
                var li = tabHandlesList.eq(i);

                $(li.find('a').attr('href')).remove();

                li.remove();
            }
            tabs.tabs('refresh');
        }

        var toggleTabVisibility = function (show) {
            if (show) {
                tabs.removeClass('hidden');
                $('#tabButtons').removeClass('hidden');
            } else {
                tabs.addClass('hidden');
                $('#tabButtons').addClass('hidden');
            }
        }

        var addTableDataToTab = function (form, tabTitleHolder, tabContentHolder) {
            var horizontalMin = form.elements['horizontalMin'].value;
            var horizontalMax = form.elements['horizontalMax'].value;
            var verticalMin = form.elements['verticalMin'].value;
            var verticalMax = form.elements['verticalMax'].value;
            var tabTitleText =
                '(' + horizontalMin +
                ') to (' + horizontalMax +
                ') by (' + verticalMin +
                ') to (' + verticalMax + ')';

            tabTitleHolder.innerHTML = tabTitleText;

            var table = generateTable(horizontalMin, horizontalMax,
                verticalMin, verticalMax);
            $(tabContentHolder).empty();
            generate(table, tabContentHolder);
        }

        var updateActiveTab = function (form) {
            var activeTab = tabs.tabs('option', 'active');
            if (activeTab === false) {
                createTab(form);
            } else {
                var tabHandle = tabHandles.find('li').eq(activeTab);
                var tabTitleHolder = tabHandle.find('a');
                var tabContentHolder = $(tabTitleHolder.attr('href'));
                addTableDataToTab(form, tabTitleHolder[0], tabContentHolder[0]);
                tabs.tabs('refresh');
            }

        }

        var createTab = function (form) {
            if (!tabs.is(':visible')) {
                toggleTabVisibility(true);
            }

            var tabID = "tab-" + tabCount;
            tabCount++;

            var li = document.createElement('li');
            li.id = "handle-" + tabID;
            var a = document.createElement('a');
            a.href = "#" + tabID;
            li.appendChild(a);

            var div = document.createElement('div');
            div.className = "tabClose";
            div.appendChild(document.createTextNode('x'));
            li.appendChild(div);
            tabHandles.append(li);

            var div = document.createElement('div');
            div.id = tabID;
            tabs.append(div);

            addTableDataToTab(form, a, div);

            tabs.tabs('refresh');

            var index = tabHandles.find('li').length - 1;
            tabs.tabs("option", "active", index);
        };

        return {
            init: init
        };
    })();

    document.addEventListener('DOMContentLoaded', FormHandler.init);
};