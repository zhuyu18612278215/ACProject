var url = window.location.origin;

$(function() {
  var ttxx = "";
  for (var i = 1; i < 1000; i++) {
    // ttxx += "<option value=\"" + i + "\">" + i + "</option>";
    ttxx += `<option value="${ i }">${ i }</option>`;
  }
  $('#voucher-select').append(ttxx);
  white_list = [];
  trusted_mac_list = [];
  auth_server_show_ajax();
  voucherfun();
});

function authConfig(action, data) {
  // "action=" + action
  var dataString = `action=${ action }`;
  if (data === null || data === undefined || $.trim(data) === "")
    dataString += "&data";
  else
    // "&data=" + data
    dataString += `&data=${ data }`;
  var res = "-1";
  $.ajax({
    type: 'post',
    async: false,
    // "{%url 'auth_proxy' %}"
    url: `${ url }/ap-list/ap_guest_policy/auth_proxy/`,
    data: dataString,
    success: function(resMsg) {
      res = resMsg;
    },
    error: function() {}
  });
  return res;
}
// var change_sms_gateway_select = function(platform)
// {
//   $("select.smsgateway_select").find("option").each(
//     function()
//     {
//       var text = "";
//       if($(this).attr("value") == platform)
//       {
//         text = $(this).attr("text")+'{% trans "(已启用)" %}'
//       }
//       else
//       {
//         text = $(this).attr("text");
//       }
//       $(this).html(text);
//     }
//   );
//   $("select.smsgateway_select").find("option[value=select]").hide();
//   //$("select.smsgateway_select").val(platform);
// };

function auth_server_ajax() {
  // body...
  $.ajax({
    type: "POST",
    dataType: "html",
    // "{% url 'auth_server_ajax' %}"
    url: `${ url }/ap-list/ap_guest_policy/auth_server_ajax/`,
    data: $('#auth_server').serialize(),
    success: function(result) {
      // alert(unescape(result.replace(/\\\u/g, "%u")));
      alert(eval(result));
    },
  });
}

function global_config_ajax() {
  var sign = true;
  if (sign) {
    if ($('#auth_validate_timeout').val() === '0') {
      if (!check_custom_input_int('auth_validate_timeout_0_num')) {
        sign = false;
        alert(pageWords.customValidityInputError);
      } else {
        var res = check_custom_input_type('auth_validate_timeout_0_suffix', 'auth_validate_timeout_0_num');
        if (!res.res) {
          sign = false;
          alert(pageWords.customValidityHourInputError);
        }
      }
    }
  };
  if (sign) {
    if ($('#client_timeout').val() === '0') {
      if (!check_custom_input_int('client_timeout_0_num')) {
        sign = false;
        alert(pageWords.customOfflineTimeInputError);
      } else {
        var res = check_custom_input_type('client_timeout_0_suffix', 'client_timeout_0_num');
        if (!res.res) {
          sign = false;
          alert(pageWords.customOfflineTimeUnitInputError);
        }
      }
    }
  };
  if (sign) {
    var xx = $('#global_config').serializeArray();
    // console.log(JSON.stringify(white_list));
    xx.push({
      'name': 'white_list',
      'value': JSON.stringify(white_list)
    });
    xx.push({
      'name': 'trusted_mac_list',
      'value': JSON.stringify(trusted_mac_list)
    });
    // "{% url 'global_config_ajax' %}"
    $.post(`${ url }/ap-list/ap_guest_policy/global_config_ajax/`, xx, function(ret) {
      // body...
      alert(ret);
    });
  }
}

function auth_server_show_ajax() {
  // body...
  // "{% url 'auth_server_show_ajax' %}"
  $.getJSON(`${ url }/ap-list/ap_guest_policy/auth_server_show_ajax/`, function(ret) {
    // console.log(ret);
    if ($.trim(ret.auth_server) !== '') {
      var a = JSON.parse(ret.auth_server);
      $('#login').val(a.login);
      $('#portal').val(a.portal);
    } else {
      $('#login').val();
      $('#portal').val();
    }
    if (ret.bypass === "true") {
      $('#bypass').attr('checked', 'checked');
    } else {
      $('#bypass').removeAttr('checked', 'checked');
    }
    if (ret.wechatallowed === "true") {
      $('#wechatallowed').attr('checked', 'checked');
    } else {
      $('#wechatallowed').removeAttr('checked', 'checked');
    }
    var ra = (parseInt(ret.auth_validate_timeout) / 60).toString();
    if ($.inArray(ra, ['8', '24', '72', '168', '720']) != -1) {
      $('#auth_validate_timeout').val(ra);
      $('#auth_validate_timeout_hide').hide();
    } else {
      $('#auth_validate_timeout').val('0');
      $('#auth_validate_timeout_hide').show();
      if (parseInt(ra) >= 24) {
        $('#auth_validate_timeout_0_num').val((parseInt(ra) / 24).toString());
        $('#auth_validate_timeout_0_suffix').val('24');
      } else {
        $('#auth_validate_timeout_0_num').val(ra);
        $('#auth_validate_timeout_0_suffix').val('1');
      }
    }
    var rc = ret.client_timeout;
    if ($.inArray(rc, ['5', '10', '30', '60', '480', '1440', '2880', '10080']) != -1) {
      $('#client_timeout').val(rc);
      $('#client_timeout_hide').hide();
    } else {
      $('#client_timeout').val('0');
      $('#client_timeout_hide').show();
      if (parseInt(rc) >= 1440) {
        $('#client_timeout_0_num').val((parseInt(rc) / 60 / 24).toString());
        $('#client_timeout_0_suffix').val('1440');
      } else if (parseInt(rc) >= 60) {
        $('#client_timeout_0_num').val((parseInt(rc) / 60).toString());
        $('#client_timeout_0_suffix').val('60');
      } else {
        $('#client_timeout_0_num').val(rc);
        $('#client_timeout_0_suffix').val('1');
      }
    }
    white_list = JSON.parse(ret.white_list);
    trusted_mac_list = JSON.parse(ret.trusted_mac_list);
    var wl = JSON.parse(ret.white_list);
    var tl = JSON.parse(ret.trusted_mac_list);
    for (var i in wl) {
      var a = $('.white_list_clone').first().clone();
      var b = a.find('input.white_list');
      b.val(wl[i]);
      b.data("oldval", wl[i]);
      b.attr("textvalue", wl[i]);
      a.appendTo($('.white_list_div').last());
      if ($.trim($('input.white_list').first().val()) === '') {
        $('input.white_list').first().parent().remove();
      }
    }
    for (var i in tl) {
      var a = $('.trusted_mac_list_clone').first().clone();
      var b = a.find('input.trusted_mac_list');
      b.val(tl[i]);
      b.data("oldval", tl[i]);
      b.attr("textvalue", tl[i]);
      a.appendTo($('.trusted_mac_list_div').last());
      if ($.trim($('input.trusted_mac_list').first().val()) === '') {
        $('input.trusted_mac_list').first().parent().remove();
      }
    }
  });
}

$('#auth_validate_timeout').on('click', function() {
  // body...
  var a = $('#auth_validate_timeout').val();
  if (a === '0') {
    $('#auth_validate_timeout_hide').show();
  } else {
    $('#auth_validate_timeout_hide').hide();
  }
});
$('#client_timeout').on('click', function() {
  // body...
  var a = $('#client_timeout').val();
  if (a === '0') {
    $('#client_timeout_hide').show();
  } else {
    $('#client_timeout_hide').hide();
  }
});
// function white_list() {
//     // body...
//     if($('input.white_list').last().val() != ''){
//         var a = $('.white_list_clone').first().clone();
//         var b = a.find('input.white_list');
//         b.val('');
//         b.removeData("oldval");
//         b.removeAttr("textvalue");
//         a.appendTo($('.white_list_div').last());
//     }
// }
// function trusted_mac_list() {
//     // body...
//     if($('input.trusted_mac_list').last().val() != ''){
//         var a = $('.trusted_mac_list_clone').first().clone();
//         var b = a.find('input.trusted_mac_list');
//         b.val('');
//         b.removeData("oldval");
//         b.removeAttr("textvalue");
//         a.appendTo($('.trusted_mac_list_div').last());
//     }
// }

function updatewhitelist() {
  var container = $(this).parent().parent();
  if ($.trim($(this).val()) !== "") {
    // "input[textvalue='" + $(this).data("oldval") + "']"
    if ($(this).data("oldval") && $.trim($(this).data("oldval")) !== "" && $(this).data("oldval") !== $(this).val() && container.find(`input[textvalue='${ $(this).data("oldval") }']`).length === 1) {
      if (container.hasClass("white_list_div")) {
        white_list.splice($.inArray($(this).data("oldval"), white_list), 1);
        // console.log('xxxxxxxxxxx');
      } else {
        trusted_mac_list.splice($.inArray($(this).data("oldval"), trusted_mac_list), 1);
        // console.log('aaaaaaaaaa');
      }
    }
    if (container.hasClass("white_list_div")) {
      if (isSubnetSpec($(this).val()) || isIP($(this).val(), 223) || isDomainName($(this).val())) {
        var aaa = $(this).val();
        if (white_list.indexOf(aaa) === -1) {
          white_list.push(aaa);
        }
        // console.log('sssssssssss');
      } else {
        // alert();
        $(this).val("");
        $(this).focus();
        // console.log('ddddddddddd');
      }
    } else {
      if (isMacAddress($(this).val()) && $(this).val().length === 17) {
        var macaddress = $(this).val().replace(/-/g, ":");
        if (trusted_mac_list.indexOf(macaddress) === -1) {
          trusted_mac_list.push(macaddress);
        }
        // trusted_mac_list.push(macaddress);
        $(this).val(macaddress);
        // console.log('ffffffffff');
      } else {
        // alert();
        $(this).val("");
        $(this).focus();
        // console.log('gggggggggggg');
      }
    }
    $(this).data("oldval", $(this).val());
    $(this).attr("textvalue", $(this).val());
    // "input[textvalue='" + $(this).val() + "']"
    if (!(container.find(`input[textvalue='${ $(this).val() }']`).length === 1)) {
      $(this).parent().remove();
      if (container.hasClass("white_list_div")) {
        white_list.splice($.inArray($(this).val(), white_list), 1);
        // console.log('qqqqqqqqqqqqqqqqq1');
      } else {
        trusted_mac_list.splice($.inArray($(this).val(), trusted_mac_list), 1);
        // console.log('qqqqqqqqqqqqqq2');
      }

    }
  } else {
    // "input[textvalue='" + $(this).data("oldval") + "']"
    if ($(this).data("oldval") && $.trim($(this).data("oldval")) !== "" && container.find(`input[textvalue='${ $(this).data("oldval") }']`).length === 1) {
      if (container.hasClass("white_list_div")) {
        white_list.splice($.inArray($(this).data("oldval"), white_list), 1);
        // console.log('wwwwwwwww');
      } else {
        trusted_mac_list.splice($.inArray($(this).data("oldval"), trusted_mac_list), 1);
        // console.log('eeeeeeeeeeee');
      }
    }
    var xxx = 0;
    if (container.find("input").each(function() {
        if ($.trim($(this).val()) === "") {
          xxx = xxx + 1;
        }
      })) {
      if (xxx != 1) {
        $(this).parent().remove();
        // console.log('rrrrrrrrrrrrr');
      }

    }
  }
  if ($.trim($('input.trusted_mac_list').last().val()) !== '') {
    var a = $('.trusted_mac_list_clone').first().clone();
    var b = a.find('input.trusted_mac_list');
    b.val('');
    b.removeData("oldval");
    b.removeAttr("textvalue");
    a.appendTo($('.trusted_mac_list_div').last());
  }
  if ($.trim($('input.white_list').last().val()) !== '') {
    var a = $('.white_list_clone').first().clone();
    var b = a.find('input.white_list');
    b.val('');
    b.removeData("oldval");
    b.removeAttr("textvalue");
    a.appendTo($('.white_list_div').last());
  }
};


$(document).on('click', 'i.white_list_i', function() {
  // body...
  var container = $(this).parent().parent('.white_list_clone').parent();
  var xxx = 0;
  container.find("input").each(function() {
    xxx = xxx + 1;
  })
  if (xxx != 1) {
    white_list.splice($.inArray($(this).parent().parent('.white_list_clone').find("input").data("oldval"), white_list), 1);
    $(this).parent().parent('.white_list_clone').remove();
    // console.log('rrrrrrrrrrrrr');
  }
  // container.remove();
})
$(document).on('click', 'i.trusted_mac_list_i', function() {
  // body...
  var container = $(this).parent().parent('.trusted_mac_list_clone').parent();
  var xxx = 0;
  container.find("input").each(function() {
    xxx = xxx + 1;
  })
  if (xxx != 1) {
    // console.log(trusted_mac_list);
    trusted_mac_list.splice($.inArray($(this).parent().parent('.trusted_mac_list_clone').find("input").data("oldval"), trusted_mac_list), 1);
    // console.log(trusted_mac_list);
    $(this).parent().parent('.trusted_mac_list_clone').remove();
    // console.log('rrrrrrrrrrrrr');
  }

  // container.remove();
})
$(document).on("blur", "input.white_list, input.trusted_mac_list",
  updatewhitelist
);

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

// 判断是否显示
// function pwd_strong(value){
//     console.log(value);
//     if(value == ""){
//         $('#pwd_strong').attr('hidden','hidden');
//     }
//     else{
//         $('#pwd_strong').removeAttr('hidden','hidden');
//     }
// }
//判断输入密码的类型
function CharMode(iN) {
  if (iN >= 48 && iN <= 57) //数字
    return 1;
  if (iN >= 65 && iN <= 90) //大写
    return 2;
  if (iN >= 97 && iN <= 122) //小写
    return 4;
  else
    return 8;
}
//bitTotal函数
//计算密码模式
function bitTotal(num) {
  modes = 0;
  for (i = 0; i < 4; i++) {
    if (num & 1) modes++;
    num >>>= 1;
  }
  return modes;
}
//返回强度级别
function checkStrong(sPW) {
  if (sPW.length < 6)
    return 0; //密码太短，不检测级别
  Modes = 0;
  for (i = 0; i < sPW.length; i++) {
    //密码模式
    Modes |= CharMode(sPW.charCodeAt(i));
  }
  return bitTotal(Modes);
}

//显示颜色
function pwStrength(pwd) {
  Dfault_color = "#eeeeee"; //默认颜色
  L_color = "#FF0000"; //低强度的颜色，且只显示在最左边的单元格中
  M_color = "#FF9900"; //中等强度的颜色，且只显示在左边两个单元格中
  H_color = "#33CC00"; //高强度的颜色，三个单元格都显示
  if (pwd == null || $.trim(pwd) == '') {
    Lcolor = Mcolor = Hcolor = Dfault_color;
  } else {
    S_level = checkStrong(pwd);
    switch (S_level) {
      case 0:
        Lcolor = Mcolor = Hcolor = Dfault_color;
        break;
      case 1:
        Lcolor = L_color;
        Mcolor = Hcolor = Dfault_color;
        break;
      case 2:
        Lcolor = Mcolor = M_color;
        Hcolor = Dfault_color;
        break;
      default:
        Lcolor = Mcolor = Hcolor = H_color;
    }
  }
  document.getElementById("strength_L").style.background = Lcolor;
  document.getElementById("strength_M").style.background = Mcolor;
  document.getElementById("strength_H").style.background = Hcolor;
  return;
}

function datatableInit(dataset) {
  // '<table class="table table-bordered table-striped" id="datatable-default-2"><thead><tr><th>{% trans "账号" %}</th><th>{% trans "密码" %}</th><th>{% trans "创建时间" %}</th><th >{% trans "状态" %}</th><th>{% trans "操作" %}</th></tr></thead><tbody></tbody></table>'
  $('#exex').html(`<table class="table table-bordered table-striped" id="datatable-default-2"><thead><tr><th>${ pageWords.account }</th><th>${ pageWords.passwd }</th><th>${ pageWords.createTime }</th><th>${ pageWords.expiretime }</th><th>${ pageWords.action }</th></tr></thead><tbody></tbody></table>`);
  $('#datatable-default-2').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": false,
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
    // "ajax": "{% url 'ap_wait_access_ajax' %}",
    "data": dataset,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "name"
    }, {
      "data": "password"
    }, {
      "data": "regist_time"
    }, {
      "data": "expiretime"
    }, {
      "data": null
    }, ],
    'createdRow': function(row, data, index) {
      // "<a class=\"btn btn-default table-btn-btnpad delete_portal_user\" username=\"" + data.name + "\">{% trans '删除' %}</a>"
      $('td', row).eq(5).html(`<a class="btn btn-default table-btn-btnpad delete_portal_user" username="${ data.name }">${ pageWords.delete }</a>`);
    }
  });
};

function voucherfun() {
  // "{%url 'auth_proxy' %}"
  $.post(`${ url }/ap-list/ap_guest_policy/auth_proxy/`, {
    list: "voucherList"
  }, function(res) {
    // body...
    var dataset = JSON.parse(res);
    vouchertable(dataset);
    // console.log(dataset);
    ds = dataset;
  });
}

function voucher_re() {
  // "{%url 'auth_proxy' %}"
  $.post(`${ url }/ap-list/ap_guest_policy/auth_proxy/`, {
    list: "voucherList"
  }, function(res) {
    // body...
    var dataset = JSON.parse(res);
    tt.destroy();
    vouchertable(dataset);
    ds = dataset;
    // console.log(dataset);
  });
}

function vouchertable(dataset) {
  // body...
  // $('#portal-voucher').html('<table class="table table-bordered table-striped" id="datatable-default-2"><thead><tr><th>{% trans "账号" %}</th><th>{% trans "密码" %}</th><th>{% trans "创建时间" %}</th><th >{% trans "状态" %}</th><th>{% trans "操作" %}</th></tr></thead><tbody></tbody></table>');
  tt = $('#datatable-default-voucher').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": false,
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
    "data": dataset,
    'retrieve': true,
    'destroy': true,
    "columns": [
      // { "data": "id" },
      {
        "data": "essid"
      }, {
        "data": "code"
      }, {
        "data": "support"
      }, {
        "data": "duration"
      }, {
        "data": "flow"
      }, {
        "data": "create"
      }, {
        "data": "used"
      },
      // { "data": "start" },
      {
        "data": "status"
      },
      // { "data": "endtime" },
      // { "data": "groupname" },
      {
        "data": "mac"
      }, {
        "data": "remarks"
      }, {
        "data": null
      },
    ],
    'createdRow': function(row, data, index) {
      // "<a class=\"btn btn-default table-btn-btnpad edit_voucher\" href=\"#\" data-id=\"" + data.id + "\">{% trans '编辑' %}</a><a class=\"btn btn-default table-btn-btnpad del_voucher\" data-code=\"" + data.code + "\">{% trans '删除' %}</a><a class=\"btn btn-default table-btn-btnpad print_voucher\" data-code=\"" + data.code + "\">{% trans '打印' %}</a>"
      $('td', row).eq(10).html(`<a class="btn btn-default table-btn-btnpad edit_voucher" href="#" data-id="${ data.id }">${ pageWords.edit }</a><a class="btn btn-default table-btn-btnpad del_voucher" data-code="${ data.code }">${ pageWords.delete }</a><a class="btn btn-default table-btn-btnpad print_voucher" data-code="${ data.code }">${ pageWords.print }</a>`);
      if (data.support === "single") {
        $('td', row).eq(2).text(pageWords.single);
      } else if (data.support === "many") {
        $('td', row).eq(2).text(pageWords.many);
      }
      if (data.status === "not") {
        $('td', row).eq(7).text(pageWords.notEnabled);
      } else if (data.status === "expired") {
        $('td', row).eq(7).text(pageWords.expired);
      } else if (data.status === "out") {
        $('td', row).eq(7).text(pageWords.out);
      } else if (data.status === "apply") {
        // "{% trans '使用中，过期时间:' %}" + data.endtime
        $('td', row).eq(7).text(`${ pageWords.apply }:${ data.endtime }`);
      }
    }
  });
}

// edit_voucher
function edit_voucher() {
  var id = $(this).attr("data-id");
  for (var i in ds) {
    if (ds[i].id === id) {
      var c = ds[i];
    }
  }
  var date = '';
  if (c.duration !== 8) {
    date = c.duration / 24;
  } else {
    date = c.duration;
  }
  $("#voucher_essid_inputs").val(c.essid || "");
  $('#voucher_code_list').show();
  $(".voucher-num").hide();
  $(".voucher-code-input").val(c.code);
  // $(".voucher-nums-select").val("1");
  $(".voucher-durations-select").val(date);
  $("#voucher_byte_inputs").val(c.flow || "");
  $(".voucher-supports-select").val(c.support || "single");
  $(".voucher-remarks-input").val(c.remarks || "");
  $('#open_form').click();
}

function del_voucher() {
  var code = $(this).attr("data-code");
  $('#voucher_sure').data("data-code", code);
  $('#open_confirm').click();
}

function print_voucher() {
  var code = $(this).attr("data-code");
  // '{% url "voucherprint" %}?code=' + code
  window.open(`${ url }/ap-list/ap_guest_policy/voucherprint/?code=${ code }`);
}

$("#voucher_sure").click(function() {
  var code = $(this).data("data-code");
  // "{%url 'auth_proxy' %}"
  $.post(`${ url }/ap-list/ap_guest_policy/auth_proxy/`, {
    'cmd': "voucherDelete",
    'code': code
  }, function(ret) {
    // body...
    $('#voucher_cancel').click();
    voucher_re();
  });
});
$(document).on('click', '.btn.btn-default.table-btn-btnpad.edit_voucher', edit_voucher);
$(document).on('click', '.btn.btn-default.table-btn-btnpad.del_voucher', del_voucher);
$(document).on('click', '.btn.btn-default.table-btn-btnpad.print_voucher', print_voucher);

$("#vouchermany_print").click(function() {
  // "{% url 'voucherprint' %}"
  window.open(`${ url }/ap-list/ap_guest_policy/voucherprint/`);
});


$(document).on("click", "#edit_phonelogin", function() {
  var title = 'phonelogin';
  edit_portal(title);
});

$(document).on("click", "#edit_accountlogin", function() {
  var title = 'accountlogin';
  edit_portal(title);
});

$(document).on("click", "#edit_onekey", function() {
  var title = 'onekey';
  edit_portal(title);
});

$(document).on("click", "#edit_wechat", function() {
  var title = 'wechat';
  edit_portal(title);
});

$(document).on("click", "#edit_voucher", function() {
  var title = 'voucher';
  edit_portal(title);
});
$("#close_portal").click(function() {
  // $(".device-cover").hide();
  // $("#create_custom").hide();
  // "{% url 'create_portal_css_php' %}"
  $.post(`${ url }/portal_master/create_portal_css.php`, {
    'json': ""
  }, function(ret) {
    // body...
  });
});


$('#auth-export').click(function(event) {
  /* Act on the event */
  $('#openAuthExport').click();
});

$('#exportAuthInfo').click(function(event) {
  /* Act on the event */
  window.location.href = `${ url }/ap-list/ap_guest_policy/authAccountInfoApi/?mode=export`;
  $('a.exportDismiss').click();
});

$('#auth-import').click(function(event) {
  /* Act on the event */
  $('#authAccountInfoResultHide').hide();
  $('#authAccountInfoResult').html('');
  $('#openAuthImport').click();
});

$('#importAuthInfo').click(function() {
  // body...
  var file = $('#authAccountInfoFile')[0].files[0];
  // console.log(file);
  if (file) {
    if ($.inArray(file['type'], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) !== -1) {
      var fm = new FormData();
      fm.append('file', file);
      $.ajax({
        type: 'POST',
        url: `${ url }/ap-list/ap_guest_policy/authAccountInfoApi/`,
        data: fm,
        processData: false, // 告诉jquery不转换数据
        contentType: false, // 告诉jquery不设置内容格式
        success: function(ret) {
          alert(ret.error);
          if ($.trim(ret.furl) !== "") {
            var a = `<a href="/static/${ ret.furl }" style="color:#23527c;">${ pageWords.errorListDownload }</a>`;
            $('#authAccountInfoResultHide').show();
            $('#authAccountInfoResult').html(a);
          }
        }
      })
    } else {
      alert(pageWords.fileTypeError);
    }
  } else {
    alert(pageWords.fileNotFound);
  }

});
