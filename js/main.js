$(document).ready(function() {
	$('.button-collapse').sideNav();
	$('.parallax').parallax();
	$('.tooltipped').tooltip({delay: 500});
	$('.scrollspy').scrollSpy();
	$('.modal-trigger').leanModal();

	$('.work-grid').height($('.work-grid').width());
	$('.work-grid img').height($('.work-grid').width());

	$(window).resize(function() {
		$('.work-grid').height($('.work-grid').width());
		$('.work-grid img').height($('.work-grid').width());
	});
});

$(window).load(function() {
	$('body').addClass('loaded');
});

var form = $('#gform');
form.submit(function(event){
	event.preventDefault();
	var status = $('#status');
	if ($('#usrname').val() !== '' && $('#phone').val() !== '' && $('#comment-message').val() !== '' && $('#email').val() !== '') {
		$.ajax({
			method: "POST",
			data: form.serialize(),
			url: $(this).attr('action'),
			beforeSend: function(){
				status.append('<div class="preloader-wrapper active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>').fadeIn();
			}
		}).done(function(data){
			status.html('<i class="material-icons">check_circle</i>').delay(3000).fadeOut();
			Materialize.toast('<i class="material-icons" style="margin-right: 0.5em;">check_circle</i>Your message was successfully sent!', 4000);
			form.trigger('reset');
		});
	} else {
		Materialize.toast('<i class="material-icons" style="margin-right: 0.5em;">warning</i> Please fill out all the required fields.', 4000);
	}
});