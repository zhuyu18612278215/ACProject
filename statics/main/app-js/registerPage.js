var url = window.location.origin;

$('#register').submit(function(event) {
  /* Act on the event */
  var fname = false;
  var fpass = false;
  var frepass = false;
  //账户名验证
  var username = $('#username').val();
  var reg = /^\w{6,18}$/;
  if (reg.test(username)) {
    fname = true;
    $('#alert-div').hide();
    $('#alert').text("");
  } else {
    // "{% trans '用户名应为6-18位的数字,字母,下划线' %}"
    $('#alert').text(pageWords.usernameAlertInfo);
    $('#alert-div').show();
    fname = false;
  }
  if (fname) {
    //密码格式
    var password = $('#password').val();
    var reg = /^[\w\!\@\#\$\%\^\&\*\(\)\.\-\=\+\/\,\'\"\;\:\`\~\|\\\{\}\[\]\<\>\?]{6,18}$/;
    if (reg.test(password)) {
      fpass = true;
      $('#alert-div').hide();
      $('#alert').text("");
    } else {
      // "{% trans '密码长度应为6-18位' %}"
      $('#alert').text(pageWords.passwdAlertInfo);
      $('#alert-div').show();
      fpass = false;
    }
  }
  if (fname && fpass) {
    //重复密码
    var passwordconfirm = $('#passwordconfirm').val();
    var password = $('#password').val();
    if (passwordconfirm === password && passwordconfirm.length >= 6 && passwordconfirm.length <= 18) {
      frepass = true;
      $('#alert-div').hide();
      $('#alert').text("");
    } else if (passwordconfirm !== password) {
      // "{% trans '两次输入的密码不一致' %}"
      $('#alert').text(pageWords.passwdTwiceInputErrorInfo);
      $('#alert-div').show();
      frepass = false;
    } else {
      // "{% trans '密码长度应为6-18位' %}"
      $('#alert').text(pageWords.passwdAlertInfo);
      $('#alert-div').show();
      frepass = false;
    }
  }
  if (fname && fpass && frepass) {
    // pass
  } else {
    event.preventDefault();
  }
});

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
  var modes = 0;
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
  var Modes = 0;
  for (i = 0; i < sPW.length; i++) {
    //密码模式
    Modes |= CharMode(sPW.charCodeAt(i));
  }
  return bitTotal(Modes);
}

//显示颜色
function pwStrength(pwd) {
  var Dfault_color = "#eeeeee"; //默认颜色
  var L_color = "#FF0000"; //低强度的颜色，且只显示在最左边的单元格中
  var M_color = "#FF9900"; //中等强度的颜色，且只显示在左边两个单元格中
  var H_color = "#33CC00"; //高强度的颜色，三个单元格都显示
  if (pwd === null || $.trim(pwd) === '') {
    Lcolor = Mcolor = Hcolor = Dfault_color;
  } else {
    var S_level = checkStrong(pwd);
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
