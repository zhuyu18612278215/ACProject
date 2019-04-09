var url = window.location.origin;

$(document).ready(function() {
  chartajax();
  sort_change();
  warningajax();
});

function chartajax() {
  var t = $('#net_type').val();
  //  "{% url 'chartajax' %}?type="+t
  $.getJSON(`${ url }/index/chartajax/?type=${ t }`, function(ret) {
    Highcharts.chart('dev-net', {
      chart: {
        type: 'column'
      },
      title: {
        // "{% trans '网络使用情况' %}("+ret.type+")"
        text: `${ pageWords.networkUsage }(${ ret.type })`
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
          // "{% trans '流量' %} (MB)"
          text: `${ pageWords.flow } (MB)`
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f} MB</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        // "{% trans '上传' %}"
        name: pageWords.upload,
        data: ret.upload,
      }, {
        // "{% trans '下载' %}"
        name: pageWords.download,
        data: ret.download,
      }, ]
    });
  });
};

function sort_change() {
  var t = parseInt($('#sort_type').val());
  // "{% url 'sort_type_change' %}?type="+t
  $.getJSON(`${ url }/index/sort_type_change/?type=${ t }`, function(ret) {
    var h = '';
    var g = '';
    if (t === 1) {
      for (var i = 0; i < ret.length; i++) {
        // h = h + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >"+ "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('"+String(ret[i].mac)+"','"+ ret[i].state +"')\">"+ ret[i].name +"</a>" +"</span></div><div class='col-md-4 text-right'><span>"+ ret[i].hour +"</span></div></div>"
        h = `${ h }<div class="col-md-12 index-probe-sort-fontsize"><div class="col-md-8 text-left"><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ ret[i].state }')">${ ret[i].name }</a></span></div><div class="col-md-4 text-right"><span>${ret[i].hour }</span></div></div>`;
      }
      $('#sort').html(h);
    }
    if (t === 2) {
      for (var i = 0; i < ret.length; i++) {
        // g = g + "<div class='col-md-12 index-probe-sort-fontsize'><div class='col-md-8 text-left'><span >" + "<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('" + String(ret[i].mac) + "','" + "在线" + "')\">" + ret[i].name + "</a>" + "</span></div><div class='col-md-4 text-right'><span>" + ret[i].upload + "</span></div></div>"
        g = `${ g }<div class="col-md-12 index-probe-sort-fontsize"><div class="col-md-8 text-left"><span ><a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }',${ pageWords.online })">${ ret[i].name }</a></span></div><div class="col-md-4 text-right"><span>${ ret[i].upload }</span></div></div>`;
      }
      $('#sort').html(g);
    }
  })
};

function warningajax() {
  var t = $('#warning-type').val();
  // "{% url 'warningajax' %}?type="+t
  $.getJSON(`${ url }/index/warningajax/?type=${ t }`, function(ret) {
    var h = '';
    // console.log(ret);
    if (ret.length !== 0) {
      for (var i = 0; i < ret.length; i++) {
        // h = h + "<div class='alert alert-danger'><strong>Warning!</strong>&nbsp;&nbsp;"+ ret[i].time +"&nbsp;&nbsp;{% trans '设备' %}[<a href=\"#\" class=\"table-a-color\" onclick=\"ajaxfunc('"+String(ret[i].mac)+"','"+String(ret[i].state)+"')\">"+ ret[i].mac +"</a>]&nbsp;&nbsp;{% trans '别名' %}&nbsp;"+ ret[i].name +"&nbsp;&nbsp;{% trans '版本' %}&nbsp;"+ ret[i].version +"&nbsp;&nbsp;{% trans '状态' %}&nbsp;"+ ret[i].type +"&nbsp;{% trans '使用率为' %}&nbsp;"+ ret[i].num +"</div>"
        h = `${ h }<div class="alert alert-danger"><strong>Warning!</strong>&nbsp;&nbsp;${ ret[i].time }&nbsp;&nbsp;${ pageWords.device }[<a href="#" class="table-a-color" onclick="ajaxfunc('${ String(ret[i].mac) }','${ String(ret[i].state) }')">${ ret[i].mac }</a>]&nbsp;&nbsp;${ pageWords.alias }&nbsp;${ ret[i].name }&nbsp;&nbsp;${ pageWords.version }&nbsp;${ ret[i].version }&nbsp;&nbsp;${ pageWords.status }&nbsp;${ ret[i].type }&nbsp;${ pageWords.usage }&nbsp;${ ret[i].num }</div>`;
      }
      $('#warning').html(h);
    }
    if (ret.length === 0) {
      $('#warning').html(h);
    }
  });
}
