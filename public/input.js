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
	    	   $("#article_box9").append("<div class='row m-4 p-2 articleRow'><div class='col-9'><div class='title'>" + bundle[i].title + "</div><div class='link'>" + bundle[i].link + "</div></div><div class='col-2'><button class='save btn btn-dark' data-id=" + i + ">save this article</button></div></div>");
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
	// get the notes
	$.ajax({
		method: "GET",
		url: "/viewnotes",
		data: $(this).data("id")
	}).then(function(theGetback) {
		// put the data into the modal..
		console.log(typeof(theGetback));
		console.log(theGetback);

		theGetback.forEach(function() {
			let htmlString = "<div class='row rowdal'><span class='notle'>"
			+ title + "</span><span class='nody'>"
			+ link + "</span><button class='delete btn btn-warning' data-id="
			+ _id + ">X</button></div>";
			$(".modal-body").append(htmlString);
			console.log(htmlString);
		});
		$("#notes_modal").modal("show");
	})

});