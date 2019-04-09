var url = window.location.origin;
var powerList = ["high", "medium", "low", "auto"]
var pathname = window.location.pathname;
var otbList = ['/nonoperate-list/', '/probe-list/', '/ap-list/'];

$(document).ready(function() {
  // chartajax();
  sort_change();
  ap_warningajax();
  user_chartajax();
  ssid_select();
  // user_counterajax();
  $(':input.radio').labelauty();
  $('#apply_change_wlan').click(apply_change_wlan);
  $('#reduction_change_wlan').click(reduction_change_wlan);
});


function user_chartajax() {
  // var t = $('#net_type').val();
  // "{% url 'ap_user_chartajax' %}"
  $.getJSON(`${ url }/ap/ap_index/ap_user_chartajax/`, {
    'type': ''
  }, function(ret) {
    // console.log(ret);
    Highcharts.chart('user_chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: pageWords.devUserRank
        // ("+ret.type+")"
      },
      /*subtitle: {
          text: 'Source: WorldClimate.com'
      },*/
      xAxis: {
        categories: ret.name,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: pageWords.userNum
        }
      },
      // tooltip: {
      //     valueDecimals: 0,
      //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //         '<td style="padding:0"><b>{point.y}</b></td></tr>',
      //         //+
      //         // '<tr><td style="color:{series.color};padding:0">{% trans "上行流量:" %} </td>'+
      //         // '<td style="padding:0"><b>{point.upload} Mkb </b></td></tr>'+
      //         // '<tr><td style="color:{series.color};padding:0">{% trans "下行流量:" %} </td>'+
      //         // '<td style="padding:0"><b>{point.download} Mkb </b></td></tr>',
      //     footerFormat: '</table>',
      //     shared: true,
      //     useHTML: true
      // },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [

        {
          name: pageWords.userNum,
          //data: ret.num,
          data: ret.uflow,

          tooltip: {
            // '用户数 <b> {point.y} </b><br>' +
            // '上行流量: <b> {point.z} MB </b><br>' +
            // '下行流量: <b> {point.w} MB </b><br>'
            pointFormat: `用户数 <b> {point.y} </b><br>
              上行流量: <b> {point.z} MB </b><br>
              下行流量: <b> {point.w} MB </b><br>`
          }
        }
        // , {
        //     name: "{% trans '上传' %}",
        //     data: ret.upload
        // }, {
        //     name: "{% trans '下载' %}",
        //     data: ret.download
        // }
      ]
    });
  });
}

function ssid_select() {
  // "{% url 'ap_ssid_select' %}"
  $.getJSON(`${ url }/ap/ap_index/ap_ssid_select/`, {}, function(ret) {
    // console.log(ret);
    if (ret.length === 0) {
      // $('#user_count_type').append('<option ></option>');
    } else {
      for (var i in ret) {
        // '<option value=' + ret[i].group_id + ';' + ret[i].wlan_id + '> ' + ret[i].wlan_ssid + ' / ' + ret[i].group_name + ' </option>'
        $('#user_count_type').append(`<option value='${ ret[i].group_id };${ ret[i].wlan_id }'> ${ ret[i].wlan_ssid } / ${ ret[i].group_name } </option>`);
        if (i === 0) {
          // $('#user_count_type').append('<option value='+ ret[i].group_id + ';' + ret[i].wlan_id +' selected = "selected"> '+ ret[i].wlan_ssid + ' / ' + ret[i].group_name +' </option>');
          // ret[i].group_id + ';' + ret[i].wlan_id
          $('#user_count_type').val(`${ ret[i].group_id };${ ret[i].wlan_id }`);
        }
      }
    }
    user_counterajax();
  });
}

function user_counterajax() {
  var type = $('#user_count_type').val();
  // "{% url 'ap_user_counterajax' %}"
  $.getJSON(`${ url }/ap/ap_index/ap_user_counterajax/`, {
    'type': type
  }, function(ret) {
    // console.log(ret);
    Highcharts.chart('user_counter', {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: '用户数量统计'
      },
      xAxis: {
        type: 'category',
        // categories: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '24:00'],
        categories: ret.time,
        //tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        minRange: 4,
        title: {
          text: pageWords.userNum
        }
      },

      // tooltip: {
      //     //split: true,
      //     shared: true,
      //     valueSuffix: '',
      //     valueDecimals: 0,
      //         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      //         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //             '<td style="padding:0"><b>{point.y}</b></td></tr>',
      //         footerFormat: '</table>',
      //         shared: true,
      //         useHTML: true
      // },
      plotOptions: {
        // area: {
        //     stacking: 'normal',
        //     lineColor: '#666666',
        //     lineWidth: 1,
        //     marker: {
        //         lineWidth: 1,
        //         lineColor: '#666666'
        //     }
        // }
        areaspline: {
          fillOpacity: 0.5
        }
      },
      series: [{
          // name: '亚洲',
          // data: [502, 635, 809, 947, 1402, 3634, 5268]
          // name: ret.name[0],
          name: pageWords.userNum,
          data: ret.uflow,
          // data: [
          // {'y': 100, 'z': 1000},
          // {'y': 1020, 'z': 1000}
          //],

          tooltip: {
            // '用户数 <b> {point.y} </b><br>' +
            // '上行流量: <b> {point.z} MB </b><br>' +
            // '下行流量: <b> {point.w} MB </b><br>'
            pointFormat: `用户数 <b> {point.y} </b><br>
              上行流量: <b> {point.z} MB </b><br>
              下行流量: <b> {point.w} MB </b><br>`
          }
          // data: [502, 635, 809, 947, 1402, 3634, 5268]
        }
        // ,
        // {
        //     name: "{% trans '上传流量' %} ",
        //     data: ret.upload
        // }, {
        //     name: "{% trans '下载流量' %}",
        //     data: ret.download
        // }
        // , {
        //     name: '美洲',
        //     data: [18, 31, 54, 156, 339, 818, 1201]
        // }, {
        //     name: '大洋洲',
        //     data: [2, 2, 2, 6, 13, 30, 46]
        // }
      ]
    });
  });
}

function sort_change() {
  var t = parseInt($('#sort_type').val());
  // "{% url 'ap_sort_type_change' %}?type=" + t
  $.getJSON(`${ url }/ap/ap_index/ap_sort_type_change/?type=${ t }`, function(ret) {
    var h = '';
    var g = '';
    // console.log('123', ret);
    if (t === 1) {
      for (var i = 0; i < ret.length; i++) {
        // h + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >" + "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + ret[i].state + "');wlan_modify(\'" + ret[i].dev_id + "\');\" >" + ret[i].name + "</a>" + "</span></div><div class='col-md-4 text-right'><span>" + ret[i].hour + "</span></div></div>"
        h = `${ h }<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }');wlan_modify('${ ret[i].dev_id }');" >${ ret[i].name }</a></span></div><div class='col-md-4 text-right'><span>${ ret[i].hour }</span></div></div>`
      }
      $('#sort').html(h);
    }
    if (t === 2) {
      for (var i = 0; i < ret.length; i++) {
        // g + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >" + "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + ret[i].state + "');wlan_modify(\'" + ret[i].dev_id + "\');\">" + ret[i].name + "</a>" + "</span></div><div class='col-md-4 text-right'><span>" + ret[i].upload + "</span></div></div>"
        g = `${ g }<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }');wlan_modify('${ ret[i].dev_id }');">${ ret[i].name }</a></span></div><div class='col-md-4 text-right'><span>${ ret[i].upload }</span></div></div>`
      }
      $('#sort').html(g);
    }
    if (t === 3) {
      for (var i = 0; i < ret.length; i++) {
        // g + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >" + "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + ret[i].state + "');wlan_modify(\'" + ret[i].dev_id + "\');\">" + ret[i].name + "</a>" + "</span></div><div class='col-md-4 text-right'><span>" + ret[i].download + "</span></div></div>"
        g = `${ g }<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }');wlan_modify('${ ret[i].dev_id }');">${ ret[i].name }</a></span></div><div class='col-md-4 text-right'><span>${ ret[i].download }</span></div></div>`
      }
      $('#sort').html(g);
    }
    if (t === 4) {
      for (var i = 0; i < ret.length; i++) {
        // g + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >" + "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + ret[i].state + "');wlan_modify(\'" + ret[i].dev_id + "\');\">" + ret[i].name + "</a>" + "</span></div><div class='col-md-4 text-right'><span>" + ret[i].download + "</span></div></div>"
        g = `${ g }<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }');wlan_modify('${ ret[i].dev_id }');">${ ret[i].name }</a></span></div><div class='col-md-4 text-right'><span>${ ret[i].immediateFlow }</span></div></div>`
      }
      $('#sort').html(g);
    }
  })
}

function ap_warningajax() {
  var t = $('#warning-type').val();
  // "{% url 'ap_warningajax' %}?type=" + t
  $.getJSON(`${ url }/ap/ap_index/ap_warningajax/?type=${ t }`, function(ret) {
    var h = '';
    // console.log(ret);
    if (ret.length !== 0) {
      for (var i = 0; i < ret.length; i++) {
        // h = h + "<div class='alert alert-danger'><strong>Warning!</strong>&nbsp;&nbsp;" + ret[i].time + "&nbsp;&nbsp;{% trans '设备' %}[<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + ret[i].state + "');wlan_modify(\'" + ret[i].dev_id + "\');\">" + ret[i].mac + "</a>]&nbsp;&nbsp;{% trans '别名' %}&nbsp;" + ret[i].name + "&nbsp;&nbsp;{% trans '版本' %}&nbsp;" + ret[i].version + "&nbsp;&nbsp;{% trans '状态' %}&nbsp;" + ret[i].type + "&nbsp;{% trans '使用率为' %}&nbsp;" + ret[i].num + "</div>"
        h = `${ h }<div class='alert alert-danger'><strong>Warning!</strong>&nbsp;&nbsp;${ ret[i].time }&nbsp;&nbsp;${ pageWords.dev }[<a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }');wlan_modify('${ ret[i].dev_id }');">${ ret[i].mac }</a>]&nbsp;&nbsp;${ pageWords.name }&nbsp;${ ret[i].name }&nbsp;&nbsp;${ pageWords.version }&nbsp;${ ret[i].version }&nbsp;&nbsp;${ pageWords.status }&nbsp;${ ret[i].type }&nbsp;${ pageWords.usage }&nbsp;${ ret[i].num }</div>`
      }
      $('#warning').html(h);
    }
    if (ret.length == 0) {
      $('#warning').html(h);
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
