var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/favorites", function () {
    // Before each test begins, create a new request server for testing
    // & delete all examples from the db
    beforeEach(function () {
        request = chai.request(server);
        return db.sequelize.sync({ force: true });
    });

    it("should find all favorites", function (done) {
        // Add some examples to the db to test with
        db.Favorites.create(
            { userId: "xyz", username: "Brielle", title: "Book Club", eventDate: new Date(), address: "123 School Ln", placeId: "abc", startTime: "7:00 AM", timeZone: "CTRL", eventID: "abc" }
        ).then(function (results) {
            // Request the route that returns all examples
            request.get("/api/favorites").end(function (err, res) {
                var responseStatus = res.status;
                var responseBody = res.body;
                console.log('BODDYYYYYYYYY!!!!', results);

                // Run assertions on the response

                expect(err).to.be.null;

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("array")
                    .that.has.lengthOf(2);

                expect(responseBody[0])
                    .to.be.an("object")
                    .that.includes({ userId: "xyz", username: "Brielle", title: "Book Club", eventDate: "April, 18th, 2019", address: "123 School Ln", placeId: "abc", startTime: "7:00 PM", timeZone: "CTRL", eventID: "abc" });

                expect(responseBody[1])
                    .to.be.an("object")
                    .that.includes({ userId: "xyz", username: "Maurice", title: "Dance Party", eventDate: "April, 18th, 2019", address: "123 Party Ln", placeId: "abc", startTime: "11:00 PM", timeZone: "CTRL", eventID: "abc" });

                // The `done` function is used to end any asynchronous tests
                done();
            });
        });
    });
});