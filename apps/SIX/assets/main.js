$(document).ready(function() {
   $('select').material_select();
   $('.scrollspy').scrollSpy();
   $('.tooltipped').tooltip({delay: 100});
});

scheda.init('6-sched');

window.onbeforeunload = function() {
    return 'Changes you made may not be saved.';
};

// Variables
var add = $('#add-class');

// Back-End
var addfxn = function() {
   var course = $('#course-title'),
       section = $('#course-section'),
       time, log,
       room = $('#course-rm').val(),
       days = $('.days'),
       days_str = '',
       color = $('#course-color').val();

if ($('.days:checked').length == 0) {
   Materialize.toast('Please check at least one class day.', 4000);
} else {
   for (i=0; i < days.length; i++) {
      if (days[i].checked) {
         days_str += days[i].getAttribute('id');
      }
   }
   // Process
   if (course.val().length < 2 || section.val().length == 0) {
      Materialize.toast('Please enter your information properly.', 4000);
   } else {
      // Fillers
      if (room.length == 0) {
         room = 'TBA';
      }
      time = $('#from-hh').val() + ':' + $('#from-mm').val() + '-' + $('#to-hh').val() + ':' + $('#to-mm').val();

      if (color == 'rand') {
         id = scheda.drawCourse(days_str, time, course.val(), section.val(), room);
      } else {
         id = scheda.drawCourse(days_str, time, course.val(), section.val(), room, color);
      }
      Materialize.toast("Class succesfully added!", 4000);
      clearForm();

      // Update Log
      $('#class-list').html('');
      log = scheda.getHistory();
      // Write to Table
      for (i=0; i < log.length; i++) {
         var c_title = log[i]['args'][2],
             c_sec = log[i]['args'][3],
             c_time = log[i]['args'][1],
             c_day = log[i]['args'][0],
             c_rm = log[i]['args'][4],
             c_id = log[i]['id'], c_color;

         if (log[i]['args'].length == 6) {
            c_color = log[i]['args'][5];
         } else {
            c_color = '#dfdfdf';
         }

         $('#class-list').append('<tr id="' + c_id + '"><td>' + c_title + '<div class="color-pre" style="background-color:' + c_color + '"></div></td><td>' + c_sec + '</td><td>' + c_rm + '</td><td>' + c_time + ' ' + c_day + '</td><td><a class="btn btn-floating red darken-4 waves-effect waves-light table" onClick="ifEmpty();scheda.remove(\'' + c_id + '\');$(\'#' + c_id + '\').remove();Materialize.toast(\'Class successfully deleted!\', 4000);"><img src="assets/clear.svg" class="table"></a><a class="btn btn-floating red darken-4 waves-effect waves-light table"  href="#edit-class" onClick="Materialize.toast(\'Please edit fields.\', 4000);editCourse(\'' + c_title + '\',\'' + c_sec + '\',\'' + c_rm + '\');ifEmpty();scheda.remove(\'' + c_id + '\');$(\'#' + c_id + '\').remove();"><img src="assets/edit.svg" class="table"></a></td></tr>').fadeIn();
      }
   }
}
};

var ifEmpty = function() {
   if (scheda.getHistory().length == 1) {
      $('#class-list').html('<td colspan="5" class="center disabled">No entries</td>');
   }
};

// Color Setter
scheda.setConfig({ // Default Values
   bgColor: "#ffffff",
   timeColumnWidth: 60,
   time: {font: "sans-serif"},
   day: {font: "sans-serif"},
   sched: {font: "sans-serif", size: 12}
});

scheda.setConfig({
   headerBgColor: "#b71c1c",
   miniGridColor: "#F7E8E8",
   hMainGridColor: "#E9BABA",
   vMainGridColor: "#E9BABA",
   time: {bgColor: "#b71c1c"}
});

$('#colors').change(function() {
   var val = $('#colors option:selected').val();
   // scheda.repaint();

   switch (val) {
      case 'red':
         scheda.setConfig({
            headerBgColor: "#b71c1c",
            miniGridColor: "#F7E8E8",
            hMainGridColor: "#E9BABA",
            vMainGridColor: "#E9BABA",
            time: {bgColor: "#b71c1c"}
         });
         break;
      case 'mnBlue':
         scheda.setConfig({
            headerBgColor: "#2C3E50",
            miniGridColor: "#E9EBED",
            hMainGridColor: "#BFC5CA",
            vMainGridColor: "#BFC5CA",
            time: {bgColor: "#2C3E50"}
         });
         break;
      case 'teal':
         scheda.setConfig({
            headerBgColor: "#1ABC9C",
            miniGridColor: "#E8F8F5",
            hMainGridColor: "#BAEAE1",
            vMainGridColor: "#BAEAE1",
            time: {bgColor: "#1ABC9C"}
         });
         break;
      case 'blue':
         scheda.setConfig({
            headerBgColor: "#2980B9",
            miniGridColor: "#E9F2F8",
            hMainGridColor: "#BED8EA",
            vMainGridColor: "#BED8EA",
            time: {bgColor: "#2980B9"}
         });
         break;
      case 'lavender':
         scheda.setConfig({
            headerBgColor: "#8D44AD",
            miniGridColor: "#F3ECF6",
            hMainGridColor: "#DCC6E6",
            vMainGridColor: "#DCC6E6",
            time: {bgColor: "#8D44AD"}
         });
         break;
      case 'orange':
         scheda.setConfig({
            headerBgColor: "#FF6F00",
            miniGridColor: "#FFF0E5",
            hMainGridColor: "#FFC599",
            vMainGridColor: "#FFC599",
            time: {bgColor: "#FF6F00"}
         });
         break;
      case 'charcoal':
         scheda.setConfig({
            headerBgColor: "#424242",
            miniGridColor: "#ECECEC",
            hMainGridColor: "#B3B3B3",
            vMainGridColor: "#B3B3B3",
            time: {bgColor: "#424242"}
         });
         break;
   }
});

// Clear Elements
var clearForm = function() {
   $('.days').attr('checked', false);
   $('#course-title').val('');
   $('label[for="course-title"]').removeClass('active');
   $('#course-section').val('');
   $('label[for="course-section"]').removeClass('active');
   $('#course-rm').val('');
   $('label[for="course-rm"]').removeClass('active');
}

// Edit
var editCourse = function(c_title, c_sec, c_rm) {
   $('label[for="course-title"]').addClass('active');
   $('#course-title').val(c_title);

   $('label[for="course-section"]').addClass('active');
   $('#course-section').val(c_sec);

   $('label[for="course-rm"]').addClass('active');
   $('#course-rm').val(c_rm);

};
