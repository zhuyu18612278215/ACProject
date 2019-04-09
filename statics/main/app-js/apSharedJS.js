var url = window.location.origin;
var powerList = ["high", "medium", "low", "auto"]
var pathname = window.location.pathname;
var otbList = ['/nonoperate-list/', '/probe-list/', '/ap-list/'];

$(document).ready(function() {
  getCountryCode();
  $('#2g_channel').on('change', onChannel2GChange);
  $('#5g_channel').on('change', onChannel5GChange);
});

let intervalID;

function deviceLocate(mac) {
  // body...
  let locateButton = document.getElementById('a_locate');
  if (locateButton.dataset.buttonAttr === 'on') {
    $.post(`${ url }/ap-list/deviceLocateApi/`, {
      'mac': mac,
      'state': 'off',
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.status === 'success') {
        locateButton.dataset.buttonAttr = 'off';
        clearInterval(intervalID);
        locateButton.style.background = '';
      } else {
        alert(pageWords.locatingError);
      }
    });
  } else {
    $.post(`${ url }/ap-list/deviceLocateApi/`, {
      'mac': mac,
      'state': 'on',
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.status === 'success') {
        locateButton.dataset.buttonAttr = 'on';
        intervalID = setInterval(function() {
          locateButton.style.background = locateButton.style.background == '' ? '#3bbfb4' : '';
        }, 500);
      } else {
        alert(pageWords.locatingError);
      }
    });
  }
};

function deviceLocateState(state) {
  // body...
  let locateButton = document.getElementById('a_locate');
  clearInterval(intervalID);
  locateButton.style.background = '';
  if (state === 'on') {
    locateButton.dataset.buttonAttr = 'on';
    intervalID = setInterval(function() {
      locateButton.style.background = locateButton.style.background === '' ? '#3bbfb4' : '';
    }, 500);
  } else {
    locateButton.dataset.buttonAttr = 'off';
    clearInterval(intervalID);
    locateButton.style.background = '';
  }
}


function ap_reboot(mac) {
  // body...
  // "{% url 'ap_reboot' %}"
  $.post(`${ url }/ap-list/ap_reboot/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) !== '') {
      alert(ret);
      if (otbList.indexOf(pathname) !== -1) {
        oTable.ajax.reload(null, false);
      }
    }
  });
};

function ap_del(mac) {
  // body...
  // "{% url 'ap_del' %}"
  $.post(`${ url }/ap-list/ap_del/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) !== '') {
      alert(ret);
      if (otbList.indexOf(pathname) !== -1) {
        oTable.ajax.reload(null, false);
      }
    }
  });
};

function wlan_modify(id) {
  wlan_table = $('#datatable-default-wlan-modify').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": true,
    // "autoWidth": true,
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
    // 'data': data,
    'retrieve': true,
    'destroy': true,
    "columns": [{
      "data": "wlan_ssid"
    }, {
      "data": "change"
    }, {
      "data": "id"
    }, ],
    'createdRow': function(row, data, index) {
      // "<a  href='#' onclick=\"wlan_show_detail(" + data.id + "," + data.ap_id + ");\" class='btn btn-default table-btn-btnpad'>" + '{% trans "修改" %}' + "</a>"
      $('td', row).eq(2).html(`<a href='#' onclick="wlan_show_detail(${ data.id },${ data.ap_id });" class='btn btn-default table-btn-btnpad'>${ pageWords.fix }</a>`);
      $('td', row).eq(1).addClass('td-word-break');
    }
  });
  $('#datatable-default-wlan-modify_filter').addClass("modal_table_fix_2");
  // "{% url 'ap_wlan_list' %}?id=" + id
  wlan_table.ajax.url(`${ url }/ap-list/ap_wlan_list/?id=${ id }`).load();

}

function close_wlan_detail() {
  // body...
  $('#wlan_table').show();
  $('#wlan_detail').hide();
}

function wlan_show_detail(id, ap_id) {
  // body...
  $('#wlan_table').hide();
  $('#wlan_detail').show();
  // "{% url 'wlan_show_detail' %}?id=" + id + "&ap_id=" + ap_id
  $.getJSON(`${ url }/ap-list/wlan_show_detail/?id=${ id }&ap_id=${ ap_id }`, function(ret) {
    $('#ssid').val(ret.wlan_ssid);
    if (ret.radios_enable === 'both') {
      $('#radios_enable_both').attr('checked', 'checked');
      $('#radios_enable_2g').removeAttr('checked', 'checked');
      $('#radios_enable_5g').removeAttr('checked', 'checked');
    } else if (ret.radios_enable === '2g') {
      $('#radios_enable_both').removeAttr('checked', 'checked');
      $('#radios_enable_2g').attr('checked', 'checked');
      $('#radios_enable_5g').removeAttr('checked', 'checked');
    } else if (ret.radios_enable === '5g') {
      $('#radios_enable_both').removeAttr('checked', 'checked');
      $('#radios_enable_2g').removeAttr('checked', 'checked');
      $('#radios_enable_5g').attr('checked', 'checked');
    }

    $('#passphrase').val(ret.passphrase);
    if ($.trim(ret.passphrase) === "") {
      $('#passphrase_hide').hide();
    } else {
      $('#passphrase_hide').show();
    }
    $('#upload_speed').val(ret.upload_speed);
    $('#download_speed').val(ret.download_speed);
    $('#upload_speed_select').val(ret.upload_speed);
    $('#download_speed_select').val(ret.download_speed);
    if (ret.vlan_enabled === 'on') {
      $('#vlan_enabled').attr('checked', 'checked');
      $("#vlan_hide").show();
      $('#vlan').val(ret.vlan);
    } else if (ret.vlan_enabled === 'off') {
      $('#vlan_enabled').removeAttr('checked', 'checked');
      $("#vlan_hide").hide();
      $('#vlan').val(ret.vlan);
    }
    if (ret.wlan_service === 'off') {
      $('#wlan_service').removeAttr('checked', 'checked');
    } else if (ret.wlan_service === 'on') {
      $('#wlan_service').attr('checked', 'checked');
    }
  })

  $('#apply_change_wlan').attr('data-id', id);
  $('#apply_change_wlan').attr('data-ap_id', ap_id);
  $('#reduction_change_wlan').attr('data-id', id);
  $('#reduction_change_wlan').attr('data-ap_id', ap_id);
}

$('#vlan_enabled').click(function() {
  /* Act on the event */
  if ($('#vlan_enabled').attr('checked') === "checked") {
    $("#vlan_hide").show();
  } else {
    $("#vlan_hide").hide();
    $('#vlan').val(0);
  }
});

function apply_change_wlan() {
  // body...
  var id = $('#apply_change_wlan').attr('data-id');
  var ap_id = $('#apply_change_wlan').attr('data-ap_id');
  var sign = 1;
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
  if ($('#passphrase_hide').is(':hidden')) {
    $('#passphrase').val('');
  } else {
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
  }
  if (sign !== 0) {
    $.ajax({
      type: "POST",
      dataType: "html",
      // "{% url 'apply_change_wlan' %}?id=" + id + "&ap_id=" + ap_id
      url: `${ url }/ap-list/apply_change_wlan/?id=${ id }&ap_id=${ ap_id }`,
      data: $('#wlan_detail_form').serialize(),
      success: function(ret) {
        if ($.trim(eval(ret)) !== "") {
          alert(eval(ret));
        } else {
          wlan_table.ajax.reload(null, false);
          close_wlan_detail();
        }
      },
    });
  }
}

function reduction_change_wlan() {
  // body...
  var id = $('#reduction_change_wlan').attr('data-id');
  var ap_id = $('#reduction_change_wlan').attr('data-ap_id');
  // "{% url 'reduction_change_wlan' %}"
  $.post(`${ url }/ap-list/reduction_change_wlan/`, {
    'id': id,
    'ap_id': ap_id
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) !== "") {
      alert(ret);
    } else {
      wlan_table.ajax.reload(null, false);
      close_wlan_detail();
    }
  });
}

$('#vpn').click(function() {
  var value = $('#vpn').attr('data-a');

  if ($('#vpn').attr('checked') === 'checked') {
    // "{% url 'ap_vpn' %}"
    $.post(`${ url }/ap-list/ap_detail/ap_vpn/`, {
      'model': 'on',
      'mac': value
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.result === 'on') {
        $('#vpn').attr('checked', 'checked');
      } else if (ret.result === 'off') {
        $('#vpn').removeAttr('checked', 'checked');
      };
      if ($.trim(ret.ip) !== '') {
        $('#vpntitle').attr('title', ret.ip);
      } else {
        $('#vpntitle').removeAttr('title');
      };
    });
  } else {
    // "{% url 'ap_vpn' %}"
    $.post(`${ url }/ap-list/ap_detail/ap_vpn/`, {
      'model': 'off',
      'mac': value
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.result === 'on') {
        $('#vpn').attr('checked', 'checked');
      } else if (ret.result === 'off') {
        $('#vpn').removeAttr('checked', 'checked');
      };
      if ($.trim(ret.ip) !== '') {
        $('#vpntitle').attr('title', ret.ip);
      } else {
        $('#vpntitle').removeAttr('title');
      };
    });
  }
});

function ajaxfunc(value, value2) {
  // bk-bg-danger
  // console.log(value);
  // "{% url 'ap_detail' %}?mac=" + value
  $.getJSON(`${ url }/ap-list/ap_detail/?mac=${ value }`, function(ret) {
    // console.log(value2);
    // (ret.mac).substr(0, 2) + '-' + (ret.mac).substr(2, 2) + '-' + (ret.mac).substr(4, 2) + '-' + (ret.mac).substr(6, 2) + '-' + (ret.mac).substr(8, 2) + '-' + (ret.mac).substr(10, 2)
    var m = `${ (ret.mac).substr(0, 2) }-${ (ret.mac).substr(2, 2) }-${ (ret.mac).substr(4, 2) }-${ (ret.mac).substr(6, 2) }-${ (ret.mac).substr(8, 2) }-${ (ret.mac).substr(10, 2) }`;
    $('#mac').text(m.toUpperCase());
    $('#sn').text(ret.sn);
    $('#model').text(ret.model);
    $('#version').text(ret.version);
    $('#place').text(ret.place);
    $('#ip').text(ret.ip);
    var a = parseInt(ret.running_time);
    var b = parseInt(a / (24 * 3600));
    var c = parseInt(a % (24 * 3600) / 3600);
    var d = parseInt(a % (24 * 3600) % 3600 / 60);
    var e = parseInt(a % (24 * 3600) % 3600 % 60);
    var f = '';
    if (b === 0 && c === 0 && d === 0) {
      // e + 's'
      f = `${ e }s`;
    } else if (b === 0 && c === 0) {
      // d + 'm ' + e + 's'
      f = `${ d }m ${ e }s`;
    } else if (b === 0) {
      // c + 'h ' + d + 'm ' + e + 's'
      f = `${ c }h ${ d }m ${ e }s`;
    } else {
      // b + 'd ' + c + 'h ' + d + 'm ' + e + 's'
      f = `${ b }d ${ c }h ${ d }m ${ e }s`;
    }
    // console.log(a,'@#',b,'#$',c,'#@',d,'@',e,'@#',f,'@!');
    // $('#running_time').text(f);
    if (ret.running_time === "") {
      $('#running_time').text("");
    } else {
      $('#running_time').text(f);
    }

    $('#last_time').text(ret.last_time);
    $('#cpu').text(ret.cpu);
    $('#memory').text(ret.memory);
    $('#flash').text(ret.flash);
    if ($.trim(ret.name) === "") {
      // ret.model + '_' + ret.mac.substring(6)
      $('#name').text(`${ ret.model }_${ ret.mac.substring(6) }`);
    } else {
      $('#name').text(ret.name);
      $('#d_name').val(ret.name);

    }
    $('.receive_mac').val(value);

    $('#apusernum').text(ret.apusernum);
    $('#guestsnum').text(ret.guestsnum);
    // ret.down_pkts + "/" + getFlow(ret.download)
    $('#download_all').text(`${ ret.down_pkts }/${ getFlow(ret.download) }`);
    // ret.up_pkts + "/" + getFlow(ret.upload)
    $('#upload_all').text(`${ ret.up_pkts }/${ getFlow(ret.upload) }`);
    $('#radios_2_channel_show').text(ret.radios_2_channel);
    $('#radios_2_power_show').text(txpower_turn(ret.radios_2_power));
    $('#radios_5_channel_show').text(ret.radios_5_channel);
    $('#radios_5_power_show').text(txpower_turn(ret.radios_5_power));
    $('#radios_2_currstanum').text(ret.radios_2_currstanum);
    $('#radios_5_currstanum').text(ret.radios_5_currstanum);
    $('#radios_2_guestsnum').text(ret.radios_2_guestsnum);
    $('#radios_5_guestsnum').text(ret.radios_5_guestsnum);

    $('#ac_address').val(ret.ac_address);
    $('#log_address').val(ret.log_address);
    $('#ip_model').val(ret.ip_model);
    $('#ip_address').val(ret.ip_address);
    $('#subnet_mask').val(ret.subnet_mask);
    $('#gateway').val(ret.gateway);
    $('#preferred_dns').val(ret.preferred_dns);
    $('#alternative_dns').val(ret.alternative_dns);
    $('#preferred_ntp').val(ret.preferred_ntp);
    $('#alternative_ntp').val(ret.alternative_ntp);
    if (ret.ip_model === "dhcp") {
      $('#ip_address_d').hide();
      $('#subnet_mask_d').hide();
      $('#gateway_d').hide();
      $('#preferred_dns_d').hide();
      $('#alternative_dns_d').hide();
    }
    if (ret.vpn === 'on') {
      $('#vpn').attr('checked', 'checked');
    } else {
      $('#vpn').removeAttr('checked', 'checked');
    }
    if ($.trim(ret.vpnip) !== '') {
      $('#vpntitle').attr('title', ret.vpnip);
    } else {
      $('#vpntitle').removeAttr('title');
    }

    // console.log(ret);

    $('#vpn').attr('data-a', value);
    $('#delete').attr('href', '#');
    // "ap_del('" + value + "');"
    $('#delete').attr('onclick', `ap_del('${ value }');`);
    $('#reboot').attr('href', '#');
    // "ap_reboot('" + value + "');"
    $('#reboot').attr('onclick', `ap_reboot('${ value }');`);
    $('#a_locate').attr('onclick', `deviceLocate('${ value }');`);
    deviceLocateState(ret.locateState);

    // console.log();
    if (ret.admin_power_control === "ban") {
      $('#a_config').hide();
      // $('#a_audit').hide();
      $('#a_diagnosis').hide();
      $('#a_locate').hide();
      $('#reboot').hide();
    } else {
      $('#a_config').show();
      // $('#a_audit').show();
      $('#a_diagnosis').show();
      $('#a_locate').show();
      $('#reboot').show();
    }
  });
  $('#state').text(value2);
  // "{% trans '在线' %}"
  if (value2 === pageWords.online) {
    $('#head-state').removeClass("state-color-green");
    $('#head-state').removeClass("state-color-yellow");
    $('#head-state').removeClass("state-color-red");
    $('#head-state').removeClass("state-color-gray");

    $('#head-state').addClass("state-color-green");
  } else if (value2 === pageWords.timeOut) {
    // "{% trans '超时' %}"
    $('#head-state').removeClass("state-color-green");
    $('#head-state').removeClass("state-color-yellow");
    $('#head-state').removeClass("state-color-red");
    $('#head-state').removeClass("state-color-gray");

    $('#head-state').addClass("state-color-yellow");
  } else if (value2 === pageWords.offline) {
    // "{% trans '离线' %}"
    $('#head-state').removeClass("state-color-green");
    $('#head-state').removeClass("state-color-yellow");
    $('#head-state').removeClass("state-color-red");
    $('#head-state').removeClass("state-color-gray");

    $('#head-state').addClass("state-color-red");
  } else if (value2 === pageWords.retired || value2 === pageWords.removed) {
    //  "{% trans '退服' %}" "{% trans '已移除' %}"
    $('#head-state').removeClass("state-color-green");
    $('#head-state').removeClass("state-color-yellow");
    $('#head-state').removeClass("state-color-red");
    $('#head-state').removeClass("state-color-gray");

    $('#head-state').addClass("state-color-gray");
  } else if (value2 === pageWords.reboot || value2 === pageWords.update) {
    // "{% trans '重启' %}" "{% trans '升级' %}"
    $('#head-state').removeClass("state-color-green");
    $('#head-state').removeClass("state-color-yellow");
    $('#head-state').removeClass("state-color-red");
    $('#head-state').removeClass("state-color-gray");

    $('#head-state').addClass("state-color-red");
  }

  // "{% url 'ap_config' %}?mac=" + value
  $.getJSON(`${ url }/ap-list/ap_config/?mac=${ value }`, function(ret) {
    if (ret.radios_type === '0') {
      // $('#2G').removeAttr('hidden','hidden');
      // $('#5G').removeAttr('hidden','hidden');
      $("#2g_radios_detail").show();
      $("#5g_radios_detail").show();
      $("#2g_radios_config").show();
      $("#5g_radios_config").show();
    } else if (ret.radios_type === '1') {
      // $('#2G').removeAttr('hidden','hidden');
      // $('#5G').attr('hidden','hidden');
      $("#2g_radios_detail").show();
      $("#5g_radios_detail").hide();
      $("#2g_radios_config").show();
      $("#5g_radios_config").hide();
    } else if (ret.radios_type === '2') {
      // $('#2G').attr('hidden','hidden');
      // $('#5G').removeAttr('hidden','hidden');
      $("#2g_radios_detail").hide();
      $("#5g_radios_detail").show();
      $("#2g_radios_config").hide();
      $("#5g_radios_config").show();
    }
    $('#max_user').val(ret.max_user);
    $('#2g_channel').val(ret.radios_2_channel);
    $('#2g_ht').val(ret.radios_2_ht);
    $('#radios_2_com').val(ret.radios_2_com);
    // ret.r_2g_maxp + "dBm"
    $('#2g_max_p').text(`${ ret.r_2g_maxp }dBm`);
    limit_max_power('2g_cu', ret.r_2g_maxp);
    // ret.radios_2_power !== "high" && ret.radios_2_power !== "medium" && ret.radios_2_power !== "low" && ret.radios_2_power !== "auto"
    if (powerList.indexOf(String(ret.radios_2_power)) === -1) {
      $('#2g_cu').val(ret.radios_2_power);
      $('#2G_power').val('customize');
      $('#2g_customize').show();
    } else {
      $('#2G_power').val(ret.radios_2_power);
      $('#2g_customize').hide();
    }
    check_cus('2g');
    $('#5g_channel').val(ret.radios_5_channel);
    $('#5g_ht').val(ret.radios_5_ht);
    // ret.r_5g_maxp + "dBm"
    $('#5g_max_p').text(`${ ret.r_5g_maxp }dBm`);
    limit_max_power('5g_cu', ret.r_5g_maxp);
    $('#radios_5_com').val(ret.radios_5_com);
    // ret.radios_5_power != "high" && ret.radios_5_power != "medium" && ret.radios_5_power != "low" && ret.radios_5_power != "auto"
    if (powerList.indexOf(String(ret.radios_5_power)) === -1) {
      $('#5g_cu').val(ret.radios_5_power);
      $('#5G_power').val('customize');
      $('#5g_customize').show();
    } else {
      $('#5G_power').val(ret.radios_5_power);
      $('#5g_customize').hide();
    }
    check_cus('5g');

  })
  show_gpon_config(value);
  // '{% url "gpon" %}'
  $.getJSON(`${ url }/ap/ap_list/gpon/`, {
    'mac': value
  }, function(ret) {
    /*optional stuff to do after success */
    $('#save_pwd_button').hide();
    $('#save_update_button').hide();

    if (ret.null === 'false') {
      $('#gpon_config_list').show();
      $('#collapse-gpon-config').data('mac', ret.ap_mac);
      // $('#gpon_sn_config').val(ret.gpon_sn);
      $('#gpon_pwd_config').val(ret.gpon_pwd);
      // $('#manufacturer_oui_config').val(ret.manufacturer_oui);
      // $('#gpon_update_link').val(ret.update_link);
      // $('#gpon_update_file').val(ret.update_file);

      $('#gpon_sn').text(ret.gpon_sn);
      $('#gpon_pwd').text(ret.gpon_pwd);
      $('#los_status').text(ret.los_status);
      $('#tx_power').text(ret.tx_power);
      $('#rx_power').text(ret.rx_power);
      $('#temperature').text(ret.temperature);
      $('#supply_voltage').text(ret.supply_voltage);
      $('#txbias_current').text(ret.txbias_current);
      $('#onu_state').text(ret.onu_state);
      $('#phy_status').text(ret.phy_status);
      $('#traffic_status').text(ret.traffic_status);
      $('#manufacturer').text(ret.manufacturer);
      $('#manufacturer_oui').text(ret.manufacturer_oui);
      $('#operator_id').text(ret.operator_id);
      $('#model_name').text(ret.model_name);
      $('#customer_hwversion').text(ret.customer_hwversion);
      $('#customer_swversion').text(ret.customer_swversion);
    } else {
      $('#gpon_config_list').hide();
      $('#collapse-gpon-config').data('mac', '');
      // $('#gpon_sn_config').val('');
      $('#gpon_pwd_config').val('');
      // $('#manufacturer_oui_config').val('');
      // $('#gpon_update_link').val('');
      // $('#gpon_update_file').val('');


      $('#gpon_sn').text('');
      $('#gpon_pwd').text('');
      $('#los_status').text('');
      $('#tx_power').text('');
      $('#rx_power').text('');
      $('#temperature').text('');
      $('#supply_voltage').text('');
      $('#txbias_current').text('');
      $('#onu_state').text('');
      $('#phy_status').text('');
      $('#traffic_status').text('');
      $('#manufacturer').text('');
      $('#manufacturer_oui').text('');
      $('#operator_id').text('');
      $('#model_name').text('');
      $('#customer_hwversion').text('');
      $('#customer_swversion').text('');
    }
  });
  ap_customer_tab_table(value);
  $('#detail_message_href').click();
  $('#open_form').click();
}

// $('#gpon_sn_config_button').click(function() {
//     /* Act on the event */
//     var mac = $('#collapse-gpon-config').data('mac');
//     if($('#gpon_sn_config').val() == ""){
//         alert("{% trans '序列号不能为空' %}");
//     }else{
//         var value = $('#gpon_sn_config').val();
//         $.post('{% url "gpon_config" %}', {'mac': mac,'type':'sn','value':value}, function(ret) {
//             /*optional stuff to do after success */
//             alert(ret.mes);
//         });
//     }
// });
// save_pwd_button
$('#gpon_pwd_config').bind('input propertychange', function() {
  /* Act on the event */
  $('#save_pwd_button').show();
});
$('#gpon_update_link,#gpon_update_file').bind('input propertychange', function() {
  /* Act on the event */
  $('#save_update_button').show();
});

$('#gpon_pwd_config_button').click(function() {
  /* Act on the event */
  var mac = $('#collapse-gpon-config').data('mac');
  var value = $('#gpon_pwd_config').val();
  // '{% url "gpon_config" %}'
  $.post(`${ url }/ap/ap_list/gpon/gpon_config/`, {
    'mac': mac,
    'type': 'pwd',
    'value': value
  }, function(ret) {
    /*optional stuff to do after success */
    $('#save_pwd_button').hide();
    $('#save_update_button').hide();
    alert(ret.mes);
  });
});
// $('#manufacturer_oui_config_button').click(function() {
//     /* Act on the event */
//     var mac = $('#collapse-gpon-config').data('mac');
//     if($('#manufacturer_oui_config').val() == ""){
//         alert("{% trans '厂商标识不能为空' %}");
//     }else{
//         var value = $('#manufacturer_oui_config').val();
//         $.post('{% url "gpon_config" %}', {'mac': mac,'type':'oui','value':value}, function(ret) {
//             /*optional stuff to do after success */
//             alert(ret.mes);
//         });
//     }
// });

$('#gpon_update_button').click(function() {
  /* Act on the event */
  var mac = $('#collapse-gpon-config').data('mac');
  if ($.trim($('#gpon_update_link').val()) === "") {
    // "{% trans '服务器地址不能为空' %}"
    alert(pageWords.serverIPEmptyError);
  } else if ($.trim($('#gpon_update_file').val()) === "") {
    // "{% trans '文件名称不能为空' %}"
    alert(pageWords.gponFileNameError);
  } else {
    var value = new Array();
    value[0] = $('#gpon_update_link').val();
    value[1] = $('#gpon_update_file').val();
    // '{% url "gpon_config" %}'
    $.post(`${ url }/ap/ap_list/gpon/gpon_config/`, {
      'mac': mac,
      'type': 'update',
      'value': JSON.stringify(value)
    }, function(ret) {
      /*optional stuff to do after success */
      alert(ret.mes);
    });
  }
});
$('#gpon_reboot').click(function() {
  // body...
  var mac = $('#collapse-gpon-config').data('mac');
  // '{% url "gpon_action" %}'
  $.post(`${ url }/ap/ap_list/gpon/gpon_action/`, {
    'mac': mac,
    'type': 'reboot'
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.mes);
  });
});
$('#gpon_update').click(function() {
  // body...
  var mac = $('#collapse-gpon-config').data('mac');
  // '{% url "gpon_action" %}'
  $.post(`${ url }/ap/ap_list/gpon/gpon_action/`, {
    'mac': mac,
    'type': 'update'
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.mes);
  });
});
$('#gpon_save_data').click(function() {
  // body...
  var mac = $('#collapse-gpon-config').data('mac');
  // '{% url "gpon_action" %}'
  $.post(`${ url }/ap/ap_list/gpon/gpon_action/`, {
    'mac': mac,
    'type': 'save_data'
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.mes);
  });
});
$('#gpon_recover').click(function() {
  // body...
  var mac = $('#collapse-gpon-config').data('mac');
  // '{% url "gpon_action" %}'
  $.post(`${ url }/ap/ap_list/gpon/gpon_action/`, {
    'mac': mac,
    'type': 'recover'
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.mes);
  });
});

function show_gpon_config(mac) {
  // body...
  // '{% url "show_gpon_config" %}'
  $.getJSON(`${ url }/ap/ap_list/gpon/show_gpon_config/`, {
    'type': 'dev',
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    // ret !== {}
    if (!$.isEmptyObject(ret)) {
      $('#gpon_update_link').val(ret.update_link);
      $('#gpon_update_file').val(ret.update_file);
    }
  });
}

function ap_customer_tab_table(mac) {
  // body...
  simpleCustomerTable = $('#ap_customer_tab_table').DataTable({
    // "dom":"<'row'<'col-sm-6' l><'col-sm-6' f>>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
    // "dom":"<'row'<'col-sm-6' l><'col-sm-6' >>rt<'row '<'col-sm-5' i><'col-sm-6 table_page_controller_div'p><'#ch.col-sm-1 table_page_jump_div'>>",
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": false,
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
    // "{% url 'ap_customer_tab_table' %}?mac=" + mac
    "ajax": `${ url }/ap/ap_list/ap_customer_tab_table/?mac=${ mac }`,
    "columns": [{
      "data": "mac"
    }, {
      "data": "wlanid"
    }, {
      "data": "mac"
    }],
    'createdRow': function(row, data, index) {
      // "<a href=\"#\" onclick=\"customer_detail('" + data.mac + "','" + data.id + "');\" class=\"table-a-color\">" + data.name + "</a>"
      $('td', row).eq(0).html(`<a href="#" onclick="customer_detail('${ data.mac }','${ data.id }');" class="table-a-color">${ data.name }</a>`);
      if ($.trim(data.wlan) !== "") {
        $('td', row).eq(1).text(data.wlan);
      }
      // if(data.ap_dev !=""){
      //     $('td',row).eq(3).html("<a href=\"#\" onclick=\"ajaxfunc('"+data.ap+"');\" class=\"table-a-color\">"+data.ap_dev+"</a>");
      // }
      // $('td',row).eq(4).text(rssiToSignalQuality(data.signal));
      // "<a class=\"btn btn-default table-btn-btnpad\" href=\"#\" onclick=\"simpleCustomerTable_kickmac('" + data.ap + "','" + data.mac + "');\">{% trans '移除' %}</a>"
      var a = `<a class="btn btn-default table-btn-btnpad" href="#" onclick="simpleCustomerTable_kickmac('${ data.ap }','${ data.mac }');">${ pageWords.remove }</a>`;
      $('td', row).eq(2).html(a);
      // $('#ch').html('<input type="text" class="form-control input-sm" id="change_page" placeholder=\"{% trans "跳转至" %}\" style="margin-top: 2px;padding-right: 0px;padding-left: 5px;width: 57px; "/>');
      // $('#change_page').change(function () {
      //     var page = parseInt($('#change_page').val());
      //     if(!isNaN(page)){
      //         oTable.page( page - 1 ).draw( false );
      //     }else{
      //         $('#change_page').val('');
      //     }

      // } );
    }
  });
};

function simpleCustomerTable_kickmac(apmac, mac) {
  //body...
  //"{% url 'ap_kickmac' %}"
  $.post(`${ url }/ap-list/ap_kickmac/`, {
    'apmac': apmac,
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) !== '') {
      alert(ret);
      simpleCustomerTable.ajax.reload(null, false);
    }
  });
};

function changeFunc() {
  var selectbox = document.getElementById('ip_model');
  var selectedValue = selectbox.options[selectbox.selectedIndex].value;
  if (selectedValue === 'static') {
    $('#ip_address_d').show();
    $('#subnet_mask_d').show();
    $('#gateway_d').show();
    $('#preferred_dns_d').show();
    $('#alternative_dns_d').show();
  } else if (selectedValue === 'dhcp') {
    $('#ip_address').val('');
    $('#subnet_mask').val('');
    $('#gateway').val('');
    $('#preferred_dns').val('');
    $('#alternative_dns').val('');


    $('#ip_address_d').hide();
    $('#subnet_mask_d').hide();
    $('#gateway_d').hide();
    $('#preferred_dns_d').hide();
    $('#alternative_dns_d').hide();
  }
};

function customer_detail(mac, id) {
  // body...
  // '{% url "customer_detail" %}'
  $.getJSON(`${ url }/ap/ap_customer/customer_detail/`, {
    'id': id
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.isEmptyObject(ret)) {
      $('#customer_detail_mac').text("");
      $('#customer_detail_hostname').text("");
      $('#customer_detail_os_type').text("");
      $('#customer_detail_ip').text("");
      $('#customer_detail_livetime').text("");
      $('#customer_detail_ap').html("");
      $('#customer_detail_last_heart_time').text("");
      $('#customer_detail_wlan').text("");
      $('#customer_detail_ap_1').html("");
      $('#customer_detail_singal').text("");
      $('#customer_detail_channel').text("");
      $('#customer_detail_tx_rate').text("");
      $('#customer_detail_rx_rate').text("");
      $('#customer_detail_tx').text("");
      $('#customer_detail_rx').text("");
      $('#customer_detail_name').val("");
      $('#customer_detail_head_name').text("");
      $('#customer_detail_name_apply').data("mac", "");
    } else {
      // ret.mac.substring(0, 2).toUpperCase() + '-' + ret.mac.substring(2, 4).toUpperCase() + '-' + ret.mac.substring(4, 6).toUpperCase() + '-' + ret.mac.substring(6, 8).toUpperCase() + '-' + ret.mac.substring(8, 10).toUpperCase() + '-' + ret.mac.substring(10, 12).toUpperCase()
      $('#customer_detail_mac').text(`${ ret.mac.substring(0, 2).toUpperCase() }-${ ret.mac.substring(2, 4).toUpperCase() }-${ ret.mac.substring(4, 6).toUpperCase() }-${ ret.mac.substring(6, 8).toUpperCase() }-${ ret.mac.substring(8, 10).toUpperCase() }-${ ret.mac.substring(10, 12).toUpperCase() }`);
      $('#customer_detail_hostname').text(ret.hostname);
      $('#customer_detail_os_type').text(ret.ostype);
      $('#customer_detail_ip').text(ret.ip);
      $('#customer_detail_livetime').text(ret.uptime);
      // "<a href=\"#\" onclick=\"ajaxfunc('" + ret.ap + "','" + ret.state + "');wlan_modify(\'" + ret.dev_id + "\');\" class=\"table-a-color\">" + ret.ap_dev + "</a>"
      $('#customer_detail_ap').html(`<a href="#" onclick="ajaxfunc('${ ret.ap }','${ ret.state }');wlan_modify('${ ret.dev_id }');" class="table-a-color">${ ret.ap_dev }</a>`);
      $('#customer_detail_last_heart_time').text(ret.last_heart_time);
      $('#customer_detail_wlan').text(ret.wlan);
      // "<a href=\"#\" onclick=\"ajaxfunc('" + ret.ap + "','" + ret.state + "');wlan_modify(\'" + ret.dev_id + "\');\" class=\"table-a-color\">" + ret.ap_dev + "</a>"
      $('#customer_detail_ap_1').html(`<a href="#" onclick="ajaxfunc('${ ret.ap }','${ ret.state }');wlan_modify('${ ret.dev_id }');" class="table-a-color">${ ret.ap_dev }</a>`);
      $('#customer_detail_singal').text(rssiToSignalQuality(ret.signal));
      $('#customer_detail_channel').text(ret.channel);
      // $('#customer_detail_tx_rate').text(getFlow(ret.tx_rate));
      // $('#customer_detail_rx_rate').text(getFlow(ret.rx_rate));
      // parseInt(ret.tx_wifirate / 1000) + 'M'
      $('#customer_detail_tx_rate').text(`${ parseInt(ret.tx_wifirate / 1000) }M`);
      // parseInt(ret.rx_wifirate / 1000) + 'M'
      $('#customer_detail_rx_rate').text(`${ parseInt(ret.rx_wifirate / 1000) }M`);
      // ret.up_package + '/' + getFlow(ret.tx_bytes)
      $('#customer_detail_tx').text(`${ ret.up_package }/${ getFlow(ret.tx_bytes) }`);
      // ret.down_package + '/' + getFlow(ret.rx_bytes)
      $('#customer_detail_rx').text(`${ ret.down_package }/${ getFlow(ret.rx_bytes) }`);
      $('#customer_detail_name').val(ret.name);
      $('#customer_detail_head_name').text(ret.name);
      $('#customer_detail_name_apply').data("mac", ret.mac);
    }
  });
  $('#open_customer').click();
  customer_history_table(mac);
}
$('#customer_detail_name_apply').click(function() {
  /* Act on the event */
  var name = $('#customer_detail_name').val();
  var mac = $('#customer_detail_name_apply').data('mac');
  if ($.trim(name) === "") {
    alert(pageWords.nameEmptyError);
  } else if ($.trim(mac) === "") {
    alert(pageWords.userNotFoundError);
  } else {
    // '{% url "change_customer_name" %}'
    $.post(`${ url }/ap/ap_customer/customer_detail/change_customer_name/`, {
      'mac': mac,
      'name': name
    }, function(ret) {
      /*optional stuff to do after success */
      if (ret.sign === 'true') {
        alert(ret.mes);
      } else {
        alert(ret.mes);
      }
    });
  }
});

function customer_history_table(mac) {
  // body...
  $('#customer_history_table').DataTable({
    "pagingType": "simple_numbers",
    "processing": true,
    "searching": false,
    "autoWidth": true,
    "deferRender": true,
    "destroy": true,
    "order": [0, "desc"],
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
    // "{% url 'custome_detail_table' %}?mac=" + mac
    "ajax": `${ url }/ap/ap_customer/customer_detail/custome_detail_table/?mac=${ mac }`,
    "columns": [{
      "data": "last_heart_time"
    }, {
      "data": "livetime"
    }, {
      "data": "rx_bytes"
    }, {
      "data": "tx_bytes"
    }],
    'createdRow': function(row, data, index) {
      $('td', row).eq(2).text(getFlow(data.rx_bytes));
      $('td', row).eq(3).text(getFlow(data.tx_bytes));
      // $('#ch').html('<input type="text" class="form-control input-sm" id="change_page" placeholder=\"{% trans "跳转至" %}\" style="margin-top: 2px;padding-right: 0px;padding-left: 5px;width: 57px; "/>');
      // $('#change_page').change(function () {
      //     var page = parseInt($('#change_page').val());
      //     if(!isNaN(page)){
      //         oTable.page( page - 1 ).draw( false );
      //     }else{
      //         $('#change_page').val('');
      //     }

      // } );
    }
  });
};

var countryCode = '';
var currentCountryObject = {};

function getCountryCode() {
  // body...
  $.get(`${ url }/system/system_service/countryCodeApi/`, function(ret) {
    /*optional stuff to do after success */
    if (ret.countryCode) {
      countryCode = ret.countryCode;
    } else {
      countryCode = 'CN';
    }
    currentCountryObject = countryCodeObject[countryCode];
    setCountryCodeSetting();
  });
};

function setCountryCodeSetting() {
  // body...
  let emptyHTML = `<option value="auto">${ pageWords.auto }</option>`;

  let htOption2G = emptyHTML;
  if (currentCountryObject.ht40_ng) {
    ht2GList.forEach((val) => {
      htOption2G = `${ htOption2G } <option value="${ val }">HT${ val }</option>`
    });
  } else {
    htOption2G = `${ htOption2G } <option value="20">HT20</option>`
  };
  $('#2g_ht').html(htOption2G);

  let htOption5G = emptyHTML;
  if (currentCountryObject.ht40_na) {
    ht5GList.forEach((val) => {
      htOption5G = `${ htOption5G } <option value="${ val }">HT${ val }</option>`
    });
  } else {
    htOption5G = `${ htOption5G } <option value="20">HT20</option>`
  };
  $('#5g_ht').html(htOption5G);

  let channel2GList = currentCountryObject.channels_ng;
  let channel5GList = currentCountryObject.channels_na;

  let channelOption2G = emptyHTML;
  let channelOption5G = emptyHTML;
  channel2GList.forEach((val) => {
    channelOption2G = `${ channelOption2G } <option value="${ val }">${ val }</option>`
  });
  channel5GList.forEach((val) => {
    let dfs = '';
    if (currentCountryObject.channels_na_dfs && currentCountryObject.channels_na_dfs.includes(val)) {
      dfs = '(dfs)';
    };
    channelOption5G = `${ channelOption5G } <option value="${ val }">${ val }${ dfs }</option>`;
  });

  $('#2g_channel').html(channelOption2G);
  $('#5g_channel').html(channelOption5G);

}

function onChannel2GChange() {
  // body...
  let ht = $('#2g_ht').val();
  let channel = Number($('#2g_channel').val());

  let emptyHTML = `<option value="auto">${ pageWords.auto }</option>`;
  let htOption2G = emptyHTML;
  let htList = [];

  if (currentCountryObject.channels_ng && currentCountryObject.channels_ng.includes(channel)) {
    htList.push('20');
  }
  if (currentCountryObject.channels_ng_40 && currentCountryObject.channels_ng_40.includes(channel)) {
    htList.push('40');
  }

  htList.forEach((val) => {
    htOption2G = `${ htOption2G } <option value="${ val }">HT${ val }</option>`
  });
  $('#2g_ht').html(htOption2G);
  if (htList.includes(ht)) {
    $('#2g_ht').val(ht);
  } else {
    $('#2g_ht').val('auto');
  }

}

function onChannel5GChange() {
  // body...
  let ht = $('#5g_ht').val();
  let channel = Number($('#5g_channel').val());

  let emptyHTML = `<option value="auto">${ pageWords.auto }</option>`;
  let htOption5G = emptyHTML;
  let htList = [];

  if (currentCountryObject.channels_na && currentCountryObject.channels_na.includes(channel)) {
    htList.push('20');
  }
  if (currentCountryObject.channels_na_40 && currentCountryObject.channels_na_40.includes(channel)) {
    htList.push('40');
  }
  if (currentCountryObject.channels_na_80 && currentCountryObject.channels_na_80.includes(channel)) {
    htList.push('80');
  }

  htList.forEach((val) => {
    htOption5G = `${ htOption5G } <option value="${ val }">HT${ val }</option>`
  });
  $('#5g_ht').html(htOption5G);
  if (htList.includes(ht)) {
    $('#5g_ht').val(ht);
  } else {
    $('#5g_ht').val('auto');
  }

}



var ht2GList = ['20', '40'];
var ht5GList = ['20', '40', '80'];

var countryCodeObject = {
  "AL": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "8",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "AL",
    "name": "Albania"
  },
  "DZ": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "12",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "DZ",
    "name": "Algeria"
  },
  "AR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "32",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AR",
    "name": "Argentina"
  },
  "AM": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "51",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "AM",
    "name": "Armenia"
  },
  "AW": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "533",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AW",
    "name": "Aruba"
  },
  "AU": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "36",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AU",
    "name": "Australia"
  },
  "AT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "40",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AT",
    "name": "Austria"
  },
  "AZ": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "31",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AZ",
    "name": "Azerbaijan"
  },
  "BH": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "48",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "BH",
    "name": "Bahrain"
  },
  "BD": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "50",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "BD",
    "name": "Bangladesh"
  },
  "BB": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "52",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BB",
    "name": "Barbados"
  },
  "BY": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "112",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BY",
    "name": "Belarus"
  },
  "BE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "56",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BE",
    "name": "Belgium"
  },
  "BZ": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "84",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BZ",
    "name": "Belize"
  },
  "BO": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "68",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BO",
    "name": "Bolivia"
  },
  "BA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "70",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BA",
    "name": "Bosnia and Herzegovina"
  },
  "BR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "76",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BR",
    "name": "Brazil"
  },
  "BN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "96",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BN",
    "name": "Brunei Darussalam"
  },
  "BG": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "100",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "BG",
    "name": "Bulgaria"
  },
  "KH": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "116",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "KH",
    "name": "Cambodia"
  },
  "CA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "124",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CA",
    "name": "Canada"
  },
  "CL": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "152",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CL",
    "name": "Chile"
  },
  "CN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "code": "156",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CN",
    "name": "China"
  },
  "CO": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "170",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CO",
    "name": "Colombia"
  },
  "CR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "188",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "CR",
    "name": "Costa rica"
  },
  "HR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "191",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "HR",
    "name": "Croatia"
  },
  "CY": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "196",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CY",
    "name": "Cyprus"
  },
  "CZ": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "203",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CZ",
    "name": "Czech Republic"
  },
  "DK": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "208",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "DK",
    "name": "Denmark"
  },
  "DO": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "214",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "DO",
    "name": "Dominican Republic"
  },
  "EC": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "218",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "EC",
    "name": "Ecuador"
  },
  "EG": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "818",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "EG",
    "name": "Egypt"
  },
  "SV": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "222",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "SV",
    "name": "El Salvador"
  },
  "EE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "233",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "EE",
    "name": "Estonia"
  },
  "FI": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "246",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "FI",
    "name": "Finland"
  },
  "FR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "250",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "FR",
    "name": "France"
  },
  "GE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "268",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "GE",
    "name": "Georgia"
  },
  "DE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "276",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "DE",
    "name": "Germany"
  },
  "GR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "300",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "GR",
    "name": "Greece"
  },
  "GL": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "304",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "GL",
    "name": "Greenland"
  },
  "GD": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "308",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "GD",
    "name": "Grenada"
  },
  "GU": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "316",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "GU",
    "name": "Guam"
  },
  "GT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "320",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "GT",
    "name": "Guatemala"
  },
  "HT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "332",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "HT",
    "name": "Haiti"
  },
  "HN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "340",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "HN",
    "name": "Honduras"
  },
  "HK": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "344",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "HK",
    "name": "Hong Kong"
  },
  "HU": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "348",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "HU",
    "name": "Hungary"
  },
  "IS": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "352",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IS",
    "name": "Iceland"
  },
  "IN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "356",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IN",
    "name": "India"
  },
  "ID": {
    "channels_na": [149, 153, 157, 161],
    "channels_na_40": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "360",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "ID",
    "name": "Indonesia"
  },
  "IR": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "364",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IR",
    "name": "Iran"
  },
  "IE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "372",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IE",
    "name": "Ireland"
  },
  "IL": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "376",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IL",
    "name": "Israel"
  },
  "IT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "380",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "IT",
    "name": "Italy"
  },
  "JM": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "388",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "JM",
    "name": "Jamaica"
  },
  "JP": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    "channels_ng_40": [],
    "code": "392",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": false,
    "key": "JP",
    "name": "Japan"
  },
  "JO": {
    "channels_na": [36, 40, 44, 48],
    "channels_na_40": [36, 40, 44, 48],
    "channels_na_80": [36, 40, 44, 48],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "400",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "JO",
    "name": "Jordan"
  },
  "KZ": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "398",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "KZ",
    "name": "Kazakhstan"
  },
  "KE": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "404",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "KE",
    "name": "Kenya"
  },
  "KR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "410",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "KR",
    "name": "Korea Republic"
  },
  "KW": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "414",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "KW",
    "name": "Kuwait"
  },
  "LV": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "428",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "LV",
    "name": "Latvia"
  },
  "LB": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "422",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "LB",
    "name": "Lebanon"
  },
  "LI": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "438",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "LI",
    "name": "Liechtenstein"
  },
  "LT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "440",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "LT",
    "name": "Lithuania"
  },
  "LU": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "442",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "LU",
    "name": "Luxembourg"
  },
  "MO": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "446",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MO",
    "name": "Macau"
  },
  "MK": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "807",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MK",
    "name": "Macedonia"
  },
  "MY": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "458",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MY",
    "name": "Malaysia"
  },
  "MT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "470",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MT",
    "name": "Malta"
  },
  "MX": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "484",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MX",
    "name": "Mexico"
  },
  "MC": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "492",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MC",
    "name": "Monaco"
  },
  "ME": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "499",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "ME",
    "name": "Montenegro"
  },
  "MA": {
    "channels_na": [36, 40, 44, 48, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "504",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "MA",
    "name": "Morocco"
  },
  "NP": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "524",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "NP",
    "name": "Nepal"
  },
  "NL": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "528",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "NL",
    "name": "Netherlands"
  },
  "AN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "530",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AN",
    "name": "Netherlands Antilles"
  },
  "NZ": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "554",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "NZ",
    "name": "New Zealand"
  },
  "KP": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 149, 153, 157, 161],
    "channels_na_40": [],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [],
    "code": "408",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": false,
    "key": "KP",
    "name": "North Korea"
  },
  "NO": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "578",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "NO",
    "name": "Norway"
  },
  "OM": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "512",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "OM",
    "name": "Oman"
  },
  "PK": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "586",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PK",
    "name": "Pakistan"
  },
  "PA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "591",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PA",
    "name": "Panama"
  },
  "PG": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "598",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PG",
    "name": "Papua New Guinea"
  },
  "PE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "604",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PE",
    "name": "Peru"
  },
  "PH": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "608",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PH",
    "name": "Philippines"
  },
  "PL": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "616",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PL",
    "name": "Poland"
  },
  "PT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "620",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PT",
    "name": "Portugal"
  },
  "PR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "630",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "PR",
    "name": "Puerto Rico"
  },
  "QA": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "634",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "QA",
    "name": "Qatar"
  },
  "RS": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "688",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "RS",
    "name": "Republic of Serbia"
  },
  "RO": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "642",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "RO",
    "name": "Romania"
  },
  "RU": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 132, 136, 140, 149, 153, 157, 161],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "643",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "RU",
    "name": "Russia"
  },
  "RW": {
    "channels_na": [149, 153, 157, 161, 165],
    "channels_na_40": [149, 153, 157, 161],
    "channels_na_80": [149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "646",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "RW",
    "name": "Rwanda"
  },
  "SA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "682",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "SA",
    "name": "Saudi Arabia"
  },
  "SG": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "702",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "SG",
    "name": "Singapore"
  },
  "SK": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "703",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "SK",
    "name": "Slovakia"
  },
  "SI": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "705",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "SI",
    "name": "Slovenia"
  },
  "ZA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "710",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "ZA",
    "name": "South africa"
  },
  "ES": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "724",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "ES",
    "name": "Spain"
  },
  "LK": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "144",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "LK",
    "name": "Sri Lanka"
  },
  "SE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "752",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "SE",
    "name": "Sweden"
  },
  "CH": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "756",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "CH",
    "name": "Switzerland"
  },
  "SY": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "760",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "SY",
    "name": "Syrian Arab Republic"
  },
  "TW": {
    "channels_na": [56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "158",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "TW",
    "name": "Taiwan"
  },
  "TH": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "764",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "TH",
    "name": "Thailand"
  },
  "TT": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "780",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "TT",
    "name": "Trinidad and Tobago"
  },
  "TN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "788",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "TN",
    "name": "Tunisia"
  },
  "TR": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [],
    "channels_na_80": [],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "792",
    "has_na": true,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "TR",
    "name": "Turkey"
  },
  "UG": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "800",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "UG",
    "name": "Uganda"
  },
  "UA": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "804",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "UA",
    "name": "Ukraine"
  },
  "AE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "784",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "AE",
    "name": "United Arab Emirates"
  },
  "GB": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "826",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "GB",
    "name": "United Kingdom"
  },
  "US": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "840",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "US",
    "name": "United States"
  },
  "UY": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "858",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "UY",
    "name": "Uruguay"
  },
  "UZ": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 149, 153, 157, 161],
    "channels_na_dfs": [52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "code": "860",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "UZ",
    "name": "Uzbekistan"
  },
  "VE": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161, 165],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "862",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "VE",
    "name": "Venezuela"
  },
  "VN": {
    "channels_na": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_40": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_80": [36, 40, 44, 48, 52, 56, 60, 64],
    "channels_na_dfs": [52, 56, 60, 64],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "704",
    "has_na": true,
    "has_ng": true,
    "ht40_na": true,
    "ht40_ng": true,
    "key": "VN",
    "name": "Viet Nam"
  },
  "YE": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "887",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "YE",
    "name": "Yemen"
  },
  "ZW": {
    "channels_na": [],
    "channels_na_40": [],
    "channels_na_dfs": [],
    "channels_ng": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "channels_ng_40": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "code": "716",
    "has_na": false,
    "has_ng": true,
    "ht40_na": false,
    "ht40_ng": true,
    "key": "ZW",
    "name": "Zimbabwe"
  }
};
