var url = window.location.origin;

$(document).ready(function() {
  system_status_ajax();
});

function system_status_ajax() {
  // body...
  // "{% url 'system_status_ajax' %}?type=1"
  $.getJSON(`${ url }/system/system_service/system_status_ajax/?type=1`, function(ret) {
    // ret.cpuused + '%'
    $('#cpuused').text(`${ ret.cpuused }%`);
    // ret.memerused + '%'
    $('#memerused').text(`${ ret.memerused }%`);
    // ret.diskused + '%'
    $('#diskused').text(`${ ret.diskused }%`);
    // ret.cachedused + '%'
    $('#cachedused').text(`${ ret.cachedused }%`);
    // ret.restime + 'ms'
    $('#restime').text(`${ ret.restime }ms`);
  });
}

var stack_bar_top = {
  "dir1": "down",
  "dir2": "right",
  "push": "top",
  "spacing1": 0,
  "spacing2": 0
};
$('#position-4-success').click(function() {
  var errors = $(this).attr('data-a');
  var notice = new PNotify({
    title: "{% trans '提示信息' %}",
    text: errors,
    type: 'success',
    addclass: 'stack-bar-top',
    stack: stack_bar_top,
    width: "100%"
  });
});
$('#position-4-error').click(function() {
  var errors = $(this).attr('data-a');
  var notice = new PNotify({
    title: "{% trans '提示信息' %}",
    text: errors,
    type: 'error',
    addclass: 'stack-bar-top',
    stack: stack_bar_top,
    width: "100%"
  });
});
