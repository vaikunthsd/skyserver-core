"use strict";

$(document).ready(function () {
  $('.checkbox ~ input, .checkbox ~ label').hide();
});
$("input[type=checkbox]").change(function (event) {
  $(event.target).parent().siblings('label, input').slideToggle(200, null);
});
//# sourceMappingURL=searchformcheckbox.js.map
