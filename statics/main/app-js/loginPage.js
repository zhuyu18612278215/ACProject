var url = window.location.origin;

function language_change() {
  $('#language-submit').submit();
}
$("#next-captcha123").click(function() {
  // "{% url 'refresh-captcha' %}"
  $.getJSON(`${ url }/refresh-captcha/`, function(json) {
    // This should update your captcha image src and captcha hidden input
    // debugger;
    var status = json['status'];
    var new_cptch_key = json['new_cptch_key'];
    var new_cptch_image = json['new_cptch_image'];
    id_captcha_0 = $("#id_reg_captcha_0");
    img = $(".captcha");
    id_captcha_0.attr("value", new_cptch_key);
    img.attr("src", new_cptch_image);
  });
});
