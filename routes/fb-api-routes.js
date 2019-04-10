var Facebook = require('facebook-node-sdk');

var facebook = new Facebook({ appID: 'YOUR_APP_ID', secret: 'YOUR_APP_SECRET' });

facebook.api('/', function(err, data) {
  console.log(data); // => { id: ... }
});

$(document).ready(function(){

    var fbUser = $("#user-name");
    var favorites = $("tbody");
$(document).on("authorization", "#createUser", handleFormSubmit);
})

getFBUsers();

function handleFormSubmit(favorites) {
    favorites.preventDefault();

    if(!userInput.val().trim().trim()) {
        return;
    }

    upsertUser({
        name: fbUser
            .val()
            .trim()
    });
}