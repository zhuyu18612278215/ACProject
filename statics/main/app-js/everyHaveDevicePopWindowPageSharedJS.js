var url = window.location.origin;
var pathname = window.location.pathname;
var otbList = ['/nonoperate-list/', '/probe-list/', '/ap-list/'];



function modify_ajax(fid, type) {
  // body...
  var sign = 0;
  if (type === '2') {
    var result = check_input_ip($('#ac_address').val());
    if (result) {
      sign = 0;
    } else {
      sign = 1;
      alert(pageWords.acAddressErrorInfo);
    }
  }
  if (sign == 0) {
    $.ajax({
      type: "POST",
      dataType: "html",
      // "{% url 'probe_config_modify' %}?modify_model=" + type
      url: `${ url }/probe-list/probe_detail/probe_config_modify/?modify_model=${ type }`,
      data: $(`#${ fid }`).serialize(),
      success: function(result) {
        // alert(unescape(result.replace(/\\\u/g, "%u")));
        alert(eval(result));
        if (otbList.indexOf(pathname) !== -1) {
          oTable.ajax.reload(null, false);
        }

      },
    });
  }
}

function modify_radios_ajax(fid, type) {
  // body...
  var configUrldict = {
    '/ap-list/': `${ url }/ap/ap_list/ap_radios_config/?modify_model=${ type }`,
    '/nonoperate-list/': `${ url }/nonoperate/nonoperate_list/nonoperate_radios_config/?modify_model=${ type }`,
  };
  $.ajax({
    type: "POST",
    dataType: "html",
    // "{% url 'ap_radios_config' %}?modify_model=" + type,
    // "{% url 'nonoperate_radios_config' %}?modify_model=" + type
    url: configUrldict[pathname],
    data: $(`#${ fid }`).serialize(),
    success: function(result) {
      // alert(unescape(result.replace(/\\\u/g, "%u")));
      alert(eval(result));
      if (otbList.indexOf(pathname) !== -1) {
        oTable.ajax.reload(null, false);
      }
    },
  });
}

function audit_ajax() {
  // body...
  $.ajax({
    type: "POST",
    dataType: "html",
    // "{% url 'probe_audit_modify' %}"
    url: `${ url }/probe-list/probe_detail/probe_audit_modify/`,
    data: $('#audit_modify').serialize(),
    success: function(result) {
      alert(eval(result));
      if (otbList.indexOf(pathname) !== -1) {
        oTable.ajax.reload(null, false);
      }
    },
  });
}

function check_cus(type) {
  // body...
  if (type === '2g') {
    if ($('#2G_power').val() === "customize") {
      $('#2g_customize').show();
      $('#2g_max_p_div').show();
    } else {
      $('#2g_customize').hide();
      $('#2g_max_p_div').hide();
    }
  }
  if (type === '5g') {
    if ($('#5G_power').val() === "customize") {
      $('#5g_customize').show();
      $('#5g_max_p_div').show();
    } else {
      $('#5g_customize').hide();
      $('#5g_max_p_div').hide();
    }
  }
}
