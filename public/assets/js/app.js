// window.getJSON = function(obj) {
//     this.console.log()
// }



// $.getJSON("/articles", function(data) {
//   for (var i = 0; i < data.length; i++) {
    
//   }
// })

// var request = new XMLHttpRequest();
// request.open('GET', '/my/url', true);

// request.onload = function() {
//   if (this.status >= 200 && this.status < 400) {
//     // Success!
//     var data = JSON.parse(this.response);
//   } else {
//     // We reached our target server, but it returned an error

//   }
// };

// request.onerror = function() {
//   // There was a connection error of some sort
// };

// request.send();

$(document).on("click", "#addComment", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id")

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#comments").append("<textarea id='commentInput' name='body'></textarea>")
    $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

    if (data.comment) {
      // Place the body of the note in the body textarea
      $("#commentInput").val(data.comment.body);
    }
  });
});