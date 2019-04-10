var db = require("../models");
var moment = require("moment");

module.exports = function(app) {
  // Get all examples

  app.get("/api/favorites", function(req, res) {
    db.Favorites.findAll().then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/favorites/:userID", function(req, res) {
    var userID = req.params.userID;
    db.Favorites.findAll({
      where: {
        userID: userID
      }
    }).then(function(favs) {
      var favsArr = [];
      favs.forEach(el => {
        el.dataValues.eventDate = moment(
          el.dataValues.eventDate,
          moment.ISO_8601
        ).format("LL");
        el.dataValues.startTime = moment(el.dataValues.startTime, [
          "HH:mm"
        ]).format("h:mm a");
        favsArr.push(el.dataValues);
      });
      res.json(favsArr);
    });
  });

  // Create a new example
  app.post("/api/create", function(req, res) {
    db.Favorites.create({
      title: req.body.title,
      eventDate: req.body.date,
      address: req.body.strAddr,
      username: req.body.username,
      userID: req.body.userID,
      placeId: req.body.place_id,
      startTime: moment(req.body.start, moment.ISO_8601)
        .tz(req.body.timezone)
        .format("HH:mm:ss"),
      timeZone: req.body.timezone,
      eventID: req.body.id
    }).then(function(favs) {
      console.log(
        moment(req.body.start, moment.ISO_8601)
          .tz(req.body.timezone)
          .format("HH:mm:ss")
      );
      res.json(favs);
    });
  });

  // Delete an example by id
  app.delete("/api/delete/:userID&:eventID", function(req, res) {
    var userID = req.params.userID;
    var eventID = req.params.eventID;

    db.Favorites.destroy({
      where: {
        userID: userID,
        eventID: eventID
      }
    }).then(function(results) {
      res.json(results);
    });
  });
};
