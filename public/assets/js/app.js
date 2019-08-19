// window.getJSON = function(obj) {
//     this.console.log()
// }

$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });


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