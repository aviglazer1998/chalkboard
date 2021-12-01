$('.check input:checkbox').click(function () {
  $('.check input:checkbox').not(this).prop('checked', false);
});
