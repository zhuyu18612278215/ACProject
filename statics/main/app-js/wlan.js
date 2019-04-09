$('.passwd-eye').click(function(event) {
  /* Act on the event */
  let input = $(this).parent().parent().find('input');
  if ($(this).hasClass('fa-eye-slash')) {
    $(this).removeClass('fa-eye-slash').addClass('fa-eye');
    input.prop('type', 'text');
  } else {
    $(this).removeClass('fa-eye').addClass('fa-eye-slash');
    input.prop('type', 'password');
  }
});
