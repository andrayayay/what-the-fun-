require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const config = require("./config");

const events = (lat, lon, cat, offset, range, callback) => {
  const AuthStr = "Bearer ".concat(config.AUTH.id);
  const url = `https://api.predicthq.com/v1/events?category=${cat}&offset=${offset}&within=${range}mi@${lat},${lon}`;
  var callbackData = [];

  axios
    .get(url, {
      headers: { Authorization: AuthStr }
    })
    .then(response => {
      callbackData = response.data.results;
      reverseGeolocate(callbackData).then(() => {
        setTimeout(() => {
          callback(undefined, callbackData);
        }, 2000);
      });
    })
    .catch(error => {
      throw error;
    });
};

async function reverseGeolocate(array) {
  array.forEach(el => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          el.location[1]
        },${el.location[0]}&key=${config.GOOGLE.id}`
      )
      .then(response => {
        let ind = 0;
        if (response.status === 200) {
          if (
            response.data.results[0].formatted_address.includes("Unnamed Road")
          ) {
            ind++;
          }
          el.place_id = response.data.results[ind].place_id;
          el.strAddr = response.data.results[ind].formatted_address;
          el.date = moment(el.start).format("LL");
          el.start = moment(el.start).format("LT");
        } else throw new Error(response.status);
      });
  });
}

module.exports = events;
