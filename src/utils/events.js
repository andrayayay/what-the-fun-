require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const config = require("./config");

async function events(lat, lon, date, keyword, cat, offset, range, callback) {
  const AuthStr = "Bearer ".concat(config.AUTH.id);
  const url = `https://api.predicthq.com/v1/events/`;
  var callbackData = [];

  const response = await axios.get(url, {
    headers: { Authorization: AuthStr },
    params: {
      q: keyword,
      category: cat,
      offset: offset,
      within: `${range}@${lat},${lon}`,
      "start.gte": moment(date).toISOString(),
      "start.lte": moment(date)
        .add(1, "d")
        .toISOString(),
      sort: "local_rank"
    }
  });
  callbackData = response.data.results;
  if (callbackData.length === 0) {
    var msg = "No results found!";
    callbackData[0] = {
      title: msg,
      date: "",
      strAddr: "",
      start: ""
    };
    callback(undefined, callbackData);
  } else {
    reverseGeolocate(callbackData).then(() => {
      setTimeout(() => {
        callback(undefined, callbackData);
      }, 2000);
    });
  }
}

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
          el.start_time = moment(el.start).format("LT");
        } else throw new Error(response.status);
      });
  });
}

module.exports = events;
