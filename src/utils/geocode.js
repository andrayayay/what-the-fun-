require("dotenv").config();
const request = require("request");
const config = require("./config");

const geocode = (address, callback) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}.json&key=${
    config.GOOGLE.id
  }&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.length === 0) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      callback(undefined, {
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    }
  });
};

module.exports = {
  geocode: geocode
};
