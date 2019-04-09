var url = window.location.origin;
var ap_table_url = `/ap/ap_customer/customer_table/`;
var non_table_url = `/nonoperate/nonoperate_customer/nonoperate_customer_table/`;
var own_url;

function create_button(type) {
  // body...
  var button_div = (
    `<div>
      <button class = 'btn btn-default btn-xs' id='customer_type_all'>${button_word['all']}</button>
      <button class = 'btn btn-default btn-xs' id='customer_type_2G'>${button_word['2G']}</button>
      <button class = 'btn btn-default btn-xs' id='customer_type_5G'>${button_word['5G']}</button>
    </div>`
  );
  if (type === 'ap') {
    own_url = ap_table_url;
  } else if (type === 'non') {
    own_url = non_table_url;
  }

  $('.customer_type').html(button_div);
  $('#customer_type_all').addClass('active');

  $('#customer_type_all').click(active_all);
  $('#customer_type_2G').click(active_2G);
  $('#customer_type_5G').click(active_5G);
};

function active_all(type) {
  // body...
  $('#customer_type_all').addClass('active');
  $('#customer_type_2G').removeClass('active');
  $('#customer_type_5G').removeClass('active');
  oTable.ajax.url(`${own_url}?customer_type=all`).load();
}

function active_2G() {
  // body...
  $('#customer_type_all').removeClass('active');
  $('#customer_type_2G').addClass('active');
  $('#customer_type_5G').removeClass('active');
  oTable.ajax.url(`${own_url}?customer_type=2G`).load();
}

function active_5G() {
  // body...
  $('#customer_type_all').removeClass('active');
  $('#customer_type_2G').removeClass('active');
  $('#customer_type_5G').addClass('active');
  oTable.ajax.url(`${own_url}?customer_type=5G`).load();
}
