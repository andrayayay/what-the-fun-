var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/favorites", function(req, res) {
    db.Favorites.findAll({}).then(function(favs) {
      res.render("index", {
        msg: "These are your favorite events!",
        examples: favs
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Favorites.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });

  app.post("/api/create", (req,res)=>{
    res.render(req.body[1]);
    console.log("This is req.body on htmlRoutes.js: " + req.body[1].category);
  })
};
