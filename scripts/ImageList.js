function splitInput() {
    console.log(imageList);
    var removedLineBreak = imageList.replace(/(&#xA;)/gm, " ");
    var result = removedLineBreak.split(" ");
    var newArray = [];
    for (var i = 0; i < result.length; i++) {
        if (result[i] !== "" && result[i] !== "name" && result[i] !== "ra" && result[i] !== "dec") {
            newArray.push(result[i]);
        }
    }
    var finalArray = [];
    var div1 = document.getElementById('imageListContainer');
    var table = document.createElement("table");
    table.style.width = '100%';
    table.style.border = '1px solide black';
    for (var j = 0; j < newArray.length; j = j + 3) {
        var imagesrc = IMAGEJPEGURL + '?TaskName=SkyServer.Chart.List' + '&ra=' + newArray[j + 1] + "&dec=" + newArray[j + 2] + "&scale=0.4&width=120&height=120&opt";
        var navUrl = 'http://skyserver.sdss.org/dr15/en/tools/chart/navi.aspx?' + 'ra=' + newArray[j + 1] + '&dec=' + newArray[j + 2] + '&scale=0.2&width=120&height=120&opt=';
        finalArray.push('<a href=' + navUrl + '><img src=' + imagesrc + '></a>');
    }
    var tableData = [];
    for (var k = 0; k < finalArray.length; k = k + 5) {
        var first = finalArray[k];
        var second = finalArray[k + 1]; 
        var third = finalArray[k + 2];
        var fourth = finalArray[k + 3];
        var fifth = finalArray[k + 4];
        
        tableData.push({ 0: first, 1: second, 2: third, 3: fourth, 4: fifth });
    }
    console.log(tableData);
    createImageListTable(tableData);
    return newArray;
}
function createImageListTable(tableData) {
    if ($.fn.dataTable.isDataTable('#imageListTable')) { // trying to refresh the table
        const table = $('#imageListTable').DataTable();
        table.clear();
        table.rows.add(tableData).draw(false);
    } else { // instantiate it for the first time:
        $('#imageListTable').DataTable(
            {
                data: tableData,
                processing: true,
                bFilter: false, // text search
                bLengthChange: false,
                bSort: false,
                stateSave: false,
                select: false,
                paging: true,
                responsive: true,
                "aoColumns": [
                    { "sTitle": "" },
                    { "sTitle": "" },
                    { "sTitle": "" },
                    { "sTitle": "" },
                    { "sTitle": "" }
                ],
                "fnInitComplete": function (oSettings) {
                    $('.dataTables_scrollHead thead').hide();
                }
            },
        );
    }
}