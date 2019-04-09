var db = require("../models");
var moment = require("moment");

module.exports = function (app) {
  // Get all examples
  
  app.get("/api/favorites", function (req, res) {
    db.Favorites.findAll().then(function (results) {
      res.json(results);
    });
  });

  app.get("/api/favorites/:userID", function (req, res) {
    var userID = req.params.userID;
    // console.log("id", userID);
    db.Favorites.findAll({
      where: {
        userID: userID
      }
    }).then(function(favs) {
      var favsArr = [];
      favs.forEach(el => {
        // console.log("API request", el.dataValues);
        favsArr.push(el);
      });
      res.json(favsArr);
    });
  });

  // Create a new example
  app.post("/api/create", function (req, res) {
    // console.log("This is req.body on apiRoutes.js: ", req.body);
    db.Favorites.create({
      title: req.body.title,
      eventDate: req.body.date,
      address: req.body.strAddr,
      username: req.body.username,
      userID: req.body.userID,
      placeId: req.body.place_id,
      startTime: moment(req.body.start).format("HH:mm:ss"),
      timeZone: req.body.timezone,
      eventID: req.body.id
    }).then(function (favs) {
      // console.log("This is the result: ", favs);
      res.json(favs);
      // console.log(req.body);
    });
  });

  // Delete an example by id
  app.delete("/api/delete/:userID&:eventID", function (req, res) {
    // console.log("*********************************** THIS IS WORKING");
    
    var userID = req.params.userID;
    var eventID = req.params.eventID;
    

    db.Favorites.destroy({
      where: {
        userID: userID,
        eventID: eventID
      }
    }).then(function (results) {
      res.json(results);
      // console.log(userID);
      // console.log(eventID);
    });
  });

};
