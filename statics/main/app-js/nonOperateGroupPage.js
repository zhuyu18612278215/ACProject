var url = window.location.origin;
var administratorPermissionList = [1, 2, 3];
var auditCropLimitList = ['3', '15', '22', '50', '27', '28', '31', '7', '29', '30'];
var auditIdTypeLimitList = ['22', '7', '29', '30'];
var auditDevTypeLimitList = ['29', '30'];

var manu = {
  // '1': 'JiangSuPaibo',
  // '16': 'Xinghan',
  // '50': 'Byzoro',
  // '51': 'Paibo',
  // '52': 'Star Media',
  // '31': 'XinghanFeiJing',
  '1': '江苏派博',
  '7': '新网程',
  '16': '星瀚',
  '50': '百卓',
  '51': '派博',
  '52': '网际星辰',
  '31': '星瀚非经',
  '22': '爱思网安',
  '29': '任子行',
  '30': '任子行V1.0',
};
var renZiXingDevType = {
  '00': '固定AP',
  '01': '移动AP',
  '10': '固定围栏',
  '11': '移动围栏',
  '12': '单兵设备围栏',
  '20': 'H系列',
  '22': 'RT系列',
  '30': '网关设备',
  '90': '警用热点+无线二合一',
  '91': '警用热点+电子围栏二合一',
};
var dev_type = {
  normal: {
    '1': '固定采集设备',
    '2': '移动车载采集设备',
    '3': '单兵采集设备',
    '9': '其他',
  },
  '29': renZiXingDevType,
  '30': renZiXingDevType,
};
var place_type = {
  // '1': 'Hotel',
  // '2': 'Library',
  // '3': 'Computer Training',
  // '4': 'Entertainment',
  // '5': 'Traffic Hinge',
  // '6': 'Vehicle',
  // '7': 'Catering',
  // '8': 'Financial',
  // 'A': 'Shopping',
  // 'B': 'Public Service',
  // 'C': 'Cultural Services',
  // 'D': 'Public Leisure',
  // '9': 'Other',
  '0': '网吧',
  '1': '旅店宾馆类',
  '2': '图书馆阅览室',
  '3': '电脑培训中心类',
  '4': '娱乐场所类',
  '5': '交通枢纽',
  '6': '公共交通工具',
  '7': '餐饮服务场所',
  '8': '金融服务场所',
  'A': '购物场所',
  'B': '公共服务场所',
  'C': '文化服务场所',
  'D': '公共休闲场所',
  '9': '其他',
}
var nature = {
  // '0': 'Business',
  // '1': 'Non-Business',
  // '3': 'Other',
  '0': '经营',
  '1': '非经营',
  '3': '其他',
}
var renZiXingIdType = {
  '1021111': '身份证',
  '1021133': '学生证',
  '1021335': '驾驶证',
  '1021114': '军官证',
  '1021123': '警官证',
  '1021113': '户口簿',
  '1021414': '护照',
  '1021511': '台胞证',
  '1021516': '回乡证',
  '1021159': '社保卡',
  '1021233': '士兵证/军人证',
  '1021990': '其他证件',
};
var id_type = {
  // '2': 'Phone Number',
  // '111': 'ID card',
  // '990': 'Other',
  normal: {
    '2': '手机号',
    '111': '身份证',
    '990': '其他',
  },
  '22': {
    '111': '身份证',
    '112': '临时身份证',
    '113': '户口簿',
    '114': '军官证',
    '123': '警官证',
    '133': '学生证',
    '414': '护照',
    '501': '手机号',
    '999': '特殊数据',
  },
  '7': {
    '111': '居民身份证',
    '112': '临时居民身份证',
    '114': '中国人民解放军军官证',
    '116': '暂住证',
    '123': '警官证',
    '133': '学生证',
    '335': '机动车驾驶证',
    '411': '外交护照',
    '412': '公务护照',
    '413': '因公普通护照',
    '414': '普通护照',
    '415': '旅行证',
    '416': '入出境通行证',
    '417': '外国人出入境证',
    '418': '外国人旅行证',
    '420': '香港特别行政区护照',
    '421': '澳门特别行政区护照',
    '511': '台湾居民来往大陆通行证',
    '513': '往来港澳通行证',
    '515': '前往港澳通行证',
    '516': '港澳同胞回乡证(通行卡)',
    '517': '大陆居民往来台湾通行证',
    '518': '因公往来香港澳门特别行政区通行证',
    '554': '外国人居留证',
    '555': '外国人临时居留证',
    '711': '边境管理区通行证',
    '990': '其他证件',
  },
  '29': renZiXingIdType,
  '30': renZiXingIdType,
}

// 添加option
$(function() {
  // body...
  addAuditSelectOption(OEMLimitType);
});

function addAuditSelectOption(oem = '', ...other) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let corpHTML = emptyHTML;
  if (oem === 'qingdao') {
    corpHTML = `<option value="52">${ manu['52'] }</option>`;
  } else {
    Object.keys(manu).forEach(function(value) {
      if (value !== '52') {
        corpHTML = `${ corpHTML }<option value="${ value }">${ manu[value] }</option>`;
      }
    });
  }
  $('#device_setting_ajax_audit_corp').html(corpHTML);

  let netsiteTypeHTML = emptyHTML;
  Object.keys(place_type).forEach(function(value) {
    netsiteTypeHTML = `${ netsiteTypeHTML }<option value="${ value }">${ place_type[value] }</option>`;
  });
  $('#device_setting_ajax_netsite_type').html(netsiteTypeHTML);

  let bussinessNatureHTML = emptyHTML;
  Object.keys(nature).forEach(function(value) {
    bussinessNatureHTML = `${ bussinessNatureHTML }<option value="${ value }">${ nature[value] }</option>`;
  });
  $('#device_setting_ajax_bussiness_nature').html(bussinessNatureHTML);

  addAuditIdTypeSelectOption('normal');
  addAuditDevTypeSelectOption('normal');
}

function addAuditIdTypeSelectOption(corp) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let certificateTypeHTML = emptyHTML;
  Object.keys(id_type[corp]).forEach(function(value) {
    certificateTypeHTML = `${ certificateTypeHTML }<option value="${ value }">${ id_type[corp][value] }</option>`;
  });
  $('#device_setting_ajax_certificate_type').html(certificateTypeHTML);
}

function addAuditDevTypeSelectOption(corp) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let equipmentTypeHTML = emptyHTML;
  Object.keys(dev_type[corp]).forEach(function(value) {
    equipmentTypeHTML = `${ equipmentTypeHTML }<option value="${ value }">${ dev_type[corp][value] }</option>`;
  });
  $('#device_setting_ajax_equipment_type').html(equipmentTypeHTML);
}

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

  // $('#collapse-gpon-config').data('gp', id);
  // show_gpon_config(id);
  $('#remove_device_href').click();
  $('#open_form1').click();
  modify_device = {
    "id": id,
    "groupname": '',
    "area_name": area_name,
    "remove_device_mac": {},
    "add_device_mac": {},
    "add_wlan": {},
    "setting": {}
  };
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
  // "{% url 'nonoperate_add_ajax' %}"
  table.ajax.url(`${ url }/nonoperate/nonoperate_group/nonoperate_add_ajax/`).load();

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
  // "{% url 'add_nonoperate_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/nonoperate/nonoperate_group/add_nonoperate_ajax/?group_id=${ id }`).load();

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
  // "{% url 'remove_nonoperate_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/nonoperate/nonoperate_group/remove_nonoperate_ajax/?group_id=${ id }`).load();
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
  // "{% url 'add_nonoperate_wlan_in_group_ajax' %}?group_id=" + id
  table.ajax.url(`${ url }/nonoperate/nonoperate_group/add_nonoperate_wlan_in_group_ajax/?group_id=${ id }`).load();
}

function ap_setting_ajax(id) {
  // body...
  // "{% url 'nonoperate_setting_ajax' %}?group_id=" + id
  $.getJSON(`${ url }/nonoperate/nonoperate_wlan/nonoperate_setting_ajax/?group_id=${ id }`, function(ret) {
    if (ret.group_name === "DefaultGroup" && ret.account_group_name === "admin") {
      $('#fix_group_name').attr('readonly', 'readonly');
    } else if (ret.account_group_name !== "admin" && ret.account_group_name === ret.group_name) {
      $('#fix_group_name').attr('readonly', 'readonly');
    } else {
      $('#fix_group_name').removeAttr('readonly', 'readonly');
    }

    $('#device_setting_ajax_audit_corp').val(ret.audit_corp);

    // renzixing,wangbo,chongqingaisi,byzoro feijing
    // ret.audit_corp == '3' || ret.audit_corp == '15' || ret.audit_corp == '22' || ret.audit_corp == '50' || ret.audit_corp == '27' || ret.audit_corp == '28'
    if (auditCropLimitList.indexOf(String(ret.audit_corp) !== -1)) {
      $("#ftp_name_hide").show();
      $("#ftp_passwd_hide").show();
      $('#ftp_name').val('');
      $('#ftp_name').val(ret.ftp_name);
      $('#ftp_passwd').val('');
      $('#ftp_passwd').val(ret.ftp_passwd);
      // console.log(ret.ftp_name);
      if (ret.audit_corp === '50') {
        $("#ftp_port_hide").show();
        $('#ftp_port').val('');
        $('#ftp_port').val(ret.ftp_port);
      } else {
        $("#ftp_port_hide").hide();
        $('#ftp_port').val('');
      }
    } else {
      $("#ftp_name_hide").hide();
      $("#ftp_passwd_hide").hide();
      $("#ftp_port_hide").hide();
      $('#ftp_name').val('');
      $('#ftp_passwd').val('');
      $('#ftp_port').val('');
      // $('#vlan').val(ret.vlan);
    }

    $('#device_setting_ajax_audit_ip').val(ret.audit_ip);
    $('#device_setting_ajax_audit_port').val(ret.audit_port);
    $('#device_setting_ajax_location_encode').val(ret.location_encode);
    $('#device_setting_ajax_device_encode').val(ret.device_encode);
    $('#device_setting_ajax_longitude').val(ret.longitude);
    $('#device_setting_ajax_latitude').val(ret.latitude);

    $('#device_setting_ajax_collection_radius').val(ret.collection_radius);
    let auditDevType = 'normal';
    if (auditDevTypeLimitList.indexOf(String(ret.audit_corp)) !== -1) {
      auditDevType = String(ret.audit_corp);
    }
    addAuditDevTypeSelectOption(auditDevType);
    $('#device_setting_ajax_equipment_type').val(ret.collection_equipment_type);
    $('#device_setting_ajax_equipment_name').val(ret.collection_equipment_name);
    $('#device_setting_ajax_equipment_address').val(ret.collection_equipment_address);
    $('#device_setting_ajax_software_orgcode').val(ret.security_software_orgcode);
    $('#device_setting_ajax_software_orgname').val(ret.security_software_orgname);
    $('#device_setting_ajax_software_address').val(ret.security_software_address);
    $('#device_setting_ajax_contactor').val(ret.contactor);
    $('#device_setting_ajax_contactor_tel').val(ret.contactor_tel);
    $('#device_setting_ajax_contactor_mail').val(ret.contactor_mail);

    $('#device_setting_ajax_place_name').val(ret.place_name);
    $('#device_setting_ajax_site_address').val(ret.site_address);
    $('#device_setting_ajax_netsite_type').val(ret.netsite_type);
    $('#device_setting_ajax_bussiness_nature').val(ret.bussiness_nature);
    $('#device_setting_ajax_law_principal_name').val(ret.law_principal_name);

    // for corp to change id type
    let auditIdType = 'normal';
    if (auditIdTypeLimitList.indexOf(String(ret.audit_corp)) !== -1) {
      auditIdType = String(ret.audit_corp);
    }
    addAuditIdTypeSelectOption(auditIdType);
    $('#device_setting_ajax_certificate_type').val(ret.law_principal_certificate_type);


    $('#device_setting_ajax_certificate_id').val(ret.law_principal_certificate_id);
    $('#device_setting_ajax_relationship_account').val(ret.relationship_account);
    $('#device_setting_ajax_start_time').val(ret.start_time);
    $('#device_setting_ajax_end_time').val(ret.end_time);

    check_show_policy({
      audit_corp: ret.audit_corp,
      site_type_val: ret.site_type,
      police_station_code_val: ret.police_station_code
    });

    var ssid = JSON.parse(ret.ssid)
    // console.log(ssid);
    if ($.trim(ssid) === "") {
      $('#ssid_0').val("");
      $('#enc_false_0').attr('checked', 'checked');
      // $('#enc_true_0').removeAttr('checked', 'checked');
      $('#wlan_append').html('');
    } else {
      $('#ssid_0').val("");
      $('#enc_false_0').attr('checked', 'checked');
      // $('#enc_true_0').removeAttr('checked', 'checked');
      $('#wlan_append').html('');
      for (var i in ssid) {
        var x = parseInt(i) + 1;
        var ss = ssid[i].name;
        if (ssid[i].encryption === 'none') {
          enc_true = "";
          enc_false = 'checked="checked"';
          lock = "display:none;";
        } else if (ssid[i].encryption === 'psk2') {
          enc_true = 'checked="checked"';
          enc_false = "";
          lock = '';
        }
        // $('#ssid_'+i).val(ssid[i].name);
        // if(ssid[i].encryption == 'none'){
        //     $('#enc_false_'+i).attr('checked', 'checked');
        // }else if(ssid[i].encryption == 'psk2'){
        //     $('#enc_true_'+i).attr('checked', 'checked');
        // }
        if (i != 7) {
          $('#wlan_append').prepend(
            //   '<div class="col-md-12 penel-body-div-marign-bottom" id="ssid_div_' + x + '" >\
            //     <span class="col-md-4 penel-body-title-font">SSID:</span>\
            //     <span class="col-md-1"></span>\
            //     <span class="col-md-1"><i class="fa fa-lock " style="font-size:20px;color:lightgrey;' + lock + '" title=\"{% trans "已加密" %}\"></i></span>\
            //     <div class="col-md-6">\
            //         <div class="input-group">\
            //             <input type="text" class="form-control ssid" id="ssid_' + x + '" value="' + ss + '" readonly="readonly">\
            //             <span class=" input-group-btn penel-body-title-font"><a href="#" class="remove_input btn btn-default ssid-group-button"><i class="fa fa-minus ssid-group-button-i-color"></i></a></span>\
            //         </div>\
            //         <div class="probe-ssid-box" style="display:none;">\
            //             <div class="probe-ssid-encryption">\
            //                 <input type="radio" name="encyption_' + x + '" value="psk2" id="enc_true_' + x + '" ' + enc_true + '>\
            //                 <label for="enc_true_' + x + '">{% trans "加密" %}</label>\
            //                 <input type="radio" name="encyption_' + x + '" value="none" id="enc_false_' + x + '" ' + enc_false + '>\
            //                 <label for="enc_false_' + x + '">{% trans "不加密" %}</label>\
            //             </div>\
            //         </div>\
            //     </div>\
            // </div>'
            `<div class="col-md-12 penel-body-div-marign-bottom" id="ssid_div_${ x }" >
              <span class="col-md-4 penel-body-title-font">SSID:</span>
              <span class="col-md-1"></span>
              <span class="col-md-1"><i class="fa fa-lock " style="font-size:20px;color:lightgrey;${ lock }" title="${ pageWords.alreadyEncrypt }"></i></span>
              <div class="col-md-6">
                  <div class="input-group">
                      <input type="text" class="form-control ssid" id="ssid_${ x }" value="${ ss }" readonly="readonly">
                      <span class=" input-group-btn penel-body-title-font"><a href="#" class="remove_input btn btn-default ssid-group-button"><i class="fa fa-minus ssid-group-button-i-color"></i></a></span>
                  </div>
                  <div class="probe-ssid-box" style="display:none;">
                      <div class="probe-ssid-encryption">
                          <input type="radio" name="encyption_${ x }" value="psk2" id="enc_true_${ x }" ${ enc_true }>\
                          <label for="enc_true_${ x }">${ pageWords.encrypt }</label>
                          <input type="radio" name="encyption_${ x }" value="none" id="enc_false_${ x }" ${ enc_false }>\
                          <label for="enc_false_${ x }">${ pageWords.noEncrypt }</label>
                      </div>
                  </div>
              </div>
          </div>`
          );
        } else {
          $('#ssid_0').val(ssid[7].name);
          if (ssid[7].encryption === 'none') {
            $('#enc_false_0').attr('checked', 'checked');
          } else if (ssid[7].encryption === 'psk2') {
            $('#enc_true_0').attr('checked', 'checked');
          }
        }
      }
    }

    // if(ret.admin_power_control == "ban"){
    //     $('#a_audit_fix').hide();
    // }else{
    //     $('#a_audit_fix').show();
    // }
  })
}

$('#device_setting_ajax_audit_corp').click(function() {

  // renzixing,wangbo,chongqingaisi,byzoro feijing
  // $('#device_setting_ajax_audit_corp').attr('value') == '3' || $('#device_setting_ajax_audit_corp').attr('value') == '15' || $('#device_setting_ajax_audit_corp').attr('value') == '22' || $('#device_setting_ajax_audit_corp').attr('value') == '50' || $('#device_setting_ajax_audit_corp').attr('value') == '27' | $('#device_setting_ajax_audit_corp').attr('value') == '28'
  if (auditCropLimitList.indexOf(String($('#device_setting_ajax_audit_corp').attr('value'))) !== -1) {
    $("#ftp_name_hide").show();
    $("#ftp_passwd_hide").show();

    if ($('#device_setting_ajax_audit_corp').attr('value') === '50') {
      $("#ftp_port_hide").show();

    } else {
      $("#ftp_port_hide").hide();
      $('#ftp_port').val("");
    }
  } else {
    $("#ftp_name_hide").hide();
    $("#ftp_passwd_hide").hide();
    $("#ftp_port_hide").hide();

    $('#ftp_name').val("");
    $('#ftp_passwd').val("");
    $('#ftp_port').val("");
  }

  // for corp to change id type
  let auditIdType = 'normal';
  if (auditIdTypeLimitList.indexOf(String($('#device_setting_ajax_audit_corp').attr('value'))) !== -1) {
    auditIdType = String($('#device_setting_ajax_audit_corp').attr('value'));
  }
  addAuditIdTypeSelectOption(auditIdType);
  let auditDevType = 'normal';
  if (auditDevTypeLimitList.indexOf(String($('#device_setting_ajax_audit_corp').attr('value'))) !== -1) {
    auditDevType = String($('#device_setting_ajax_audit_corp').attr('value'));
  }
  addAuditDevTypeSelectOption(auditDevType);
});

function modify_device_group() {
  var name = $('#fix_group_name').val();
  // modify_device = {"id":id,"groupname":'',"area_name":area_name,"remove_device_mac":{},"add_device_mac":{},"setting":{}};
  if ($.trim(name) === '') {
    alert(pageWords.pleaseInputGroupName);
  } else {
    modify_device['groupname'] = name;
    modify_device["setting"]['audit_corp'] = $('#device_setting_ajax_audit_corp').val();
    modify_device["setting"]['ftp_name'] = $('#ftp_name').val();
    modify_device["setting"]['ftp_passwd'] = $('#ftp_passwd').val();
    modify_device["setting"]['ftp_port'] = $('#ftp_port').val();
    modify_device["setting"]['audit_ip'] = $('#device_setting_ajax_audit_ip').val();
    modify_device["setting"]['audit_port'] = $('#device_setting_ajax_audit_port').val();
    modify_device["setting"]['location_encode'] = $('#device_setting_ajax_location_encode').val();
    modify_device["setting"]['device_encode'] = $('#device_setting_ajax_device_encode').val();
    modify_device["setting"]['longitude'] = $('#device_setting_ajax_longitude').val();
    modify_device["setting"]['latitude'] = $('#device_setting_ajax_latitude').val();
    modify_device["setting"]['collection_radius'] = $('#device_setting_ajax_collection_radius').val();
    modify_device["setting"]['collection_equipment_type'] = $('#device_setting_ajax_equipment_type').val();
    modify_device["setting"]['collection_equipment_name'] = $('#device_setting_ajax_equipment_name').val();
    modify_device["setting"]['collection_equipment_address'] = $('#device_setting_ajax_equipment_address').val();
    modify_device["setting"]['security_software_orgcode'] = $('#device_setting_ajax_software_orgcode').val();
    modify_device["setting"]['security_software_orgname'] = $('#device_setting_ajax_software_orgname').val();
    modify_device["setting"]['security_software_address'] = $('#device_setting_ajax_software_address').val();
    modify_device["setting"]['contactor'] = $('#device_setting_ajax_contactor').val();
    modify_device["setting"]['contactor_tel'] = $('#device_setting_ajax_contactor_tel').val();
    modify_device["setting"]['contactor_mail'] = $('#device_setting_ajax_contactor_mail').val();
    modify_device["setting"]['place_name'] = $('#device_setting_ajax_place_name').val();
    modify_device["setting"]['site_address'] = $('#device_setting_ajax_site_address').val();
    modify_device["setting"]['netsite_type'] = $('#device_setting_ajax_netsite_type').val();
    modify_device["setting"]['bussiness_nature'] = $('#device_setting_ajax_bussiness_nature').val();
    modify_device["setting"]['law_principal_name'] = $('#device_setting_ajax_law_principal_name').val();
    modify_device["setting"]['law_principal_certificate_type'] = $('#device_setting_ajax_certificate_type').val();
    modify_device["setting"]['law_principal_certificate_id'] = $('#device_setting_ajax_certificate_id').val();
    modify_device["setting"]['relationship_account'] = $('#device_setting_ajax_relationship_account').val();
    modify_device["setting"]['start_time'] = $('#device_setting_ajax_start_time').val();
    modify_device["setting"]['end_time'] = $('#device_setting_ajax_end_time').val();

    modify_device["setting"]['police_station_code'] = $('#device_setting_ajax_police_station_code').val();

    // console.log(JSON.stringify(modify_device));
    // "{% url 'modify_nonoperate_group_ajax' %}"
    $.post(`${ url }/nonoperate/nonoperate_group/modify_nonoperate_group_ajax/`, {
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
    // "{% url 'add_nonoperate_group_ajax' %}"
    $.post(`${ url }/nonoperate/nonoperate_group/add_nonoperate_group_ajax/`, {
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
