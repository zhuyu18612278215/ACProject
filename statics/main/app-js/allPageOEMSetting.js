var url = window.location.origin;
var pathname = window.location.pathname;

$(function() {
  // body...
  getOEMSetting();
});

function getOEMSetting() {
  // body...
  $.getJSON(`${ url }/oemSettingApi/`, function(ret) {
    // console.log(ret);
    if (ret.specialOEMOption === 'byzoroXinyang') {
      $('h4.byzoroXinyang').css('display', '');
      $('img.byzoroXinyang').css('display', '');
      $('img.commonLogo').css('display', 'none');
      $('.byzoroXinyangOemPageFooterDiv').css('display', '');
      $('.byzoroXinyangOemPageTitleDiv').css('display', '')
      $('div.byzoroXinyang').css('display', '');
      $('li.byzoroXinyang').css('display', '');
      $('h4.commonLogin').css('display', 'none');
      if (administratorPermission === '4' || administratorPermission === 4) {
        $('li.commonSidebarLi').css('display', 'none');
        $('li.byzoroXinyang').css('display', '');
        $('li.byzoroXinyangFatherLi').css('display', '');
      }
    } else {
      $('h4.byzoroXinyang').css('display', 'none');
      $('img.byzoroXinyang').css('display', 'none');
      $('img.commonLogo').css('display', '');
      $('.byzoroXinyangOemPageFooterDiv .byzoroXinyang').css('display', 'none');
      $('.byzoroXinyangOemPageTitleDiv').css('display', 'none');
      $('div.byzoroXinyang').css('display', 'none');
      $('li.byzoroXinyang').css('display', 'none');
      $('h4.commonLogin').css('display', '');
    }

    if (ret.acUpdateAddressOption === 'Assign') {
      $('input.acUpdateAddressOption').attr({
        readonly: 'readonly',
      });
    } else if (ret.acUpdateAddressOption === 'Free') {
      $('input.acUpdateAddressOption').removeAttr('readonly');
    }

    if (pathname === '/system/system_service/') {
      if (ret.acUpdateSwitchOption === 'Auto') {
        $('#upgrade_ajax').click(upgrade_ajax);
      } else if (ret.acUpdateSwitchOption === 'UpdateURL') {
        $('#upgrade_ajax').click(produceUpdateURL);
      }
    }

    if (ret.logoDisplay === 'hide') {
      $('img.commonLogo').css('visibility', 'hidden');
    } else if (ret.logoDisplay === 'show') {
      $('img.commonLogo').css('visibility', 'visible');
    }

    if (ret.logoCustomization !== '' && ret.useLogoCustomization === 'true') {
      $('img.commonLogo').attr('src', ret.logoCustomization);
    } else {
      $('img.commonLogo').attr('src', '/static/assets/img/logo.png');
    }

    if (ret.customUIOption !== 'Default' && ret.customUIMainColor !== '' && ret.customUISecondaryColor !== '') {
      $('.sidebar').css('background', ret.customUIMainColor);
      $('.sidebar ul.nav.nav-sidebar li .nav-children').css('background', ret.customUISecondaryColor);
      $('.sidebar ul.nav.nav-sidebar > li.nav-expanded > a').css('background', ret.customUIMainColor);
      $('.page-header').css('background', ret.customUIMainColor);
    }

    if (ret.systemFirstLevelPageControl === 'hide') {
      $('li.commonSidebarLi.systemFirstLevelPageControl').hide();
    } else {
      $('li.commonSidebarLi.systemFirstLevelPageControl').show();
    }
    if (ret.supportFirstLevelPageControl === 'hide') {
      $('li.commonSidebarLi.supportFirstLevelPageControl').hide();
    } else {
      $('li.commonSidebarLi.supportFirstLevelPageControl').show();
    }

    if (ret.guestCommonOptionControl === 'hide') {
      $('li.guestCommonOptionControl').hide();
    } else {
      $('li.guestCommonOptionControl').show();
    }
    if (ret.guestAccountOptionControl === 'hide') {
      $('li.guestAccountOptionControl').hide();
      $('option.wlanAuthType.account').hide();
      $('div.guestAccountOptionControl').hide();
    } else {
      $('li.guestAccountOptionControl').show();
    }
    if (ret.guestSMSOptionControl === 'hide') {
      $('li.guestSMSOptionControl').hide();
      $('option.wlanAuthType.phonesms').hide();
      $('div.guestSMSOptionControl').hide();
    } else {
      $('li.guestSMSOptionControl').show();
    }
    if (ret.guestWXOptionControl === 'hide') {
      $('li.guestWXOptionControl').hide();
      $('option.wlanAuthType.wechatauth').hide();
      $('option.wlanAuthType.smsandwechat').hide();
      $('option.wlanAuthType.localwechat').hide();
      $('div.guestWXOptionControl').hide();
    } else {
      $('li.guestWXOptionControl').show();
    }
    if (ret.guestCardOptionControl === 'hide') {
      $('li.guestCardOptionControl').hide();
      $('option.wlanAuthType.voucher_auth').hide();
      $('div.guestCardOptionControl').hide();
    } else {
      $('li.guestCardOptionControl').show();
    }
    if (ret.guestCustomizeOptionControl === 'hide') {
      $('li.guestCustomizeOptionControl').hide();
    } else {
      $('li.guestCustomizeOptionControl').show();
    }

    // if (ret.guestCommonOptionControl === 'hide' && ret.guestAccountOptionControl === 'hide' && ret.guestSMSOptionControl === 'hide' && ret.guestWXOptionControl === 'hide' && ret.guestCardOptionControl === 'hide' && ret.guestCustomizeOptionControl === 'hide') {
    //   $('fieldset.builtIn').hide();
    // } else {
    //   $('fieldset.builtIn').show();
    // }

    if (ret.guestCommonOptionControl === 'show') {
      $('li.guestCommonOptionControl').addClass('active');
      $('div.guestCommonOptionControl').addClass('active');
    } else if (ret.guestAccountOptionControl === 'show') {
      $('li.guestAccountOptionControl').addClass('active');
      $('div.guestAccountOptionControl').addClass('active');
    } else if (ret.guestSMSOptionControl === 'show') {
      $('li.guestSMSOptionControl').addClass('active');
      $('div.guestSMSOptionControl').addClass('active');
    } else if (ret.guestWXOptionControl === 'show') {
      $('li.guestWXOptionControl').addClass('active');
      $('div.guestWXOptionControl').addClass('active');
    } else if (ret.guestCardOptionControl === 'show') {
      $('li.guestCardOptionControl').addClass('active');
      $('div.guestCardOptionControl').addClass('active');
    } else if (ret.guestCustomizeOptionControl === 'show') {
      $('li.guestCustomizeOptionControl').addClass('active');
      $('div.guestCustomizeOptionControl').addClass('active');
    } else {
      $('fieldset.builtIn').hide();
    }

    if (ret.specialOEMOption === 'wisOEM') {
      $('div .wisOEMAccount').hide();
      $('p .wisOEMAccount').hide();


      $('div.guestOneKeyOptionControl').hide();
      $('option.wlanAuthType.no_authentication').hide();
      $('option.wlanAuthType.external_auth_server').hide();
      $('#auth_type').val('account');

      $('li.guestSMSOptionControl').hide();
      $('option.wlanAuthType.phonesms').hide();
      $('div.guestSMSOptionControl').hide();
      $('li.guestWXOptionControl').hide();
      $('option.wlanAuthType.wechatauth').hide();
      $('option.wlanAuthType.smsandwechat').hide();
      $('option.wlanAuthType.localwechat').hide();
      $('div.guestWXOptionControl').hide();
      $('li.guestCardOptionControl').hide();
      $('option.wlanAuthType.voucher_auth').hide();
      $('div.guestCardOptionControl').hide();
      $('fieldset.wisOEMAuth').hide();
    }
    if (ret.accountSystemControl === 'hide') {
      $('div.accountSystemControl').hide();
    } else {
      $('div.accountSystemControl').show();
    }
  });
}
