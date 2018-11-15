var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var cards_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

//Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, '192.168.217.50', function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/api/cards", function(req, res) {
    db.collection('cards').find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get cards.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/cards", function(req, res) {
    var searchCard = req.body;
    var query = {};

    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide search string.", 400);
    } else {
        db.collection('cards').find(query);
    }
});


app.get("/api/cards/:id", function(req, res) {
    db.collection('cards').findOne({ name: new ObjectID(req.params.id) }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update contact");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/api/cards/:id", function(req, res) {
});

app.delete("/api/cards/:id", function(req, res) {
});
