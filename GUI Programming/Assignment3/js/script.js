/*--
File: style.css
GUI Assignment: Multiplication Table
Thomas DeMasse, UMass Lowell Computer Science, Thomas_DeMasse@student.uml.edu
Copyright (c) 2023 by Thomas DeMasse. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by TD on June 16, 2023 at 10:26 PM */

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

//Exception Handling 
if (typeof FormHandler == "undefined") {

    var FormHandler = (function () {
        var form;
        var minError = 'Min value must be less than the max value';
        var maxError = 'Max value must be greater than the min value.';
        var tooLargeError = 'You have entered a number that is too large!'
        var tooSmallError = 'You have entered a number that is too small!'

        var init = function () {
            form = document.getElementById('form');

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var table = generateTable(
                    form.elements['horizontalMin'].value,
                    form.elements['horizontalMax'].value,
                    form.elements['verticalMin'].value,
                    form.elements['verticalMax'].value);
                generate(table, form);
            });

            for (var i = 0; i < form.elements.length; i++) {
                if (form.elements[i].type !== 'number') continue;

                form.elements[i].addEventListener('input', validation);
            }
        }

        //Generates error if min > max or if input falls outside the range 
        // -50 < x < 50
        var validation = function () {
            var min, max;

            if (this.name === 'horizontalMin' ||
                this.name === 'horizontalMax') {

                min = form.elements['horizontalMin'];
                max = form.elements['horizontalMax'];

            } else if (this.name === 'verticalMin' ||
                this.name === 'verticalMax') {

                min = form.elements['verticalMin'];
                max = form.elements['vertialMax'];
            }
            if (min.length !== 0 && max.length !== 0 &&
                parseInt(min.value, 10) > parseInt(max.value, 10)) {

                min.setCustomValidity(minError);
                max.setCustomValidity(maxError);
            } else {

                min.setCustomValidity('');
                max.setCustomValidity('');
            }
            if (min.length != 0 && max.length !== 0 &&
                parseInt(max.value, 10) > 50) {
                max.setCustomValidity(tooLargeError);
            }
            else if (min.length != 0 && max.length !== 0 &&
                parseInt(max.value, 10) < -50) {
                max.setCustomValidity(tooSmallError);
            }
            else if (min.length != 0 && max.length !== 0 &&
                parseInt(min.value, 10) > 50) {
                min.setCustomValidity(tooLargeError);
            }
            else if (min.length != 0 && max.length != 0 &&
                parseInt(min.value, 10) < -50) {
                min.setCustomValidity(tooSmallError);
            }
        }

        return {
            init: init
        };
    })();

    document.addEventListener('DOMContentLoaded', FormHandler.init);
};