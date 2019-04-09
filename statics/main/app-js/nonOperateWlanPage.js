var url = window.location.origin;

var authTypeOption = [
  'no_authentication',
  'account',
  'phonesms',
  'wechatauth',
  'smsandwechat',
  'voucher_auth',
  'localwechat',
  'external_auth_server',
];

$(function() {
  $('.labelauty:input').labelauty();
  addWlanAuthTypeSelectOption();
  get_auto_accept();
  black_list_table();
});

function addWlanAuthTypeSelectOption() {
  // body...
  let wlanAuthTypeHTML = '';
  authTypeOption.forEach(function(value) {
    wlanAuthTypeHTML = `${ wlanAuthTypeHTML }<option class="wlanAuthType ${ value }" value="${ value }">${ pageWords[value] }</option>`;
  });
  $('#auth_type').html(wlanAuthTypeHTML);
  $('#auth_type_m').html(wlanAuthTypeHTML);
}

$('#auth_type').change(function(event) {
  /* Act on the event */
  if ($(this).val() === 'localwechat') {
    $('#localwechat').show();
    $('#external_auth_server').hide();
  } else if ($(this).val() === 'external_auth_server') {
    $('#localwechat').hide();
    $('#external_auth_server').show();
  } else {
    $('#localwechat').hide();
    $('#external_auth_server').hide();
  }
});
$('#auth_type_m').change(function(event) {
  /* Act on the event */
  if ($(this).val() === 'localwechat') {
    $('#localwechat_m').show();
    $('#external_auth_server_m').hide();
  } else if ($(this).val() === 'external_auth_server') {
    $('#localwechat_m').hide();
    $('#external_auth_server_m').show();
  } else {
    $('#localwechat_m').hide();
    $('#external_auth_server_m').hide();
  }
});

function wlan_ajax() {
  // body...
  var sign = 1;
  if ($('#group_id').val() === null || $.trim($('#group_id').val()) === '') {
    alert(pageWords.wlanChooseGroupEmptyError);
    sign = 0;
  }
  if ($.trim($('#ssid').val()) === "") {
    alert(pageWords.ssidEmptyError);
    sign = 0;
  }
  if ($.trim($('#download_speed').val()) === "" || $.trim($('#upload_speed').val()) === "") {
    alert(pageWords.speedLimitEmptyError);
    sign = 0;
  }
  if ($('#vlan_enabled').attr('checked') === "checked") {
    if ($.trim($('#vlan').val()) === "") {
      alert(pageWords.vlanEmptyError);
      sign = 0;
    } else {
      var vlan = $.trim($('#vlan').val());
      var reg = /^[0-9]+$/g;
      if (!reg.test(vlan) || !(vlan >= 1 && vlan <= 4094)) {
        alert(pageWords.vlanValueError);
        sign = 0;
      }
    }
  }
  if ($('#ex6').val() === "2" || $('#ex6').val() === "3") {
    if ($.trim($('#passphrase').val()) === "") {
      alert(pageWords.passwdEmptyError);
      sign = 0;
    } else {
      var passphrase = $.trim($('#passphrase').val());
      var reg = /^.{8,64}$/g;
      if (!reg.test(passphrase)) {
        alert(pageWords.passwdValueError);
        sign = 0;
      }
    }
  } else if ($('#ex6').val() === "1") {
    $('#passphrase').val("");
  }
  if ($('#auth_type').val() === "localwechat") {
    if ($.trim($('#wechat_appid').val()) === "" || $.trim($('#wechat_shopid').val()) === "" || $.trim($('#wechat_secretkey').val()) === "") {
      alert(pageWords.weixinEmptyError);
      sign = 0;
    } else if ($('#wechat_forcefollow').attr('checked') === 'checked' && $.trim($('#wechat_appid').val()) === "") {
      alert(pageWords.applyPasswdEmptyError);
      sign = 0;
    }
  }
  if ($('#auth_type').val() === "external_auth_server") {
    if ($.trim($('#auth_server_loginurl').val()) === "" || $.trim($('#auth_server_portalurl').val()) === "") {
      alert(pageWords.serverConfigEmptyError);
      sign = 0;
    }
  }

  if (sign != 0) {
    $.ajax({
      type: "POST",
      dataType: "html",
      // "{% url 'add_nonoperate_wlan_ajax' %}"
      url: `${ url }/nonoperate/nonoperate_wlan/add_nonoperate_wlan_ajax/`,
      data: $("#create_wlan").serialize(),
      success: function(result) {
        // alert(111111);
        alert(JSON.parse(result).message);
        if (JSON.parse(result).sign === "true") {
          $('#close_create').click();
          location.reload();
        }
        // oTable.ajax.reload(null,false)
      },
    });
  }
}

var slider = new Slider("#ex6");
// var a = pageWords.low;
// var b = pageWords.med;
// var c = pageWords.strong;
$("#ex6").on("change", function(slideEvt) {
  var a = pageWords.low;
  var b = pageWords.med;
  var c = pageWords.strong;
  // console.log(slideEvt.value.newValue);
  // console.log(typeof(slideEvt.value.newValue));
  if (slideEvt.value.newValue === parseInt('1')) {
    $("#ex6SliderVal").text(a);
    $("#ex6SliderVal").css('background-color', '#EE3439');
    $('#passphrase_hide').hide();
  } else if (slideEvt.value.newValue === parseInt('2')) {
    $("#ex6SliderVal").text(b);
    $("#ex6SliderVal").css('background-color', '#FF8E42');
    $('#passphrase_hide').show();
  } else {
    $("#ex6SliderVal").text(c);
    $("#ex6SliderVal").css('background-color', 'green');
    $('#passphrase_hide').show();
  }
});

var changeSlider = new Slider("#ex6_m");
$("#ex6_m").on(" change", function(slideEvt) {
  var a = pageWords.low;
  var b = pageWords.med;
  var c = pageWords.strong;
  // console.log(slideEvt);
  // console.log(changeSlider.getValue());
  if (slideEvt.value.newValue === parseInt('1')) {
    $('#ex6_m').val(parseInt('1'));
    $("#ex6_mSliderVal").text(a);
    $("#ex6_mSliderVal").css('background-color', '#EE3439');
    // $('#passphrase_hide').val('');
    $('#passphrase_hide_m').hide();
  } else if (slideEvt.value.newValue === parseInt('2')) {
    $('#ex6_m').val(parseInt('2'));
    $("#ex6_mSliderVal").text(b);
    $("#ex6_mSliderVal").css('background-color', '#FF8E42');
    $('#passphrase_hide_m').show();
  } else {
    $('#ex6_m').val(parseInt('3'));
    $("#ex6_mSliderVal").text(c);
    $("#ex6_mSliderVal").css('background-color', 'green');
    $('#passphrase_hide_m').show();
  }
});

$("#vlan_enabled").on("click", function(event) {
  // body...
  if ($("#vlan_enabled").attr("checked") === "checked") {
    $("#vlan_hide").show();
  } else {
    $("#vlan_hide").hide();
  }
});
$("#vlan_enabled_m").on("click", function(event) {
  // body...
  if ($("#vlan_enabled_m").attr("checked") === "checked") {
    $("#vlan_hide_m").show();
  } else {
    $("#vlan_hide_m").hide();
  }
});

function get_auto_accept() {
  // body...
  // '{% url "nonoperate_auto_accept" %}'
  $.post(`${ url }/nonoperate/nonoperate_wlan/auto-accept/`, {
    'accept': 'get'
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret === "open") {
      $('#auto-accept').attr('checked', 'checked');
    } else {
      $('#auto-accept').removeAttr('checked', 'checked');
    }
  });
}
$('#auto-accept').click(function() {
  /* Act on the event */
  if ($(this).attr('checked') === "checked") {
    // '{% url "nonoperate_auto_accept" %}'
    $.post(`${ url }/nonoperate/nonoperate_wlan/auto-accept/`, {
      'accept': 'open'
    }, function(ret) {
      /*optional stuff to do after success */
      // alert(ret.error);
    });
  } else {
    // '{% url "nonoperate_auto_accept" %}'
    $.post(`${ url }/nonoperate/nonoperate_wlan/auto-accept/`, {
      'accept': 'close'
    }, function(ret) {
      /*optional stuff to do after success */
      // alert(ret.error);
    });
  }
});

function modify_wlan_ajax(pk) {
  // body...
  var sign = 1;
  if ($.trim($('#ssid_m').val()) === "") {
    alert(pageWords.ssidEmptyError);
    sign = 0;
  }
  if ($.trim($('#download_speed_m').val()) === "" || $.trim($('#upload_speed_m').val()) === "") {
    alert(pageWords.speedLimitEmptyError);
    sign = 0;
  }
  if ($('#vlan_enabled_m').attr('checked') === "checked") {
    if ($.trim($('#vlan_m').val()) === "") {
      alert(pageWords.vlanEmptyError);
      sign = 0;
    } else {
      var vlan = $.trim($('#vlan_m').val());
      var reg = /^[0-9]+$/g;
      if (!reg.test(vlan) || !(vlan >= 1 && vlan <= 4094)) {
        alert(pageWords.vlanValueError);
        sign = 0;
      }
    }
  }
  if ($('#ex6_m').val() === "2" || $('#ex6_m').val() === "3") {
    if ($.trim($('#passphrase_m').val()) === "") {
      alert(pageWords.passwdEmptyError);
      sign = 0;
    } else {
      var passphrase = $.trim($('#passphrase_m').val());
      var reg = /^.{8,64}$/g;
      if (!reg.test(passphrase)) {
        alert(pageWords.passwdValueError);
        sign = 0;
      }
    }
  } else if ($('#ex6_m').val() === "1") {
    $('#passphrase_m').val("");
  }
  if ($('#auth_type_m').val() === "localwechat") {
    if ($.trim($('#wechat_appid_m').val()) === "" || $.trim($('#wechat_shopid_m').val()) === "" || $.trim($('#wechat_secretkey_m').val()) === "") {
      alert(pageWords.weixinEmptyError);
      sign = 0;
    } else if ($('#wechat_forcefollow_m').attr('checked') === 'checked' && $.trim($('#wechat_appid_m').val()) === "") {
      alert(pageWords.applyPasswdEmptyError);
      sign = 0;
    }
  }
  if ($('#auth_type_m').val() === "external_auth_server") {
    if ($.trim($('#auth_server_loginurl_m').val()) === "" || $.trim($('#auth_server_portalurl_m').val()) === "") {
      alert(pageWords.serverConfigEmptyError);
      sign = 0;
    }
  }
  if (sign != 0) {
    $.ajax({
      type: "POST",
      dataType: "html",
      // "{% url 'nonoperate_modify_wlan_ajax' %}?pk=" + pk
      url: `${ url }/nonoperate/nonoperate_wlan/nonoperate_modify_wlan_ajax/?pk=${ pk }`,
      data: $("#modify_wlan").serialize(),
      success: function(result) {
        alert(JSON.parse(result).message);
        if (JSON.parse(result).sign === "true") {
          $('#close_create').click();
          location.reload();
        }
      },
    });
  }
}

function black_list_add_table() {
  var table = $('#datatable-black-list-add').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
    }, ],

    "createdRow": function(row, data, index) {
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<div class=\"switch-div\" ><div class=\"switch-button\"><input type=\"checkbox\" onclick=\"blacklist_add_func('" + data.mac + "');\" id=\"blacklist_" + data.mac + "\"/><label for=\"blacklist_" + data.mac + "\"></label></div></div>"
      $('td', row).eq(1).html(`<div class="switch-div" ><div class="switch-button"><input type="checkbox" onclick="blacklist_add_func('${ data.mac }');" id="blacklist_${ data.mac }"/><label for="blacklist_${ data.mac }"></label></div></div>`);
    }
  });
  // "{% url 'nonoperate_black_list_add_ajax' %}"
  table.ajax.url(`${ url }/nonoperate/nonoperate_wlan/nonoperate_black_list_add_ajax/`).load();
}

function blacklist_add_func(mac) {
  // "#blacklist_" + mac + ""
  var ck = $(`#blacklist_${ mac }`).attr('checked');
  if (ck === "checked") {
    blacklist.push(mac);
  } else {
    blacklist.splice($.inArray(mac, blacklist), 1);
  }
}
$('#blacklist_add').click(function() {
  /* Act on the event */
  // '{% url "nonoperate_blacklist_add" %}'
  $.post(`${ url }/nonoperate/nonoperate_wlan/nonoperate_blacklist_add/`, {
    'bl': JSON.stringify(blacklist)
  }, function(ret) {
    /*optional stuff to do after success */
    if (ret.su === 'false') {
      if ($.trim(ret.error) !== "") {
        alert(ret.error);
      }
    } else if (ret.su === 'true') {
      alert(ret.error);
      $('#blacklist_add_cancel').click();
      black_list_table();
    }
  });
});

function black_list_table() {
  var table = $('#datatable-black-list').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    "autoWidth": true,
    "deferRender": true,
    // "<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>"
    "dom": `<'row'<'col-sm-6  modal_table_fix_1'l><' modal_table_fix_2'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>`,
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
      "data": "mac"
    }, {
      "data": "mac"
    }, ],

    "createdRow": function(row, data, index) {
      // "<a class=\"table-a-color\" title='" + data.mac + "'>" + data.name + "</a>"
      $('td', row).eq(0).html(`<a class="table-a-color" title='${ data.mac }'>${ data.name }</a>`);
      // "<button type=\"button\" onclick=\"blacklist_remove('" + data.mac + "');\" class=\"btn btn-default table-btn-btnpad\">{% trans '删除' %}</button>"
      $('td', row).eq(1).html(`<button type="button" onclick="blacklist_remove('${ data.mac }');" class="btn btn-default table-btn-btnpad">${ pageWords.delete }</button>`);
    }
  });
  // "{% url 'nonoperate_black_list_table' %}"
  table.ajax.url(`${ url }/nonoperate/nonoperate_wlan/nonoperate_black_list_table/`).load();
}

function blacklist_remove(mac) {
  // body...
  // '{% url "nonoperate_blacklist_remove" %}'
  $.post(`${ url }/nonoperate/nonoperate_wlan/nonoperate_blacklist_remove/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.error);
    black_list_table();
  });
}

$(function() {
  // body...
  var auth_config = eval(authConfig('authGetconfig'));
  if (auth_config && auth_config.length > 0) {
    $("#wechat_appid").val(auth_config[0].plugins["apAuthLocalUserPlugin"].appid || "");
    $("#wechat_appkey").val(auth_config[0].plugins["apAuthLocalUserPlugin"].appsecret || "");
    $("#wechat_shopid").val(auth_config[0].plugins["apAuthLocalUserPlugin"].shopid || "");
    $("#wechat_secretkey").val(auth_config[0].plugins["apAuthLocalUserPlugin"].secretkey || "");
    var forcefollow = (auth_config[0].plugins["apAuthLocalUserPlugin"].forcefollow === "yes");
    if (forcefollow) {
      $("#wechat_forcefollow").attr('checked', 'checked');
    } else {
      $("#wechat_forcefollow").removeAttr('checked', 'checked');
    }
  }
});

function open_form() {
  // bk-bg-danger
  // '{% url "ap_wlan_create_get_portal_config" %}'
  $.getJSON(`${ url }/ap/ap_wlan/ap_wlan_create_get_portal_config/`, {
    'mode': 'open_form'
  }, function(ret) {
    /*optional stuff to do after success */
    // console.log(ret);
    if (ret.auth_server.login !== undefined) {
      $('#auth_server_loginurl').val(ret.auth_server.login);
    } else {
      $('#auth_server_loginurl').val();
    }
    if (ret.auth_server.portal !== undefined) {
      $('#auth_server_portalurl').val(ret.auth_server.portal);
    } else {
      $('#auth_server_portalurl').val();
    }
  });
  $('#open_form').click();
}

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

function open_form1(wl_id) {
  // bk-bg-danger
  var a = pageWords.low;
  var b = pageWords.med;
  var c = pageWords.strong;
  // "{% url 'nonoperate_wlan_info_ajax' %}?id=" + wl_id
  $.getJSON(`${ url }/nonoperate/nonoperate_wlan/nonoperate_wlan_info_ajax/?id=${ wl_id }`, function(ret) {
    // console.log(ret);
    var x = '';
    // "<option value=\"" + ret['gp'].group_id + "\">" + ret['gp'].group_account_group_name + "/" + ret['gp'].group_name + "</option>";
    x = `<option value="${ ret['gp'].group_id }">${ ret['gp'].group_account_group_name }/${ ret['gp'].group_name }</option>`;
    $('#group_id_m').html(x);
    $('#ssid_m').val(ret['wl'].wlan_ssid);
    if (ret['wl'].radios_enable === 'both') {
      $('#radios_enable_both_m').attr('checked', 'checked');
      $('#radios_enable_2g_m').removeAttr('checked', 'checked');
      $('#radios_enable_5g_m').removeAttr('checked', 'checked');
    } else if (ret['wl'].radios_enable === '2g') {
      $('#radios_enable_both_m').removeAttr('checked', 'checked');
      $('#radios_enable_2g_m').attr('checked', 'checked');
      $('#radios_enable_5g_m').removeAttr('checked', 'checked');
    } else if (ret['wl'].radios_enable === '5g') {
      $('#radios_enable_both_m').removeAttr('checked', 'checked');
      $('#radios_enable_2g_m').removeAttr('checked', 'checked');
      $('#radios_enable_5g_m').attr('checked', 'checked');
    }
    // console.log(ret['wl'].encry_type);
    if ($.trim(ret['wl'].encry_type) === '') {
      // $('#ex6_m').val('1');
      changeSlider.setValue(1);
      $('#ff div.slider-selection').attr('style', 'left: 0%; width: 0%;');
      $('#ff div.slider-handle.min-slider-handle.round').attr('style', 'left: 0%;');
      $("#ex6_mSliderVal").text(a);
      $("#ex6_mSliderVal").css('background-color', '#EE3439');
      $('#passphrase_hide_m').hide();
      $('#passphrase_m').val("");
    } else if (ret['wl'].encry_type === 'tkip') {
      // $('#ex6_m').val('2');
      changeSlider.setValue(2);
      $('#ff div.slider-selection').attr('style', 'left: 0%; width: 50%;');
      $('#ff div.slider-handle.min-slider-handle.round').attr('style', 'left: 50%; ');
      $("#ex6_mSliderVal").text(b);
      $("#ex6_mSliderVal").css('background-color', '#FF8E42');
      $('#passphrase_hide_m').show();
      $('#passphrase_m').val(ret['wl'].passphrase);
    } else if (ret['wl'].encry_type === 'ccmp') {
      // $('#ex6_m').attr('value','3');
      changeSlider.setValue(3);
      $('#ff div.slider-selection').attr('style', 'left: 0%; width: 100%;');
      $('#ff div.slider-handle.min-slider-handle.round').attr('style', 'left: 100%; ');
      // $('#ex6_m').attr('data',"value: '3'");
      $("#ex6_mSliderVal").text(c);
      $("#ex6_mSliderVal").css('background-color', 'green');
      $('#passphrase_hide_m').show();
      $('#passphrase_m').val(ret['wl'].passphrase);
    };
    $('#upload_speed_m').val(ret['wl'].upload_speed);
    $('#download_speed_m').val(ret['wl'].download_speed);
    $('#upload_speed_m_select').val(ret['wl'].upload_speed);
    $('#download_speed_m_select').val(ret['wl'].download_speed);
    if (ret['wl'].guest_enabled === 'on') {
      $('#guest_enabled_m').attr('checked', 'checked');
    } else if (ret['wl'].guest_enabled === 'off') {
      $('#guest_enabled_m').removeAttr('checked', 'checked');
    }
    $('#auth_type_m').val(ret['wl'].auth_type);

    if ($('#auth_type_m').val() === 'localwechat') {
      $('#localwechat_m').show();
      $('#external_auth_server_m').hide();
    } else if ($('#auth_type_m') === 'external_auth_server') {
      $('#localwechat_m').hide();
      $('#external_auth_server_m').show();
    } else {
      $('#localwechat_m').hide();
      $('#external_auth_server_m').hide();
    }
    $('#wechat_appid_m').val(ret['wl'].wechat_appid);
    $('#wechat_appkey_m').val(ret['wl'].wechat_appkey);
    $('#wechat_shopid_m').val(ret['wl'].wechat_shopid);
    $('#wechat_secretkey_m').val(ret['wl'].wechat_secretkey);
    if (ret['wl'].wechat_forcefollow === "true") {
      $('#wechat_forcefollow_m').attr('checked', 'checked');
    } else {
      $('#wechat_forcefollow_m').removeAttr('checked');
    }
    $('#auth_server_loginurl_m').val(ret['wl'].auth_server_loginurl)
    $('#auth_server_portalurl_m').val(ret['wl'].auth_server_portalurl)

    if (ret['wl'].hidden_ssid === 'on') {
      $('#hidden_ssid_m').attr('checked', 'checked');
    } else if (ret['wl'].hidden_ssid === 'off') {
      $('#hidden_ssid_m').removeAttr('checked', 'checked');
    }
    if (ret['wl'].vlan_enabled === 'on') {
      $('#vlan_enabled_m').attr('checked', 'checked');
      $("#vlan_hide_m").show();
      $('#vlan_m').val(ret['wl'].vlan);
    } else if (ret['wl'].vlan_enabled === 'off') {
      $('#vlan_enabled_m').removeAttr('checked', 'checked');
      $("#vlan_hide_m").hide();
      $('#vlan_m').val(ret['wl'].vlan);
    }
    if (ret['wl'].wlan_service === 'off') {
      $('#wlan_service_m').removeAttr('checked', 'checked');
    } else if (ret['wl'].wlan_service == 'on') {
      $('#wlan_service_m').attr('checked', 'checked');
    }
    // "modify_wlan_ajax(" + ret['wl'].id + ");"
    $('#modify_button').attr('onclick', `modify_wlan_ajax('${ ret['wl'].id }');`);
  });
  $('#open_form1').click();
}

function open_form_black_list() {
  // bk-bg-danger
  blacklist = [];
  $('#open_form_black_list').click();

}

function choose_ap_group_ajax() {
  // body...
  // "{% url 'choose_nonoperate_group_ajax' %}"
  $.getJSON(`${ url }/nonoperate/nonoperate_wlan/choose_nonoperate_group_ajax/`, function(ret) {
    // console.log(ret);
    // console.log(ret);
    // "<option value=\"\" >{% trans '请选择群组' %}</option>"
    var a = `<option value="" >${ pageWords.pleaseChooseGroup }</option>`;
    for (i in ret) {
      if (ret[i].disabled === 'disabled') {
        // a + "<option value=\"" + ret[i].group_id + "\" disabled='disabled'>" + ret[i].group_account_group_name + "/" + ret[i].group_name + " ({% trans '已满4个WLAN' %})</option>"
        a = `${ a }<option value="${ ret[i].group_id }" disabled='disabled'>${ ret[i].group_account_group_name }/${ ret[i].group_name } (${ pageWords.wlanAlreadyFull })</option>`;
      } else {
        // a + "<option value=\"" + ret[i].group_id + "\">" + ret[i].group_account_group_name + "/" + ret[i].group_name + "</option>"
        a = `${ a }<option value="${ ret[i].group_id }">${ ret[i].group_account_group_name }/${ ret[i].group_name }</option>`;
      }

    }
    $('#group_id').html(a);

  })
  $('#ssid').val('Name');
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
