const express = require("express"),
    server = express(),
    bodyParser = require("body-parser"),
    PORT = process.env.PORT || 3001,
    { MongoClient } = require("mongodb"),
    dbName = 'heroku_5nkbvc09',
    client = new MongoClient(process.env.MONGODB_URI);
server.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static("public/"))

server.get('/submissions', (req, res) => {
    client.connect(err => {
        console.log(`err: ${err}`)
        const db = client.db(dbName);
        const collection = db.collection('submissions');
        const options = {projection: {'vid':1, _id: 0}}
        collection.find({approved:true}, options).toArray((error, videos) => {
            if (error) console.log(`error: ${error}`)
            res.send(videos);
        });
    });
})

.post('/submit', (req, res) => {
    client.connect(err => {
        console.log(`err: ${err}`)
        const db = client.db(dbName);
        const collection = db.collection('submissions');
        collection.insert({url:req.body.url, vid:"", approved: false}, (error, success) => {
            if (error || !success) {
                console.log(`error: ${error}`)
                res.sendStatus(500);
            } else res.sendStatus(200);
        });
    });
})

    .listen(PORT, function () {
        console.log(`Server running on port ${PORT}!`);
    });
