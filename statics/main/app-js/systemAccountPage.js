var url = window.location.origin;

$('#language-submit').click(function() {
  let language = $('#language-select').val();
  console.log(language);
  $.post(`${ url }/system/account/language/`, {
    language: language
  }, function(ret) {
    // alert(ret);
    window.location.reload();
  });
});

var stack_bar_top = {
  "dir1": "down",
  "dir2": "right",
  "push": "top",
  "spacing1": 0,
  "spacing2": 0
};
$('#position-4-success').click(function() {
  var errors = $(this).attr('data-a');
  var notice = new PNotify({
    title: pageWords.promptInfo,
    text: errors,
    type: 'success',
    addclass: 'stack-bar-top',
    stack: stack_bar_top,
    width: "100%"
  });
});
$('#position-4-error').click(function() {
  var errors = $(this).attr('data-a');
  var notice = new PNotify({
    title: pageWords.promptInfo,
    text: errors,
    type: 'error',
    addclass: 'stack-bar-top',
    stack: stack_bar_top,
    width: "100%"
  });
});

(function($) {

  'use strict';

  var datatableInit = function() {

    $('#datatable-default-2').DataTable({
      "pagingType": "simple_numbers",
      "processing": true,
      "searching": true,
      "autoWidth": true,
      "deferRender": true,
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
    });

  };
  $(function() {
    datatableInit();
  });
}).apply(this, [jQuery]);

function ajaxfunc() {
  // bk-bg-danger
  // console.log(value);
  $('#open_form').click();
}

function create_area() {
  // bk-bg-danger
  // console.log(value);
  $('#open_form_1').click();
}

function add_area() {
  // bk-bg-danger
  // console.log(value);
  $('#open_form_2').click();
}

function invite_user() {
  // bk-bg-danger
  // console.log(value);
  $('#open_form_3').click();
}

function user_modify_ajax(value) {
  $('#open_form_4').click();
  // "{% url 'user_modify' %}?username=" + value
  $.getJSON(`${ url }/system_account/user_modify/?username=${ value }`, function(ret) {
    $('#user_permission').val(ret.administrator_permission);
    $('#user_id').val(ret.id);
    $('#user_language').val(ret.language);
    $('#user_username').val(ret.username);
    if (String(ret.email_alert) === '0') {
      $('#user_email_alert').removeAttr('checked', 'checked');
    }
    if (String(ret.email_alert) === '1') {
      $('#user_email_alert').attr('checked', 'checked');
    }
    $('#user_email').val(ret.email);
  })
}

function reg_modify_ajax(value) {
  $('#open_form_5').click();
  // "{% url 'user_modify' %}?username=" + value
  $.getJSON(`${ url }/system_account/user_modify/?username=${ value }`, function(ret) {
    $('#reg_permission').val(ret.administrator_permission);
    $('#reg_id').val(ret.id);
    $('#reg_username').val(ret.username);
  })
}

// 判断是否显示
function pwd_strong(value) {
  // console.log(value);
  if ($.trim(value) === "") {
    $('#pwd_strong').hide();
  } else {
    $('#pwd_strong').show();
  }
}
//判断输入密码的类型
function CharMode(iN) {
  if (iN >= 48 && iN <= 57) //数字
    return 1;
  if (iN >= 65 && iN <= 90) //大写
    return 2;
  if (iN >= 97 && iN <= 122) //小写
    return 4;
  else
    return 8;
}
//bitTotal函数
//计算密码模式
function bitTotal(num) {
  modes = 0;
  for (i = 0; i < 4; i++) {
    if (num & 1) modes++;
    num >>>= 1;
  }
  return modes;
}
//返回强度级别
function checkStrong(sPW) {
  if (sPW.length < 6)
    return 0; //密码太短，不检测级别
  Modes = 0;
  for (i = 0; i < sPW.length; i++) {
    //密码模式
    Modes |= CharMode(sPW.charCodeAt(i));
  }
  return bitTotal(Modes);
}

//显示颜色
function pwStrength(pwd) {
  Dfault_color = "#eeeeee"; //默认颜色
  L_color = "#FF0000"; //低强度的颜色，且只显示在最左边的单元格中
  M_color = "#FF9900"; //中等强度的颜色，且只显示在左边两个单元格中
  H_color = "#33CC00"; //高强度的颜色，三个单元格都显示
  if (pwd == null || $.trim(pwd) == '') {
    Lcolor = Mcolor = Hcolor = Dfault_color;
  } else {
    S_level = checkStrong(pwd);
    switch (S_level) {
      case 0:
        Lcolor = Mcolor = Hcolor = Dfault_color;
        break;
      case 1:
        Lcolor = L_color;
        Mcolor = Hcolor = Dfault_color;
        break;
      case 2:
        Lcolor = Mcolor = M_color;
        Hcolor = Dfault_color;
        break;
      default:
        Lcolor = Mcolor = Hcolor = H_color;
    }
  }
  document.getElementById("strength_L").style.background = Lcolor;
  document.getElementById("strength_M").style.background = Mcolor;
  document.getElementById("strength_H").style.background = Hcolor;
  return;
}

$('#change_password_button').click(function(event) {
  /* Act on the event */
  var old_passwd = $.trim($('#old_passwd').val());
  var new_passwd = $.trim($('#new_passwd').val());
  var again_passwd = $.trim($('#again_passwd').val());
  var reg = /^[\w\!\@\#\$\%\^\&\*\(\)\.\-\=\+\/\,\'\"\;\:\`\~\|\\\{\}\[\]\<\>\?]{6,18}$/;
  if (old_passwd.length === 0 || new_passwd.length === 0 || again_passwd.length === 0) {
    alert(pageWords.passwdInputEmptyError);
  } else if (!reg.test(new_passwd) || !reg.test(again_passwd)) {
    alert(pageWords.passwdInputError);
  } else if (new_passwd !== again_passwd) {
    alert(pageWords.passwdNotSameError);
  } else {
    // "{% url 'passwd_change' %}"
    $.post(`${ url }/system_account/passwd_change/`, {
      'old_passwd': old_passwd,
      'new_passwd': new_passwd,
      'again_passwd': again_passwd
    }, function(ret) {
      /*optional stuff to do after success */
      alert(ret.error_msg);
      location.reload();
    });
  }
});

$('#create_user_button').click(function(event) {
  /* Act on the event */
  var local_username = $.trim($('#local_username').val());
  var local_password = $.trim($('#local_password').val());
  var local_two_password = $.trim($('#local_two_password').val());
  var local_admin_password = $.trim($('#local_admin_password').val());
  var reg_user = /^\w{6,18}$/;
  var reg_pwd = /^[\w\!\@\#\$\%\^\&\*\(\)\.\-\=\+\/\,\'\"\;\:\`\~\|\\\{\}\[\]\<\>\?]{6,18}$/;
  if (!reg_user.test(local_username)) {
    alert(pageWords.usernameInputError);
  } else if (!reg_pwd.test(local_password) || !reg_pwd.test(local_two_password)) {
    alert(pageWords.passwdInputError);
  } else if (local_password !== local_two_password) {
    alert(pageWords.passwdNotSameError);
  } else if (local_admin_password.length === 0) {
    alert(pageWords.adminPasswdEmptyError);
  } else {
    // '{% url "create_user" %}'
    $.post(`${ url }/system_account/create_user/`, $('#create_user_form').serialize(), function(ret) {
      /*optional stuff to do after success */
      alert(ret.error_msg);
    });
  }
});

$('#user_fix_button').click(function(event) {
  /* Act on the event */
  var user_username = $.trim($('#user_username').val());
  var user_password = $.trim($('#user_password').val());
  var user_two_password = $.trim($('#user_two_password').val());
  var user_admin_password = $.trim($('#user_admin_password').val());
  var reg_user = /^\w{6,18}$/;
  var reg_pwd = /^[\w\!\@\#\$\%\^\&\*\(\)\.\-\=\+\/\,\'\"\;\:\`\~\|\\\{\}\[\]\<\>\?]{6,18}$/;
  if (!reg_user.test(user_username)) {
    alert(pageWords.usernameInputError);
  } else if (!reg_pwd.test(user_password) || !reg_pwd.test(user_two_password)) {
    alert(pageWords.passwdInputError);
  } else if (user_password !== user_two_password) {
    alert(pageWords.passwdNotSameError);
  } else if (user_admin_password.length === 0) {
    alert(pageWords.adminPasswdEmptyError);
  } else {
    // '{% url "change_user" %}'
    $.post(`${ url }/system_account/change_user/`, $('#user_fix_form').serialize(), function(ret) {
      /*optional stuff to do after success */
      alert(ret.error_msg);
    });
  }
});

// 判断是否显示
function pwd_strong_1(value) {
  // console.log(value);
  if ($.trim(value) === "") {
    $('#pwd_strong-1').hide();
  } else {
    $('#pwd_strong-1').show();
  }
}

//显示颜色
function pwStrength_1(pwd) {
  Dfault_color = "#eeeeee"; //默认颜色
  L_color = "#FF0000"; //低强度的颜色，且只显示在最左边的单元格中
  M_color = "#FF9900"; //中等强度的颜色，且只显示在左边两个单元格中
  H_color = "#33CC00"; //高强度的颜色，三个单元格都显示
  if (pwd == null || $.trim(pwd) == '') {
    Lcolor = Mcolor = Hcolor = Dfault_color;
  } else {
    S_level = checkStrong(pwd);
    switch (S_level) {
      case 0:
        Lcolor = Mcolor = Hcolor = Dfault_color;
        break;
      case 1:
        Lcolor = L_color;
        Mcolor = Hcolor = Dfault_color;
        break;
      case 2:
        Lcolor = Mcolor = M_color;
        Hcolor = Dfault_color;
        break;
      default:
        Lcolor = Mcolor = Hcolor = H_color;
    }
  }
  document.getElementById("strength_L-1").style.background = Lcolor;
  document.getElementById("strength_M-1").style.background = Mcolor;
  document.getElementById("strength_H-1").style.background = Hcolor;
  return;
}

// 判断是否显示
function pwd_strong_2(value) {
  // console.log(value);
  if ($.trim(value) == "") {
    $('#pwd_strong-2').hide();
  } else {
    $('#pwd_strong-2').show();
  }
}

//显示颜色
function pwStrength_2(pwd) {
  Dfault_color = "#eeeeee"; //默认颜色
  L_color = "#FF0000"; //低强度的颜色，且只显示在最左边的单元格中
  M_color = "#FF9900"; //中等强度的颜色，且只显示在左边两个单元格中
  H_color = "#33CC00"; //高强度的颜色，三个单元格都显示
  if (pwd == null || $.trim(pwd) == '') {
    Lcolor = Mcolor = Hcolor = Dfault_color;
  } else {
    S_level = checkStrong(pwd);
    switch (S_level) {
      case 0:
        Lcolor = Mcolor = Hcolor = Dfault_color;
        break;
      case 1:
        Lcolor = L_color;
        Mcolor = Hcolor = Dfault_color;
        break;
      case 2:
        Lcolor = Mcolor = M_color;
        Hcolor = Dfault_color;
        break;
      default:
        Lcolor = Mcolor = Hcolor = H_color;
    }
  }
  document.getElementById("strength_L-2").style.background = Lcolor;
  document.getElementById("strength_M-2").style.background = Mcolor;
  document.getElementById("strength_H-2").style.background = Hcolor;
  return;
}
