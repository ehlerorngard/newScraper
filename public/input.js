$(document).on("click", "#home", function() {
   window.location.href = window.location.href + "home";
});

$(document).on("click", "#view_saved", function() {
   window.location.href = window.location.href + "saved";
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
	    	   	+ bundle[i].link + ">" + bundle[i].link + "</a></div><div class='col-2'><button class='save btn btn-dark'>save this article</button></div></div>");
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
	$(this).addClass("hide_saved");
	$(this).removeClass("save");
	$(this).parent().append("<div class='btn-success'>article saved</div>");

	console.log("this is the title of the button clicked: " 
		+ $(this).parent().parent().find("div.title").text())
	$.ajax({
		method: "POST",
		url: "/save",
		data: {
			title: $(this).parent().parent().find("div.title").text(),
			link: $(this).parent().parent().find("a.link").text()
		}
	}).then(function(data) {
		console.log("article SAVED.");
		// window.location.href = window.location.href + "viewsaved";
	});
});

$(document).on("click", ".view_notes", function() {
	console.log("view notes button works");
	console.log($(this).data("id"));

	const article_id = $(this).data("id");
	$(".modal-body").empty();
	$("#modal_title").empty();
	$("#modal_body").data("id", article_id);

	$.ajax({
		method: "POST",
		url: "/viewnotes",
		data: { id: article_id }
	}).then(function(result) {
		// put the data into the modal..
		console.log(typeof(result));
		console.log(result);
		const theGetback = result[0];
		console.log("just the object? ", theGetback);
		console.log("theGetback.note: \n", theGetback.note);
		console.log(typeof theGetback.note);
		if (typeof theGetback.note !== "array") {
			$(".save_notes").data("isArray", false);
		}
		if ((theGetback.note) && (typeof theGetback.note !== "array")) {
			theGetback.note = [theGetback.note];
		}
		if (theGetback.note) {
			$.ajax({
				method: "POST",
				url: "getnotes",
				data: { ids: theGetback.note }
			}).then(function(theReturn) {
				console.log("the result of the getnotes is an array: \n", theReturn);
				theReturn.forEach(function(element) {
					console.log("I know the note title: ", element.title);

					let htmlString = "<div class='row rowdal oldNote m-2 p-1'><input class='notle oldNotle m-1' id='title"
					+ element._id + "'><textarea class='nody oldNody m-1' id='corpus"
					+ element._id + "'></textarea><button class='delete btn btn-danger' data-id="
					+ element._id + ">delete</button></div>";
					$(".modal-body").append(htmlString);
					$("#title" + element._id).val(element.title);
					$("#corpus" + element._id).val(element.corpus);
					$("#modal_body").append("<div class='row rowdal m-2 p-1'>"
						+ "<input class='notle newNotle m-1' placeholder='enter new note title here'>"
						+ "<input class='nody newNody m-1' placeholder='enter new note here'></div>")
					console.log("here's the htmlstring: ", htmlString);
				});
			});
		}

		else {
			$(".modal-body").append("<div class='alert alert-primary'>no notes to display!</div>");
			$("#modal_body").append("<div class='row rowdal m-2 p-1'>"
				+ "<input class='notle newNotle m-1' placeholder='enter new note title here'>"
				+ "<input class='nody newNody m-1' placeholder='enter new note here'></div>")
		}
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
		console.log("note saved!", elm);
		$("#notes_modal").modal("hide");
		// location.reload();
	});
	$(".oldNote").each(function(i, element) {
		$.ajax({
			method: "POST",
			url: "/updatenote",
			data: {
				_id: $(this).children("button").data("id"),
				title: $(this).children(".notle").val().trim(),
				corpus: $(this).children(".nody").val().trim()
			}
		}).then(function(rez) {
			console.log("the rez of the update(s): \n", rez);
			$("#notes_modal").modal("hide");
		});
	});

});

$(document).on("click", ".delete", function() {
	const article_id = $(this).parent().parent().data('id');
	const note_id = $(this).data("id");
	$.ajax({
		mehtod: "POST",
		url: "/deletenote",
		data: {
			article_id: article_id,
			note_id: note_id
		}
	}).then(function(reception) {
		console.log("after DELETION ", reception);
	});
});