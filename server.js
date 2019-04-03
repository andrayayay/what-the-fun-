require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
const geocode = require("./src/utils/geocode");
const events = require("./src/utils/events");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.get("", (req, res) => {
  res.render("index", {
    title: "What the Fun?!"
  });
});

app.get("/favorites", (req, res) => {
  res.render("favorites", {
    title: "Favorites"
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

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    // console.log(
    //   "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    //   PORT,
    //   PORT
    // );
  });
});

module.exports = app;
