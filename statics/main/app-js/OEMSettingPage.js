var url = window.location.origin;

$(function() {
  // body...
  getOEMSetting();
});

function getOEMSetting() {
  // body...
  $.getJSON(`${ url }/oemSettingApi/`, function(ret) {
    // console.log(ret);
    // acUpdateAddressOption
    if (ret.acUpdateAddressOption === 'Free') {
      $('#acUpdateAddressOption-free').attr('checked', 'checked');
      $('#acUpdateAddress').attr('readonly', 'readonly');
    } else {
      $('#acUpdateAddressOption-assign').attr('checked', 'checked');
      $('#acUpdateAddress').removeAttr('readonly');
    }
    $('#acUpdateAddress').val(ret.acUpdateAddress);

    // acUpdateSwitchOption
    if (ret.acUpdateSwitchOption === 'Auto') {
      $('#acUpdateSwitchOption-auto').attr('checked', 'checked');
    } else if (ret.acUpdateSwitchOption === 'UpdateURL') {
      $('#acUpdateSwitchOption-updateURL').attr('checked', 'checked');
    }

    $('#specialOEMOption').val(ret.specialOEMOption);
    $('#logoDisplay').val(ret.logoDisplay);
    $('#useLogoCustomization').val(ret.useLogoCustomization);
    if (ret.logoCustomization === '') {
      $('#logoCustomizationText').text(pageWords.noCustomLogo);
    } else {
      $('#logoCustomizationText').text(pageWords.hasCustomLogo);
    }

    if (ret.customUIOption === 'Default') {
      $('#customUIOption-default').attr('checked', 'checked');
      $('#customUIMainColor').attr('readonly', 'readonly');
      $('#customUISecondaryColor').attr('readonly', 'readonly');
    } else {
      $('#customUIOption-assign').attr('checked', 'checked');
      $('#customUIMainColor').removeAttr('readonly');
      $('#customUISecondaryColor').removeAttr('readonly');
    }
    $('#customUIMainColor').val(ret.customUIMainColor);
    $('#customUISecondaryColor').val(ret.customUISecondaryColor);

    if (ret.showAPPage === 'show') {
      $('#showAPPage')[0].checked = true;
    } else {
      $('#showAPPage')[0].checked = false;
    }
    if (ret.showProbePage === 'show') {
      $('#showProbePage')[0].checked = true;
    } else {
      $('#showProbePage')[0].checked = false;
    }
    if (ret.showNonPage === 'show') {
      $('#showNonPage')[0].checked = true;
    } else {
      $('#showNonPage')[0].checked = false;
    }
    if (ret.systemFirstLevelPageControl === 'show') {
      $('#systemFirstLevelPageControl')[0].checked = true;
    } else {
      $('#systemFirstLevelPageControl')[0].checked = false;
    }
    if (ret.supportFirstLevelPageControl === 'show') {
      $('#supportFirstLevelPageControl')[0].checked = true;
    } else {
      $('#supportFirstLevelPageControl')[0].checked = false;
    }

    if (ret.guestCommonOptionControl === 'show') {
      $('#guestCommonOptionControl')[0].checked = true;
    } else {
      $('#guestCommonOptionControl')[0].checked = false;
    }
    if (ret.guestAccountOptionControl === 'show') {
      $('#guestAccountOptionControl')[0].checked = true;
    } else {
      $('#guestAccountOptionControl')[0].checked = false;
    }
    if (ret.guestSMSOptionControl === 'show') {
      $('#guestSMSOptionControl')[0].checked = true;
    } else {
      $('#guestSMSOptionControl')[0].checked = false;
    }
    if (ret.guestWXOptionControl === 'show') {
      $('#guestWXOptionControl')[0].checked = true;
    } else {
      $('#guestWXOptionControl')[0].checked = false;
    }
    if (ret.guestCardOptionControl === 'show') {
      $('#guestCardOptionControl')[0].checked = true;
    } else {
      $('#guestCardOptionControl')[0].checked = false;
    }
    if (ret.guestCustomizeOptionControl === 'show') {
      $('#guestCustomizeOptionControl')[0].checked = true;
    } else {
      $('#guestCustomizeOptionControl')[0].checked = false;
    }

    $('#userDefaultLanguage').val(ret.userDefaultLanguage);
    $('#accountSystemControl').val(ret.accountSystemControl);
  });
}

function saveOEMSetting(oemSetting) {
  // body...
  $.ajax({
    url: `${ url }/oemSettingApi/`,
    type: 'POST',
    processData: false, // 不处理数据
    contentType: false, // 不设置内容类型
    data: oemSetting,
  }).done(function(ret) {
    // console.log("success");
    if (ret.status === 'success') {
      alert(pageWords.saveSuccess);
    } else {
      alert(pageWords.saveFailed);
    }
  });
}

$('#saveOEMSetting').click(function(event) {
  /* Act on the event */
  let oemSetting = new FormData();
  let error = '';
  if ($('#acUpdateAddressOption-free').attr('checked')) {
    oemSetting.append('acUpdateAddressOption', 'Free');
    oemSetting.append('acUpdateAddress', '');
    // oemSetting.acUpdateAddressOption = 'Free';
    // oemSetting.acUpdateAddress = '';
  } else {
    let acUpdateAddress = $('#acUpdateAddress').val();
    if (!acUpdateAddress.trim()) {
      error = pageWords.acUpdateAddressNull;
    } else {
      oemSetting.append('acUpdateAddressOption', 'Assign');
      oemSetting.append('acUpdateAddress', acUpdateAddress);
      // oemSetting.acUpdateAddressOption = 'Assign';
      // oemSetting.acUpdateAddress = acUpdateAddress;
    }
  }

  if ($('#acUpdateSwitchOption-auto').attr('checked')) {
    oemSetting.append('acUpdateSwitchOption', 'Auto');
    // oemSetting.acUpdateSwitchOption = 'Auto';
  } else if ($('#acUpdateSwitchOption-updateURL').attr('checked')) {
    oemSetting.append('acUpdateSwitchOption', 'UpdateURL');
    // oemSetting.acUpdateSwitchOption = 'UpdateURL';
  }

  oemSetting.append('specialOEMOption', $('#specialOEMOption').val());
  oemSetting.append('logoDisplay', $('#logoDisplay').val());
  // oemSetting.specialOEMOption = $('#specialOEMOption').val();
  // oemSetting.logoDisplay = $('#logoDisplay').val();

  oemSetting.append('useLogoCustomization', $('#useLogoCustomization').val());

  if ($('#logoCustomization')[0].files[0]) {
    oemSetting.append('logoCustomization', $('#logoCustomization')[0].files[0]);
  }

  if ($('#customUIOption-default').attr('checked')) {
    oemSetting.append('customUIOption', 'Default');
    oemSetting.append('customUIMainColor', '');
    oemSetting.append('customUISecondaryColor', '');
  } else {
    let customUIMainColor = $('#customUIMainColor').val();
    let customUISecondaryColor = $('#customUISecondaryColor').val();
    if (customUIMainColor.trim() === '' || customUISecondaryColor.trim() === '') {
      error = pageWords.customUIColorNull;
    } else {
      oemSetting.append('customUIOption', 'Assign');
      oemSetting.append('customUIMainColor', customUIMainColor);
      oemSetting.append('customUISecondaryColor', customUISecondaryColor);
    }
  }

  if ($('#showAPPage')[0].checked) {
    oemSetting.append('showAPPage', 'show');
  } else {
    oemSetting.append('showAPPage', 'hide');
  }
  if ($('#showProbePage')[0].checked) {
    oemSetting.append('showProbePage', 'show');
  } else {
    oemSetting.append('showProbePage', 'hide');
  }
  if ($('#showNonPage')[0].checked) {
    oemSetting.append('showNonPage', 'show');
  } else {
    oemSetting.append('showNonPage', 'hide');
  }
  if ($('#systemFirstLevelPageControl')[0].checked) {
    oemSetting.append('systemFirstLevelPageControl', 'show');
  } else {
    oemSetting.append('systemFirstLevelPageControl', 'hide');
  }
  if ($('#supportFirstLevelPageControl')[0].checked) {
    oemSetting.append('supportFirstLevelPageControl', 'show');
  } else {
    oemSetting.append('supportFirstLevelPageControl', 'hide');
  }

  if ($('#guestCommonOptionControl')[0].checked) {
    oemSetting.append('guestCommonOptionControl', 'show');
  } else {
    oemSetting.append('guestCommonOptionControl', 'hide');
  }
  if ($('#guestAccountOptionControl')[0].checked) {
    oemSetting.append('guestAccountOptionControl', 'show');
  } else {
    oemSetting.append('guestAccountOptionControl', 'hide');
  }
  if ($('#guestSMSOptionControl')[0].checked) {
    oemSetting.append('guestSMSOptionControl', 'show');
  } else {
    oemSetting.append('guestSMSOptionControl', 'hide');
  }
  if ($('#guestWXOptionControl')[0].checked) {
    oemSetting.append('guestWXOptionControl', 'show');
  } else {
    oemSetting.append('guestWXOptionControl', 'hide');
  }
  if ($('#guestCardOptionControl')[0].checked) {
    oemSetting.append('guestCardOptionControl', 'show');
  } else {
    oemSetting.append('guestCardOptionControl', 'hide');
  }
  if ($('#guestCustomizeOptionControl')[0].checked) {
    oemSetting.append('guestCustomizeOptionControl', 'show');
  } else {
    oemSetting.append('guestCustomizeOptionControl', 'hide');
  }

  oemSetting.append('userDefaultLanguage', $('#userDefaultLanguage').val());
  oemSetting.append('accountSystemControl', $('#accountSystemControl').val());

  // console.log(oemSetting);

  if (error) {
    alert(error);
  } else {
    saveOEMSetting(oemSetting);
  }
});


$('#acUpdateAddressOption-free').click(function(event) {
  /* Act on the event */
  $('#acUpdateAddressOption-free').attr('checked', 'checked');
  $('#acUpdateAddressOption-assign').removeAttr('checked');
  $('#acUpdateAddress').attr('readonly', 'readonly');
});
$('#acUpdateAddressOption-assign').click(function(event) {
  /* Act on the event */
  $('#acUpdateAddressOption-free').removeAttr('checked');
  $('#acUpdateAddressOption-assign').attr('checked', 'checked');
  $('#acUpdateAddress').removeAttr('readonly');
});

$('#acUpdateSwitchOption-auto').click(function(event) {
  /* Act on the event */
  $('#acUpdateSwitchOption-auto').attr('checked', 'checked');
  $('#acUpdateSwitchOption-updateURL').removeAttr('checked');
});
$('#acUpdateSwitchOption-updateURL').click(function(event) {
  /* Act on the event */
  $('#acUpdateSwitchOption-updateURL').attr('checked', 'checked');
  $('#acUpdateSwitchOption-auto').removeAttr('checked');
});

function previewFile() {
  let previewPic = $('#previewPic')[0];
  let img = $('#logoCustomization')[0].files[0];
  // console.log(img);
  let reader = new FileReader();
  reader.addEventListener("load", function() {
    previewPic.src = reader.result;
  }, false);
  if (img) {
    reader.readAsDataURL(img);
  }
}

$('#logoCustomization').change(previewFile);


$('#customUIOption-default').click(function(event) {
  /* Act on the event */
  $('#customUIOption-default').attr('checked', 'checked');
  $('#customUIOption-assign').removeAttr('checked');
  $('#customUIMainColor').attr('readonly', 'readonly');
  $('#customUISecondaryColor').attr('readonly', 'readonly');
});
$('#customUIOption-assign').click(function(event) {
  /* Act on the event */
  $('#customUIOption-default').removeAttr('checked');
  $('#customUIOption-assign').attr('checked', 'checked');
  $('#customUIMainColor').removeAttr('readonly');
  $('#customUISecondaryColor').removeAttr('readonly');
});


function languageChange() {
  $('#languageSubmit').submit();
}
