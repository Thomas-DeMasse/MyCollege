$( function() {
  const currentYear = new Date().getFullYear();
  $( "#datepicker" ).datepicker({
    changeMonth: true,
    changeYear: true,
    minDate: new Date(2000, 0, 1),
    yearRange: '2000:' + currentYear
  });
});

function removeallaccordiotitems() {
// description: remove all the accordion items in the screen
// will be useful if date picker changes
$("#accordionExample").empty();
}