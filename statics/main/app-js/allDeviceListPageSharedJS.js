var url = window.location.origin;
var pathname = window.location.pathname;
var modeDict = {
  '/nonoperate-list/': '3',
  '/probe-list/': '2',
  '/ap-list/': '1',
};

function open_adddevice() {
  // body...
  $('#add_name').val('');
  $('#add_sn').val('');
  $('#add_MAC').val('');
  $('#open_adddevice').click();

}

function open_importdevice() {
  // body...
  $('#result_hide').hide();
  $('#result_a').html('');
  $('#open_importdevice').click();

}

function open_exportdevice() {
  // body...
  $('#export_sort_type').val('1');
  $('#open_exportdevice').click();

}
$('#adddevice_button').click(function() {
  // body...
  var name = $('#add_name').val();
  var sn = $('#add_sn').val();
  var mac = $('#add_MAC').val();
  var e = '';
  if (sn.length === 0) {
    e = '1';
    alert(pageWords.serialNumAlertInfo);
  }
  if (mac.length === 0) {
    e = '1';
    alert(pageWords.macAlertInfo);
  }
  var re = /[0-9a-fA-F]/g;
  if (e !== '1') {
    var a_mac = mac.match(re).join('').toLowerCase();
    // console.log(a_mac);
    if (a_mac.length !== 12) {
      e = '1';
      alert(pageWords.macLenghtErrorAlertInfo);
    }
  }
  if (e !== '1') {
    // '{% url "adddevicebutton_ajax" %}'
    $.post(`${ url }/probe-list/adddevicebutton_ajax/`, {
      'name': name,
      'sn': sn,
      'mac': a_mac,
      // '2'
      'mode': modeDict[pathname],
    }, function(ret) {
      /*optional stuff to do after success */
      alert(ret.mes);
      if ($.trim(ret.reason) !== "") {
        // console.log(ret.reason);
      }
      oTable.ajax.reload(null, false);
    });
  }

});
$('#importdevice_button').click(function() {
  // body...
  var file = $('#file')[0].files[0];
  // console.log(file);
  if (file) {
    if ($.inArray(file['type'], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) !== -1) {
      var fm = new FormData();
      fm.append('file', file);
      $.ajax({
        type: 'POST',
        // "{% url 'importdevice' %}?mode=2"
        url: `${ url }/probe-list/importdevice/?mode=${ modeDict[pathname] }`,
        data: fm,
        processData: false, // 告诉jquery不转换数据
        contentType: false, // 告诉jquery不设置内容格式
        success: function(ret) {
          alert(ret.error);
          if ($.trim(ret.furl) !== "") {
            // '<a href=\"/static/' + ret.furl + '\" style=\"color:#23527c;\">{% trans "错误列表下载" %}</a>'
            var a = `<a href="/static/${ ret.furl }" style="color:#23527c;">${ pageWords.errorListDownload }</a>`;
            $('#result_hide').show();
            $('#result_a').html(a);
          }
          oTable.ajax.reload(null, false);
        }
      })
    } else {
      alert(pageWords.fileTypeError);
    }
  } else {
    alert(pageWords.fileNotFound);
  }

});
$('#exportdevice_button').click(function() {
  // body...
  var extype = $('#export_sort_type').val();

  // "{% url 'exportdevicebutton_ajax' %}" + "?extype=" + extype + "&mode=2"
  window.location.href = `${ url }/probe-list/exportdevicebutton_ajax/?extype=${ extype }&mode=${ modeDict[pathname] }`;

});
