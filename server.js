const express = require("express"),
    rateLimit = require("express-rate-limit"),
    server = express(),
    bodyParser = require("body-parser"),
    PORT = process.env.PORT || 3001,
    { MongoClient } = require("mongodb"),
    dbName = 'heroku_5nkbvc09',
    client = new MongoClient(process.env.MONGODB_URI);
server.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static("public/"))
    .set('trust proxy', 1);

const submitLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: "You're attempting to submit too many videos. Please try again at a later time."
});

server.use("/submit/", submitLimiter);

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
    const url = req.body.url;
    const ytRegex = /^https?:\/\/(?:www\.)?youtu.?be(?:.com)?\/(?:watch\?v=)?([a-z,A-Z,0-9]+)$/gi
    if(ytRegex.test(url)){
        const vid = ytRegex.exec(url)[1];
        client.connect(err => {
            console.log(`err: ${err}`)
            const db = client.db(dbName);
            const collection = db.collection('submissions');
            collection.insert({url, vid, approved: false}, (error, success) => {
                if (error || !success) {
                    console.log(`error: ${error}`)
                    res.sendStatus(500);
                } else res.sendStatus(200);
            });
        });
    } else {
        res.status(400).send("Invalid youtube video url.");
    }
    
   
})

    .listen(PORT, function () {
        console.log(`Server running on port ${PORT}!`);
    });
