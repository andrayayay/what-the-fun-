var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/favorites", function(req, res) {
    db.Favorites.findAll({}).then(function(favs) {
      res.json(favs);
      // console.log(res.body);
    });
  });

  // Create a new example
  app.post("/api/create", function(req, res) {
    console.log("This is req.body on apiRoutes.js: ", req.body);
    db.Favorites.create({
      userId: "1",
      username: "brielle",
      title: req.body[1].title,
      eventDate: req.body[1].date,
      address: req.body[1].strAddr,
      placeId: req.body[1].place_id,
      startTime: req.body[1].start,
      timeZone: req.body[1].timezone,
      eventID: req.body[1].id
    }).then(function(dbFavorites) {
      console.log("**************************              This is the result: ");
      //res.json(dbFavorites);

    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Favorites.destroy({ where: { id: req.params.id } }).then(function(
      favs
    ) {
      res.json(favs);
    });
  });
};
