"use strict";
var table_field;
var query = "--This query does a table JOIN between the imaging(PhotoObj) and spectra\n" +
    "--(SpecObj) tables and includes the necessary columns in the SELECT to upload\n" +
    "--the results to the SAS(Science Archive Server) for FITS file retrieval.\n" +
    "SELECT TOP 10\n" +
    "   p.objid, p.ra, p.dec, p.u, p.g, p.r, p.i, p.z, \n" +
    "   p.run, p.rerun, p.camcol, p.field, \n" +
    "   s.specobjid, s.class, s.z as redshift, \n" +
    "   s.plate, s.mjd, s.fiberid\n" +
    "FROM PhotoObj AS p\n" +
    "JOIN SpecObj AS s ON s.bestobjid = p.objid\n" +
    "WHERE\n" +
    "p.u BETWEEN 0 AND 19.6\n" +
    "AND g BETWEEN 0 AND 20";
var editor;
var cmd;
var table;
$(document).ready(function () {
    editor = ace.edit("editor");
    cmd = document.getElementById('cmd_div');
    loadCmd();
    table_field = document.getElementById('table_name_group');
    table_field.style.display = 'none';
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/sql");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
    });
    var textarea = $('#cmd');
    /* for setting the input query as a request parameter */
    editor.getSession().on("change", function () {
        textarea.val(editor.getSession().getValue());
    });
    editor.setValue(query);
    editor.getSession().selection.clearSelection();
    table = document.querySelector("table");
    if (typeof table !== 'undefined' && table != null) {
        var previous = table.previousSibling;
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class","table-wrapper");
        wrapper.appendChild(table);
        previous.appendChild(wrapper);
    }
});

//# sourceMappingURL=sqlsearch.js.map

function loadQuery(that) {
    if (typeof $(that).find($(".sample-query-text"))[0] !== 'undefined') {
        query = (new DOMParser().parseFromString($(that).find($(".sample-query-text"))[0].innerHTML, "text/html")).documentElement.textContent;
        editor.setValue(query);
        editor.getSession().selection.clearSelection();
    }
}

function loadCmd() {
    if (typeof $(cmd) !== 'undefined') {
        query = (new DOMParser().parseFromString($(cmd).find($(".sample-query-text"))[0].innerHTML, "text/html")).documentElement.textContent;
        editor.setValue(query);
        editor.getSession().selection.clearSelection();
    }
}

$('#sqlClear').click(function () {
    editor.setValue('');
    textarea.val(editor.getSession().getValue());
});
$('#resetQuery').click(function () {
    editor.setValue(query);
    textarea.val(editor.getSession().getValue());
});
$('#submitQuery').click(function () {
    textarea.val(editor.getSession().getValue());
    $('#syntax').val('NoSyntax');
});
$('#sqlCheck').click(function () {
    textarea.val(editor.getSession().getValue());
    $('#syntax').val('Syntax');
});

function showTable() {
    table_field.style.display = '';
}

function hideTable() {
    table_field.style.display = 'none';
}
