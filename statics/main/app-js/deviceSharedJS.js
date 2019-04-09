var url = window.location.origin;
var auditCropLimitList = ['3', '15', '22', '50', '27', '28', '31', '7', '29'];
var auditIdTypeLimitList = ['22', '7', '29'];
var manu = {
  // '0': 'Byzoro',
  // '1': 'Paibo',
  // '2': 'Runtech',
  // '3': 'Surfilter',
  // '4': 'Meiya',
  // '5': 'Saiao',
  // '6': 'Nielsen',
  // '7': 'Pronetway',
  // '8': 'Hengbang',
  // '9': 'Ahzxsoft',
  // '10': 'Hxct',
  // '11': 'Ixianxia',
  // '12': 'Witrusty',
  // '13': 'Oplus',
  // '15': 'Netbox',
  // '16': 'Xinghan',
  // '17': 'Yeetec',
  // // '18':'Jiayin',
  // // '19':'Jyssuo',
  // // '20':'Hnbbwl',
  // // '21':'Ssgm',
  // '22': 'Ckisoft',
  // '23': 'Star Media',
  // // '50': 'Byzoro',
  // // '51': 'Paibo',
  // // '52': 'Star Media',
  // '27': 'XinghanV1.10',
  // '28': 'NetboxV17',
  '0': '百卓',
  '1': '派博',
  '2': '锐安',
  '3': '任子行',
  '4': '美亚',
  '5': '赛奥',
  '6': '尼尔森',
  '7': '新网程',
  '8': '恒邦',
  '9': '中新软',
  '10': '虹旭',
  '11': '爱线下',
  '12': '纬信',
  '13': '友盟',
  '15': '网博',
  '16': '星瀚',
  '17': '以太',
  // '18':'Jiayin',
  // '19':'Jyssuo',
  // '20':'Hnbbwl',
  // '21':'Ssgm',
  '22': '爱思网安',
  '23': '网星',
  // '50': 'Byzoro',
  // '51': 'Paibo',
  // '52': 'Star Media',
  '27': '星瀚V1.10',
  '28': '网博V17',
  '32': '唐风',
};
var dev_type = {
  // '1': 'Fixed',
  // '2': 'Vehicle',
  // '3': 'Singal',
  // '9': 'Other',
  '1': '固定采集设备',
  '2': '移动车载采集设备',
  '3': '单兵采集设备',
  '9': '其他',
};
var place_type = {
  // '1': 'Hotel',
  // '2': 'Library',
  // '3': 'Computer Training',
  // '4': 'Entertainment',
  // '5': 'Traffic Hinge',
  // '6': 'Vehicle',
  // '7': 'Catering',
  // '8': 'Financial',
  // 'A': 'Shopping',
  // 'B': 'Public Service',
  // 'C': 'Cultural Services',
  // 'D': 'Public Leisure',
  // '9': 'Other',
  '1': '旅店宾馆类',
  '2': '图书馆阅览室',
  '3': '电脑培训中心类',
  '4': '娱乐场所类',
  '5': '交通枢纽',
  '6': '公共交通工具',
  '7': '餐饮服务场所',
  '8': '金融服务场所',
  'A': '购物场所',
  'B': '公共服务场所',
  'C': '文化服务场所',
  'D': '公共休闲场所',
  '9': '其他',
}
var nature = {
  // '0': 'Business',
  // '1': 'Non-Business',
  // '3': 'Other',
  '0': '经营',
  '1': '非经营',
  '3': '其他',
}
var id_type = {
  // '2': 'Phone Number',
  // '111': 'ID card',
  // '990': 'Other',
  normal: {
    '2': '手机号',
    '111': '身份证',
    '990': '其他',
  },
  '22': {
    '111': '身份证',
    '112': '临时身份证',
    '113': '户口簿',
    '114': '军官证',
    '123': '警官证',
    '133': '学生证',
    '414': '护照',
    '501': '手机号',
    '999': '特殊数据',
  },
  '7': {
    '111': '居民身份证',
    '112': '临时居民身份证',
    '114': '中国人民解放军军官证',
    '116': '暂住证',
    '123': '警官证',
    '133': '学生证',
    '335': '机动车驾驶证',
    '411': '外交护照',
    '412': '公务护照',
    '413': '因公普通护照',
    '414': '普通护照',
    '415': '旅行证',
    '416': '入出境通行证',
    '417': '外国人出入境证',
    '418': '外国人旅行证',
    '420': '香港特别行政区护照',
    '421': '澳门特别行政区护照',
    '511': '台湾居民来往大陆通行证',
    '513': '往来港澳通行证',
    '515': '前往港澳通行证',
    '516': '港澳同胞回乡证(通行卡)',
    '517': '大陆居民往来台湾通行证',
    '518': '因公往来香港澳门特别行政区通行证',
    '554': '外国人居留证',
    '555': '外国人临时居留证',
    '711': '边境管理区通行证',
    '990': '其他证件',
  },
}

// 添加option
$(function() {
  // body...
  addAuditSelectOption(OEMLimitType);
});

function addAuditSelectOption(oem = '', ...other) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let corpHTML = emptyHTML;
  if (oem === 'qingdao') {
    corpHTML = `<option value="23">${ manu['23'] }</option>`;
  } else {
    Object.keys(manu).forEach(function(value) {
      if (value !== '23') {
        corpHTML = `${ corpHTML }<option value="${ value }">${ manu[value] }</option>`;
      }
    });
  }
  $('#audit_corp').html(corpHTML);

  let equipmentTypeHTML = emptyHTML;
  Object.keys(dev_type).forEach(function(value) {
    equipmentTypeHTML = `${ equipmentTypeHTML }<option value="${ value }">${ dev_type[value] }</option>`;
  });
  $('#equipment_type').html(equipmentTypeHTML);

  let netsiteTypeHTML = emptyHTML;
  Object.keys(place_type).forEach(function(value) {
    netsiteTypeHTML = `${ netsiteTypeHTML }<option value="${ value }">${ place_type[value] }</option>`;
  });
  $('#netsite_type').html(netsiteTypeHTML);

  let bussinessNatureHTML = emptyHTML;
  Object.keys(nature).forEach(function(value) {
    bussinessNatureHTML = `${ bussinessNatureHTML }<option value="${ value }">${ nature[value] }</option>`;
  });
  $('#bussiness_nature').html(bussinessNatureHTML);

  addAuditIdTypeSelectOption('normal');
}

function addAuditIdTypeSelectOption(corp) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let certificateTypeHTML = emptyHTML;
  Object.keys(id_type[corp]).forEach(function(value) {
    certificateTypeHTML = `${ certificateTypeHTML }<option value="${ value }">${ id_type[corp][value] }</option>`;
  });
  $('#certificate_type').html(certificateTypeHTML);
}


function probe_reboot(mac) {
  // body...
  // "{% url 'probe_reboot' %}"
  $.post(`${ url }/probe-list/probe_reboot/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) != '') {
      alert(ret);
      oTable.ajax.reload(null, false);
    }
  });
};

function probe_upgrade(mac) {
  // body...
  // "{% url 'probe_update' %}"
  $.post(`${ url }/probe-list/probe_update/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) != '') {
      alert(ret);
      oTable.ajax.reload(null, false);
    }
  });
};

function probe_del(mac) {
  // body...
  // "{% url 'probe_del' %}"
  $.post(`${ url }/probe-list/probe_del/`, {
    'mac': mac
  }, function(ret) {
    /*optional stuff to do after success */
    if ($.trim(ret) != '') {
      alert(ret);
      oTable.ajax.reload(null, false);
    }
  });
};

$('#vpn').click(function() {
  var value = $('#vpn').attr('data-a');

  if ($('#vpn').attr('checked') === 'checked') {
    // "{% url 'probe_vpn' %}"
    $.post(`${ url }/probe-list/probe_detail/probe_vpn/`, {
      'model': 'on',
      'mac': value
    }, function(ret) {
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
    // "{% url 'probe_vpn' %}"
    $.post(`${ url }/probe-list/probe_detail/probe_vpn/`, {
      'model': 'off',
      'mac': value
    }, function(ret) {
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
  $('#detail_message_href').click();
  $('#open_form').click();
  // "{% url 'probe_detail' %}?mac=" + value
  $.getJSON(`${ url }/probe-list/probe_detail/?mac=${ value }`, function(ret) {
    // console.log(value2);
    // var m = (ret.mac).substr(0, 2) + '-' + (ret.mac).substr(2, 2) + '-' + (ret.mac).substr(4, 2) + '-' + (ret.mac).substr(6, 2) + '-' + (ret.mac).substr(8, 2) + '-' + (ret.mac).substr(10, 2);
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
      // f = e + 's';
      f = `${ e }s`;
    } else if (b === 0 && c === 0) {
      // f = d + 'm ' + e + 's';
      f = `${ d }m ${ e }s`;
    } else if (b === 0) {
      // f = c + 'h ' + d + 'm ' + e + 's';
      f = `${ c }h ${ d }m ${ e }s`;
    } else {
      // f = b + 'd ' + c + 'h ' + d + 'm ' + e + 's';
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
    // "probe_del('" + value + "');"
    $('#delete').attr('onclick', `probe_del('${ value }');`);
    $('#reboot').attr('href', '#');
    // "probe_reboot('" + value + "');"
    $('#reboot').attr('onclick', `probe_reboot('${ value }');`);
    $('#a_locate').attr('onclick', `deviceLocate('${ value }');`);
    deviceLocateState(ret.locateState);

    // console.log();
    // alert(ret.admin_power_control)
    if (ret.admin_power_control == "ban") {
      $('#a_config').hide();
      $('#a_audit').hide();
      $('#a_diagnosis').hide();
      $('#a_locate').hide();
      $('#reboot').hide();
    } else {
      $('#a_config').show();
      $('#a_audit').show();
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
    // "{% trans '退服' %}" "{% trans '已移除' %}"
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
  };

  // "{% url 'probe_audit_status' %}?mac=" + value
  $.getJSON(`${ url }/probe-list/porbe_detail/probe_audit_status/?mac=${ value }`, function(ret) {
    // console.log(ret);
    // var manu = ret.manu;
    // var dev_type = ret.dev_type;
    // var place_type = ret.place_type;
    // var nature = ret.nature;
    // var id_type = ret.id_type;
    if (ret.basic !== undefined) {
      $('#status_audit_corp').text('');
      $('#status_audit_corp').text(manu[ret.basic.audit_corp]);
      $('#status_audit_ip').text('');
      $('#status_audit_ip').text(ret.basic.audit_ip);
      $('#status_audit_port').text('');
      $('#status_audit_port').text(ret.basic.audit_port);
      $('#status_location_encode').text('');
      $('#status_location_encode').text(ret.basic.location_encode);
      $('#status_device_encode').text('');
      $('#status_device_encode').text(ret.basic.device_encode);
      $('#status_longitude').text('');
      $('#status_longitude').text(ret.basic.longitude);
      $('#status_latitude').text('');
      $('#status_latitude').text(ret.basic.latitude);


      $('#audit_corp').val(ret.basic.audit_corp);
      $('#audit_ip').val(ret.basic.audit_ip);
      $('#audit_port').val(ret.basic.audit_port);
      $('#location_encode').val(ret.basic.location_encode);
      $('#device_encode').val(ret.basic.device_encode);
      $('#longitude').val(ret.basic.longitude);
      $('#latitude').val(ret.basic.latitude);
      // renzixing,wangbo,chongqingaisi,byzoro feijing
      // ret.basic.audit_corp === '3' || ret.basic.audit_corp === '15' || ret.basic.audit_corp === '22' || ret.basic.audit_corp === '50' || ret.basic.audit_corp === '27' || ret.basic.audit_corp === '28'
      if (auditCropLimitList.indexOf(String(ret.basic.audit_corp)) !== -1) {
        $("#ftpname_hide").show();
        $("#ftppwd_hide").show();
        $('#status_ftp_name').text('');
        $('#status_ftp_name').text(ret.basic.ftp_name);
        $('#status_ftp_passwd').text('');
        $('#status_ftp_passwd').text(ret.basic.ftp_passwd);
        $('#ftp_name').val(ret.basic.ftp_name);
        $('#ftp_passwd').val(ret.basic.ftp_passwd);

        if (ret.basic.audit_corp === '50') {
          $("#ftpport_hide").show();
          $("#ftp_port_hide").show();
          $('#status_ftp_port').text('');
          $('#status_ftp_port').text(ret.basic.ftp_port);
          $('#ftp_port').val(ret.basic.ftp_port);
        } else {
          $("#ftpport_hide").hide();
          $("#ftp_port_hide").hide();
          $('#status_ftp_port').text('');
        }
      } else {
        $("#ftpname_hide").hide();
        $("#ftppwd_hide").hide();
        $("#ftpport_hide").hide();
        $('#status_ftp_name').text('');
        $('#status_ftp_passwd').text('');
        $('#status_ftp_port').text('');

        $("#ftp_name_hide").hide();
        $("#ftp_passwd_hide").hide();
        $("#ftp_port_hide").hide();

        // $('#vlan').val(ret.vlan);
      }
    }
    if (ret.dev !== undefined) {
      $('#status_collection_radius').text('');
      $('#status_equipment_type').text('');
      $('#status_equipment_name').text('');
      $('#status_equipment_address').text('');
      $('#status_software_orgcode').text('');
      $('#status_software_orgname').text('');
      $('#status_software_address').text('');
      $('#status_contactor').text('');
      $('#status_contactor_tel').text('');
      $('#status_contactor_mail').text('');

      $('#status_collection_radius').text(ret.dev.collection_radius);
      $('#status_equipment_type').text(dev_type[ret.dev.collection_equipment_type]);
      $('#status_equipment_name').text(ret.dev.collection_equipment_name);
      $('#status_equipment_address').text(ret.dev.collection_equipment_address);
      $('#status_software_orgcode').text(ret.dev.security_software_orgcode);
      $('#status_software_orgname').text(ret.dev.security_software_orgname);
      $('#status_software_address').text(ret.dev.security_software_address);
      $('#status_contactor').text(ret.dev.contactor);
      $('#status_contactor_tel').text(ret.dev.contactor_tel);
      $('#status_contactor_mail').text(ret.dev.contactor_mail);

      $('#collection_radius').val(ret.dev.collection_radius);
      $('#equipment_type').val(ret.dev.collection_equipment_type);
      $('#equipment_name').val(ret.dev.collection_equipment_name);
      $('#equipment_address').val(ret.dev.collection_equipment_address);
      $('#software_orgcode').val(ret.dev.security_software_orgcode);
      $('#software_orgname').val(ret.dev.security_software_orgname);
      $('#software_address').val(ret.dev.security_software_address);
      $('#contactor').val(ret.dev.contactor);
      $('#contactor_tel').val(ret.dev.contactor_tel);
      $('#contactor_mail').val(ret.dev.contactor_mail);
    }
    if (ret.place !== undefined) {
      $('#status_place_name').text('');
      $('#status_site_address').text('');
      $('#status_netsite_type').text('');
      $('#status_bussiness_nature').text('');
      $('#status_law_principal_name').text('');
      $('#status_certificate_type').text('');
      $('#status_certificate_id').text('');
      $('#status_relationship_account').text('');
      $('#status_start_time').text('');
      $('#status_end_time').text('');



      $('#status_place_name').text(ret.place.place_name);
      $('#status_site_address').text(ret.place.site_address);
      $('#status_netsite_type').text(place_type[ret.place.netsite_type]);
      $('#status_bussiness_nature').text(nature[ret.place.bussiness_nature]);
      $('#status_law_principal_name').text(ret.place.law_principal_name);
      // for corp to change id type
      let auditIdType = 'normal';
      if (auditIdTypeLimitList.indexOf(String(ret.basic.audit_corp)) !== -1) {
        auditIdType = String(ret.basic.audit_corp);
      }
      addAuditIdTypeSelectOption(auditIdType);
      $('#status_certificate_type').text(id_type[auditIdType][ret.place.law_principal_certificate_type]);

      $('#status_certificate_id').text(ret.place.law_principal_certificate_id);
      $('#status_relationship_account').text(ret.place.relationship_account);
      $('#status_start_time').text(ret.place.start_time);
      $('#status_end_time').text(ret.place.end_time);


      $('#place_name').val(ret.place.place_name);
      $('#site_address').val(ret.place.site_address);
      $('#netsite_type').val(ret.place.netsite_type);
      $('#bussiness_nature').val(ret.place.bussiness_nature);
      $('#law_principal_name').val(ret.place.law_principal_name);
      $('#certificate_type').val(ret.place.law_principal_certificate_type);
      $('#certificate_id').val(ret.place.law_principal_certificate_id);
      $('#relationship_account').val(ret.place.relationship_account);
      $('#start_time').val(ret.place.start_time);
      $('#end_time').val(ret.place.end_time);

      check_show_policy({
        audit_corp: ret.basic.audit_corp,
        site_type_val: ret.place.site_type,
        police_station_code_val: ret.place.police_station_code,
      });
    }

  });
  $('#audit_corp').click(function() {

    // renzixing,wangbo,chongqingaisi,byzoro feijing
    // $('#audit_corp').attr('value') === '3' || $('#audit_corp').attr('value') === '15' || $('#audit_corp').attr('value') === '22' || $('#audit_corp').attr('value') === '50' || $('#audit_corp').attr('value') === '27' || $('#audit_corp').attr('value') === '28'
    if (auditCropLimitList.indexOf(String($('#audit_corp').attr('value'))) !== -1) {
      $("#ftp_name_hide").show();
      $("#ftp_passwd_hide").show();

      if ($('#audit_corp').attr('value') === '50') {
        $("#ftp_port_hide").show();
      } else {
        $("#ftp_port_hide").hide();
        $('#ftp_port').val("");
      }
    } else {
      $("#ftp_name_hide").hide();
      $("#ftp_passwd_hide").hide();
      $("#ftp_port_hide").hide();

      $('#ftp_name').val("");
      $('#ftp_passwd').val("");
      $('#ftp_port').val("");
    }

    // for corp to change id type
    let auditIdType = 'normal';
    if (auditIdTypeLimitList.indexOf(String($('#audit_corp').attr('value'))) !== -1) {
      auditIdType = String($('#audit_corp').attr('value'));
    }
    addAuditIdTypeSelectOption(auditIdType);
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
