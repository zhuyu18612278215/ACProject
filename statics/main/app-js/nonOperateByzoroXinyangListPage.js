var url = window.location.origin;
var extendsCondition = {};

$(document).ready(function() {
  byzoroXinyangTable();
  // create_button('byzoroXinyang');
});

function byzoroXinyangTable() {
  // body...
  oTable = $('#datatable-byzoroXinyang').DataTable({
    "dom": "<'row'<'col-sm-6' <'col-sm-6'l><'col-sm-6 device_type'>><'col-sm-6' f>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
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
    // "{% url 'nonoperate_already_access_ajax' %}"
    "ajax": {
      "url": `${ url }/nonoperate-list/nonoperateByzoroXinyangTableApi/`,
      "dataSrc": function(json) {
        // body...
        extendsCondition = json.condition;
        // console.log(extendsCondition);
        return json.data;
      }
    },
    "columns": [{
      "data": "place_name"
    }, {
      "data": "location_encode"
    }, {
      "data": "districtCode"
    }, {
      "data": "policeName"
    }, {
      "data": "state"
    }, {
      "data": "placeState"
    }],
    'createdRow': function(row, data, index) {
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

function xinyangOpenExportDevice() {
  // body...
  $('#export_sort_type').val('1');
  $('#xinyangOpenExportDevice').click();

}

$('#xinyangExportDeviceButton').click(function() {
  // body...
  var extype = $('#export_sort_type').val();

  // "{% url 'exportdevicebutton_ajax' %}" + "?extype=" + extype + "&mode=2"
  window.location.href = `${ url }/nonoperate-list/xinyangExportDeviceButtonApi/?extype=${ extype }&extendsCondition=${ JSON.stringify(extendsCondition) }`;

});
