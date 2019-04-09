var url = window.location.origin;

$(function() {
  // body...
  customer_table();
  $(':input.radio').labelauty();
  $('#apply_change_wlan').click(apply_change_wlan);
  $('#reduction_change_wlan').click(reduction_change_wlan);
  create_button('ap');
});

function customer_table() {
  // body...
  oTable = $('#datatable-customer').DataTable({
    // "dom":"<'row'<'col-sm-6' l><'col-sm-6' f>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
    "dom": "<'row'<'col-sm-6' <'col-sm-6'l><'col-sm-6 customer_type'>><'col-sm-6' f>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
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
    // "{% url 'customer_table' %}?customer_type=all"
    "ajax": `${ url }/ap/ap_customer/customer_table/?customer_type=all`,
    "columns": [{
        "data": "mac"
      }, {
        "data": "ip"
      }, {
        "data": "wlanid"
      }, {
        "data": "ap"
      }, {
        "data": "signal"
      }, {
        "data": "channel"
      },
      // { "data": "tx_bytes" },
      // { "data": "rx_bytes" },
      {
        "data": "uptime"
      }, {
        "data": "portal_enable"
      }, {
        "data": "uphone"
      }, {
        "data": "mac"
      }
    ],
    "columnDefs": [{
      "orderable": false,
      "targets": 0
    }],
    "order": [
      [3, 'asc']
    ],
    'createdRow': function(row, data, index) {
      // "<a href=\"#\" onclick=\"customer_detail('" + data.mac + "','" + data.id + "');\" class=\"table-a-color\">" + data.name + "</a>"
      $('td', row).eq(0).html(`<a href="#" onclick="customer_detail('${ data.mac }','${ data.id }');" class="table-a-color">${ data.name }</a>`);
      if ($.trim(data.wlan) !== "") {
        $('td', row).eq(2).text(data.wlan);
      }
      if ($.trim(data.ap_dev) !== "") {
        // "<a href=\"#\" onclick=\"ajaxfunc('" + data.ap + "','" + data.state + "');wlan_modify(\'" + data.dev_id + "\');\" class=\"table-a-color\">" + data.ap_dev + "</a>"
        $('td', row).eq(3).html(`<a href="#" onclick="ajaxfunc('${ data.ap }','${ data.state }');wlan_modify('${ data.dev_id }');" class="table-a-color">${ data.ap_dev }</a>`);
      }
      $('td', row).eq(4).text(rssiToSignalQuality(data.signal));
      // $('td',row).eq(5).text(getFlow(data.tx_bytes));
      // $('td',row).eq(6).text(getFlow(data.rx_bytes));
      if (data.portal_enable === true) {
        // "{% trans '来宾接入' %}"
        $('td', row).eq(7).text(pageWords.guestUser);
        $('td', row).eq(8).text(data.uphone);
      } else {
        // "{% trans '用户接入' %}"
        $('td', row).eq(7).text(pageWords.commonUser);
        $('td', row).eq(8).text("");
      }

      // "<a class=\"btn btn-default table-btn-btnpad\" href=\"#\" onclick=\"ap_kickmac('" + data.ap + "','" + data.mac + "');\">{% trans '移除' %}</a>"
      var a = `<a class="btn btn-default table-btn-btnpad" href="#" onclick="ap_kickmac('${ data.ap }','${ data.mac }');">${ pageWords.remove }</a>`;
      $('td', row).eq(9).html(a);
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
  });
}

function ap_kickmac(apmac, mac) {
  //body...
  //"{% url 'ap_kickmac' %}"
  $.post(`${ url }/ap-list/ap_kickmac/`, {
    'apmac': apmac,
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) !== '') {
      alert(ret);
      oTable.ajax.reload(null, false);
    }
  });
}

$(function() {
  $("#modalForm").draggable({
    cancel: ".drag"
  });
});

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
