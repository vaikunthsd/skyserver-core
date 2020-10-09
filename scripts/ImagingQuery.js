"use strict";
var table_field;
const positionType = ['rectangular', 'cone', 'proximity', 'none'];
//import axios from 'axios';
window.onload = function init() {};

$(document).ready(function () {
    table_field = document.getElementById('table_name_group');
    table_field.style.display = 'none';
    positionType.forEach((pos) => {
        if (document.getElementById(pos).checked) {
            changePositionType(pos);
        }
    })
});

function changePositionType(type) {
  switch (type) {
    case 'rectangular':
      $('.rectangular-group').show();
      $('.cone-group').hide();
      $('.proximity-group').hide();
      break;

    case 'cone':
      $('.cone-group').show();
      $('.rectangular-group').hide();
      $('.proximity-group').hide();
      break;

    case 'proximity':
      $('.proximity-group').show();
      $('.cone-group').hide();
      $('.rectangular-group').hide();
      break;

    case 'none':
      $('.cone-group').hide();
      $('.rectangular-group').hide();
      $('.proximity-group').hide();
      break;
  }
}

function loadImageParams(url, config) {
  axios.get(url, config).then();
}

function loadSpecParams(url, config) {
  axios.get(url, config).then();
}

function loadFlagsOnList(url, config) {
  axios.get(url, config).then();
}

function loadFlagsOffList(url, config) {
  axios.get(url, config).then();
}

function fillImageParamsList() {// fill image params select list
}

function fillSpecParamsList() {// fill Spectro params select list
}

function fillFlagsOnList() {// fill Flags on select list
}

function fillFlagsOffList() {// fill Flags Off select list
}
//# sourceMappingURL=ImagingQuery.js.map
function showTable() {
    table_field.style.display = '';
}

function hideTable() {
    table_field.style.display = 'none';
}
