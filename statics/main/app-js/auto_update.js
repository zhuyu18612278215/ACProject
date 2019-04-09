var url = window.location.origin;
var urltail;
var option_type = $('#update_rule').data('option-type');
if (option_type === 'ap') {
  urltail = `${ url }/ap/ap_wlan/auto-update/`;
} else if (option_type === 'probe') {
  urltail = `${ url }/device/device_group/auto-update/`;
} else if (option_type === 'nonoperate') {
  urltail = `${ url }/nonoperate/nonoperate_wlan/auto-update/`;
}
$(function() {
  // body...
  update_rule = $('#update_rule').select2({
    width: '100%',
    theme: 'classic',
    ajax: {
      url: urltail,
      type: 'GET',
      dataType: 'json',
      data: {
        get_type: 'option',
      },
    },
  });

  $.ajax({
    url: urltail,
    type: 'GET',
    dataType: 'json',
    data: {
      get_type: 'option',
    },
  }).then(function(data) {
    var option = data['results'].map(function(value) {
      if (!update_rule.find(`option[value=${value.id}]`).length) {
        var optchild = new Option(value.text, value.id, false, false);
        return optchild;
      }
    });
    if (option.length !== 0) {
      update_rule.append(option).trigger('change');
    }

    update_rule.trigger({
      type: 'select2:select',
      params: {
        data: data,
      },
    });

    $.ajax({
      url: urltail,
      type: 'GET',
      dataType: 'json',
      data: {
        get_type: 'load_result',
      },
    }).then(function(data) {
      // body...
      update_rule.val(JSON.parse(data)).trigger('change');
    });
  });

});

$('#update_rule_every_one').on('click', function(event) {
  /* Act on the event */
  $.ajax({
    url: urltail,
    type: 'GET',
    dataType: 'json',
    data: {
      get_type: 'option',
    },
  }).then(function(data) {
    value = data['results'].map(function(value) {
      return value.id;
    });
    update_rule.val(value).trigger('change');
  });
});
$('#update_rule_clear').on('click', function(event) {
  /* Act on the event */
  update_rule.val(null).trigger('change');
});

$('#update_rule_submit').on('click', function(event) {
  /* Act on the event */
  var rule = $('#update_rule').val();
  if (!rule) {
    rule = [];
  }
  $.ajax({
    url: urltail,
    type: 'POST',
    dataType: 'json',
    data: {
      rule: rule,
    },
  }).done(function(res) {
    // body...
    alert(res.error);
    location.reload();
  });
});
