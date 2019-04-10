$(document).ready(function(){
        var nameInput = $("#user-name");
        var userList = $("tbody");
        var userContainer = $(".user-container");
    
        var express = require('express');
    
    var Facebook = require('facebook-node-sdk');
    
    var app = express.createServer();
    
    app.configure(function () {
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.session({ secret: 'foo bar' }));
      app.use(Facebook.middleware({ appId: 'YOUR_APP_ID', secret: 'YOUR_APP_SECRET' }));
    });
    
    app.get('/me', Facebook.loginRequired(), function (req, res) {
      req.facebook.api('/me', function(err, user) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello, ' + user.name + '!');
      });
      console.log();
    });
    
        FB.login(function(response) {
            // Original FB.login code
          }, { auth_type: 'authorize' });
        {
            status: 'connected';
            authResponse: {
              accessToken: '...';
              expiresIn:'...';
              reauthorize_required_in:'...';
              data_access_expiration_time: '...';
              signedRequest:'...';
              userID:'...'
            }
          }
        
        $(document).on("submit", "#user-form", handleFormSubmit);
        
        getUsers();
    
        function handleFormSubmit(event) {
            event.preventDefault();
            if (!nameInput.val().trim().trim()){
                return;
            }
        
            upsertUser({
                name: nameInput
                    .val()
                    .trim()
            });
        }
    
        function upsertUser(userData) {
            $.post("/api/user-api-route.js", userData)
            .then(getUsers);
        }
    
        function createUserRow(userData) {
            var newTr = $("<tr");
            newTr.data("user", userData);
            newTr.append("<td>" = userData.Events.length + "</td>");
        }
    // else {
    //         newTr.append("<td>0</td>");
        // }
    //     newTr.append("<td><a href='/events?q=${keyword}&date=${date}&address=${location}&category=${category}&range=${range}${unit}&limit=10&offset=${offset}')
    //     newTr.append("<td><a href='/cms?author_id=" + userData.id + "'>Create a Post</a></td>");
    //     newTr.append("<td><a style='cursor:pointer;color:red' class='delete-author'>Delete Author</a></td>");
    //     return newTr;
    //   });
    
    function getUsers(){
        $.get("/api/users", function(data){
            var rowsToAdd = [];
            for (var i = 0; i < data.length; i++) {
                rowsToAdd.push(createUserRow(data[i]));
            }
            renderUserList(rowsToAdd);
            nameInput.val("");
        });
    }
    
    function renderUserList(rows) {
        userList.children().not(":last").remove();
        userContainer.children(".alert").remove();
        if (rows.lenth){
            console.log(rows);
        }
        else {
            renderEmpty();
        }
    }
    
    function renderEmpty(){
        var alertDiv = $("<div>");
        alertDiv.addClass("No User Found");
        alertDiv.text("You must log-in");
        userContainer.append(alertDiv);
    };
});