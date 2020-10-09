"use strict";
//alert("test");
var xAuth = "";
var currentCatalog = "";
var currentTable = "";
var datasetsUrl = "";
var selectedQueue = "all";
var jobs_table_refresh_time = 5000; //in milliseconds

var currentExpandedJobsTableRows = {};
var jobIDvsRowIDMapping = {};
var sampleQueries = ["Select top 10 ra,dec from  SDSSDR7:PhotoObj", "SELECT s.objid, s.ra, s.dec, g.objid, g.ra, g.dec, x.ra, x.dec \n" + "INTO twowayxmatch  \n" + "FROM XMATCH( \n" + "     MUST EXIST IN SDSSDR7:PhotoObjAll AS s  \n" + "          WITH(POINT(s.ra, s.dec), ERROR(0.1, 0.1, 0.1)),  \n" + "     MUST EXIST IN GALEX:PhotoObjAll AS g  \n" + "          WITH(POINT(g.ra, g.dec), ERROR(0.2, 0.2, 0.2)),  \n" + "     LIMIT BAYESFACTOR TO 1e3 \n" + ") AS x \n" + "WHERE s.ra BETWEEN 0 AND 5 AND s.dec BETWEEN 0 AND 5  \n" + "AND g.ra BETWEEN 0 AND 5 AND g.dec BETWEEN 0 AND 5 "];
var crossMatchQuery = [];
var jobsTableRowOptions = {};
/* initialize query editor */

var editor = ace.edit("editor");
editor.setTheme("ace/theme/clouds"); //editor.setTheme("ace/theme/merbivore");

editor.getSession().setMode("ace/mode/sql");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true
});
editor.commands.on("afterExec", function (e) {
  if (e.command.name == "insertstring" && /^[\<.]$/.test(e.args)) {
    editor.execCommand("startAutocomplete");
  }
});

function initParams() {
  readCookie("Keystone");

  if (xAuth != "") {
    callServices();
  }
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';'); //console.log(ca);

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) == 0) {
      var temp = c.substring(nameEQ.length, c.length);
      if (temp.indexOf("token") > -1) temp = decodeURIComponent(temp);
      xAuth = temp.replace("token=", ""); //console.log(xAuth);

      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

function callServices() {
  datasetsUrl = skyqueryUrl + "Api/V1/Schema.svc/datasets";
  var tablesUrl = ""; //update database dropdown
  //skyQueryConnect(datasetsUrl, xAuth, "GET", "datasets");

  updateCatalogs();
  refreshJobsTableContinuously(); //callJobs('all');

  callSubmit(); /// select sample queries

  $(document).on('click', '#samples a', function () {
    var index = $(this).attr("tabindex");
    editor.setValue(sampleQueries[index]);
  });
}

function callJobs(whichqueue) {
  //load Jobs 
  var jobsurl = skyqueryUrl + "Api/V1/Jobs.svc/queues/" + whichqueue + "/jobs?TaskName=Skyserver.SkyQuery.submitJob";
  var numberOfJobs = $("#numberOfJobs").val().trim();
  if (numberOfJobs != "") jobsurl += "&Max=" + numberOfJobs; //console.log(jobsurl);

  addWaitSpinner('#waitSpinnerJobsTable');
  skyQueryConnect(jobsurl, xAuth, "GET", "jobs");
}

function callSubmit() {
  //submitJob
  $(document).on('click', "#submit", function () {
    submitJob("long");
  }); //runquick query

  $(document).on('click', "#quick", function () {
    submitJob("quick");
  }); // to open more information about skyquery apis

  $(document).on('click', "#info", function () {
    window.open(skyqueryUrl + "Apps/Api/Default.aspx?token=" + xAuth);
  }); // to open more information about skyquery apis

  $(document).on('click', "#refresh", function () {
    //console.log("Test");
    callJobs(selectedQueue);
  }); // button for manually refreshing jobs table

  $(document).on('click', "#refreshJobsTableButton", function () {
    //console.log("Test");
    callJobs(selectedQueue);
  });
}

function submitJob(whichqueue) {
  var jobsurl = skyqueryUrl + "Api/V1/Jobs.svc/queues/" + whichqueue + "/jobs?TaskName=Skyserver.SkyQuery.submitJob";
  var obj = {};
  obj.query = editor.getValue();//$("#query").val();
  
  var queryObj = {};
  queryObj.queryJob = obj;
  var jsonString = JSON.stringify(queryObj);

  if (whichqueue == "long") {
    addWaitSpinner('#submittingLongQuerySpinner');
  }

  if (whichqueue == "quick") {
    addWaitSpinner('#submittingQuickQuerySpinner');
  }

  skyQueryConnect(jobsurl, xAuth, "POST", whichqueue, jsonString);
} // Update datasets 


function updateDropDown(response) {
  var temp = $.parseJSON(JSON.stringify(response));
  var mydbs = $('#ListDataSets');
  $('#ListDataSets').empty();
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      mydbs.append($("<a href=\"javascript:void(0)\" class=\"list-group-item\">" + text1.name + "</a>").val(val1));
    });
  });
} //////// start ///////////////////////////////////////////////


function deleteTable(ID) {
  var tabb = $(ID).DataTable();
  tabb.clear();
  tabb.destroy(); //$(ID).remove();
  //tabb.destroy();

  $(ID).empty(); //$('#SchemaTable').dataTable().fnDestroy();
  //$(ID).empty()
}

function loadCatalogs(response) {
    removeWaitSpinner('#waitSpinner');
    var temp = $.parseJSON(JSON.stringify(response)); //var mydbs = $('#DataCatalogs');
    //$('#DataCatalogs').empty();

    var Data = [];
    $.each(temp, function (val, text) {
        $.each(text, function (val1, text1) {
            name = "<a href=\"javascript:void(0)\" onclick=\"updateCatalogTables('" + text1.name + "')\" >" + text1.name + "</a>";
            var row = {
                0: name
            };
            Data.push(row);
        });
    }); //mydbs.append('<table id="SchemaTable" class="table table-bordered schema-browser-table"></table>');

    var checkk = $.fn.dataTable.isDataTable('#SchemaTable');
    if(checkk == true) {
        //trying to refresh the table
        deleteTable("#SchemaTable");
    }



  var columnsTable = $("#SchemaTable").DataTable({
    "dom": '<"top"i>rt<"bottom"flp><"clear">',
    "data": Data,
    "searching": false,
    "info": false,
    //"lengthChange": true,
    //"order": [[0, 'desc']],
    "scrollY": "300px",
    "scrollCollapse": true,
    "paging": false,
    "scrollX": true,
    "bDestroy": true,
    "columnDefs": [{
      "title": "Catalog Name",
      "visible": true,
      "targets": 0
    }],
    "processing": true,
    "bProcessing": true,
    "language": {
      processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
    }
  });
  document.getElementById("schemaTitle").innerHTML = ""; //"Catalogs list"

    $("#catalogInPath").addClass("d-none");
    $("#tableInPath").addClass("d-none");
}

function loadTables(response) {
  removeWaitSpinner('#waitSpinner');
  var temp = $.parseJSON(JSON.stringify(response));
  var mydbs = $('#DataCatalogs'); //$('#DataCatalogs').empty();

  var Data = [];
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      //mydbs.append($("<a href=\"#\" class=\"list-group-item\" onclick=\"updateTableColumns('" + text1.name + "')\" >" + text1.name + "</a>").val(val1));
      name = "<a href=\"javascript:void(0)\" onclick=\"updateTableColumns('" + text1.name + "')\" >" + text1.name + "</a>";
      var info = "";
      if (text1.summary != "") info = info + text1.summary;

      if (text1.remarks != "") {
        if (info != "") {
          info = info + "<br>" + text1.remarks;
        } else {
          info = info + text1.remarks;
        }
      }

      var row = {
        0: name,
        1: info
      };
      Data.push(row);
    });
  }); //mydbs.append('<table id="SchemaTable" class="table table-bordered schema-browser-table"></table>');

  if($.fn.dataTable.isDataTable('#SchemaTable')) {
    //trying to refresh the table
    deleteTable("#SchemaTable");
  }

  var columnsTable = $("#SchemaTable").DataTable({
    "dom": '<"top"i>rt<"bottom"flp><"clear">',
    "data": Data,
    "searching": true,
    "info": false,
    //"lengthChange": true,
    //"order": [[0, 'desc']],
    "scrollY": "300px",
    "scrollX": true,
    "scrollCollapse": true,
    "paging": false,
    "bDestroy": true,
    "columnDefs": [{
      "title": "Table Name",
      "visible": true,
      "targets": 0
    }, {
      "title": "Info",
      "visible": true,
      "targets": 1
    }],
    "processing": true,
    "bProcessing": true,
    "language": {
      processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
    }
  });
    document.getElementById("catalogInPath").innerHTML = '<a href="javascript:void(0)" onclick ="updateCatalogTables(\'' + currentCatalog + '\')">' + currentCatalog + "</a>";
  document.getElementById("schemaTitle").innerHTML = ""; //"Catalog Tables"

    $("#catalogInPath").removeClass("d-none");
    $("#tableInPath").addClass("d-none");
}

function loadColumns(response) {
  removeWaitSpinner('#waitSpinner');
  var temp = $.parseJSON(JSON.stringify(response));
  var mydbs = $('#DataCatalogs'); //$('#DataCatalogs').empty();

  /*8
      tableHeader = "<tr><th>Column Name</th><th>Data Type</th><th>Summary</th></tr>"
      table = "<table width='100%' class='schema-browser-table' style='margin: 0px;overflow-x: scroll;'>" + tableHeader 
      $.each(temp, function (val, text) {
          $.each(text, function (val1, text1) {
              table = table + "<tr><td>" + text1.name + "</td><td>" + text1.dataType + "</td><td>" + text1.summary + "</td></td></tr>"
              //item = "<div class=\"list-group-item\" >" + table + "</div>"
              //mydbs.append(item);
          });
      });
      table = table + "</table>"
      item = "<div class=\"list-group-item\" >" + table + "</div>"
      mydbs.append(item);
  */

  var Data = [];
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      var dataType = "";

      if (text1.dataType != null) {
        dataType = text1.dataType;
      }

      var info = "";
      if (text1.summary != "" & text1.summary != null) info = info + text1.summary;

      if (text1.remarks != "" & text1.remarks != null) {
        if (info != "") {
          info = info + "<br>" + text1.remarks;
        } else {
          info = info + text1.remarks;
        }
      }

      var row = {
        0: text1.name,
        1: text1.dataType,
        2: info
      };
      Data.push(row);
    });
  }); //mydbs.append('<table id="SchemaTable" class="table table-bordered schema-browser-table" style="width:100%;"></table>');

  if($.fn.dataTable.isDataTable('#SchemaTable')) {
    //trying to refresh the table
    deleteTable("#SchemaTable");
  }

  var columnsTable = $("#SchemaTable").DataTable({
    "dom": '<"top"i>rt<"bottom"flp><"clear">',
    "data": Data,
    "searching": true,
    "info": false,
    //"lengthChange": true,
    //"order": [[0, 'desc']],
    "scrollY": "300px",
    "scrollCollapse": true,
    "paging": false,
    "scrollX": true,
    "bDestroy": true,
    "columnDefs": [{
      "title": "Column Name",
      "visible": true,
      "targets": 0
    }, {
      "title": "Data Type",
      "visible": true,
      "targets": 1
    }, {
      "title": "Info",
      "visible": true,
      "targets": 2
    }],
    "processing": true,
    "bProcessing": true,
    "language": {
      processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
    }
  });
  document.getElementById("tableInPath").innerHTML = currentTable;
  document.getElementById("schemaTitle").innerHTML = ""; //"Table Columns"

    $("#catalogInPath").removeClass("d-none");
    $("#tableInPath").removeClass("d-none");
}

function addWaitSpinner(id) {
    $(id).removeClass("d-none");
}

function removeWaitSpinner(id) {
    $(id).addClass("d-none");
}

function updateCatalogs() {
  addWaitSpinner('#waitSpinner');
  skyQueryConnect(datasetsUrl, xAuth, "GET", "catalogs");
}

function updateCatalogTables(catalogName) {
  currentCatalog = catalogName;
  datasetsUrl = skyqueryUrl + "Api/V1/Schema.svc/datasets?TaskName=Skyserver.SkyQuery.listAllDatasets";
  var tablesUrl = skyqueryUrl + "Api/V1/Schema.svc/datasets/" + currentCatalog + "/tables?TaskName=Skyserver.SkyQuery.listDatasetTables";
  addWaitSpinner('#waitSpinner'); //$('#DataTables').empty();
  //$('#DataColumns').empty();

  skyQueryConnect(tablesUrl, xAuth, "GET", "tables");
}

function updateTableColumns(tableName) {
  currentTable = tableName;
  datasetsUrl = skyqueryUrl + "Api/V1/Schema.svc/datasets?TaskName=Skyserver.SkyQuery.listAllDatasets";
  var columnsurl = skyqueryUrl + "Api/V1/Schema.svc/datasets/" + currentCatalog + "/tables/" + currentTable + "/columns?TaskName=Skyserver.SkyQuery.listTableColumns";
  addWaitSpinner('#waitSpinner');
  skyQueryConnect(columnsurl, xAuth, "GET", "columns");
} /////////fin ////////////////////////////////////////////////////////////////////////
// update tables according to database selection


function updatetables(response) {
  //alert(JSON.stringify(response));
  var temp = $.parseJSON(JSON.stringify(response));
  var listTables = $('#DataCatalogs');
  $('#DataCatalogs').empty();
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      listTables.append($("<a href=\"#\" class=\"list-group-item\">" + text1.name + "</a>").val(val1));
    });
  });
}

function updateColumns(response) {
  //alert(JSON.stringify(response));
  var temp = $.parseJSON(JSON.stringify(response));
  var listColumns = $('#DataCatalogs');
  $('#DataCatalogs').empty();
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      listColumns.append($("<a href=\"#\" class=\"list-group-item\">" + text1.name + "</a>").val(val1));
    });
  });
}

function downloadTable(dbContext, tableName, format) {
  var query = "select * from " + tableName;
  var accept = ""
  if (format == "json") {
    accept = "application/json";
  } else if (format == "csv") {
    accept = "text/csv";
  } else if (format == "txt") {
    accept = "text/plain";
  } else if (format == "fits") {
    accept = "application/fits";
  } else if (format == "xml") {
    accept = "application/xml";
  } else {
    accept = "text/csv";
  }

  var url = skyqueryUrl + "Api/V1/Data.svc/" + dbContext + "/" + tableName + "?TaskName=Skyserver.SkyQuery.getTable";
  skyQueryConnect(url, xAuth, "GET", "downloadTable", null, accept);
}

function skyQueryConnect(url, authToken, method, caller, senddata, accept) {
  var accept_value = "";
  if (accept == null) {
    accept_value = "application/json";
  } else {
    accept_value = accept;
  }

  $.ajax({
    url: url,
    //        dataType: "json",
    data: senddata,
    headers: {
      "Content-Type": "application/json",
      "Accept": accept_value,
      "X-Auth-Token": authToken
    },
    accept: accept_value,
    type: method,
    beforeSend: function beforeSend(jqxhr, settings) {
      jqxhr.requestURL = "http://some/url";
    },
    success: function success(response, status, xhr) {
      if (caller == "catalogs") {
        loadCatalogs(response);
      }

      if (caller == "tables") {
        loadTables(response);
      }

      if (caller == "columns") {
        loadColumns(response);
      }

      if (caller == "datasets") {
        updateDropDown(response);
      } else if (caller == "tablelist") {
        updatetables(response);
      } else if (caller == "columnlist") {
        updateColumns(response);
      } else if (caller == "jobs") {
        updateJobs(response);
      } else if (caller == "long" || caller == "quick") {
        //$('#waitWhileSavingChangesModal').modal('hide');
        $('#queryWasSubmittedModal').modal('show');
        selectedQueue = caller;

        if (caller == "quick") {
          removeWaitSpinner('#submittingQuickQuerySpinner');
        } else {
          removeWaitSpinner('#submittingLongQuerySpinner');
        }

        callJobs(caller);
      } else if (caller == "downloadTable") {
        saveResponseAsFile(response, status, xhr, url);
      } else {}
    },
    error: function error(XMLHttpRequest, textStatus, errorThrown) {
      //alert("Error when connecting with SkyQuery:\n\n" + errorThrown);
      removeWaitSpinner('#waitSpinner');
      removeWaitSpinner('#waitSpinnerJobsTable');
      removeWaitSpinner('#submittingQuickQuerySpinner');
      removeWaitSpinner('#submittingLongQuerySpinner');
      var errorMessage = "Error when connecting with SkyQuery:\n" + errorThrown + "\n" + textStatus;
      console.log(errorMessage);
      alert(errorMessage);
    }
  });
}

function saveResponseAsFile(response, status, xhr, url) {
  var filename = "";
  var disposition = xhr.getResponseHeader('Content-Disposition');

  if (disposition && disposition.indexOf('attachment') !== -1) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
  }

  var type = xhr.getResponseHeader('Content-Type');
  var blob = new Blob([response], {
    type: type
  });

  if (filename == "") {
    var s = url.split("/");
    filename = s[s.length - 1];
    if (type == "text/csv") filename = filename + ".csv";else if (type == "text/plain") filename = filename + ".txt";
  }

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);

    if (filename) {
      // use HTML5 a[download] attribute to specify filename
      var a = document.createElement("a"); // safari doesn't support this yet

      if (typeof a.download === 'undefined') {
        window.location = downloadUrl;
      } else {
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
      }
    } else {
      window.location = downloadUrl;
    }

    setTimeout(function () {
      URL.revokeObjectURL(downloadUrl);
    }, 100); // cleanup
  }
} /// This is to populate jobslist


function updateJobs(response) {
  removeWaitSpinner('#waitSpinnerJobsTable'); //alert(JSON.stringify(response));

  var temp = $.parseJSON(JSON.stringify(response)); //var mySelect = $('#bjobsList');
  //$('#bjobsList').empty();

  var rows = [];
  crossMatchQuery = [];
  jobIDvsRowIDMapping = {};
  var rowId = 0;
  $.each(temp, function (val, text) {
    $.each(text, function (val1, text1) {
      var tablerow = "<tr>";
      $.each(text1, function (val2, text2) {
        var cls = "label label-default";
        var status_message = "";

        if (text2.error != null) {
          status_message = text2.error;
        }

        var status = "<td><span class=\"" + getLabelCls(text2.status) + "\">" + text2.status + "</span><br>" + status_message + "</td>";
        var dbtb = "";
        if (typeof text2.output != 'undefined') dbtb = text2.output.split(":");
        var dnlink = "";

        if (text2.output != undefined) {
          var html_link = skyqueryUrl + "Api/V1/Data.svc/" + dbtb[0] + "/" + dbtb[1] + "?token=" + xAuth + "&TaskName=Skyserver.SkyQuery.download";
            dnlink = "<a target='_blank' href=" + html_link + "  download><span> " + "html" + "</span></a>" + "<a href=\"javascript:void(0)\" onclick =\"downloadTable('" + dbtb[0] + "','" + dbtb[1] + "','csv')\"><span> " + "csv" + "</span></a>" + "<a href=\"javascript:void(0)\" onclick =\"downloadTable('" + dbtb[0] + "','" + dbtb[1] + "','json')\"><span> " + "txt" + "</span></a>"; //"<a href=\"javascript:void(0)\" onclick =\"downloadTable('" + dbtb[0] + "','" + dbtb[1] + "','fits')\"><span> " + "FITS" + "</span></a>" +
          //"<a href=\"javascript:void(0)\" onclick =\"downloadTable('" + dbtb[0] + "','" + dbtb[1] + "','xml')\"><span> " + "XML" + "</span></a>";
        }

        var dateCreated = getDateString(text2.dateCreated == undefined ? "" : text2.dateCreated, true, false);
        var dateStarted = getDateString(text2.dateStarted == undefined ? "" : text2.dateStarted, true, false);
        var dateFinished = getDateString(text2.dateFinished == undefined ? "" : text2.dateFinished, true, false);
        var query = text2.query == undefined ? "" : text2.query;
        var queue = text2.queue == undefined ? "" : text2.queue;
        var word = query;
        var jobId = text2.name;
          var buttons = '<button type="button" id="expandQueryButton_' + jobId + '" class="btn btn-sm btn-outline-secondary" style="min-width:7rem" onclick="expandQuery(\'' + jobId + '\')" >Expand Query</button><button type="button" id="reloadQueryButton" class="btn btn-sm btn-outline-secondary" style="min-width:7rem" onclick="reloadQuery(\'' + jobId + '\')" >Reload Query</button>';
        rows.push({
          0: dateCreated,
          1: dateStarted,
          2: dateFinished,
          3: queue,
          4: status,
          5: dnlink,
          6: query,
          7: buttons,
          8: jobId,
          9: rowId
        });
        jobIDvsRowIDMapping[jobId] = rowId;
        rowId = rowId + 1;
        crossMatchQuery.push(query);
      }); //mySelect.append(tablerow);
    });
  });
  var checkk = $.fn.dataTable.isDataTable('#jobsTable');

  if(checkk == true) {
    //trying to refresh the table
    var table = $("#jobsTable").DataTable();
    table.clear();
    table.rows.add(rows).draw(false);
  } else {
    var myTable = $("#jobsTable").DataTable({
      "data": rows,
      "responsive": true,
      "bFilter": true,
      // text search
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All "]],
      "stateSave": false,
      "oLanguage": {
        "sLengthMenu": "_MENU_ rows per page"
      },
      "columnDefs": [{
        "title": "Created",
        "visible": true,
        "targets": 0
      }, {
        "title": "Started",
        "visible": true,
        "targets": 1
      }, {
        "title": "Finished",
        "visible": true,
        "targets": 2
      }, {
        "title": "Queue",
        "visible": true,
        "targets": 3
      }, {
        "title": "Status",
        "visible": true,
        "targets": 4
      }, {
        "title": "Download",
        "visible": true,
        "targets": 5
      }, {
        "title": "Query",
        "visible": true,
        "targets": 6
      }, {
        "title": "",
        "visible": true,
        "targets": 7,
        "className": 'details-control',
        "orderable": false
      }],
      "paging": true,
      "order": [[0, 'desc']],
      //"order": [[1,'asc']],//sorts the columns "order": []
      "rowCallback": function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Row click
        $(nRow).on('click', function () {//getSqlQuery(iDisplayIndexFull);
        });
      }
    });
  }

  expandPreselectedRows();
}

function expandPreselectedRows() {
  var table = $("#jobsTable").DataTable();

  for (var jobId in currentExpandedJobsTableRows) {
    expandQuery(jobId, table);
  }
}

function expandQuery(jobId, table) {
  var rowId = jobIDvsRowIDMapping[jobId];

  if (table == null) {
    table = $("#jobsTable").DataTable();
  }

  var row = table.row(rowId);
  var data = row.data();

  if (row.child.isShown()) {
    row.child.hide();
    document.getElementById("expandQueryButton_" + jobId).innerHTML = "Expand Query";
    delete currentExpandedJobsTableRows[jobId];
  } else {
    row.child(createChildRow(data, jobId)).show();
    document.getElementById("expandQueryButton_" + jobId).innerHTML = "Hide Query";
    currentExpandedJobsTableRows[jobId] = true;
  }
}

function createChildRow(data, jobId) {
  var sqlQuery = data[6];
  var htmlCode = '<h4 style="text-center">SQL Query:</h4><div class="">' + '<a href=\"javascript:void(0)\" onclick="reloadQuery(\'' + jobId + '\')" >Reload Query</a>' + '<pre><code class="SQL"><div id="query2">' + sqlQuery + '</div></code></pre>' + '</div>';
  return htmlCode;
}

function getSqlQuery(queryIndex) {
  var table = $("#jobsTable").DataTable();
  table.rows('').deselect();
  table.row(queryIndex).select();
    if (crossMatchQuery[queryIndex] != null) {
        document.getElementById("crossMatchQuery").value = crossMatchQuery[queryIndex];
    } else {
        document.getElementById("crossMatchQuery").value = "";
    }
}

function reloadQuery(jobId) {
  var rowId = jobIDvsRowIDMapping[jobId];
  var table = $("#jobsTable").DataTable();
  var row = table.row(rowId);
  var data = row.data();
  var queryElement = document.getElementById("editor");
  editor.setValue(data[6]);
  queryElement.scrollIntoView();
}

function showJobsTable() {
  var queryElement = document.getElementById("jobsTable");
  queryElement.scrollIntoView();
}

function refreshJobsTable() {
  callJobs(selectedQueue);
}

function refreshJobsTableContinuously() {
  if (jobs_table_refresh_time != null && jobs_table_refresh_time > 0) {
    refreshJobsTable();
    setTimeout(refreshJobsTableContinuously, jobs_table_refresh_time);
  }
}

function getLabelCls(status) {
  var cls = "";

  switch (status) {
    case "completed":
          cls = "badge badge-success";
      break;

    case "failed":
          cls = "badge badge-danger";
      break;

    case "canceled":
          cls = "badge badge-warning";
      break;

    case "waiting":
          cls = "badge badge-primary";
      break;

    case "executing":
          cls = "badge badge-default";
      break;

    case "timedout":
          cls = "badge badge-danger";
      break;

    default:
      cls = "";
      break;
  }

  return cls;
}

function updateJobDetails(id) {//alert(id);
}

function testFunction() {
  $.ajax({
    url: skyqueryUrl + "Api/V1/Schema.svc/datasets",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Auth-Token": "61d7e192cc2e45c3aaa10541607b2e3c"
    },
    type: 'GET',
    success: function success(response) {
      alert(JSON.stringify(response)); //console.log(response);
    },
    error: function error(data, errorThrown) {
      alert(errorThrown);
    }
  });
}

function getDateString(dateString, isForUSerDisplay, doAddTimeZone) {
  try {
    if (dateString != "" & dateString != null) {
      //dateString = dateString.replace("T", " ");
      var date = new Date(dateString);
      var month = String(date.getMonth() + 1);
      if (month.length == 1) month = "0" + month;
      var day = String(date.getDate());
      if (day.length == 1) day = "0" + day;
      var hours = String(date.getHours());
      if (hours.length == 1) hours = "0" + hours;
      var minutes = String(date.getMinutes());
      if (minutes.length == 1) minutes = "0" + minutes;
      var seconds = String(date.getSeconds());
      if (seconds.length == 1) seconds = "0" + seconds;
      var milliseconds = String(date.getMilliseconds());
      milliseconds = ("000" + milliseconds).substr(-3, 3);
      var utcOffset = date.getTimezoneOffset();
      var utcOffsetHours = parseInt(utcOffset / 60.0);
      var utcOffsetMinutes = utcOffset - utcOffsetHours * 60;
      utcOffsetHours = String(utcOffsetHours);
      if (utcOffsetHours.length == 1) utcOffsetHours = "0" + utcOffsetHours;
      utcOffsetMinutes = String(utcOffsetMinutes);
      if (utcOffsetMinutes.length == 1) utcOffsetMinutes = "0" + utcOffsetMinutes;
      var timeZone = "";
      if (utcOffset > 0) timeZone += "+" + utcOffsetHours + "" + utcOffsetMinutes;else timeZone += "-" + utcOffsetHours + "" + utcOffsetMinutes; //var s = date.getUTCFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds + "" + timeZone;

      var s = "";
      if (isForUSerDisplay) s = date.getUTCFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;else s = date.getUTCFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
      if (doAddTimeZone) s = s + " " + timeZone;
      if (s.indexOf("NaN") >= 0) return "";else return s;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}

document.addEventListener("load", initParams());
//# sourceMappingURL=skyquery.js.map
