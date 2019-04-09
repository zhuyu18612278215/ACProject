var url = window.location.origin;


$('#goBackLogin').on('click', goBackLogin);
$('#reSendCheckMail').on('click', reSendCheckMail);


function goBackLogin() {
  // body...
  // "{% url 'login' %}"
  window.location.href = `${ url }/login/`;
}

function reSendCheckMail() {
  // body...
  $.post(`${ url }/reSendCheckMail/`, {
    username: username,
  }, function(ret) {
    /*optional stuff to do after success */
    alert(ret.info);
    if (ret.type === 'success') {
      window.location.href = `${ url }/login/`;
    }
  });
}
