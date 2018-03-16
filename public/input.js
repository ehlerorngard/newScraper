$(document).on("click", "#home", function() {
	console.log("home button works");
	$.ajax({
   	method: "GET",
   	url: "/",
   }).then(function() {
   	console.log("ajax call completed");
   });
});


   $(document).on("click", "#npr", function() {
	console.log("npr button works");
	$.ajax({
   	method: "GET",
   	url: "/scrape/npr",
   })
   .then(function(bundle) {
   		$("#article_box9").empty();
   		console.log("box emptied...");
  			for (let i = 0; i < bundle.length; i++) {
  				console.log("this is iteration " + i);
	    	   $("#article_box9").append("<div class='row m-4 p-2 articleRow'><div class='col-9'><div class='title'>" 
	    	   	+ bundle[i].title + "</div><a class='link' href="
	    	   	+ bundle[i].link + ">" + bundle[i].link + "</div></div><div class='col-2'><button class='save btn btn-dark'>save this article</button></div></div>");
	    	}
	    	$.ajax({
	    		method: "GET",
	    		url: "/"
	    	});


	    	// window.location.href = path.join (__dirname, "/");
  	})
  	;

});

$(document).on("click", ".save", function() {
	console.log("save button works");
	// get the data to be sent to the database

	$(this).removeClass("save").addClass("view_saved");

	console.log("this is the title of the button clicked: " 
		+ $(this).parent().parent().find("div.title").text())
	$.ajax({
		method: "POST",
		url: "/save",
		data: {
			title: $(this).parent().parent().find("div.title").text(),
			link: $(this).parent().parent().find("div.link").text()
		}
	}).then(function(data) {
		window.location.href = window.location.href + "viewsaved";
	});
});

$(document).on("click", ".view_notes", function() {
	console.log("view notes button works");
	console.log($(this).data("id"));
	$(".modal-body").empty();
	$("#modal_title").empty();
	// get the notes
	$.ajax({
		method: "POST",
		url: "/viewnotes",
		data: { id: $(this).data("id") }
	}).then(function(result) {
		// put the data into the modal..
		console.log(typeof(result));
		console.log(result);
		const theGetback = result[0];
		console.log("just the object? ", theGetback);
		console.log("theGetback.note: \n", theGetback.note);
		if (theGetback.note) {

			for (let i = 0; i < theGetback.note.length; i++) {

			}

			$.ajax({
				method: "POST",
				url: "getnotes",
				data: { ids: theGetback.note }
			}).then(function(theReturn) {
				console.log("the result of the getnotes is an array: \n", theReturn);

			});

			theGetback.note.forEach(function(element) {
				console.log("I know the title: ", element.title);

				let htmlString = "<div class='row rowdal'><span class='notle'>"
				+ element.title + "</span><span class='nody'>"
				+ element.corpus + "</span><button class='delete btn btn-danger' data-id="
				+ theGetback._id + ">X</button></div>";
				$(".modal-body").append(htmlString);
				console.log("here's the htmlstring: ", htmlString);
			});
		}
		else {
			$(".modal-body").append("<div class='alert alert-primary'>no notes to display!</div>");
		}
		$("#modal_body").append("<div class='row rowdal m-2 p-1'>"
			+ "<input class='notle newNotle m-1' placeholder='enter new note title here'>"
			+ "<input class='nody newNody m-1' placeholder='enter new note here'></div>")
		$("#modal_title").append(" " + theGetback.title);
		$("#save_notes_button").data("id", theGetback._id);
		$("#notes_modal").modal("show");
	});
});

$(document).on("click", ".save_notes", function() {

	const article_id = $(this).data("id");

	$.ajax({
		method: "POST",
		url: "/createnote/" + article_id,
		data: {
			title: $('.newNotle').val().trim(),
			corpus: $('.newNody').val().trim()
		}
	}).then(function(elm) {
		console.log("note saved!");
		$("#notes_modal").modal("hide");
		location.reload();
	});
});