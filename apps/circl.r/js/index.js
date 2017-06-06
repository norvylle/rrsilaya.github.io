UIkit.modal("#setup-modal").toggle();

// Init Circular
$(window).on('load', () => {
	circular.init("circular", {
		title: {
			font: "Circular-Pro-Bold, sans-serif"
		},

		time: {
			font: "Circular-Pro-Book, sans-serif"
		}
	});

	$('#loader-wrapper').remove();
});

// Constants
const empty = "<tr><td colspan=\"3\">No classes added yet.</td></tr>";

// Fxns
disableEdits = () => {
	$('.uk-radio').attr('disabled', true);
	$('#sched-title').attr('disabled', true);
	$('#save-config').attr('disabled', true);
}

showInvalid = element => {
	const show = "uk-animation-shake uk-form-danger";

	element.addClass(show);
	setTimeout(() => {
		element.removeClass(show);
	}, 800);
}

getDays = () => {
	var checked = [];

	$('input:checked').each(function() {
		checked.push(parseInt($(this).attr('name')));
	});

	return checked;
}

checkFormValidity = () => {
	const courseTitle = $('#coursetitle').val(),
		days = getDays();
	var isValid = true;

	// Course Title
	if(courseTitle === '') {
		showInvalid($('#coursetitle'));
		isValid = false;
	}

	// Time
	if(
		(
			$('#start-hh').val() === $('#end-hh').val() &&
			parseInt($('#start-mm').val().substr(1, 2)) >= parseInt($('#end-mm').val().substr(1, 2))
		) ||
		(
			parseInt($('#start-hh').val()) > parseInt($('#end-hh').val())
		)
	) {
		showInvalid($('#end-hh'));
		showInvalid($('#end-mm'));
		isValid = false;
	}

	// Days
	if(days.length === 0) {
		showInvalid($('#days'));
		isValid = false;
	}

	return isValid;
}

resetForm = () => {
	$('#coursetitle').val('');
	$('#section').val('');
	$('#room').val('');

	$('input[type=checkbox]:checked').each(function() {
		$(this).prop('checked', false);
	});
}

addSubjectToTable = (uuid, title, section) => {
	const subject = `
		<tr>
			<td>
				${title} ${section}
			</td>
			<td class="uk-text-center">
				<a href="#" uk-icon="icon: trash" class="remove-class" id="${uuid}"></a>
			</td>
		</tr>
	`;

	if(circular.getSubjects().length === 1) {
		$('tbody').html(subject);
	} else {
		$('tbody').append(subject);
	}

	$('#' + uuid).click(e => {
		e.preventDefault();
		deleteClass(uuid);
	});
}

deleteClass = uuid => {
	$('#' + uuid).parent().parent().remove();
	circular.rmSubject(uuid);

	if(circular.getSubjects().length === 0)
		$('tbody').html(empty);
}


// Listeners
$('#showControls').click(e => {
	e.preventDefault();
	UIkit.offcanvas('#controls').toggle();
});

$('#download').click(e => {
	e.preventDefault();
	circular.download();
});

$('#add-class').click(e => {
	e.preventDefault();

	if(checkFormValidity()) {
		const uuid = circular.addCourse(
			getDays(),
			$('#start-hh').val() + $('#start-mm').val() + "-" + $('#end-hh').val() + $('#end-mm').val(),
			$('#coursetitle').val(),
			$('#section').val(),
			$('#room').val()
		);

		addSubjectToTable(uuid, $('#coursetitle').val(), $('#section').val());
		resetForm();

		UIkit.notification("Successfully added class.");
	}
});

$('#credits').click(e => {
	e.preventDefault();
	UIkit.modal("#setup-modal").toggle();
})

$('#save-config').click(e => {
	e.preventDefault();

	if(!$('#save-config').attr('disabled')) {
		circular.init("circular", {
			label: $("#sched-title").val() || "My Schedule",
			hasEdge: JSON.parse($("input[name=theme]:checked").val()),
			invertedDays: JSON.parse($("input[name=inversion]:checked").val())
		});

		disableEdits();

		UIkit.modal("#setup-modal").toggle();
	}
});