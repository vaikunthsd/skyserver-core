"use strict";

$(document).ready(function () {

    $(function () {
        $('#treeView').jstree({
            'core': {
                "themes": {
                    "icons": false,
                    "stripes": false
                },
                'data': treeViewData
            },
            "plugins": ["wholerow", "search"]
        }).on("select_node.jstree", function (e, data) {
            $.post("/MoreTools/Node", { id: data.node.text, parentId: data.node.parent }, function (view) {
                $("#schemaInformation").empty().append(view);
            });
        }).on("close_node.jstree", function (e, data) {
            $.post("/MoreTools/CloseNode", { "id": data.node.id })
        }).on("open_node.jstree", function (e, data) {
            $.post("/MoreTools/OpenNode", { "id": data.node.id })
        });
    });

    const inputHandler = function (e) {
        $("#treeView").jstree().search(e.target.value, null, true);
    }
    var searhTreeViewInput = document.getElementById("searchTreeView");
    searhTreeViewInput.addEventListener('input', inputHandler);
    searhTreeViewInput.addEventListener('propertychange', inputHandler); // for IE8

});
