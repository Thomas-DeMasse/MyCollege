/*--
File: script.js
GUI Assignment: Multiplication Table
Thomas DeMasse, UMass Lowell Computer Science, Thomas_DeMasse@student.uml.edu
Copyright (c) 2023 by Thomas DeMasse. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by TD on June 22, 2023 at 6:45 PM */

//Function that creates the HTML Table element
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

//Function that will ouput the table
function generate(newElement, parentNode) {
    var oldElement;
    if ((oldElement = document.getElementById(newElement.id)) &&
        oldElement.parentNode === parentNode) {

        parentNode.replaceChild(newElement, oldElement);
    } else {
        parentNode.appendChild(newElement);
    }
}

//Exception handling using JQuery and validate plugin
if (typeof FormHandler == "undefined") {

    var FormHandler = (function () {

        var init = function () {

            jQuery.validator.addMethod(
                "compareTo", function (value, element, params) {

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
                        max: 50,
                        min: 1,
                        compareTo:
                            ['horizontalMax', 'horizontal', true]
                    },
                    horizontalMax: {
                        required: true,
                        number: true,
                        step: 1,
                        max: 50,
                        min: 1,
                        compareTo:
                            ['horizontalMin', 'horizontal', false]
                    },
                    verticalMin: {
                        required: true,
                        number: true,
                        step: 1,
                        max: 50,
                        min: 1,
                        compareTo:
                            ['verticalMax', 'vertical', true]
                    },
                    verticalMax: {
                        required: true,
                        number: true,
                        step: 1,
                        max: 50,
                        min: 1,
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
                        }
                    });

                    if (errorMap.length === 0 || !isMaxError) {

                        this.currentElements.each(function (index, element) {
                            var type = element.name.slice(0, -3);
                            $('#' + type + 'Error').empty();
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

                // Once all rules are followed create the table
                submitHandler: function (form, event) {
                    event.preventDefault();

                    var table = generateTable(
                        form.elements['horizontalMin'].value,
                        form.elements['horizontalMax'].value,
                        form.elements['verticalMin'].value,
                        form.elements['verticalMax'].value);
                    generate(table, form);
                }

            });
        }

        return {
            init: init
        };
    })();

    document.addEventListener('DOMContentLoaded', FormHandler.init);
};