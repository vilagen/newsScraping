$(document).on("click", ".addComment", function() {
  let thisId = $(this).attr("data-id");
  $(`#${thisId}`).empty()

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then((data) => {
      console.log(data)
      
      commentText = $(`<div class="input-group my-3"><div class="input-group-prepend"></div><textarea class="form-control" id=comment_${thisId} aria-label="With textarea"></textarea></div>`)
      commentSave = $(`<button class='btn btn-primary m-2 text-center commentSave' data-id= '${thisId}' name='submit'>Save Comment</button>`)
      // clear textarea
      commentClear = $(`<button class='btn btn-primary m-2 text-center commentClear' data-id= '${thisId}' name='submit'>Clear Comment</button>`)

      $(`#${thisId}`).append(commentText)
      $(`#${thisId}`).append(commentSave)
      $(`#${thisId}`).append(commentClear)
  })
})

$(document).on("click", "#scrubArticles", () => {
    $.get("/scrape", (data) => {
    alert("Data Scrubbed!")
    location.reload()
  })
})

$(document).on("click", ".commentSave", function() {
  let thisId = $(this).attr("data-id");
  let body = $(`#comment_${thisId}`).val()
  console.log(thisId)
  console.log(body)
  // updating information to database
    $.ajax({
      method:"POST",
      url:"/articles/" + thisId,
      datatype: "html",
      data: {
        body: body
      },
      error: (error) => {
        if (error) throw "Error deleting article " + error;
      },
      success: (data) => {
        $(`#showComment_${thisId}`).text(body);
        $(`#${thisId}`).empty()
      }
    })
})

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
      $(`#container_${thisId}`).empty();
    }
  }).then((data) => {
    console.log(data)
  })
})

$(document).on("click", ".commentClear", function() {
  let thisId = $(this).attr("data-id");
  $(`#${thisId}`).empty()
});

  // was trying to only update Note if one existed instead of

  // if ($(`#showComment_${thisId}`).val() === "") {
  //   $.ajax({
  //     method:"PUT",
  //     url:"/articles/" + thisId,
  //     datatype: "html",
  //     data: {
  //       body: body
  //     },
  //     error: (error) => {
  //       if (error) throw "Error deleting article " + error;
  //     },
  //     success: (data) => {
  //       $(`#showComment_${thisId}`).text(body);
  //       $(`#${thisId}`).empty()
  //     }
  //   })
  // } else {