$('#myList a').on('click', function (e) {
	e.preventDefault();
	$('#myList a').removeClass("active");
	$(this).addClass("active");
	$(this).tab('show');
});