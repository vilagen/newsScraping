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
      commentText = $(`<textarea id='comment_${thisId}' name='body'></textarea>`)
      commentSave = $(`<button class='commentSave' data-id= '${thisId}' name='submit'>Save Comment</button>`)
      // clear textarea
      commentClear = $(`<button class='commentClear' data-id= '${thisId}' name='submit'>Clear Comment</button>`)

      $(`#${thisId}`).append(commentText)
      $(`#${thisId}`).append(commentSave)
      $(`#${thisId}`).append(commentClear)
  })
})

$(document).on("click", ".commentSave", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method:"POST",
    url:"/articles/" + thisId,
    data: {
      body: $(`#comment_${thisId}`).val().trim()
    },
    error: (error) => {
      if (error) throw "Error deleting article " + error;
    },
    success: (data) => {
      $(`#container_${thisId}`).html(data);
    }
  }).then((data) => {
    console.log(data);
    })
});

$(document).on("click", ".deleteArticle", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method:"DELETE",
    url:"/articles/" + thisId,
    datatype: "html",
    error: (error) => {
      if (error) throw "Error deleting article " + error;
    },
    success: (data) => {
      $(`#container_${thisId}`).html(data);
    }
  }).then((data) => {
    console.log(data)
  })
})

$(document).on("click", ".commentClear", function() {
  let thisId = $(this).attr("data-id");
  $(`#${thisId}`).empty()
});