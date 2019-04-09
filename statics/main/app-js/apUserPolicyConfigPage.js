var url = window.location.origin;

$('#access_policy').click(function() {
  // body...
  if ($('#access_policy').attr('checked') === 'checked') {
    $('#reject_max_hide').show();
  } else {
    $('#reject_max_hide').hide();
  }
});
$('#roaming_policy').click(function() {
  // body...
  if ($('#roaming_policy').attr('checked') === 'checked') {
    $('#roaming_assoc_rssi_hide').show();
  } else {
    $('#roaming_assoc_rssi_hide').hide();
  }
});
$(function() {
  // body...
  // "{% url 'ap_user_policy_config_ajax' %}"
  $.getJSON(`${ url }/ap-list/ap_user_policy_config_ajax/`, function(ret) {
    // console.log(ret);
    $('#dual_max_user').val(ret.dual_max_user);
    $('#single_max_user').val(ret.single_max_user);
    $('#rssi_threshold').val(parseInt(ret.rssi_threshold));
    $('#reject_max').val(ret.reject_max);

    if (ret.access_policy === 1) {
      $('#access_policy').attr('checked', 'checked');
      $('#reject_max_hide').show();
    } else {
      $('#access_policy').removeAttr('checked', 'checked');
      $('#reject_max_hide').hide();
    }
    if (ret.load_balance === 1) {
      $('#load_balance').attr('checked', 'checked');
    } else {
      $('#load_balance').removeAttr('checked', 'checked');
    }
    if (ret.l2_isolation === 1) {
      $('#l2_isolation').attr('checked', 'checked');
    } else {
      $('#l2_isolation').removeAttr('checked', 'checked');
    }
    if (ret.band_steering === 1) {
      $('#band_steering').attr('checked', 'checked');
    } else {
      $('#band_steering').removeAttr('checked', 'checked');
    }
    if (ret.roaming_policy === 1) {
      $('#roaming_policy').attr('checked', 'checked');
      $('#roaming_assoc_rssi_hide').show();
    } else {
      $('#roaming_policy').removeAttr('checked', 'checked');
      $('#roaming_assoc_rssi_hide').hide();
    }
    $('#ex6').val(parseInt(ret.roaming_assoc_rssi));
    var xx = 100 / 35 * ret.roaming_assoc_rssi;
    // 'left: 0%; width: ' + xx + '%;'
    $('#ff div.slider-selection').attr('style', `left: 0%; width: ${ xx }%;`);
    // 'left: ' + xx + '%;'
    $('#ff div.slider-handle.min-slider-handle.round').attr('style', `left: ${ xx }%;`);
    // -95 + ret.roaming_assoc_rssi + " dBm"
    $("#ex6SliderVal").text(`${ -95 + parseInt(ret.roaming_assoc_rssi) } dBm`);
    $('#passphrase_hide').hide();
  });
});

function wlan_ajax() {
  // body...
  $.ajax({
    type: "POST",
    dataType: "html",
    // "{% url 'add_wlan_ajax' %}"
    url: `${ url }/ap/ap_wlan/add_wlan_ajax/`,
    data: $("#create_wlan").serialize(),
    success: function(result) {
      // alert(111111);
      alert(eval(result));
      // oTable.ajax.reload(null,false)
    },
  });
}

function policy_config_ajax() {
  // body...
  let dual_max_user = $('#dual_max_user').val();
  let single_max_user = $('#single_max_user').val();
  let rssi_threshold = $('#rssi_threshold').val();
  let reject_max = $('#reject_max').val();
  let sign = true;
  if (!(/^\d+$/.test(dual_max_user) && parseInt(dual_max_user) <= 128 && parseInt(dual_max_user) >= 1)) {
    sign = false;
    alert(pageWords.doubleMaxUserErrorInfo);
  }
  if (sign) {
    if (!(/^\d+$/.test(single_max_user) && parseInt(single_max_user) <= 64 && parseInt(single_max_user) >= 1)) {
      sign = false;
      alert(pageWords.singleMaxUserErrorInfo);
    }
  }
  if (sign) {
    if (!(/^[0]|-\d+$/.test(rssi_threshold) && parseInt(rssi_threshold) <= 0 && parseInt(rssi_threshold) >= -95)) {
      sign = false;
      alert(pageWords.rssiErrorInfo);
    }
  }
  if (sign) {
    if ($('#access_policy').attr('checked') === 'checked') {
      if (!(/^\d+$/.test(reject_max) && parseInt(reject_max) >= 1 && parseInt(reject_max) <= 5)) {
        sign = false;
        alert(pageWords.rejectMaxErrorInfo);
      }
    }
  }
  if (sign) {
    $.ajax({
      type: "POST",
      dataType: "html",
      // "{% url 'policy_config_ajax' %}"
      url: `${ url }/ap-list/policy_config_ajax/`,
      data: $("#policy_config_ajax").serialize(),
      success: function(result) {
        // alert(111111);
        alert(eval(result));
        // oTable.ajax.reload(null,false)
      },
    });
  }

}

var slider = new Slider("#ex6");
$("#ex6").on("change", function(slideEvt) {
  // (-95 + parseInt(slideEvt.value.newValue)) + " dBm"
  $("#ex6SliderVal").text(`${ (-95 + parseInt(slideEvt.value.newValue)) } dBm`);
  $('#ex6').val(parseInt(slideEvt.value.newValue));
});

$(function() {
  // body...
  customer_black_list_table();
});

function customer_black_list_add_table() {
  var table = $('#datatable-customer-black-list-add').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
    'language': {
      "sProcessing": pageWords.processing,
      "sLengthMenu": `${ pageWords.show } <select>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        </select> ${ pageWords.record }`,
      "sZeroRecords": pageWords.sZeroRecords,
      "sInfo": pageWords.sInfo,
      "sInfoEmpty": pageWords.sInfoEmpty,
      "sInfoFiltered": pageWords.sInfoFiltered,
      "sInfoPostFix": "",
      "sSearch": pageWords.sSearch,
      "sUrl": "",
      "sEmptyTable": pageWords.sEmptyTable,
      "sLoadingRecords": pageWords.sLoadingRecords,
      "sInfoThousands": ",",
      "oPaginate": {
        "sFirst": `<span class="fa fa-angle-double-left"></span>`,
        "sPrevious": `<span class="fa fa-angle-left"></span>`,
        "sNext": `<span class="fa fa-angle-right"></span>`,
        "sLast": `<span class="fa fa-angle-double-right"></span>`,
      },
      // "oAria": {
      //     "sSortAscending":  ": 以升序排列此列",
      //     "sSortDescending": ": 以降序排列此列"
      // }
    },
    // "lengthMenu": [ 5,],
    // 'data': data,
    // "deferRender": true,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "mac"
    }, ],

    "createdRow": function(row, data, index) {
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\" onclick=\"customer_blacklist_add_func('" + data.mac + "');\" id=\"blacklist_" + data.mac + "\"/><label for=\"blacklist_" + data.mac + "\"></label></div></div>"
      $('td', row).eq(1).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox" onclick="customer_blacklist_add_func('${ data.mac }');" id="blacklist_${ data.mac }"/><label for="blacklist_${ data.mac }"></label></div></div>`);
    }
  });
  // "{% url 'customer_black_list_add_ajax' %}"
  table.ajax.url(`${ url }/ap-list/ap_guest_policy/customer_black_list_add_ajax/`).load();
}

function customer_blacklist_add_func(mac) {
  // "#blacklist_" + mac + ""
  var ck = $(`#blacklist_${ mac }`).attr('checked');
  if (ck === "checked") {
    blacklist.push(mac);
  } else {
    blacklist.splice($.inArray(mac, blacklist), 1);
  }
}
$('#blacklist_add').click(function() {
  /* Act on the event */
  var input_mac = $('#input-customer-blacklist-mac').val();
  // '{% url "customer_blacklist_add" %}'
  $.post(`${ url }/ap-list/ap_guest_policy/customer_blacklist_add/`, {
    'bl': JSON.stringify(blacklist),
    'input_mac': JSON.stringify(input_mac.split('\n'))
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret.su === 'false') {
      if ($.trim(ret.error) !== "") {
        alert(ret.error);
      }
    } else if (ret.su === 'true') {
      alert(ret.error);
      $('#blacklist_add_cancel').click();
      customer_black_list_table();
    }
  });
});

function customer_black_list_table() {
  var table = $('#datatable-customer-black-list').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-4  modal_table_fix_1'l><'col-sm-8 float-right'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-4  modal_table_fix_1'l><'col-sm-8 float-right'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
    'language': {
      "sProcessing": pageWords.processing,
      "sLengthMenu": `${ pageWords.show } <select>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        </select> ${ pageWords.record }`,
      "sZeroRecords": pageWords.sZeroRecords,
      "sInfo": pageWords.sInfo,
      "sInfoEmpty": pageWords.sInfoEmpty,
      "sInfoFiltered": pageWords.sInfoFiltered,
      "sInfoPostFix": "",
      "sSearch": pageWords.sSearch,
      "sUrl": "",
      "sEmptyTable": pageWords.sEmptyTable,
      "sLoadingRecords": pageWords.sLoadingRecords,
      "sInfoThousands": ",",
      "oPaginate": {
        "sFirst": `<span class="fa fa-angle-double-left"></span>`,
        "sPrevious": `<span class="fa fa-angle-left"></span>`,
        "sNext": `<span class="fa fa-angle-right"></span>`,
        "sLast": `<span class="fa fa-angle-double-right"></span>`,
      },
      // "oAria": {
      //     "sSortAscending":  ": 以升序排列此列",
      //     "sSortDescending": ": 以降序排列此列"
      // }
    },
    // "lengthMenu": [ 5,],
    // 'data': data,
    // "deferRender": true,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "mac"
    }, ],

    "createdRow": function(row, data, index) {
      // console.log(data);
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<button type=\"button\" onclick=\"customer_blacklist_remove('" + data.mac + "');\" class=\"btn btn-default table-btn-btnpad\">{% trans '删除' %}</button>"
      $('td', row).eq(1).html(`<button type="button" onclick="customer_blacklist_remove('${ data.mac }');" class="btn btn-default table-btn-btnpad">${ pageWords.delete }</button>`);
    }
  });
  // "{% url 'customer_black_list_table' %}"
  table.ajax.url(`${ url }/ap-list/ap_guest_policy/customer_black_list_table/`).load();
}

function customer_blacklist_remove(mac) {
  // body...
  // '{% url "customer_blacklist_remove" %}'
  $.post(`${ url }/ap-list/ap_guest_policy/customer_blacklist_remove/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.error);
    customer_black_list_table();
  });
}

function open_form_customer_black_list() {
  // bk-bg-danger
  blacklist = [];
  $('#open_form_customer_black_list').click();

}

$(function() {
  // body...
  customer_white_list_table();
  get_customer_black_white_switch();
});

function customer_white_list_add_table() {
  var table = $('#datatable-customer-white-list-add').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
    'language': {
      "sProcessing": pageWords.processing,
      "sLengthMenu": `${ pageWords.show } <select>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        </select> ${ pageWords.record }`,
      "sZeroRecords": pageWords.sZeroRecords,
      "sInfo": pageWords.sInfo,
      "sInfoEmpty": pageWords.sInfoEmpty,
      "sInfoFiltered": pageWords.sInfoFiltered,
      "sInfoPostFix": "",
      "sSearch": pageWords.sSearch,
      "sUrl": "",
      "sEmptyTable": pageWords.sEmptyTable,
      "sLoadingRecords": pageWords.sLoadingRecords,
      "sInfoThousands": ",",
      "oPaginate": {
        "sFirst": `<span class="fa fa-angle-double-left"></span>`,
        "sPrevious": `<span class="fa fa-angle-left"></span>`,
        "sNext": `<span class="fa fa-angle-right"></span>`,
        "sLast": `<span class="fa fa-angle-double-right"></span>`,
      },
      // "oAria": {
      //     "sSortAscending":  ": 以升序排列此列",
      //     "sSortDescending": ": 以降序排列此列"
      // }
    },
    // "lengthMenu": [ 5,],
    // 'data': data,
    // "deferRender": true,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "mac"
    }, ],

    "createdRow": function(row, data, index) {
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`"<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\" onclick=\"customer_whitelist_add_func('" + data.mac + "');\" id=\"whitelist_" + data.mac + "\"/><label for=\"whitelist_" + data.mac + "\"></label></div></div>"
      $('td', row).eq(1).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox" onclick="customer_whitelist_add_func('${ data.mac }');" id="whitelist_${ data.mac }"/><label for="whitelist_${ data.mac }"></label></div></div>`);
    }
  });
  // "{% url 'customer_white_list_add_ajax' %}"
  table.ajax.url(`${ url }/ap-list/ap_guest_policy/customer_white_list_add_ajax/`).load();
}

function customer_whitelist_add_func(mac) {
  // "#whitelist_" + mac + ""
  var ck = $(`#whitelist_${ mac }`).attr('checked');
  if (ck === "checked") {
    whitelist.push(mac);
  } else {
    whitelist.splice($.inArray(mac, whitelist), 1);
  }
}
$('#whitelist_add').click(function() {
  /* Act on the event */
  var input_mac = $('#input-customer-whitelist-mac').val();
  // '{% url "customer_whitelist_add" %}'
  $.post(`${ url }/ap-list/ap_guest_policy/customer_whitelist_add/`, {
    'wl': JSON.stringify(whitelist),
    'input_mac': JSON.stringify(input_mac.split('\n'))
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret.su === 'false') {
      if ($.trim(ret.error) !== "") {
        alert(ret.error);
      }
    } else if (ret.su === 'true') {
      alert(ret.error);
      $('#whitelist_add_cancel').click();
      customer_white_list_table();
    }
  });
});

function customer_white_list_table() {
  var table = $('#datatable-customer-white-list').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-4  modal_table_fix_1'l><'col-sm-8 float-right'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-4  modal_table_fix_1'l><'col-sm-8 float-right'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
    'language': {
      "sProcessing": pageWords.processing,
      "sLengthMenu": `${ pageWords.show } <select>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        </select> ${ pageWords.record }`,
      "sZeroRecords": pageWords.sZeroRecords,
      "sInfo": pageWords.sInfo,
      "sInfoEmpty": pageWords.sInfoEmpty,
      "sInfoFiltered": pageWords.sInfoFiltered,
      "sInfoPostFix": "",
      "sSearch": pageWords.sSearch,
      "sUrl": "",
      "sEmptyTable": pageWords.sEmptyTable,
      "sLoadingRecords": pageWords.sLoadingRecords,
      "sInfoThousands": ",",
      "oPaginate": {
        "sFirst": `<span class="fa fa-angle-double-left"></span>`,
        "sPrevious": `<span class="fa fa-angle-left"></span>`,
        "sNext": `<span class="fa fa-angle-right"></span>`,
        "sLast": `<span class="fa fa-angle-double-right"></span>`,
      },
      // "oAria": {
      //     "sSortAscending":  ": 以升序排列此列",
      //     "sSortDescending": ": 以降序排列此列"
      // }
    },
    // "lengthMenu": [ 5,],
    // 'data': data,
    // "deferRender": true,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "mac"
    }, ],

    "createdRow": function(row, data, index) {
      // console.log(data);
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<button type=\"button\" onclick=\"customer_whitelist_remove('" + data.mac + "');\" class=\"btn btn-default table-btn-btnpad\">{% trans '删除' %}</button>"
      $('td', row).eq(1).html(`<button type="button" onclick="customer_whitelist_remove('${ data.mac }');" class="btn btn-default table-btn-btnpad">${ pageWords.delete }</button>`);
    }
  });
  // "{% url 'customer_white_list_table' %}"
  table.ajax.url(`${ url }/ap-list/ap_guest_policy/customer_white_list_table/`).load();
}

function customer_whitelist_remove(mac) {
  // body...
  // '{% url "customer_whitelist_remove" %}'
  $.post(`${ url }/ap-list/ap_guest_policy/customer_whitelist_remove/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.error);
    customer_white_list_table();
  });
}

function open_form_customer_white_list() {
  // bk-bg-danger
  whitelist = [];
  $('#open_form_customer_white_list').click();
}

function get_customer_black_white_switch() {
  // body...
  // '{% url "customer_black_white_switch" %}'
  $.getJSON(`${ url }/ap-list/ap_guest_policy/customer_black_white_switch/`, {
    mode: 'get'
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret.switch === "black") {
      $('#blacklist_start').attr('checked', 'checked');
      $('#whitelist_start').removeAttr('checked');

      $('#whitelist_start').on('click', return_false);
    } else if (ret.switch === "white") {
      $('#whitelist_start').attr('checked', 'checked');
      $('#blacklist_start').removeAttr('checked');

      $('#blacklist_start').on('click', return_false);
    } else {
      $('#blacklist_start').removeAttr('checked');
      $('#whitelist_start').removeAttr('checked');
    }
    // (ret.switch == "none")
  });
}
$('#whitelist_start').change(customer_black_white_switch);
$('#blacklist_start').change(customer_black_white_switch);

function customer_black_white_switch() {
  // body...
  var customer_switch = "none";
  if ($('#blacklist_start').attr('checked') === "checked" && $('#whitelist_start').attr('checked') === undefined) {
    $('#blacklist_start').off('click', return_false);
    $('#whitelist_start').on('click', return_false);
    customer_switch = "black";
  } else if ($('#whitelist_start').attr('checked') === "checked" && $('#blacklist_start').attr('checked') === undefined) {
    $('#blacklist_start').on('click', return_false);
    $('#whitelist_start').off('click', return_false);
    customer_switch = "white";
  } else if ($('#whitelist_start').attr('checked') === undefined && $('#blacklist_start').attr('checked') === undefined) {
    $('#blacklist_start').off('click', return_false);
    $('#whitelist_start').off('click', return_false);
    customer_switch = "none";
  }
  // '{% url "customer_black_white_switch" %}'
  $.post(`${ url }/ap-list/ap_guest_policy/customer_black_white_switch/`, {
    'mode': 'post',
    'switch': customer_switch
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret.error === "false") {
      alert(ret.msg);
      window.location.reload();
    }

  });
}

function return_false() {
  // body...
  alert(pageWords.blackWhiteListOpenError);
  return false;
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
    title: pageWords.promptInfo,
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
    title: pageWords.promptInfo,
    text: errors,
    type: 'error',
    addclass: 'stack-bar-top',
    stack: stack_bar_top,
    width: "100%"
  });
});
