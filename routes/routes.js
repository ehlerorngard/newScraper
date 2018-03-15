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
	app.get("/viewsaved", function(req, res) {
		db.Article.find({}).then(function(allarticles) {
			console.log(allarticles)
			const objet = { artz: allarticles }
			res.render("saved", objet);
		}).catch(function(err) {
    		res.json(err);
  		});
	});
	app.get("/viewnotes", function(req, res) {
		db.Article.find({ _id: req.body }).populate("note")
		.then(function(notas) {
			console.log(notas);
			let obj = { key: notas };
			console.log(obj);
			res.json(obj);
		}).catch(function(err) {
			res.json(err)
		});
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

		db.Article.create(req.body)
      	.then(function(dbArticle) {
          // View the added result in the console
         	console.log(dbArticle);
      	}).catch(function(err) {
          // If an error occurred, send it to the client
         	return res.json(err);
      	});
      console.log("article saved");
      // res.redirect("/");
      res.json("saved");
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
	   	console.log("This should be the new note: " + result);
	   	res.json(result); })
		.catch(function(err) {
	  		res.json(err); 
	  	});
	});
}


// ===============================
// ========= delete note =========
// ===============================

// ===============================
// ====== unsave article =========
// ===============================