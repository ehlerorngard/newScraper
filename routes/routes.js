var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

var db = require("../models");

module.exports = function(app) {
// ===============================
// ======= routes for views ======
// ===============================
	app.get("/", function (req, res) {
		res.render('home');
	});
	app.get("/viewsavedhome", function (req, res) {
		res.redirect('/');
	});
	app.get("/home", function (req, res) {
		res.redirect('/');
	});
	app.get("/saved", function (req, res) {
		res.redirect('/viewsaved');
	});
	app.get("/viewsavedsaved", function (req, res) {
		res.redirect('/viewsaved');
	});
	app.get("/viewsaved", function(req, res) {
		db.Article.find({}).then(function(allarticles) {
			console.log(allarticles)
			const objet = { artz: allarticles }
			res.render("saved", objet);
		}).catch(function(err) {
    		res.json(err);
  		});
	});
	app.post("/viewnotes", function(req, res) {
		console.log("VIEWING NOTES req.body \n", req.body);
		console.log("VIEW.. req.body.id \n", req.body.id);
		db.Article.find({ _id: req.body.id }) //.populate("note")
		.then(function(notas) {
			console.log("VIEWING NOTES the full native array: ", notas);
			res.json(notas);
		}).catch(function(err) {
			console.log("found an error", err);
			res.json(err)
		});
	});
	app.post("/getnotes", function(req, res) {
		console.log("this is req.body.ids: \n", req.body.ids);
		const theMail = [];
		for (let i = 0; i < req.body.ids.length; i++) {
			db.Note.find({ _id: req.body.ids[i] }, {})
			.then(function(delivery) {
				console.log("this is the note bunch ARRAY that came back: \n", delivery);
				theMail.push(delivery);
				res.send(theMail);

			});
		}
		console.log("this is theMAIL: ", theMail);
	});

// ===============================
// ======= scrape NPR ============
// ===============================
	app.get("/scrape/npr", function (req, res) {
	  // First, we grab the body of the html with request
	 axios.get("https://www.npr.org/sections/news/").then(function(response) {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	   const $ = cheerio.load(response.data);

	   const bundle = {
	   	articulos: []
	   };

	    // Now, we grab every h2 within an article tag, and do the following:
	   $("h2.title").each(function(i, element) {
	      const result = {};

	      result.title = $(this)
	        .children("a")
	        .text();
	      result.link = $(this)
	        .children("a")
	        .attr("href");
	      
	      bundle.articulos.push(result);
	   });

	   // console.log("here's the scraped object: " + JSON.stringify(bundle));

		res.send(bundle.articulos);
		// res.render('articles', bundle);
	 });

	});

// ===============================
// ======= save an article =======
// ===============================
	app.post("/save", function(req, res) {
		console.log("SAVE REQUEST req.body is \n", req.body);
		db.Article.create(req.body)
      	.then(function(newArti) {
          // View the added result in the console
         	console.log(newArti);
      	}).catch(function(err) {
          // If an error occurred, send it to the client
         	return console.log(err);
      	});
      console.log("article saved");
      // res.redirect("/");
      res.json("saved");
	});

// ===============================
// ========= create note =========
// ===============================
	app.post("/createnote/:id", function(req, res) {
		console.log("this is req.body yet to be SAVED: ", req.body);
		db.Note.create(req.body).then(function(newNote) {
			console.log("here's the new NOTE SUCCESSfully created: ", newNote);
			console.log("newNote._id about to be pushed is THIS: ", newNote._id); 
			const arrnote = {key: newNote._id};
			const newn = [newNote._id];
			console.log("article number to be sought ", req.params.id);
			db.Article.update(
				{_id: req.params.id },
				{ $push: {note: newNote._id} },
				{ new: true }
			).then(function(devolucion) {
				console.log("here's what came back from the ARTICLE find and update: ", devolucion);
			});
		}).then(function(dev) {
			console.log("idk what this should be... getBack from creating the note? ", devol);
			res.json();
		}).catch(function(err) {
			return res.json(err);
		});
	});

	app.post("/createfirst/:id", function(req, res) {
		console.log("this is req.body yet to be SAVED: ", req.body);
		db.Note.create(req.body).then(function(newNote) {
			console.log("here's the new NOTE SUCCESSfully created: ", newNote);
			console.log("newNote._id about to be pushed is THIS: ", newNote._id); 
			const arrnote = {key: newNote._id};
			const newn = [newNote._id];
			db.Article.findOneAndUpdate(
				{_id: req.params.id },
				{ $set: {note: newNote._id} },
				{ new: true }
			).then(function(devolucion) {
				console.log("here's what came back from the ARTICLE find and update: ", devolucion);
			});
		}).then(function(dev) {
			console.log("idk what this should be... getBack from creating the note? ", devol);
			res.json();
		}).catch(function(err) {
			return res.json(err);
		});
	});


// ===============================
// ========= update note =========
// ===============================
	app.post("/updatenote", function(req, res) {
		db.Note.findOneAndUpdate(
			{_id: req.body._id}, 
			{ $set: { title: req.body.title, corpus: req.body.corpus } }, 
			{ new: true })
		.then(function(result) {
	   	console.log("This should be the new UPDATED note: " + result);
	   	res.json(result); })
		.catch(function(err) {
	  		res.json(err); 
	  	});
	});

// ===============================
// ========= delete note =========
// ===============================
	app.post("/deletenote", function(req, res) {
		console.log("IMPORTANT_  the req.body \n", req.body);
		db.Note.findByIdAndRemove(req.body.note_id)
		.then(function(result) {
	   	console.log("Note DELETED: " + result);
	   	db.Article.findOneAndUpdate(
	   		{ _id: req.body.article_id },
	   		{ $pull: {note: req.body.note_id} },
	   		{ new: true }
	   	).then(function(output) {
	   		console.log("ARTICLE after the article update: ", output);
	   	}).catch(function(err) {res.json(err);});
	   	res.json(result); })
		.catch(function(err) {
	  		res.json(err); 
	  	});
	});

// ===============================
// ====== unsave article =========
// ===============================

}