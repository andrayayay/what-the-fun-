var db = require("../models");
// var express = require("express");
// var app = express();
const geocode = require("../src/utils/geocode");
const events = require("../src/utils/events");
const moment = require("moment");
module.exports = function(app) {
  // Load index page
  app.get("/favorites", function(req, res) {
    // console.log("/favorites", req);
    db.Favorites.findAll({}).then(function(favs) {
      res.render("favorites", {
        msg: "These are your favorite events!",
        examples: JSON.stringify(favs)
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

  app.post("/api/create", (req, res) => {
    res.render(req.body[1]);
    // console.log("This is req.body on htmlRoutes.js: " + req.body[1].category);
  });

  app.get("/", (req, res) => {
    res.render("index", {
      title: "What the Fun?!"
    });
  });

  app.get("/friends", (req, res) => {
    res.render("friends", {
      title: "Friends"
    });
  });

  app.get("/events", (req, res) => {
    geocode.geocode(req.query.address, (error, { latitude, longitude }) => {
      events(
        latitude,
        longitude,
        moment(new Date(req.query.date)).format("YYYY-MM-DD"),
        req.query.q,
        req.query.category,
        req.query.offset,
        req.query.range,
        (error, data) => {
          if (error) return res.send({ error });
          res.send(data);
        }
      );
    });
  });

  // app.post("/api/examples", (req, res) => {
  //   // console.log(res);
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
