const express = require("express"),
    rateLimit = require("express-rate-limit"),
    server = express(),
    bodyParser = require("body-parser"),
    PORT = process.env.PORT || 3001,
    { MongoClient } = require("mongodb"),
    dbName = 'heroku_5nkbvc09',
    client = new MongoClient(process.env.MONGODB_URI);
require('dotenv').config();
server.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static("dist/"))
    .set('trust proxy', 1);

const submitLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: "You're attempting to submit too many videos. Please try again at a later time."
});


const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    let token = req.body.cachecode;
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(400).send("No Token Provided");
    }
};


server.use("/submit/", submitLimiter);
server.use('/submit', checkToken)

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

server.get('/tracking', (req, res) =>{
    let token = jwt.sign({ message: "nice try" },
        process.env.JWT_SECRET,
        {
            expiresIn: '10s' // expires in 24 hours
        }
    )
    res.status(400).send({message: 'Could not track user. Adblock detected',code: token});
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
