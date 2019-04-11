/*global FB*/
/*global postData*/

$(document).ready(function() {
  var API = {
    saveFavorites: function(favs) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",

        url: "api/create",
        data: JSON.stringify(favs)
      });
    },

    getFavorites: function(userID) {
      return $.ajax({
        url: `/api/favorites/${userID}`,
        type: "GET"
      }).done(function(data) {
        $("#favsloader").hide();
        data.forEach(el => {
          $("#favoriteBody").append(`
          <tr>
          <td>${el.title}</td>
          <td>${el.eventDate}</td>
          <td><a href="https://www.google.com/maps/place/?q=place_id:${
            el.placeId
          }" target="_blank">${el.address}</a></td>
          <td>${el.startTime}</td>
          <td>
            <div class="ui red button" data-id=${el.eventID}>
              <i class="ban icon" style="margin:auto"></i>
            </div>
          </td>
        </tr>`);
        });
      });
    },
    deleteFavorites: function(userID, eventID) {
      return $.ajax({
        url: `/api/delete/${userID}&${eventID}`,
        type: "DELETE"
      });
    },
    getFriends: function(userID) {
      return $.ajax({
        url: `/api/friends/${userID}`,
        type: "GET"
      }).done(function(data) {
        $("#friendsSegment").fadeIn(1000);
        data.forEach(el => {
          if (el) {
            $("#friends").append(`
            <div class="column">
            <div class="ui fluid card">
              <div class="image">
                <img src="${el.pic}">
              </div>
              <div class="content">
                <a class="header">${el.name}</a>
              </div>
            </div>
          </div>`);
          }
        });
      });
    }
  };

  var respData;
  const appendToTable = url => {
    fetch(url).then(response => {
      console.log(response);
      response.json().then(data => {
        if (respData === undefined) respData = data;
        else {
          data.forEach(el => {
            respData.push(el);
          });
        }
        if (data.error) {
          $("#tableBody").append(`
          <tr>${data.error}</tr>`);
          throw data.error;
        }
        $("#loader").hide();
        data.forEach(el => {
          $("#tableBody").append(`
        <tr>
        <td class="collapsing">
          <div class="ui teal basic button favorite" data-id=${
            el.id
          } data-toggle=false>
            <i class="star icon" style="margin:auto"></i> 
          </div>
        </td>
        <td>${el.title}</td>
        <td>${el.date}</td>
        <td><a href="https://maps.google.com/maps?daddr=${
          el.strAddr
        }" target="_blank">${el.strAddr}</a></td>
        <td>${el.start_time}</td>
      </tr>`);
        });
      });
    });
  };

  $(document).on("click", ".favorite", function() {
    let event_id = $(this).data("id");
    if (event_id === "undefined") {
      $(this).hide();
    } else {
      respData.forEach(el => {
        if (el.id === event_id) {
          $.extend(postData, el);
        }
      });
      if ($(this).data("toggle") === false) {
        $(this).attr("class", "ui teal button favorite");
        API.saveFavorites(postData);
        $(this).data("toggle", true);
      } else {
        $(this).attr("class", "ui teal basic button favorite");
        API.deleteFavorites(postData.userID, event_id);
        $(this).data("toggle", false);
      }
    }
  });

  $(document).on("click", ".red.button", function() {
    let event_id = $(this).data("id");
    API.deleteFavorites(postData.userID, event_id);
    $(this)
      .closest("tr")
      .fadeOut(300, function() {
        $(this).remove();
      });
  });

  // Initializing the Semantic UI Dropdown
  $(".ui.dropdown").dropdown();
  $("#loader").hide();
  $("#range").range({
    min: 1,
    max: 100,
    start: 20,
    step: 1,
    input: "#rangeInput"
  });

  $("#calendar").calendar({ type: "date" });

  $("#facebook-button").on("click", function fb_login() {
    FB.login(function() {}, { scope: "email,public_profile" });
  });

  $("#miles").on("click", () => {
    $("#miles").attr("class", "ui teal label");
    $("#kilometers").attr("class", "ui transparent label");
  });

  $("#kilometers").on("click", () => {
    $("#kilometers").attr("class", "ui teal label");
    $("#miles").attr("class", "ui transparent label");
  });

  var offset = 0;
  var date = "";
  var keyword = "";
  var url = "";
  var range = "";
  var location = "";
  var category = "";
  var unit = "mi";
  var tzOffset = new Date().getTimezoneOffset();

  if (window.location.href.includes("favorites")) {
    $("#favoritesPage").attr("class", "item active");
  } else if (window.location.href.includes("friends")) {
    $("#friendsPage").attr("class", "item active");
  } else $("#homePage").attr("class", "item active");

  const formValidated = $("#header").form({
    fields: {
      location: {
        identifier: "location",
        rules: [
          {
            type: "minLength[2]",
            prompt: "Please enter a location"
          }
        ]
      },
      events: {
        identifier: "events",
        rules: [
          {
            type: "minCount[1]",
            prompt: "Please select an event tag"
          }
        ]
      }
    }
  });

  formValidated.submit(e => {
    if ($(formValidated).form("is valid")) {
      offset = 0;
      e.preventDefault();
      $("#tableBody").html("");
      $("#resultsDisplay").fadeIn();
      $("#loader").show();
      if ($("#calendar-input").val() === "") {
        date = new Date($.now());
      } else if (
        new Date($("#calendar-input").val()) >
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ) {
        alert(
          "Due to API restrictions, dates set more than 30 days from today are not supported"
        );
        date = "";
      } else {
        date = new Date($("#calendar-input").val());
      }
      range = $("#rangeInput").val();
      location = $("#loc").val();
      keyword = $("#keyword").val();
      category = $("#etype")
        .val()
        .join(",");
      if ($("#miles").attr("class") === "ui transparent label") {
        unit = "km";
      }
      url = `/events?q=${keyword}&date=${date}&address=${location}&category=${category}&range=${range}${unit}&offset=${offset}&tzOffset=${tzOffset}`;
      $("#showMore").show();
      appendToTable(url);
    }
  });

  $("#reset").on("click", () => $("#range").range("set value", 20));

  $("#showMore").on("click", () => {
    if (respData.length < 10) {
      alert("No more results found!");
      $("#showMore").hide();
    } else {
      offset += 10;
      url = url = `/events?q=${keyword}&date=${date}&address=${location}&category=${category}&range=${range}${unit}&limit=10&offset=${offset}&tzOffset=${tzOffset}`;
      $("#loader").show();
      appendToTable(url);
      $("#showMore").hide();
    }
  });

  setTimeout(() => {
    API.getFavorites(postData.userID);
  }, 2000);

  setTimeout(() => {
    API.getFriends(postData.userID);
  }, 2000);
});

// Get references to page elements
// var $favoritesText = $("#favorites-text");
// var $favoritesDescription = $("#favorites-description");
// var $submitBtn = $("#submit");

// var $favoritesList = $("#favorites-list");

// The API object contains methods for each kind of request we'll make

// refreshfavoritess gets new favoritess from the db and repopulates the list
// var refreshFavorites = function() {
//   API.getFavorites().then(function(data) {
//     var $favorites = data.map(function() {
//       var $a = $("<a>")
//         .text(Favorites.text)
//         .attr("href", "/favorites/" + Favorites.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": Favorites.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $favoritesList.empty();
//     $favoritesList.append($favorites);
//   });
// };

// handleFormSubmit is called whenever we submit a new favorites
// Save the new favorites to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var favorites = {
//     text: $favoritesText.val().trim(),
//     description: $favoritesDescription.val().trim()
//   };

//   if (!(favorites.text && favorites.description)) {
//     alert("You must enter an favorites text and description!");
//     return;
//   }

//   API.savefavorites(favorites).then(function() {
//     refreshFavorites();
//   });

//   $favoritesText.val("");
//   $favoritesDescription.val("");
// };

// handleDeleteBtnClick is called when an favorites's delete button is clicked
// Remove the favorites from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deletefavorites(idToDelete).then(function() {
//     refreshFavorites();
//   });
// };

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $favoritesList.on("click", ".delete", handleDeleteBtnClick);
