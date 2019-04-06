var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/favorites", function(req, res) {
    db.Favorites.findAll({}).then(function(favs) {
      res.json(favs);
      console.log(res.body);
    });
  });

  // Create a new example
  app.post("/api/create", function(req, res) {
    console.log("This is req.body on apiRoutes.js: ", req.body);
    db.Favorites.create({
      title: req.body.title,
      eventDate: req.body.date,
      address: req.body.location,
      placeId: req.body.place_id,
      startTime: req.body.start,
      timeZone: req.body.timezone,
      eventID: req.body.id
      
    }).then(function(favs) {
      console.log("This is the result: " , favs);
      res.json(favs);
      // console.log(req.body);
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
