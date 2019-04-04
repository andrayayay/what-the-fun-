// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

// END OF BOILER PLATE
$(document).ready(function() {
  const appendToTable = url => {
    fetch(url).then(response => {
      response.json().then(data => {
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
          <div class="ui fitted toggle checkbox">
            <input type="checkbox" data-id=${el.id}> <label></label>
          </div>
        </td>
        <td>${el.title}</td>
        <td>${el.date}</td>
        <td><a href="https://www.google.com/maps/place/?q=place_id:${
          el.place_id
        }" target="_blank">${el.strAddr}</a></td>
        <td>${el.start}</td>
      </tr>`);
        });
      });
    });
  };

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

  $("#facebook-login").on("click", function fb_login() {
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
  var url = "";
  var range = "";
  var location = "";
  var category = "";
  var unit = "mi";

  if (window.location.href.includes("favorites")) {
    $("#favoritesPage").attr("class", "item active");
  } else if (window.location.href.includes("friends")) {
    $("#friendsPage").attr("class", "item active");
  } else $("#homePage").attr("class", "item active");

  $("#header")
    .form()
    .submit(e => {
      offset = 0;
      e.preventDefault();
      $("#tableBody").html("");
      $("#loader").show();
      range = $("#rangeInput").val();
      location = $("#loc").val();
      category = $("#etype")
        .val()
        .join(",");
      if ($("#miles").attr("class", "ui transparent label")) {
        unit = "km";
      }
      url = `/events?address=${location}&category=${category}&range=${range}${unit}&limit=10&offset=${offset}`;
      appendToTable(url, offset);
      $("#showMore").show();
    });

  $("#showMore").on("click", () => {
    offset += 10;
    url = url = `/events?address=${location}&category=${category}&range=${range}${unit}&limit=10&offset=${offset}`;
    $("#loader").show();
    appendToTable(url);
  });
});
