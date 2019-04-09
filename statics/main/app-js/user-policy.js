var url = window.location.origin;
$(function() {
  // body...
  var start = laydate.render({
    elem: '#policy_time_start_1',
    type: 'time',
    // range: true,
    format: 'HH:mm',
    theme: 'molv',
    min: '00:00:00',
    max: '23:59:59',
    done: function(value, date) {
      // body...
      end.config.min.hours = date.hours;
      end.config.min.minutes = date.minutes;
      end.config.min.seconds = date.seconds;
    },
  });
  var end = laydate.render({
    elem: '#policy_time_end_1',
    type: 'time',
    // range: true,
    format: 'HH:mm',
    theme: 'molv',
    min: '00:00:00',
    max: '23:59:59',
    change: function(value, date) {
      // body...
      start.config.max.hours = date.hours;
      start.config.max.minutes = date.minutes;
      start.config.max.seconds = date.seconds;
    },
  });
  // var start2 = laydate.render({
  //   elem: '#policy_2_time_start',
  //   type: 'time',
  //   // range: true,
  //   format: 'HH:mm',
  //   theme: 'molv',
  //   min: '00:00:00',
  //   max: '23:59:59',
  //   done: function (value,date) {
  //       // body...
  //       end2.config.min.hours = date.hours;
  //       end2.config.min.minutes = date.minutes;
  //       end2.config.min.seconds = date.seconds;
  //   },
  // });
  // var end2 = laydate.render({
  //   elem: '#policy_2_time_end',
  //   type: 'time',
  //   // range: true,
  //   format: 'HH:mm',
  //   theme: 'molv',
  //   min: '00:00:00',
  //   max: '23:59:59',
  //   change: function (value,date) {
  //       // body...
  //       start2.config.max.hours = date.hours;
  //       start2.config.max.minutes = date.minutes;
  //       start2.config.max.seconds = date.seconds;
  //   },
  // });

})
$(function() {
  weekday_select = $('#policy_weekday_1').select2({
    width: '100%',
    theme: 'classic',
  });
});
$('#weekday_select_everyday').on('click', function(event) {
  /* Act on the event */
  weekday_select.val(['1', '2', '3', '4', '5', '6', '7']).trigger('change');
});
$('#weekday_select_workday').on('click', function(event) {
  /* Act on the event */
  weekday_select.val(['1', '2', '3', '4', '5']).trigger('change');
});
$('#weekday_select_weekend').on('click', function(event) {
  /* Act on the event */
  weekday_select.val(['6', '7']).trigger('change');
});
$('#weekday_select_clear').on('click', function(event) {
  /* Act on the event */
  weekday_select.val(null).trigger('change');
});



$('#light_switch').change(function(event) {
  /* Act on the event */
  if ($('#light_switch').attr('checked') == 'checked') {
    $('#policy_div').show();
  } else {
    $('#policy_div').hide();
  }
});
$(function get_timepolicy() {
  // body...
  $.getJSON(url + '/ap-list/timing_policy_ajax/', function(res) {
    /*optional stuff to do after success */
    console.log(res);
    if ($.isEmptyObject(res)) {
      $('#light_switch').removeAttr('checked');
      $('#policy_div').hide();
      weekday_select.val(null).trigger('change');
      $('#policy_time_start_1').val();
      $('#policy_time_end_1').val();
    } else {
      if (res.gpon_light_switch == "on" && res.gpon_timer != "") {
        $('#light_switch').attr('checked', 'checked');
        $('#policy_div').show();
        gpon_timer = JSON.parse(res.gpon_timer);
        for (var i in gpon_timer) {
          weekday_select.val(gpon_timer[i]['weekday']).trigger('change');
          $('#policy_time_start_1').val(gpon_timer[i]['start']);
          $('#policy_time_end_1').val(gpon_timer[i]['end']);
        }
      } else {
        $('#light_switch').removeAttr('checked');
        $('#policy_div').hide();
        $('#policy_time_start').val();
        $('#policy_time_end').val();
      }
    }
  });
});

function light_policy_apply() {
  // body...query
  var sign = 0;
  if ($('#light_switch').attr('checked') == "checked") {
    var light_switch = "on";
    var policy_weekday_1 = $('#policy_weekday_1').val();
    var policy_time_start_1 = $('#policy_time_start_1').val();
    var policy_time_end_1 = $('#policy_time_end_1').val();
    if ($.trim(policy_weekday_1) == "" || $.trim(policy_time_start_1) == "" || $.trim(policy_time_end_1) == "") {
      alert(Translate.time_empty_error);
    } else if ($.trim(policy_time_start_1) == $.trim(policy_time_end_1)) {
      alert(Translate.time_same_error);
    } else {
      sign = 1;
    }
  } else {
    var light_switch = "off";
    var policy_weekday_1 = "";
    var policy_time_start_1 = "";
    var policy_time_end_1 = "";
    sign = 1;
  }
  if (sign == 1) {
    $.post(url + '/ap-list/timing_policy_ajax/', {
      "light_switch": light_switch,
      "policy_weekday_1": policy_weekday_1,
      "policy_time_start_1": policy_time_start_1,
      "policy_time_end_1": policy_time_end_1
    }, function(res) {
      /*optional stuff to do after success */
      alert(res.mes);
    });
  }

}
