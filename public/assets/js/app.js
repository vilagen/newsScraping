// window.getJSON = function(obj) {
//     this.console.log()
// }





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

// $("#comments").append("<textarea id='commentInput' name='body'></textarea>")
// $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>")
// $("#comments").append("<button data-id='" + data._id + "' id='deleteArticle'>Delete Article</button>");

// $(document).on("click", "#addComment", function() {
//   $("#comments").empty();
//   let thisId = $(this).attr("data-id")
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   }).then(function(data) {
//     console.log(data);
//   });
// });

$(document).on("click", ".addComment", function() {
  let thisId = $(this).attr("data-id");
  $(`#${thisId}`).empty()
  console.log(thisId)

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then((data) => {
      console.log(data)
      commentText = $("<textarea id='userInput' name='body'></textarea>")
      $(`#${thisId}`).append(commentText)
  })
})

$(document).on("click", "#saveComment", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method:"POST",
    url:"/articles/" + thisId,
    data: {
      body: $("#test1").val().trim()
    }
  }).then(function(data){
    console.log(data);
    })
});

$(document).on("click", "#deleteArticle", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method:"DELETE",
    url:"/articles/" + thisId,
  }).then(function(data){
    console.log(data)
  })
})

$(document).on("click", "p", function() {
  $("#userComments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});