function check_custom_input_int(id) {
  // body...
  var val = $.trim($(`#${id}`).val());
  if (val === 0 || val === '0') {
    return false;
  } else {
    var reg = /^\d+$/;
    return reg.test(val);
  }
}

function check_custom_input_type(type_id, val_id) {
  // body...
  var type = $.trim($(`#${type_id}`).val());
  var val = $.trim($(`#${val_id}`).val());
  if (type === '1') {
    var reg = /^[1-5]?[0-9]$/;
    return {
      'type': type,
      res: reg.test(val)
    };
  } else if (type === '60') {
    var reg = /^(([1]?[0-9])|(2[0-3]))$/;
    return {
      'type': type,
      res: reg.test(val)
    };
  } else {
    return {
      'type': type,
      res: true,
    }
  }
}
