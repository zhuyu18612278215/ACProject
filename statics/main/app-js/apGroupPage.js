var url = window.location.origin;
var administratorPermissionList = [1, 2, 3];

function open_form() {
  // bk-bg-danger
  $('#open_form').click();
  add_group_device_list = {
    "groupname": '',
    "mac": {}
  };
  $('#add_group_name').val('');
}

function open_form1(name, area_name, administrator_permission, id) {
  if (name === "DefaultGroup" && area_name === "admin") {
    $('#d-1').hide();
    $('#d-2').show();
  } else if (administratorPermissionList.indexOf(administrator_permission) !== -1) {
    // administrator_permission === 1 || administrator_permission === 2 || administrator_permission === 3
    if (name === area_name) {
      $('#d-1').hide();
      $('#d-2').show();
    } else {
      $('#d-2').hide();
      $('#d-1').show();
    }
  } else {
    $('#d-2').hide();
    $('#d-1').show();
  }
  $('#fix_group_name').val(name);

  $('#collapse-gpon-config').data('gp', id);
  show_gpon_config(id);
  $('#remove_device_href').click();
  $('#open_form1').click();
  modify_device = {
    "id": id,
    "groupname": '',
    "area_name": area_name,
    "remove_device_mac": {},
    "add_device_mac": {},
    "add_wlan": {}
  };
}

$('#gpon_update_button').click(function() {
  /* Act on the event */
  var gp = $('#collapse-gpon-config').data('gp');
  if ($.trim($('#gpon_update_link').val()) === "") {
    alert(pageWords.serverIPEmptyError);
  } else if ($.trim($('#gpon_update_file').val()) === "") {
    alert(pageWords.gponFileNameError);
  } else {
    var value = new Array();
    value[0] = $('#gpon_update_link').val();
    value[1] = $('#gpon_update_file').val();
    // '{% url "gpon_config_group" %}'
    $.post(`${ url }/ap/ap_list/gpon/gpon_config_group/`, {
      'gp': gp,
      'type': 'update',
      'value': JSON.stringify(value)
    }, function(ret) {
      /*optional stuff to do after success */
      alert(ret.mes);
    });
  }
});

function show_gpon_config(id) {
  // body...
  // '{% url "show_gpon_config" %}'
  $.getJSON(`${ url }/ap/ap_list/gpon/show_gpon_config/`, {
    'type': 'group',
    'gp': id
  }, function(ret) {
    /*optional stuff to do after success */
    // ret != {}
    if (!$.isEmptyObject(ret)) {
      $('#gpon_update_link').val(ret.update_link);
      $('#gpon_update_file').val(ret.update_file);
    }
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

(function($) {

  'use strict';

  var datatableInit = function() {

    $('#datatable-default-2').DataTable({
      "pagingType": "simple_numbers",
      "processing": true,
      "searching": true,
      "autoWidth": true,
      "deferRender": true,
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
    });

  };
  $(function() {
    datatableInit();
  });
}).apply(this, [jQuery]);

function device_add_ajax() {
  var table = $('#datatable-default-3').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "mac"
    }, {
      "data": "action"
    }, ],

    "createdRow": function(row, data, index) {
      // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\"  id=" + "add-" + data.mac + " onclick = \"add_device('" + data.mac + "')\"/><label for=" + "add-" + data.mac + "></label></div></div>"
      $('td', row).eq(2).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox"  id="add-${ data.mac }" onclick = "add_device('${ data.mac }')"/><label for="add-${ data.mac }"></label></div></div>"`);
    }
  });
  // alert(table.api().ajax.url());
  $('#datatable-default-3_filter').addClass("modal_table_fix_2");
  // "{% url 'ap_add_ajax' %}"
  table.ajax.url(`${ url }/ap/ap_group/ap_add_ajax/`).load();

}

function add_device_ajax(id) {
  var table = $('#datatable-default-add_device').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
    }, {
      "data": "action"
    }, ],

    "createdRow": function(row, data, index) {
      // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\"  id=" + "add_device-" + data.mac + " onclick = \"add_device_modify('" + data.mac + "')\"/><label for=" + "add_device-" + data.mac + "></label></div></div>"
      $('td', row).eq(2).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox"  id="add_device-${ data.mac }" onclick = "add_device_modify('${ data.mac }')"/><label for="add_device-${ data.mac }"></label></div></div>`);
    }
  });
  // alert(table.api().ajax.url());
  $('#datatable-default-add_device_filter').addClass("modal_table_fix_2");
  // "{% url 'add_ap_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/ap/ap_group/add_ap_ajax/?group_id=${ id }`).load();

}

function remove_device_ajax(id) {
  var table = $('#datatable-default-remove_device').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
    }, {
      "data": "action"
    }, ],
    "createdRow": function(row, data, index) {
      if (data.sign == "off") {

      } else {
        // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\"  id=" + "remove_device-" + data.mac + " onclick = \"remove_device('" + data.mac + "')\"/><label for=" + "remove_device-" + data.mac + "></label></div></div>"
        $('td', row).eq(2).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox"  id="remove_device-${ data.mac }" onclick = "remove_device('${ data.mac }')"/><label for="remove_device-${ data.mac }"></label></div></div>`);
      };
    }
  });
  // alert(table.api().ajax.url());
  $('#datatable-default-remove_device_filter').addClass("modal_table_fix_2");
  // "{% url 'remove_ap_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/ap/ap_group/remove_ap_ajax/?group_id=${ id }`).load();
}

function add_wlan_ajax(id) {
  var table = $('#datatable-default-add_wlan').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><'col-sm-6 modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
      "data": "sec_type"
    }, {
      "data": "guest_enabled"
    }, {
      "data": "wlan_service"
    }, ],
    "createdRow": function(row, data, index) {
      if (data.guest_enabled === 'on') {
        $('td', row).eq(2).text(pageWords.open);
      } else if (data.guest_enabled === 'off') {
        $('td', row).eq(2).text(pageWords.close);
      }
      if (data.wlan_service === 'on') {
        // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\" checked=\'checked\' id=" + "add_wlan-" + data.pk + " onclick = \"add_wlan_modify('" + data.pk + "')\"/><label for=" + "add_wlan-" + data.pk + "></label></div></div>"
        $('td', row).eq(3).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox" checked="checked" id="add_wlan-${ data.pk }" onclick = "add_wlan_modify('${ data.pk }')"/><label for="add_wlan-${ data.pk }"></label></div></div>`);
      } else if (data.wlan_service === 'off') {
        // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\"  id=" + "add_wlan-" + data.pk + " onclick = \"add_wlan_modify('" + data.pk + "')\"/><label for=" + "add_wlan-" + data.pk + "></label></div></div>"
        $('td', row).eq(3).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox"  id="add_wlan-${ data.pk }" onclick = "add_wlan_modify('${ data.pk }')"/><label for="add_wlan-${ data.pk }"></label></div></div>`);
      }
    }
  });
  // alert(table.api().ajax.url());
  $('#datatable-default-add_wlan_filter').addClass("modal_table_fix_2");
  // "{% url 'add_wlan_in_group_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/ap/ap_group/add_wlan_in_group_ajax/?group_id=${ id }`).load();
}

function ap_setting_ajax(id) {
  // body...
  // "{% url 'ap_setting_ajax' %}?group_id=" + id
  $.getJSON(`${ url }/ap/ap_wlan/ap_setting_ajax/?group_id=${ id }`, function(ret) {
    if (ret.group_name === "DefaultGroup" && ret.account_group_name === "admin") {
      $('#fix_group_name').attr('readonly', 'readonly');
    } else if (ret.account_group_name !== "admin" && ret.account_group_name === ret.group_name) {
      $('#fix_group_name').attr('readonly', 'readonly');
    } else {
      $('#fix_group_name').removeAttr('readonly', 'readonly');
    }
  })
}

function modify_device_group() {
  var name = $('#fix_group_name').val();
  // modify_device = {"id":id,"groupname":'',"area_name":area_name,"remove_device_mac":{},"add_device_mac":{},"setting":{}};
  if ($.trim(name) === '') {
    alert(pageWords.pleaseInputGroupName);
  } else {
    modify_device['groupname'] = name;
    // console.log(JSON.stringify(modify_device));
    // "{% url 'modify_ap_group_ajax' %}"
    $.post(`${ url }/ap/ap_group/modify_ap_group_ajax/`, {
      'modify_device': JSON.stringify(modify_device)
    }, function(ret) {
      if (ret.error_type === "failed") {
        alert(ret.error_msg);
      } else if (ret.error_type === "success") {
        location.reload();
      }
    });
  }
}

function remove_device(mac) {
  // "#remove_device-" + mac
  var id = `#remove_device-${ mac }`;
  if ($(id).attr('checked') === 'checked') {
    modify_device["remove_device_mac"][mac] = mac;
  } else {
    delete modify_device["remove_device_mac"][mac];
  }
  // console.log(modify_device);
}

function add_device_modify(mac) {
  // "#add_device-" + mac
  var id = `#add_device-${ mac }`;
  if ($(id).attr('checked') === 'checked') {
    modify_device["add_device_mac"][mac] = mac;
  } else {
    delete modify_device["add_device_mac"][mac];
  }
  // console.log(modify_device);
}

function add_wlan_modify(pk) {
  // "#add_wlan-" + pk
  var id = `#add_wlan-${ pk }`;
  if ($(id).attr('checked') === 'checked') {
    modify_device["add_wlan"][pk] = "on";
  } else {
    modify_device["add_wlan"][pk] = "off";
  }
  // console.log(modify_device);
}

function add_device(mac) {
  // "#add-" + mac
  var id = `#add-${ mac }`;
  if ($(id).attr('checked') === 'checked') {
    add_group_device_list["mac"][mac] = mac;
  } else {
    delete add_group_device_list["mac"][mac];
  }

}

function create_group() {
  var name = $('#add_group_name').val();

  if ($.trim(name) === '') {
    alert(pageWords.pleaseInputGroupName);
  } else {
    add_group_device_list['groupname'] = name;
    // b = add_group_device_list.toJSONString();
    // console.log(b);
    // var a = Object.prototype.toString
    // console.log(a.call(b).toLowerCase());
    // console.log(JSON.stringify(add_group_device_list));
    // "{% url 'add_ap_group_ajax' %}"
    $.post(`${ url }/ap/ap_group/add_ap_group_ajax/`, {
      'add_group_device_list': JSON.stringify(add_group_device_list)
    }, function(ret) {
      if (ret.error_type === "failed") {
        alert(ret.error_msg);
      } else if (ret.error_type === "success") {
        location.reload();
      }
    });
  }
}
