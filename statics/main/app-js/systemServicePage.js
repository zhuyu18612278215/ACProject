var url = window.location.origin;

function bar_time() {
  var width = 0;
  var timer = setInterval(function() {
    width = width + 5;
    if (width >= 100) {
      clearInterval(timer);
      width = 100;
      location.reload();
    }
    $('#probar').width(width + '%');
    $('#probar').text(width + '%');
  }, 6000);
}

function down_pro() {
  // body...
  var width = 0;
  var timer = setInterval(function() {
    $.getJSON(`${ url }/system/system_service/upgrade_down_pro_ajax/`, function(ret) {
      if (parseInt(ret.DOWN_PRO) == 100) {
        clearInterval(timer);
        width = 100;
      } else {
        width = parseFloat(ret.DOWN_PRO)
      }
      $('#probar').width(width + '%');
      $('#probar').text(width + '%');
    });
  }, 1000);
}

$('#gpon_update_button').click(function() {
  /* Act on the event */
  // var gp = $('#collapse-gpon-config').data('gp');
  if ($.trim($('#gpon_update_link').val()) === "") {
    alert(pageWords.serverIpEmptyError);
  } else if ($.trim($('#gpon_update_file').val()) === "") {
    alert(pageWords.fileNameEmptyError);
  } else {
    var value = new Array();
    value[0] = $('#gpon_update_link').val();
    value[1] = $('#gpon_update_file').val();
    // '{% url "gpon_config_system" %}'
    $.post(`${ url }/ap/ap_list/gpon/gpon_config_system/`, {
      'type': 'update',
      'value': JSON.stringify(value)
    }, function(ret) {
      /*optional stuff to do after success */
      alert(ret.mes);
    });
  }
});

function show_gpon_config() {
  // body...
  // '{% url "show_gpon_config" %}'
  $.getJSON(`${ url }/ap/ap_list/gpon/show_gpon_config/`, {
    'type': 'sys'
  }, function(ret) {
    /*optional stuff to do after success */
    // ret != {}
    if (!$.isEmptyObject(ret)) {
      $('#gpon_update_link').val(ret.update_link);
      $('#gpon_update_file').val(ret.update_file);
    }
  });
}

$(document).ready(function() {
  django_settings_ajax();
  system_version_ajax();
  refresh();
  al_access_table();
  show_gpon_config();
  getCountryCode();
  getTimezoneCode();
  windowWord = {

  };
});

function exportconf() {
  // body...
  $('#infdiv1').show();
  $('#infdiv2').hide();
  $('#confinformation').click();
  // "{% url 'exportconf' %}"
  $.getJSON(`${ url }/system/system_service/exportconf/`, function(ret) {
    // body...
    // console.log(ret);
    if (ret.sign === "True") {
      // '<a href=\"/static/download/' + ret.msg + '\" style="color:#23527c;">' + ret.msg + '</a>'
      $('#download_link').html(`<a href="/static/download/${ ret.msg }" style="color:#23527c;">${ ret.msg }</a>`);
      $('#infdiv1').hide();
      $('#infdiv2').show();
    } else {
      alert(pageWords.exportError);
      // console.log(ret.msg);
      $('#download_link_close').click();
    }
  });
}

function importconf() {
  // body...
  $('#import_file').val('');
  $('#importconf_wait').hide();
  $('#importconf').click();
}
$('#import_file_button').click(function() {
  // body...
  var file = $('#import_file')[0].files[0];
  // console.log(file);
  // console.log(file['name'].substring(file['name'].length-13,file['name'].length));
  if (file) {
    // if($.inArray(file['type'] , ['application/x-gzip','application/gzip']) != -1){
    $('#importconf_wait').show();
    if (file['name'].substring(file['name'].length - 18, file['name'].length) === "backup.tar.gz.des3") {
      var fm = new FormData();
      fm.append('file', file);
      $.ajax({
        type: 'POST',
        // "{% url 'importconf' %}"
        url: `${ url }/system/system_service/importconf/`,
        data: fm,
        processData: false, // 告诉jquery不转换数据
        contentType: false, // 告诉jquery不设置内容格式
        success: function(ret) {
          $('#importconf_wait').hide();
          alert(ret);
        }
      })
    } else {
      alert(pageWords.fileIllegal);
    }
    // }
    // else{
    //     alert('{% trans "文件类型错误" %}');
    // }
  } else {
    alert(pageWords.fileNoChoose)
  }

});

function exportsysset() {
  // body...
  $('#syssetdiv1').show();
  $('#syssetdiv2').hide();
  $('#syssetinformation').click();
  // "{% url 'exportsysset' %}"
  $.getJSON(`${ url }/system/system_service/exportsysset/`, function(ret) {
    // body...
    // console.log(ret);
    if (ret.sign === "True") {
      // '<a href=\"/static/download/' + ret.msg + '\" style="color:#23527c;">' + ret.msg + '</a>'
      $('#syssetdownload_link').html(`<a href="/static/download/${ ret.msg }" style="color:#23527c;">${ ret.msg }</a>`);
      $('#syssetdiv1').hide();
      $('#syssetdiv2').show();
    } else {
      alert(pageWords.exportError);
      // console.log(ret.msg);
      $('#syssetdownload_link_close').click();
    }
  });
}

function importsysset() {
  // body...
  $('#importsysset_file').val('');
  $('#importsysset_wait').hide();
  $('#importsysset').click();
}
$('#importsysset_file_button').click(function() {
  // body...
  var file = $('#importsysset_file')[0].files[0];
  // console.log(file);
  // console.log(file['name'].substring(file['name'].length-13,file['name'].length));
  if (file) {
    // if($.inArray(file['type'] , ['application/x-gzip','application/gzip']) != -1){
    $('#importsysset_wait').show();
    if (file['name'].substring(file['name'].length - 21, file['name'].length) === "sysseting.tar.gz.des3") {
      var fm = new FormData();
      fm.append('file', file);
      $.ajax({
        type: 'POST',
        // "{% url 'importsysset' %}"
        url: `${ url }/system/system_service/importsysset/`,
        data: fm,
        processData: false, // 告诉jquery不转换数据
        contentType: false, // 告诉jquery不设置内容格式
        success: function(ret) {
          $('#importsysset_wait').hide();
          alert(ret);
        }
      })
    } else {
      alert(pageWords.fileIllegal);
    }
    // }
    // else{
    //     alert('{% trans "文件类型错误" %}');
    // }
  } else {
    alert(pageWords.fileNoChoose)
  }
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

function django_settings_ajax() {
  // "{% url 'django_settings_ajax' %}"
  $.getJSON(`${ url }/system/system_service/django_settings_ajax/`, function(ret) {
    $('#version_service_address').val(ret.VERSION_SERVER_URL);
    $('#email_service_address').val(ret.EMAIL_HOST);
    if (ret.EMAIL_USE_SSL === true) {
      $('#ssl').attr('checked', 'checked');
    } else if (ret.EMAIL_USE_SSL === false) {
      $('#ssl').removeAttr('checked', 'checked');
    }
    if (ret.EMAIL_PORT === 0) {
      $('#email_port').val();
    } else {
      $('#email_port').val(ret.EMAIL_PORT);
    }
    $('#sender_address').val(ret.EMAIL_HOST_USER);
    $('#sender_password').val(ret.EMAIL_HOST_PASSWORD);
  })
}

function test_email() {
  var email_service_address = $('#email_service_address').val();
  if ($('#ssl').attr('checked') === 'checked') {
    var ssl = 'true';
  } else {
    var ssl = 'false';
  }
  var email_port = $('#email_port').val();
  var sender_address = $('#sender_address').val();
  var sender_password = $('#sender_password').val();
  var send_to = $('#send_to').val();

  if ($.trim(email_service_address) === '') {
    alert(pageWords.emailServerEmptyError);
  } else if ($.trim(email_port) === '') {
    alert(pageWords.portEmptyError);
  } else if ($.trim(sender_address) === '') {
    alert(pageWords.senderEmptyError);
  } else if ($.trim(sender_password) === '') {
    alert(pageWords.senderPasswdEmptyError);
  } else if ($.trim(send_to) === '') {
    alert(pageWords.testEmailEmptyError);
  } else {
    // "{% url 'test_email' %}"
    $.post(`${ url }/system/system_service/test_email/`, {
      'email_service_address': email_service_address,
      'ssl': ssl,
      'email_port': email_port,
      'sender_address': sender_address,
      'sender_password': sender_password,
      'send_to': send_to,
    }, function(ret) {
      alert(ret.errors);
    });
  }
}

function system_version_ajax() {
  // body...
  // "{% url 'system_version_ajax' %}?type=1"
  $.getJSON(`${ url }/system/system_service/system_version_ajax/?type=1`, function(ret) {
    $('#server_version_now').text(ret.version);
    $('#version_server').val(ret.SYSTEM_VERSION_SERVER_URL);
    if ($.trim(ret.new_version) !== '') {
      $('#new_version').text(ret.new_version);
      if (lim !== 1) {
        $('#upgrade_ajax').css('visibility', 'visible');
      } else {
        $('#upgrade_ajax').css('visibility', 'hidden');
      }
    } else {
      $('#new_version').text(pageWords.notHaveNewVersion);
      $('#upgrade_ajax').css('visibility', 'hidden');
    }
  });
}

function change_system_version() {
  // body...
  let urldata = $('#version_server').val();
  if ($.trim(urldata) === '') {
    alert(pageWords.addressEmptyError);
  } else {
    // "{% url 'system_version_ajax' %}?type=2"
    $.post(`${ url }/system/system_service/system_version_ajax/?type=2`, {
      'url': urldata
    }, function(ret) {
      $('#version_server').val(ret.SYSTEM_VERSION_SERVER_URL);
      if ($.trim(ret.new_version) !== '') {
        $('#new_version').text(ret.new_version);
        $('#upgrade_ajax').css('visibility', 'visible');

      } else {
        $('#new_version').text(pageWords.notHaveNewVersion);
        $('#upgrade_ajax').css('visibility', 'hidden');
      }
    });
  }
}

function produceUpdateURL() {
  // body...
  $.getJSON(`${ url }/system/system_service/produceUpdateURL/`, function(ret) {
    console.log(ret);
    if (ret.status === 'failed') {
      alert(pageWords.internetError);
    } else if (ret.status === 'success') {
      $('#showProduceUpdateURL').html(`<a style="color:#23527c;" href="${ret.url}">${ret.url}</a>`)
      $('#produceUpdateURLModal').click();
    }
  })
}

function upgrade_ajax() {
  // body...
  // 0 + '%'
  $('#probar').width(`0%`);
  $('#probar').text(`0%`);
  $('#upgmessage').click();
  $('#upm').text(pageWords.versionDownloading);
  $('#probardiv').show();
  down_pro();
  // "{% url 'upgrade_ajax' %}"
  $.getJSON(`${ url }/system/system_service/upgrade_ajax/`, function(ret) {
    if ($.trim(ret.error) === '') {
      $('#closeupm_1').hide();
      $('#upm').text(pageWords.versionUpdating);
      $('#probar').width(`0%`);
      $('#probar').text(`0%`);
      bar_time();
    } else {
      alert(ret.error);
      $('#closeupm').click();
    }
  });
}

function upfile() {
  // body...
  var reg = /[\u4e00-\u9fa5]/g;
  var fileobj = $("#upfile")[0].files[0];
  if (fileobj === undefined) {
    alert(pageWords.fileNoChoose);
  } else if (reg.test(fileobj.name)) {
    alert(pageWords.fileHaveChinese)
  } else {
    alert(pageWords.fileUploading);
    var form = new FormData();
    form.append('file', fileobj);
    $.ajax({
      type: 'POST',
      // "{% url 'local_upload' %}"
      url: `${ url }/system/system_service/local_upload/`,
      data: form,
      processData: false, // 告诉jquery不转换数据
      contentType: false, // 告诉jquery不设置内容格式
      success: function(ret) {
        // 0 + '%'
        $('#probar').width(`0%`);
        $('#probar').text(`0%`);
        if ($.trim(ret.error) === '') {
          $('#probardiv').show();
          $('#closeupm_1').hide();
          $('#upgmessage').click();
          $('#upm').text(pageWords.versionUploadUpdating);
          bar_time();
        } else {
          alert(ret.error);
          $('#closeupm').click();
        }
      }
    })
  }
}

function cancel() {
  // body...
  // "{% url 'upgrade_cancel_ajax' %}"
  $.getJSON(`${ url }/system/system_service/upgrade_cancel_ajax/`, function(ret) {
    if ($.trim(ret.error) === '') {
      location.reload();
    } else {
      alert(ret.error);
    }
  });
}

function al_access_table() {
  // body...
  oTable = $('#datatable-issue_config_switch_page').DataTable({
    // "dom":"<'row'<'col-sm-6' l><'col-sm-6' f>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
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
    // "serverSide": true,
    // "{% url 'issue_config_switch_ajax' %}"
    "ajax": `${ url }/system/system_service/issue_config_switch_ajax/`,
    "columns": [{
      "data": "groupname"
    }, {
      "data": "issue_config_switch"
    }, {
      "data": "id"
    }, ],

    'createdRow': function(row, data, index) {
      if (data.issue_config_switch === "on") {
        // "<ul class=\"dowebok\" style=\"padding-left:0px\"><li><input type=\"checkbox\" id=\"issue_config_switch_" + data.id + "\" name=\"issue_config_switch\" class=\"radio\" data-labelauty=\" {% trans '开启' %} \" checked=\"checked\"  onclick=\"issue_config_switch_set(" + data.id + ");\"></li></ul>"
        $('td', row).eq(2).html(`<ul class="dowebok" style="padding-left:0px"><li><input type="checkbox" id="issue_config_switch_${ data.id }" name="issue_config_switch" class="radio" data-labelauty="${ pageWords.open }" checked="checked"  onclick="issue_config_switch_set(${ data.id });"></li></ul>`);
      }
      if (data.issue_config_switch === "off") {
        // "<ul class=\"dowebok\" style=\"padding-left:0px\"><li><input type=\"checkbox\" id=\"issue_config_switch_" + data.id + "\" name=\"issue_config_switch\" class=\"radio\" data-labelauty=\" {% trans '开启' %} \"   onclick=\"issue_config_switch_set(" + data.id + ");\"></li></ul>"
        $('td', row).eq(2).html(`<ul class="dowebok" style="padding-left:0px"><li><input type="checkbox" id="issue_config_switch_${ data.id }" name="issue_config_switch" class="radio" data-labelauty="${ pageWords.open }" onclick="issue_config_switch_set(${ data.id });"></li></ul>`);
      }
    }
  });
  setTimeout("$('#datatable-issue_config_switch_page').removeAttr('style');$(':input.radio').labelauty();", 100);

}

function issue_config_switch_set(id) {
  // body...
  // '#issue_config_switch_' + id
  var cs = $(`#issue_config_switch_${ id }`).attr('checked');
  var i = '';
  if (cs === 'checked') {
    i = 'on';
  } else {
    i = 'off';
  }
  // "{% url 'issue_config_switch_set' %}?id=" + id + "&act=" + i
  $.getJSON(`${ url }/system/system_service/issue_config_switch_set/?id=${ id }&act=${ i }`, function(ret) {
    alert(ret);
    oTable.ajax.reload(null, false);
    setTimeout("$('#datatable-issue_config_switch_page').removeAttr('style');$(':input.radio').labelauty();", 100);
  });
}


$('#countryCodeSubmit').click(() => {
  let countryCode = $('#countryCode').val();
  if (countryCode) {
    $.post(`${ url }/system/system_service/countryCodeApi/`, {
      countryCode: countryCode,
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.message) {
        alert(ret.message);
      }
    });
  }
});

function getCountryCode() {
  // body...
  $.get(`${ url }/system/system_service/countryCodeApi/`, function(ret) {
    /*optional stuff to do after success */
    if (ret.countryCode) {
      $('#countryCode').val(ret.countryCode);
    } else {
      $('#countryCode').val('CN');
    }
  });
}


$('#timezoneCodeSubmit').click(() => {
  let timezoneCode = $('#timezoneCode').val();
  if (timezoneCode) {
    $.post(`${ url }/system/system_service/timezoneCodeApi/`, {
      timezoneCode: timezoneCode,
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.message) {
        alert(ret.message);
      }
    });
  }
});

function getTimezoneCode() {
  // body...
  $.get(`${ url }/system/system_service/timezoneCodeApi/`, function(ret) {
    /*optional stuff to do after success */
    if (ret.timezoneCode) {
      $('#timezoneCode').val(ret.timezoneCode);
    } else {
      $('#timezoneCode').val('Asia/Hong_Kong');
    }
  });
}
