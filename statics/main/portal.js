$(document).ready(function() {
  // body...
  $("#original").click(function() {
    if ($("#original").is(":checked")) {
      //if($('input[name=jump][checked]').val();
      $('#custom_portal').attr('disabled', 'disabled');
      authConfig('authClosePortalPage', $("#custom_portal").val());
    }
  });
  $("#custom").click(function() {
    if ($("#custom").is(":checked")) {
      $('#custom_portal').removeAttr('disabled', 'disabled');
      authConfig('authSetPortalPageWithCheck', $("#custom_portal").val());
    }
  });

  $("#custom_portal").focusout(function() {
    var portal = $("#custom_portal").val();
    //console.log(portal);
    //var reg = new RegExp("(?:https|http)://");
    //if(!reg.test(portal)){
    //  portal = "http://" + portal;
    //console.log(portal);
    //}
    var action = "";
    if ($("#custom").is(":checked")) {
      action = 'authSetPortalPageWithCheck';
    } else {
      action = 'authSetPortalPage';
    }
    authConfig(action, portal);
    //$("#custom_portal").attr("value", portal);
    $("#custom_portal").val(portal);
  });
  $(".wechat_config_block").find("input.wechat_appid_input").change(
    function() {
      authConfig("authSwitchApAuthLocalUserPlugin_setAppid", $(this).val());
    });
  $(".wechat_config_block").find("input.wechat_appsecret_input").change(
    function() {
      authConfig("authSwitchApAuthLocalUserPlugin_setAppSecret", $(this).val());
    });
  $(".wechat_config_block").find("input.wechat_shopid_input").change(
    function() {
      authConfig("authSwitchApAuthLocalUserPlugin_setShopid", $(this).val());
    });
  $(".wechat_config_block").find("input.wechat_secretkey_input").change(
    function() {
      authConfig("authSwitchApAuthLocalUserPlugin_setSecretKey", $(this).val());
    });
  $("div.wechat_forcefollow_container #force_follow_switch").click(function() {
    if (!$(".wechat_config_block").find("input.wechat_appid_input").val() ||
      !$(".wechat_config_block").find("input.wechat_shopid_input").val() ||
      !$(".wechat_config_block").find("input.wechat_secretkey_input").val()) {
      alert(Msg.I_WechatConfigFirst);
      // $(this).removeClass("on").addClass("off");
      $(this).removeAttr('checked', 'checked');
      return false;
    } else if (!$(".wechat_config_block").find("input.wechat_appsecret_input").val()) {
      alert(Msg.I_WechatAppSecretConfigFirst);
      // $(this).removeClass("on").addClass("off");
      $(this).removeAttr('checked', 'checked');
      return false;
    }
    if ($(this).attr("checked") == "checked") {
      authConfig("authSwitchApAuthLocalUserPlugin_setForceFollow", "yes");
    } else {
      authConfig("authSwitchApAuthLocalUserPlugin_setForceFollow", "no");
    }
  });

  function load_auth_config() {
    var external_authserver = false;
    // var auth_global_config = JSON.parse(authConfig('authGetGlobalConfig'));
    // var auth_global_config = auth_global_config.data;
    // if(auth_global_config)
    // {
    //   var expiry = auth_global_config.auth_validate_timeout || 0;
    //   switch (expiry)
    //   {
    //     case 480:
    //       //break;
    //     case 1440:
    //       //break;
    //     case 4320:
    //       //break;
    //     case 10080:
    //     case 43200:
    //       $("#auth-time").val(Math.floor(expiry/60));
    //       $("#auth-time").parent().css("float","none");
    //       $("#custom-time").prev().hide();
    //       $("#custom-time").hide();
    //       break;
    //     default:
    //       if(Math.floor(expiry/60) <= 0)
    //       {
    //         var def = 720;//hours
    //         $("#auth-time").val(def);
    //         $("#auth-time").parent().css("float","none");
    //         $("#custom-time").prev().hide();
    //         $("#custom-time").hide();
    //         //authSetGlobalConfig("authvalidatetimeout", def*60);
    //       }
    //       else if(expiry > 0 && expiry < 24*60)
    //       {
    //         var hours = Math.floor(expiry/60);
    //         $("#auth-time").val(0);
    //         $("#custom-time").prev().val(hours);
    //         $("#time-unit").val(1);
    //         $("#auth-time").parent().css("float","left");
    //         $("#custom-time").prev().show();
    //         $("#custom-time").show();
    //         //authSetGlobalConfig("authvalidatetimeout", hours*60);
    //       }
    //       else
    //       {
    //         var days = Math.floor(expiry/(24*60));
    //         $("#auth-time").val(0);
    //         $("#custom-time").prev().val(days);
    //         $("#time-unit").val(24);
    //         $("#auth-time").parent().css("float","left");
    //         $("#custom-time").prev().show();
    //         $("#custom-time").show();
    //         //authSetGlobalConfig("authvalidatetimeout", days*24*60);
    //       }
    //       break;
    //   }
    //   var client_timeout = auth_global_config.client_timeout || 0;
    //   switch (client_timeout)
    //   {
    //     case 5:
    //     case 10:
    //     case 30:
    //     case 60:
    //     case 480:
    //     case 1440:
    //     case 2880:
    //     case 10080:
    //       $("#no_oper_timeout-time").val(Math.floor(client_timeout));
    //       $("input.no_oper_timeout-custom").hide();
    //       $("#client-timeout-custom-time").hide();
    //       break;
    //     default:
    //       if(Math.floor(client_timeout) <= 0)
    //       {
    //         var def = 2880;//minutes
    //         $("#no_oper_timeout-time").val(def);
    //         $("input.no_oper_timeout-custom").hide();
    //         $("#client-timeout-custom-time").hide();
    //         //authSetGlobalConfig("clienttimeout", def);
    //       }
    //       else if(0 == (client_timeout%(24*60)))
    //       {
    //         var days = Math.floor(client_timeout/(24*60));
    //         $("#no_oper_timeout-time").val(0);
    //         $("input.no_oper_timeout-custom").val(days);
    //         $("#time-unit-by-minute").val((24*60));
    //         $("input.no_oper_timeout-custom").show();
    //         $("#client-timeout-custom-time").show();
    //       }
    //       else if(0 == (client_timeout%(60)))
    //       {
    //         var hours = Math.floor(client_timeout/60);
    //         $("#no_oper_timeout-time").val(0);
    //         $("input.no_oper_timeout-custom").val(hours);
    //         $("#time-unit-by-minute").val(60);
    //         $("input.no_oper_timeout-custom").show();
    //         $("#client-timeout-custom-time").show();
    //       }
    //       else
    //       {
    //         $("#no_oper_timeout-time").val(0);
    //         $("input.no_oper_timeout-custom").val(client_timeout);
    //         $("#time-unit-by-minute").val(1);
    //         $("input.no_oper_timeout-custom").show();
    //         $("#client-timeout-custom-time").show();
    //         //authSetGlobalConfig("clienttimeout", client_timeout);
    //       }
    //       break;
    //   }
    //   var bypass = auth_global_config.bypass;
    //   if(bypass)
    //   {
    //     $(".bypass-line .switch").addClass("on").removeClass("off");
    //   }
    //   else
    //   {
    //     $(".bypass-line .switch").addClass("off").removeClass("on");
    //   }
    //   var wechatallowed = auth_global_config.wechatallowed;
    //   if(wechatallowed)
    //   {
    //     $(".wechatallowed-line .switch").addClass("on").removeClass("off");
    //   }
    //   else
    //   {
    //     $(".wechatallowed-line .switch").addClass("off").removeClass("on");
    //   }
    //   var white_list = auth_global_config.white_list;
    //   if(white_list && white_list.length > 0)
    //   {
    //     var ii = 0;
    //     var len = white_list.length;
    //     for(ii = 0; ii < len; ii++)
    //     {
    //       append_white_list($("#subnet .allowed-subnets"), white_list[ii].address);
    //     }
    //   }
    //   var trusted_mac_list = auth_global_config.trusted_mac_list;
    //   if(trusted_mac_list && trusted_mac_list.length > 0)
    //   {
    //     var ii = 0;
    //     var len = trusted_mac_list.length;
    //     for(ii = 0; ii < len; ii++)
    //     {
    //       append_white_list($("#trusted_mac_list .trusted_mac_list"), trusted_mac_list[ii].mac_address);
    //     }
    //   }
    //   external_authserver = auth_global_config.external_authserver;
    //   var auth_server = auth_global_config.auth_server || {};
    //   var server_container = $(".third-party-auth-container");
    //   server_container.find("input.login-text").val(auth_server.login||"").attr("oldvalue", auth_server.login||"");
    //   server_container.find("input.portal-text").val(auth_server.portal||"").attr("oldvalue", auth_server.portal||"");
    //   server_container.find("input.authpath-text").val(auth_server.auth_path||"");
    //   server_container.find("input.pingpath-text").val(auth_server.ping_path||"");
    //   if(external_authserver)
    //   {
    //     authlocalusertype = "external_auth_server";
    //     $("#External").attr("checked", "checked").click();
    //   }
    // }
    console.log(132132);
    var auth_config = eval(authConfig('authGetconfig'));
    console.log('weqqewqewwqe');
    console.log(auth_config);
    if (auth_config && auth_config.length > 0) {
      console.log('ewqewqeqwewq');
      $(".wechat_config_block").find("input.wechat_appid_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].appid || "");
      $(".wechat_config_block").find("input.wechat_appsecret_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].appsecret || "");
      $(".wechat_config_block").find("input.wechat_shopid_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].shopid || "");
      $(".wechat_config_block").find("input.wechat_secretkey_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].secretkey || "");
      var forcefollow = (auth_config[0].plugins["apAuthLocalUserPlugin"].forcefollow == "yes");
      if (forcefollow) {
        $("div.wechat_forcefollow_container #force_follow_switch").attr('checked', 'checked');
      } else {
        $("div.wechat_forcefollow_container #force_follow_switch").removeAttr('checked', 'checked');
      }
      // $("div.wechat_forcefollow_container #force_follow_switch.switch").addClass(forcefollow ? "on":"off").removeClass(forcefollow ? "off" : "on");
      $('.sms_alidayu').find(".sms_appkey_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_appkey || "");
      $('.sms_alidayu').find(".sms_secret_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_secret || "");
      $('.sms_alidayu').find(".sms_signName_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_signName || "");
      $('.sms_alidayu').find(".sms_templateNamecn_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_templateName_cn || "");
      $('.sms_alidayu').find(".sms_templateNameen_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_templateName_en || "");
      $('.sms_ihuyi').find(".sms_smsaccount_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].smsaccount || "");
      $('.sms_ihuyi').find(".sms_smspassword_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].smspassword || "");
      $('.sms_ihuyi').find(".cn_text").val(auth_config[0].plugins["apAuthLocalUserPlugin"].smstemplates_cn || "");
      $('.sms_ihuyi').find(".en_text").val(auth_config[0].plugins["apAuthLocalUserPlugin"].smstemplates_en || "");

      $('.sms_aliyun').find(".sms_accessid_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_accessId || "");
      $('.sms_aliyun').find(".sms_accesskey_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_accessKey || "");
      $('.sms_aliyun').find(".sms_endPoint_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_endPoint || "");
      $('.sms_aliyun').find(".sms_topicName_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_topicName || "");
      $('.sms_aliyun').find(".sms_signName_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_signName || "");
      $('.sms_aliyun').find(".sms_templateCodecn_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_templateCode_cn || "");
      $('.sms_aliyun').find(".sms_templateCodeen_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_templateCode_en || "");

      $('.sms_yunpian').find(".sms_apikey_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].yunpian_apikey || "");
      $('.sms_yunpian').find(".sms_text_input").val(auth_config[0].plugins["apAuthLocalUserPlugin"].yunpian_text || "");

      if (auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_appkey &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_secret &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_signName &&
        (auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_templateName_cn ||
          auth_config[0].plugins["apAuthLocalUserPlugin"].alidayu_templateName_en)) {
        $("div.sms_config").data("alidayu_configed", true);
      }
      if (auth_config[0].plugins["apAuthLocalUserPlugin"].smsaccount &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].smspassword &&
        (auth_config[0].plugins["apAuthLocalUserPlugin"].smstemplates_cn ||
          auth_config[0].plugins["apAuthLocalUserPlugin"].smstemplates_en)) {
        $("div.sms_config").data("ihuyi_configed", true);
      }
      if (auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_accessId &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_accessKey &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_signName &&
        (auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_templateCode_cn ||
          auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_templateCode_en) &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_endPoint &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].aliyun_topicName) {
        $("div.sms_config").data("aliyun_configed", true);
      }
      if (auth_config[0].plugins["apAuthLocalUserPlugin"].yunpian_apikey &&
        auth_config[0].plugins["apAuthLocalUserPlugin"].yunpian_text) {
        $("div.sms_config").data("yunpian_configed", true);
      }
      var platform = auth_config[0].plugins["apAuthLocalUserPlugin"].platform;
      if (platform && platform != "") {
        // change_sms_gateway_select(platform);
        $("select.smsgateway_select").val(platform);
        $("." + platform).show();
      }
      if (auth_config[0].plugins && auth_config[0].plugins["apExternalCMSPlugin"]) {
        var portal = auth_config[0].plugins["apExternalCMSPlugin"].portal_page || "";
        $("#custom_portal").val(portal);
        $("#custom_portal-d").val(portal);
        console.log(7667878786);
      }
      if (auth_config[0].plugins && auth_config[0].plugins["apExternalCMSPlugin"] &&
        auth_config[0].plugins["apExternalCMSPlugin"].enabled) {
        if (auth_config[0].plugins["apExternalCMSPlugin"].redirect_portal_page) {
          console.log(53434534);
          $("#custom").attr("checked", "checked");
          $('#custom_portal').removeAttr('disabled', 'disabled');
          // $("#custom").click();
        }
      }

      $('#radiusIP').val(auth_config[0].plugins["apAuthLocalUserPlugin"].radiusip || "");
      $('#radiusPort').val(auth_config[0].plugins["apAuthLocalUserPlugin"].radiusport || "");
      $('#radiusAccount').val(auth_config[0].plugins["apAuthLocalUserPlugin"].radiusaccount || "");
      $('#radiusPasswd').val(auth_config[0].plugins["apAuthLocalUserPlugin"].radiuspasswd || "");
    }
  }
  //authConfig("authStartAllPlugins");
  load_auth_config();

  function authAddSmsConfig(alidayu_appkey, alidayu_secret, alidayu_signName, alidayu_templateNamecn, alidayu_templateNameen) {
    var dataString = "";
    dataString += "&appkey=" + alidayu_appkey;
    dataString += "&secret=" + alidayu_secret;
    dataString += "&signName=" + alidayu_signName;
    dataString += "&templateNamecn=" + alidayu_templateNamecn;
    dataString += "&templateNameen=" + alidayu_templateNameen;
    return authConfig('authAddSmsConfig', dataString);
  };

  function authAddSmsIhuyi(account, password, sms_cn, sms_en) {
    var dataString = "";
    dataString += "&account=" + account;
    dataString += "&password=" + password;
    dataString += "&sms_cn=" + sms_cn;
    dataString += "&sms_en=" + sms_en;
    return authConfig('authAddSmsIhuyi', dataString);
  }

  function authAddSmsConfigAliyun(aliyun_accessId, aliyun_accessKey, aliyun_endPoint,
    aliyun_topicName, aliyun_signName, aliyun_templateCodecn,
    aliyun_templateCodeen, aliyun_paramKey) {
    var dataString = "";
    dataString += "&accessId=" + aliyun_accessId;
    dataString += "&accessKey=" + aliyun_accessKey;
    dataString += "&endPoint=" + aliyun_endPoint;
    dataString += "&topicName=" + aliyun_topicName;
    dataString += "&signName=" + aliyun_signName;
    dataString += "&templateCodecn=" + aliyun_templateCodecn;
    dataString += "&templateCodeen=" + aliyun_templateCodeen;
    dataString += "&paramKey=" + aliyun_paramKey;
    return authConfig('authAddSmsConfigAliyun', dataString);
  }

  function authAddSmsYunpian(apikey, text) {
    var dataString = "";
    dataString += "&apikey=" + apikey;
    dataString += "&text=" + text;
    return authConfig('authAddSmsYunpian', dataString);
  }

  $("#alidayu_button").click(function() {
    var platform = "alidayu";
    var config_ali = $('.sms_alidayu');
    var alidayu_appkey = config_ali.find(".sms_appkey_input").val();
    var alidayu_secret = config_ali.find(".sms_secret_input").val();
    var alidayu_signName = config_ali.find(".sms_signName_input").val();
    var alidayu_templateNamecn = config_ali.find(".sms_templateNamecn_input").val();
    var alidayu_templateNameen = config_ali.find(".sms_templateNameen_input").val();
    if (!checkEmpty(config_ali.find(".sms_appkey_input"), config_ali.find(".sms_appkey_label").html()) ||
      !checkEmpty(config_ali.find(".sms_secret_input"), config_ali.find(".sms_secret_label").html()) ||
      !checkEmpty(config_ali.find(".sms_signName_input"), config_ali.find(".sms_signName_label").html())) {
      return false;
    }
    if (alidayu_templateNamecn == "" && alidayu_templateNameen == "") {
      alert(Msg.S_TemplateStr + Msg.E_CannotBeEmpty);
      return false;
    }
    var res = authAddSmsConfig(alidayu_appkey, alidayu_secret, alidayu_signName, alidayu_templateNamecn, alidayu_templateNameen);
    if (res == '1') {
      $("div.sms_config").data("alidayu_configed", true);
      // change_sms_gateway_select(platform);
      alert(Msg.E_OperationSuccess);
    } else //if(res == '0')
      alert(Msg.E_OperationFailed);
  });
  $("select.smsgateway_select").change(function() {
    var gateway = $(this).val();

    if (gateway == "alidayu") {
      $(".ihuyi").hide();
      $(".alidayu").show();
      $(".aliyun").hide();
      $('.yunpian').hide();
    } else if (gateway == "ihuyi") {
      $(".ihuyi").show();
      $(".alidayu").hide();
      $(".aliyun").hide();
      $('.yunpian').hide();
    } else if (gateway == "aliyun") {
      $(".ihuyi").hide();
      $(".alidayu").hide();
      $(".aliyun").show();
      $('.yunpian').hide();
    } else if (gateway == 'yunpian') {
      $(".ihuyi").hide();
      $(".alidayu").hide();
      $(".aliyun").hide();
      $('.yunpian').show();
    } else {
      $(".ihuyi").hide();
      $(".alidayu").hide();
      $(".aliyun").hide();
      $('.yunpian').hide();
    }
  });
  $('#config_alidayu').click(function() {
    $(".sms_alidayu").show();
  });
  $('#alidayu_cancle').click(function() {
    $(".sms_alidayu").hide();
  });
  $('#config_yunpian').click(function() {
    $(".sms_yunpian").show();
  });
  $('#yunpian_cancle').click(function() {
    $(".sms_yunpian").hide();
  });

  $('#sms_ihuyi').click(function() {
    $(".sms_ihuyi").show();
  });
  $('#other_cancle').click(function() {
    $(".sms_ihuyi").hide();
  });
  $("#Ihuyi_button").click(function() {
    var platform = "ihuyi";
    var config_other = $('.sms_ihuyi');
    var account = config_other.find(".sms_smsaccount_input").val();
    var password = config_other.find(".sms_smspassword_input").val();
    var sms_cn = config_other.find(".cn_text").val();
    var sms_en = config_other.find(".en_text").val();
    if (!checkEmpty(config_other.find(".sms_smsaccount_input"), config_other.find(".sms_smsaccount_label").html()) ||
      !checkEmpty(config_other.find(".sms_smspassword_input"), config_other.find(".sms_smspassword_label").html())) {
      return false;
    }
    if (sms_cn == "" && sms_en == "") {
      alert(Msg.S_TemplateStr + Msg.E_CannotBeEmpty);
      return false;
    }
    var res = authAddSmsIhuyi(account, password, sms_cn, sms_en);
    if (res == '1') {
      $("div.sms_config").data("ihuyi_configed", true);
      // change_sms_gateway_select(platform);
      alert(Msg.E_OperationSuccess);
    } else //if(res == '0')
      alert(Msg.E_OperationFailed);
  });
  $("#aliyun_button").click(function() {
    var platform = "aliyun";
    var config_ali = $('.sms_aliyun');
    var aliyun_accessid = config_ali.find(".sms_accessid_input").val();
    var aliyun_accesskey = config_ali.find(".sms_accesskey_input").val();
    var aliyun_signName = config_ali.find(".sms_signName_input").val();
    var aliyun_templateCodecn = config_ali.find(".sms_templateCodecn_input").val();
    var aliyun_templateCodeen = config_ali.find(".sms_templateCodeen_input").val();
    var aliyun_endPoint = config_ali.find(".sms_endPoint_input").val();
    var aliyun_topicName = config_ali.find(".sms_topicName_input").val();
    var aliyun_paramKey = config_ali.find(".sms_paramKey_input").val() || "code";
    if (!checkEmpty(config_ali.find(".sms_accessid_input"), config_ali.find(".sms_accessid_label").html()) ||
      !checkEmpty(config_ali.find(".sms_accesskey_input"), config_ali.find(".sms_accesskey_label").html()) ||
      !checkEmpty(config_ali.find(".sms_endPoint_input"), config_ali.find(".sms_endPoint_label").html()) ||
      !checkEmpty(config_ali.find(".sms_topicName_input"), config_ali.find(".sms_topicName_label").html()) ||
      !checkEmpty(config_ali.find(".sms_signName_input"), config_ali.find(".sms_signName_label").html())) {
      return false;
    }
    if (aliyun_templateCodecn == "" && aliyun_templateCodeen == "") {
      alert(Msg.E_CannotBeEmpty, Msg.S_TemplateStr);
      return false;
    }
    var res = authAddSmsConfigAliyun(aliyun_accessid, aliyun_accesskey,
      aliyun_endPoint, aliyun_topicName, aliyun_signName,
      aliyun_templateCodecn, aliyun_templateCodeen, aliyun_paramKey);
    if (res == '1') {
      $("div.sms_config").data("aliyun_configed", true);
      // change_sms_gateway_select(platform);
      alert(Msg.E_OperationSuccess);
    } else //if(res == '0')
    {
      alert(Msg.E_OperationFailed);
    }
  });
  $("#yunpian_button").click(function() {
    var platform = "yunpian";
    var config_other = $('.sms_yunpian');
    var apikey = config_other.find(".sms_apikey_input").val();
    var text = config_other.find(".sms_text_input").val();
    if (!checkEmpty(config_other.find(".sms_apikey_input"), config_other.find(".sms_apikey_label").html()) ||
      !checkEmpty(config_other.find(".sms_text_input"), config_other.find(".sms_text_label").html())) {
      return false;
    }
    if (apikey == "" && text == "") {
      alert(Msg.S_TemplateStr + Msg.E_CannotBeEmpty);
      return false;
    }
    var res = authAddSmsYunpian(apikey, text);
    if (res == '1') {
      $("div.sms_config").data("yunpian_configed", true);
      // change_sms_gateway_select(platform);
      alert(Msg.E_OperationSuccess);
    } else //if(res == '0')
      alert(Msg.E_OperationFailed);
  });
  $("#auth-user-list").click(function() {
    if (!$("#AuthUserDataTable").is(":visible")) {
      $("#AuthUserDataTable").show();
      refresh_portal_user_table();
    } else {
      $("#AuthUserDataTable").hide();
    }
  });
  var refresh_portal_user_table = function() {
    if (!$("#AuthUserDataTable").is(":visible")) {
      return false;
    }
    var auth_user_list = authConfig('authShowUsers');
    var portal_index = 0;
    var portal_user_array = [];
    //var $usertable = auth_user_list.find("table");
    $("#AuthUserDataTable table thead").empty().append($("div.user_list_thead").find("tr").clone());
    //$("#AuthUserDataTable table tbody").empty();
    var lines = $(auth_user_list).find("table tbody tr");
    var userCount = 0;
    lines.each(function() {
      var username = $(this).find("td a").get(0).innerHTML;
      var password = $(this).find("td").get(1).innerHTML;
      //var phone = $(this).find("td").get(3).innerHTML;
      var regist_time = $(this).find("td").get(4).innerHTML;
      var status = $(this).find("td").get(5).innerHTML;
      var expiretime = $(this).find("td").get(7).innerHTML;
      var linenode = $("<tr class='user_list_tr'></tr>");
      username = username.replace(/\w*:/, "");
      if (!(username.match(/^auto_/) || username.match(/^wechat_/))) {
        portal_user_array.push({
          "name": username,
          "password": password,
          "regist_time": regist_time,
          "status": status,
          "expiretime": expiretime
        });
        /*linenode.append("<td class='username'>"+username+"</td>");
        linenode.append("<td class='password'>"+password+"</td>");
        //linenode.append("<td class='phone'>"+phone+"</td>");
        linenode.append("<td class='regist_time'>"+regist_time+"</td>");
        linenode.append("<td class='status'>"+status+"</td>");
        $("#AuthUserDataTable table tbody").append(linenode);*/
        userCount++;
      }
    });
    datatableInit(portal_user_array);
    // displaySearchData(portal_user_array, 1, true);
    // multiPageProcess(portal_user_array, true);
  }
  $("#auth-add").click(function() {
    var auth_user = $("#auth-user").val();
    var auth_pw = $("#Password").val();
    var auth_aging = $("#auth-aging").val();
    if (auth_pw.length < 4) {
      alert(Msg.Auth_PasswordShort);
      return false;
    }
    var reg = new RegExp("^[A-Za-z0-9]+$");
    var reg_user = new RegExp("^[A-Za-z0-9_]+$");
    if (!auth_user.match(reg_user)) {
      alert(Msg.Auth_UserInvalid);
      return false;
    }
    if (!auth_pw.match(reg)) {
      alert(Msg.Auth_PasswordInvalid);
      return false;
    }
    if (!auth_pw.match(reg)) {
      alert(Msg.Auth_PasswordInvalid);
      return false;
    }
    var res = authAddUser(auth_user, auth_pw, auth_aging);
    if (res == '1') {
      alert(Msg.Auth_AddSuccess);
      $("#auth-user").val("");
      $("#Password").val("");
      refresh_portal_user_table();
    } else if (res == '0')
      alert(Msg.Auth_AddExistUser);
    else
      alert(Msg.Auth_AddNetError);
  });

  $('#radiusSubmit').click(() => {
    let radiusIP = $('#radiusIP').val();
    let radiusPort = $('#radiusPort').val();
    let radiusAccount = $('#radiusAccount').val();
    let radiusPasswd = $('#radiusPasswd').val();

    if ($.trim(radiusIP) === '' || $.trim(radiusPort) === '' || $.trim(radiusAccount) === '' || $.trim(radiusPasswd) === '') {
      alert(Msg.RadiusSettingEmpty);
    } else {
      let res = saveRadiusSetting(radiusIP, radiusPort, radiusAccount, radiusPasswd);
      if (res === '1') {
        alert(Msg.RadiusActSuccess);
      } else if (res == '0') {
        alert(Msg.RadiusActFail);
      } else {
        alert(Msg.RadiusActNetError);
      }
    };
  });

  function saveRadiusSetting(ip, port, account, password) {
    var dataString = "";
    dataString += "&radiusip=" + ip;
    dataString += "&radiusport=" + port;
    dataString += "&radiusaccount=" + account;
    dataString += "&radiuspasswd=" + password;
    console.log(dataString);
    return authConfig('saveRadiusSetting', dataString);
  }

  function authAddUser(user, passwd, expiretime) {
    var dataString = "";
    dataString += "&username=" + user;
    dataString += "&password=" + passwd;
    dataString += "&expiretime=" + expiretime;
    console.log(dataString);
    return authConfig('authAddUser', dataString);
  }
  var delete_portal_user = function(username) {
    if (!username) {
      return false;
    }
    var res = authConfig('authDeleteUser', username);
    if (res == '1') {
      alert(Msg.Auth_DeleteSuccess);
      refresh_portal_user_table();
    } else if (res == '0')
      alert(Msg.Auth_DeleteUnexistUser);
    else
      alert(Msg.Auth_DeleteNetError);
    return res;
  };
  $("#auth-delete").click(function() {
    var auth_user = $("#auth-user").val();
    return delete_portal_user(auth_user);
  });
  $(document).on("click", ".delete_portal_user", function() {
    var username = $(this).attr("username");
    if (username) delete_portal_user($(this).attr("username"));
  });
  $('#voucher_add_apply').click(function() {
    var essid = $("#voucher_essid_inputs").val();
    var code = $(".voucher-code-input").val();
    var number = $(".voucher-nums-select").val();
    var duration = $(".voucher-durations-select").val();
    var bytes = $("#voucher_byte_inputs").val();
    var support = $(".voucher-supports-select").val();
    var remarks = $(".voucher-remarks-input").val();
    console.log(duration);
    console.log(bytes);
    if (!checkEmpty($(".voucher-essid-input"),
        $(".voucher-essid-label").html())) {
      return false;
    }
    if (!checkEmpty($(".voucher-bytes-select"),
        $(".voucher-byte-label").html())) {
      return false;
    }
    var res = authAddVoucherConfig(essid, code, number, duration, bytes, support, remarks);
    if (res == '1') {
      // $(".device-cover").hide();
      // $("#create-voucher").hide();
      // $("#model-vouchers").jtablemodel("refresh");
      $('#close_add_form').click();
      alert(Msg.E_OperationSuccess);
      voucher_re();
    } else {
      alert(Msg.E_OperationFailed);
    }
  })

  function authAddVoucherConfig(essid, code, number, duration, bytes, support, remarks) {
    var dataString = "";
    dataString += "&essid=" + essid;
    dataString += "&code=" + code;
    dataString += "&num=" + number;
    dataString += "&duration=" + duration;
    dataString += "&byte_quota=" + bytes;
    dataString += "&user_support=" + support;
    dataString += "&remarks=" + remarks;
    return authConfig('authAddVoucherConfig', dataString);
  }
});



// portal-master
var template_edits = function() {
  $.post("/portal_master/list_edit_portal.php", {
      json: ""
    },
    function(a, g, h) {
      var data = a.data;
      if (data && data.length > 0) {
        for (var i in data[0]) {
          var title = data[0][i].title;
          var state = data[0][i].state;
          if (state == "1") {
            $('#cancel_' + title).show();
            $('#apply_' + title).hide();
          } else {
            $('#cancel_' + title).hide();
            $('#apply_' + title).show();
          }
        }
      } else {
        var authtype = ["onekey", "accountlogin", "phonelogin", "wechat", "voucher"];
        for (var i in authtype) {
          title = authtype[i];
          $('#cancel_' + title).hide();
          $('#apply_' + title).show();
        }
      }
    }, "json");
}
template_edits();
//  template apply
$(document).on("click", "#apply_phonelogin", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "apply",
    title: "phonelogin"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#apply_accountlogin", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "apply",
    title: "accountlogin"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#apply_onekey", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "apply",
    title: "onekey"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#apply_wechat", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "apply",
    title: "wechat"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#apply_voucher", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "apply",
    title: "voucher"
  }, function() {
    template_edits();
  });
});
//  template cancle
$(document).on("click", "#cancel_phonelogin", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "cancel",
    title: "phonelogin"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#cancel_accountlogin", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "cancel",
    title: "accountlogin"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#cancel_onekey", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "cancel",
    title: "onekey"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#cancel_wechat", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "cancel",
    title: "wechat"
  }, function() {
    template_edits();
  });
});
$(document).on("click", "#cancel_voucher", function() {
  $.post("/portal_master/portal_operation.php", {
    cmd: "cancel",
    title: "voucher"
  }, function() {
    template_edits();
  });
});
$(document).ready(function() {
  if (administrator_permission < 4) {
    $('.common-config').removeClass('active');
    $('.common-config').hide();
    $('.account-config').addClass('active');
  }
});
