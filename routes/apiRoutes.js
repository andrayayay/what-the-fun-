var db = require("../models");
var moment = require("moment");
var _ = require("lodash");
var faker = require("faker");

module.exports = function(app) {
  // Get all examples

  app.get("/api/favorites", function(req, res) {
    db.Favorites.findAll().then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/friends", function(req, res) {
    db.Favorites.findAll().then(function(results) {
      var names = _.uniq(_.map(results, "username"));
      var nameResp = [];
      names.forEach(el => {
        if (el) {
          let user = {
            name: el,
            pic: faker.internet.avatar()
          };
          nameResp.push(user);
        }
      });
      res.json(nameResp);
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
