var url = window.location.origin;

function open_basic() {
  $('#open_basic').click();
  $('.RECEIVE').hide();
  $('#receive_mac').text('');
  $('#receive_info').text('');
  $('#mac').val('');
}

function ajaxfunc() {
  // bk-bg-danger
  // console.log(value);
  var value = $('#mac').val();
  if ($.trim(value) === '' || value.length < 6) {
    alert(pageWords.pleaseInputMac);
  } else {
    // "{% url 'mac_search' %}?mac=" + value
    $.getJSON(`${ url }/support/mac_search/`, function(ret) {
      if ($.trim(ret.errors) === '') {
        $('.RECEIVE').show();
        $('#receive_mac').text(ret.mac);
        $('#receive_info').text(ret.info);
      } else {
        alert(ret.errors);
      }
    });
  }
}

$(function() {
  $("#modalBasic").draggable({
    cancel: ".drag"
  });
});
