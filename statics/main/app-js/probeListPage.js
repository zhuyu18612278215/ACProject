var url = window.location.origin;

$(document).ready(function() {
  eventajax();
  al_access_table();
  create_button('probe');
});

function al_access_table() {
  // body...
  dynamicColumnsCreate();
  oTable = $('#datatable-default').DataTable({
    "dom": "<'row'<'col-sm-6' <'col-sm-6'l><'col-sm-6 device_type'>><'col-sm-6' <'col-sm-6 dynamicColumnsDiv'><'col-sm-6'f>>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    "destroy": true,
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
    "serverSide": true,
    // "{% url 'already_access_ajax' %}"
    "ajax": `${ url }/probe-list/already_access_ajax/`,
    "columns": columns,
    'createdRow': function(row, data, index) {
      if (data.last_heart_time === "1970-01-01 08:00:00") {
        $('td', row).eq(resultColumn.indexOf('heart')).html('<span></span>');
      }
      // "{% trans '退服' %}"
      if (data.state === pageWords.retired) {
        // "<span class=\"fa fa-hdd-o table-icon-span-gray\" title=\"" + data.model + "\"></span>"
        $('td', row).eq(resultColumn.indexOf('icon')).html(`<span class="fa fa-hdd-o table-icon-span-gray" title="${ data.model }" ></span>`);
      }
      // "{% trans '离线' %}" "{% trans '重启' %}" "{% trans '升级' %}"
      if (data.state === pageWords.offline || data.state === pageWords.reboot || data.state === pageWords.update) {
        // "<span class=\"fa fa-hdd-o table-icon-span-red\" title=\"" + data.model + "\"></span>"
        $('td', row).eq(resultColumn.indexOf('icon')).html(`<span class="fa fa-hdd-o table-icon-span-red" title="${ data.model }"></span>`);
      }
      // "{% trans '超时' %}"
      if (data.state === pageWords.timeOut) {
        // "<span class=\"fa fa-hdd-o table-icon-span-yellow\" title=\"" + data.model + "\"></span>"
        $('td', row).eq(resultColumn.indexOf('icon')).html(`<span class="fa fa-hdd-o table-icon-span-yellow" title="${ data.model }"></span>`);
      }
      // "{% trans '在线' %}"
      if (data.state === pageWords.online) {
        // "<span class=\"fa fa-hdd-o table-icon-span-green\" title=\"" + data.model + "\"></span>"
        $('td', row).eq(resultColumn.indexOf('icon')).html(`<span class="fa fa-hdd-o table-icon-span-green" title="${ data.model }"></span>`);
      }
      if ($.trim(data.name) !== "") {
        // "<a href=\"#\" onclick=\"ajaxfunc('" + data.mac + "','" + data.state + "')\" class=\"table-a-color\">" + data.name + "</a>"
        $('td', row).eq(resultColumn.indexOf('name')).html(`<a href="#" onclick="ajaxfunc('${ data.mac }','${ data.state }')" class="table-a-color">${ data.name }</a>`);
      } else {
        // "<a href=\"#\" onclick=\"ajaxfunc('" + data.mac + "','" + data.state + "')\" class=\"table-a-color\">" + data.model + "_" + (data.mac).substring(6) + "</a>"
        $('td', row).eq(resultColumn.indexOf('name')).html(`<a href="#" onclick="ajaxfunc('${ data.mac }','${ data.state }')" class="table-a-color">${ data.model }_${ (data.mac).substring(6) }</a>`);

      }
      if (data.vpn === 'on' && $.trim(data.vpnip) !== '') {
        // "<span class=\"fa fa-cloud\" title=\"{% trans '私网地址' %}:" + data.privateip + " {% trans '远程地址' %}:" + data.vpnip + "\" style=\"color:#3bbfb4\"></span>" + data.lastip + ""
        $('td', row).eq(resultColumn.indexOf('ip')).html(`<span class="fa fa-cloud" title="${ pageWords.privateip }: ${ data.privateip } ${ pageWords.vpnip }: ${ data.vpnip }" style="color:#3bbfb4"></span>${ data.lastip }`);
      } else {
        // "<span class=\"fa fa-cloud\" title=\"{% trans '私网地址' %}:" + data.privateip + "\" ></span>" + data.lastip + ""
        $('td', row).eq(resultColumn.indexOf('ip')).html(`<span class="fa fa-cloud" title="${ pageWords.privateip }: ${ data.privateip }"></span>${ data.lastip }`);
      }
      var a = '';
      if (data.issue_config_switch === "on") {
        // "{% trans '在线' %}"
        if (data.state === pageWords.online) {
          if (data.admin_power_control !== "ban") {
            // a = a + "<a class=\"btn btn-default table-btn-btnpad\" href=\"#\" onclick=\"probe_reboot('" + data.mac + "');\">{% trans '重启' %}</a>";
            a = `${ a }<a class="btn btn-default table-btn-btnpad" href="#" onclick="probe_reboot('${ data.mac }');">${ pageWords.reboot }</a>`;
            if (data.upgrade_button === true) {
              // a = a + "<a class=\"btn btn-default table-btn-btnpad\" href=\"#\" title=\"" + data.upgrade_version + "\" onclick=\"probe_upgrade('" + data.mac + "');\">{% trans '升级' %}</a>";
              a = `${ a }<a class="btn btn-default table-btn-btnpad" href="#" title="${ data.upgrade_version }" onclick="probe_upgrade('${ data.mac }');">${ pageWords.update }</a>`;
            }
          }
        }
        // "{% trans '重启' %}" "{% trans '升级' %}"
        if (data.state === pageWords.reboot || data.state === pageWords.update) {
          a = '';
        } else {
          // a = a + "<a class=\"btn btn-default table-btn-btnpad\" href=\"#\" onclick=\"probe_del('" + data.mac + "');\">{% trans '移除' %}</a>";
          a = `${ a }<a class="btn btn-default table-btn-btnpad" href="#" onclick="probe_del('${ data.mac }');">${ pageWords.remove }</a>`;
        }
      }
      $('td', row).eq(resultColumn.indexOf('act')).html(a);
      $('td', row).eq(resultColumn.indexOf('upload')).text(getFlow(data.upload));
      $('td', row).eq(resultColumn.indexOf('download')).text(getFlow(data.download));
      if (data.locateState === 'on') {
        $('td', row).eq(resultColumn.indexOf('state')).text(`${data.state}(${pageWords.locating})`);
      };

    }
  });
  // '<input type="text" class="form-control input-sm" id="change_page" placeholder=\"{% trans "跳转至" %}\" style="margin-top: 2px;padding-right: 0px;padding-left: 5px;width: 57px; "/>'
  $('#ch').html(`<input type="text" class="form-control input-sm" id="change_page" placeholder="${ pageWords.jump }" style="margin-top: 2px;padding-right: 0px;padding-left: 5px;width: 57px; "/>`);
  $('#change_page').change(function() {
    var page = parseInt($('#change_page').val());
    if (!isNaN(page)) {
      oTable.page(page - 1).draw(false);
    } else {
      $('#change_page').val('');
    }
  });
}

// (function( $ ) {

//  'use strict';

//  var datatableInit = function() {

//      $('#datatable-default-2').DataTable({
//         "pagingType": "simple_numbers",
//         "processing": true,
//         "searching": true,
//         "autoWidth": true,
//         "deferRender": true,
//         'language':{
//             "sProcessing":   "{% trans '处理中...' %}",
//             "sLengthMenu":   '{% trans "显示" %} <select>'+
//                              '<option value="5">5</option>'+
//                              '<option value="10">10</option>'+
//                              '<option value="20">20</option>'+
//                              '<option value="50">50</option>'+
//                              '</select> {% trans "记录" %}',
//             "sZeroRecords":  "{% trans '没有匹配结果' %}",
//             "sInfo":         "{% trans '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项' %}",
//             "sInfoEmpty":    "{% trans '显示第 0 至 0 项结果，共 0 项' %}",
//             "sInfoFiltered": "({% trans '由 _MAX_ 项结果过滤' %})",
//             "sInfoPostFix":  "",
//             "sSearch":       '{% trans "搜索 : " %}',
//             "sUrl":          "",
//             "sEmptyTable":     "{% trans '表中数据为空' %}",
//             "sLoadingRecords": "{% trans '载入中...' %}",
//             "sInfoThousands":  ",",
//             "oPaginate": {
//                 "sFirst":    "<span class=\"fa fa-angle-double-left\"></span>",
//                 "sPrevious": "<span class=\"fa fa-angle-left\"></span>",
//                 "sNext":     "<span class=\"fa fa-angle-right\"></span>",
//                 "sLast":     "<span class=\"fa fa-angle-double-right\"></span>"
//             },
//             // "oAria": {
//             //     "sSortAscending":  ": 以升序排列此列",
//             //     "sSortDescending": ": 以降序排列此列"
//             // }
//         },
//         "ajax": "{% url 'wait_access_ajax' %}",
//         "columns": [
//             { "data": "model" },
//             { "data": "mac" },
//             { "data": "lastip" },
//             { "data": "mac" },
//             { "data": "version" },
//             { "data": "last_heart_time" },
//             { "data": "mac" }
//         ],
//         'createdRow': function ( row, data, index ) {
//             $('td',row).eq(0).html("<span class=\"fa fa-hdd-o table-icon-span-yellow\" title=\""+data.model+"\"></span>");
//             $('td',row).eq(1).html("<a href=\"#\" class=\"table-a-color\">"+data.model+"_"+(data.mac).substring(6)+"</a>");
//             $('td',row).eq(2).html("<span class=\"fa fa-cloud\" title=\"{% trans '私网地址' %}:"+data.privateip+"\"></span>"+data.lastip+"");
//             $('td',row).eq(3).text("{% trans '待准入' %}");
//             $('td',row).eq(6).html("<a class=\"btn btn-default table-btn-btnpad\" href=\"{% url 'probe_access' %}?mac="+data.mac+"\">{% trans '准入' %}</a>");
//         }
//      });


//  };

//  $(function() {
//      datatableInit();
//  });

// }).apply( this, [ jQuery ]);

function eventajax() {

  var time = $('#event-time-type').val();
  var type = $('#event-type').val();
  var table = $('#datatable-default-3').DataTable({
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
    // 'data': data,
    'retrieve': true,
    'destroy': true,
    "columns": [{
        "data": "event_time"
      }, {
        "data": "msg"
      },
      // { "data": "action" },
    ],
    'createdRow': function(row, data, index) {
      if (data.msg.match(/Device\[(\S*)\]/g) !== null) {
        // "Device[<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(data.probe_mac) + "','" + String(data.state) + "')\">$1</a>]"
        $('td', row).eq(1).html(String($('td', row).eq(1).text()).replace(/Device\[(\S{12})\]/g, `Device[<a href="#" class="table-a-color" onclick="ajaxfunc('${ String(data.probe_mac) }','${ String(data.state) }')">$1</a>]`));
      };
      // if(data.event == "PROBE_WAS_OFFLINED"){
      //     $('td', row).eq(2).html("<a  href='#' class='btn btn-default table-btn-btnpad'>"+ data.action +"</a>");
      // }else{
      //     $('td', row).eq(2).html("");
      // }
    }
  });
  // alert(table.api().ajax.url());
  if (type === "admin") {
    // "{% url 'eventajax' %}?type=" + type + "&time=" + time
    table.ajax.url(`${ url }/probe-list/eventajax/?type=${ type }&time=${ time }`).load();
  };
  if (type === "dev") {
    // "{% url 'eventajax' %}?type=" + type + "&time=" + time
    table.ajax.url(`${ url }/probe-list/eventajax/?type=${ type }&time=${ time }`).load();
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

$(function() {
  $("#modalForm").draggable({
    cancel: ".drag",
  });
});
