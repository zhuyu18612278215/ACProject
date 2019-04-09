var url = window.location.origin;
var powerList = ["high", "medium", "low", "auto"]
var pathname = window.location.pathname;
var otbList = ['/nonoperate-list/', '/probe-list/', '/ap-list/'];
var auditCropLimitList = ['3', '15', '22', '50', '27', '28', '31', '7', '29', '30'];
var auditIdTypeLimitList = ['22', '7', '29', '30'];
var auditDevTypeLimitList = ['29', '30'];

var manu = {
  // '1': 'JiangSuPaibo',
  // '16': 'Xinghan',
  // '50': 'Byzoro',
  // '51': 'Paibo',
  // '52': 'Star Media',
  // '31': 'XinghanFeiJing',
  '1': '江苏派博',
  '7': '新网程',
  '16': '星瀚',
  '50': '百卓',
  '51': '派博',
  '52': '网际星辰',
  '31': '星瀚非经',
  '22': '爱思网安',
  '29': '任子行',
  '30': '任子行V1.0',
};
var renZiXingDevType = {
  '00': '固定AP',
  '01': '移动AP',
  '10': '固定围栏',
  '11': '移动围栏',
  '12': '单兵设备围栏',
  '20': 'H系列',
  '22': 'RT系列',
  '30': '网关设备',
  '90': '警用热点+无线二合一',
  '91': '警用热点+电子围栏二合一',
};
var dev_type = {
  normal: {
    '1': '固定采集设备',
    '2': '移动车载采集设备',
    '3': '单兵采集设备',
    '9': '其他',
  },
  '29': renZiXingDevType,
  '30': renZiXingDevType,
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
  '0': '网吧',
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
};
var nature = {
  // '0': 'Business',
  // '1': 'Non-Business',
  // '3': 'Other',
  '0': '经营',
  '1': '非经营',
  '3': '其他',
};
var renZiXingIdType = {
  '1021111': '身份证',
  '1021133': '学生证',
  '1021335': '驾驶证',
  '1021114': '军官证',
  '1021123': '警官证',
  '1021113': '户口簿',
  '1021414': '护照',
  '1021511': '台胞证',
  '1021516': '回乡证',
  '1021159': '社保卡',
  '1021233': '士兵证/军人证',
  '1021990': '其他证件',
};
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
  '29': renZiXingIdType,
  '30': renZiXingIdType,
}
// var districtOption = {
//   '411501000000': '市辖区',
//   '411502000000': '浉河区',
//   '411503000000': '平桥区',
//   '411521000000': '罗山县',
//   '411522000000': '光山县',
//   '411523000000': '新县',
//   '411524000000': '商城县',
//   '411525000000': '固始县',
//   '411526000000': '潢川县',
//   '411527000000': '淮滨县',
//   '411528000000': '息县',
//   '411571000000': '信阳高新技术产业开发区',
// }
var districtOption = {
  '市辖区': '市辖区',
  '浉河区': '浉河区',
  '平桥区': '平桥区',
  '罗山县': '罗山县',
  '光山县': '光山县',
  '新县': '新县',
  '商城县': '商城县',
  '固始县': '固始县',
  '潢川县': '潢川县',
  '淮滨县': '淮滨县',
  '息县': '息县',
  '信阳高新技术产业开发区': '信阳高新技术产业开发区',
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
    corpHTML = `<option value="52">${ manu['52'] }</option>`;
  } else {
    Object.keys(manu).forEach(function(value) {
      if (value !== '52') {
        corpHTML = `${ corpHTML }<option value="${ value }">${ manu[value] }</option>`;
      }
    });
  }
  $('#audit_corp').html(corpHTML);

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

  let districtCodeHTML = emptyHTML;
  Object.keys(districtOption).forEach(function(value) {
    districtCodeHTML = `${ districtCodeHTML }<option value="${ value }">${ districtOption[value] }</option>`;
  });
  $('#districtCode').html(districtCodeHTML);

  addAuditIdTypeSelectOption('normal');
  addAuditDevTypeSelectOption('normal');
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

function addAuditDevTypeSelectOption(corp) {
  // body...
  let emptyHTML = `<option value="">请选择</option>`;
  let equipmentTypeHTML = emptyHTML;
  Object.keys(dev_type[corp]).forEach(function(value) {
    equipmentTypeHTML = `${ equipmentTypeHTML }<option value="${ value }">${ dev_type[corp][value] }</option>`;
  });
  $('#equipment_type').html(equipmentTypeHTML);
}

// 操作
function ap_reboot(mac) {
  // body...
  // "{% url 'nonoperate_reboot' %}"
  $.post(`${ url }/nonoperate-list/nonoperate_reboot/`, {
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
  // "{% url 'nonoperate_del' %}"
  $.post(`${ url }/nonoperate-list/nonoperate_del/`, {
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
  // "{% url 'nonoperate_wlan_list' %}?id=" + id
  wlan_table.ajax.url(`${ url }/nonoperate-list/nonoperate_wlan_list/?id=${ id }`).load();
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
  // "{% url 'nonoperate_wlan_show_detail' %}?id=" + id + "&ap_id=" + ap_id
  $.getJSON(`${ url }/nonoperate-list/nonoperate_wlan_show_detail/?id=${ id }&ap_id=${ ap_id }`, function(ret) {
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
      // "{% url 'nonoperate_apply_change_wlan' %}?id=" + id + "&ap_id=" + ap_id
      url: `${ url }/nonoperate-list/nonoperate_apply_change_wlan/?id=${ id }&ap_id=${ ap_id }`,
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
  // "{% url 'nonoperate_reduction_change_wlan' %}"
  $.post(`${ url }/nonoperate-list/nonoperate_reduction_change_wlan/`, {
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
    // "{% url 'nonoperate_vpn' %}"
    $.post(`${ url }/nonoperate-list/nonoperate_detail/nonoperate_vpn/`, {
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
    // "{% url 'nonoperate_vpn' %}"
    $.post(`${ url }/nonoperate-list/nonoperate_detail/nonoperate_vpn/`, {
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
  // "{% url 'probe_audit_status' %}?type=nonoperate&mac=" + value
  $.getJSON(`${ url }/probe-list/porbe_detail/probe_audit_status/?type=nonoperate&mac=${ value }`, function(ret) {
    // console.log(ret);
    // var manu = ret.manu
    // var dev_type = ret.dev_type
    // var place_type = ret.place_type
    // var nature = ret.nature
    // var id_type = ret.id_type
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
      // ret.basic.audit_corp == '3' || ret.basic.audit_corp == '15' || ret.basic.audit_corp == '22' || ret.basic.audit_corp == '50' || ret.basic.audit_corp == '27' || ret.basic.audit_corp == '28'
      if (auditCropLimitList.indexOf(String(ret.basic.audit_corp) !== -1)) {
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
      let auditDevType = 'normal';
      if (auditDevTypeLimitList.indexOf(String(ret.basic.audit_corp)) !== -1) {
        auditDevType = String(ret.basic.audit_corp);
      }
      addAuditDevTypeSelectOption(auditDevType);
      $('#status_equipment_type').text(dev_type[auditDevType][ret.dev.collection_equipment_type]);
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
      $('#status_policeName').text('');
      $('#status_districtCode').text('');


      $('#status_place_name').text(ret.place.place_name);
      $('#status_site_address').text(ret.place.site_address);
      $('#status_netsite_type').text(place_type[ret.place.netsite_type]);
      $('#status_bussiness_nature').text(nature[ret.place.bussiness_nature]);
      $('#status_law_principal_name').text(ret.place.law_principal_name);
      $('#status_policeName').text(ret.place.policeName);
      $('#status_districtCode').text(districtOption[ret.place.districtCode]);

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
      $('#policeName').val(ret.place.policeName);
      $('#districtCode').val(ret.place.districtCode);

      check_show_policy({
        audit_corp: ret.basic.audit_corp,
        site_type_val: ret.place.site_type,
        police_station_code_val: ret.place.police_station_code,
      });

    }
  });
  $('#audit_corp').click(function() {

    // renzixing,wangbo,chongqingaisi,byzoro feijing
    // $('#audit_corp').attr('value') == '3' || $('#audit_corp').attr('value') == '15' || $('#audit_corp').attr('value') == '22' || $('#audit_corp').attr('value') == '50' || $('#audit_corp').attr('value') == '27' || $('#audit_corp').attr('value') == '28'
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
    let auditDevType = 'normal';
    if (auditDevTypeLimitList.indexOf(String($('#audit_corp').attr('value'))) !== -1) {
      auditDevType = String($('#audit_corp').attr('value'));
    }
    addAuditIdTypeSelectOption(auditIdType);
    addAuditDevTypeSelectOption(auditDevType);
  });

  // bk-bg-danger
  // console.log(value);
  // "{% url 'nonoperate_detail' %}?mac=" + value
  $.getJSON(`${ url }/nonoperate-list/nonoperate_detail/?mac=${ value }`, function(ret) {
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

  // "{% url 'nonoperate_config' %}?mac=" + value
  $.getJSON(`${ url }/nonoperate-list/nonoperate_config/?mac=${ value }`, function(ret) {
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
    // "{% url 'nonoperate_customer_tab_table' %}?mac=" + mac
    "ajax": `${ url }/nonoperate/nonoperate_list/nonoperate_customer_tab_table/?mac=${ mac }`,
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
  // '{% url "nonoperate_customer_detail" %}'
  $.getJSON(`${ url }/nonoperate/nonoperate_customer/nonoperate_customer_detail/`, {
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
    // {% url "nonoperate_change_customer_name" %}
    $.post(`${ url }/nonoperate/nonoperate_customer/nonoperate_customer_detail/nonoperate_change_customer_name/`, {
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
    // "{% url 'nonoperate_custome_detail_table' %}?mac=" + mac
    "ajax": `${ url }/nonoperate/nonoperate_customer/customer_detail/nonoperate_custome_detail_table/?mac=${ mac }`,
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
}



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
