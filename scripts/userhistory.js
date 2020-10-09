var xAuth = "";
var startDate;
var endDate;
var apps = [];
var selectedApps = [];
var tableData;
var userHistory;
$('#datetimepicker1').datetimepicker({
    onSelect: function (d, i) {
        if (d !== i.lastVal) {
            $(this).change();
        }
    }
});
$('#datetimepicker2').datetimepicker({
    onSelect: function (d, i) {
        if (d !== i.lastVal) {
            $(this).change();
        }
    }
});
$('#datetimepicker1').change(function () {
    startDate = $(this).val();
});
$('#datetimepicker2').change(function () {
    endDate = $(this).val();
});
function initParams() {
    readCookie("Keystone");
    startDate = "";
    endDate = "";
    apps = [];
    var url = constructURL(startDate, endDate);
    if (xAuth != "") {
        getUserHistoryResponse(url, xAuth, 'GET', "", "application/json");
    }
}
function getSelectedApps() {
    var selected = $('#applicationMenu').val();
    return selected;
}
function constructURL(startDate, endDate) {
    let newUrl = userHistoryRequestUrl + "?TaskName=Skyserver.UserHistory&format=json&DoShowAllHistory=" + doShowAllHistory + "&limit=" + topRowsDefault;
    if (startDate) {
        newUrl = `${newUrl}&date_low=${startDate.toString()}`;
    }
    if (endDate) {
        newUrl = `${newUrl}&date_high=${endDate.toString()}`;
    }
    return newUrl;
}
function getSubmittedResponseTable() {
    var url = constructURL(startDate, endDate);
    if (xAuth != "") {
        getUserHistoryResponse(url, xAuth, 'GET', "", "application/json");
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
            xAuth = temp.replace("token=", "");
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}
function getUserHistoryResponse(url, authToken, method, senddata, accept) {
    if (accept == null) {
        accept_value = "application/json";
    } else {
        accept_value = accept;
    }
    const allHeaders = {
        'Content-Type': 'application/json',
        Accept: accept_value,
        'X-Auth-Token': authToken,
    };
    $.ajax({
        url,
        dataType: 'json',
        data: senddata,
        headers: allHeaders,
        type: method,
        success: function (data) {
            userHistory = data;
            tableData = setTableData(data, selectedApps);
            createUserHistoryTable(tableData);
            let appList = removeDuplicates(apps);
            createSelectionList(appList);
        },
        error(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        },
    });
}
function removeDuplicates(items) {
    var listHolder = [];
    for (var i = 0; i < items.length; i++) {
        if (!hasSeen(listHolder, items[i])) {
            listHolder.push(items[i]);
        }
    }
    return listHolder; 
}
function hasSeen(seenItems, item) {
    var flag = false;
    for (var i = 0; i < seenItems.length; i++) {
        if (seenItems[i] === item) {
            flag = true;
        }
    }
    return flag;
}
function createSelectionList(list) {
    var selectList = document.getElementById('applicationMenu');
    for (var i = 0; i < list.length; i++) {
        var opt = document.createElement('option');
        opt.value = list[i];
        opt.innerHTML = list[i];
        selectList.appendChild(opt);
    }
}
function createUserHistoryTable(tableData) {
    if ($.fn.dataTable.isDataTable('#userHistoryTable')) { // trying to refresh the table
        const table = $('#userHistoryTable').DataTable();
        table.clear();
        table.rows.add(tableData).draw(false);
    } else { // instantiate it for the first time:
        $('#userHistoryTable').DataTable(
            {
                data: tableData,
                processing: true,
                bFilter: true, // text search
                stateSave: false,
                select: false,
                paging: true,
                responsive: true,
                columnDefs: [
                    { className: 'wrapword', targets: [3] },
                    { className: 'changeColumnWidth', targets: [1] },
                    { type: 'date', targets: [1] },
                ],
                order: [[1, 'desc']],
                language: {
                    loadingRecords: 'Loading...',
                    processing: 'Processing...',
                    sLengthMenu: 'Rows _MENU_  per page',
                },
            },
        );
    }
}
function filterTable(filterBy) {
    selectedApps = getSelectedApps();
    tableData = setTableData(userHistory, selectedApps);
    createUserHistoryTable(tableData);
}
function resetTableData() {
    $("#applicationMenu").val([]);
    selectedApps = getSelectedApps();
    console.log(selectedApps.length);
    tableData = setTableData(userHistory, selectedApps);
    createUserHistoryTable(tableData);
}
function setTableData(userHistory, selectedApps) {
    var tableData = [];
    for (var i = 0; i < userHistory.length; i++) {
        for (var j = 0; j < userHistory[i].Rows.length; j++) {
            if (selectedApps.length <= 0) {
                apps.push(userHistory[i].Rows[j].Application);
                var app = `<a href=${userHistory[i].Rows[j].Content} title="Go to ${userHistory[i].Rows[j].Application}" rel="noopener"
                target="_blank"><b>${userHistory[i].Rows[j].Application}</b></a>`;
                tableData.push({ 0: userHistory[i].Rows[j].RowIndex, 1: userHistory[i].Rows[j].Time, 2: app, 3: userHistory[i].Rows[j].Content });
            } else {
                for (var k = 0; k < selectedApps.length; k++) {
                    console.log(selectedApps[k]);
                    console.log(userHistory[i].Rows[j].Application);
                    if (selectedApps[k] === userHistory[i].Rows[j].Application) {
                        apps.push(userHistory[i].Rows[j].Application);
                        var app = `<a href=${userHistory[i].Rows[j].Content} title="Go to ${userHistory[i].Rows[j].Application}" rel="noopener"
                target="_blank"><b>${userHistory[i].Rows[j].Application}</b></a>`;
                        tableData.push({ 0: userHistory[i].Rows[j].RowIndex, 1: userHistory[i].Rows[j].Time, 2: app, 3: userHistory[i].Rows[j].Content });
                    }
                }
            }
        }
    }
    return tableData;
}
document.addEventListener("load", initParams());