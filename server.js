const express = require("express"),
    server = express(),
    PORT = process.env.PORT || 3001,
    path = require('path'),
    rateLimit = require("express-rate-limit"),
    bodyParser = require("body-parser"),
    UAParser = require('ua-parser-js'),
    jwt = require('jsonwebtoken'),
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

const checkBrowser = (req, res, next) => {
    const parser = new UAParser();
    const ua = req.headers['user-agent'];
    const browserName = parser.setUA(ua).getBrowser().name;
    console.log(browserName)
    console.log(req.originalUrl)
    if (browserName == 'IE' || browserName == 'IEMobile' || browserName == 'PhantomJS' || browserName == 'Edge' || browserName == '2345Explorer' || browserName == 'Chrome Headless'){
        res.sendFile(path.join(__dirname + '/ie.html'));
    } else if (browserName == undefined) {
        res.sendStatus(418);
    } else {
        next();
    }
}

const checkToken = (req, res, next) => {
    let token = req.body.cachecode;
    if (token) {
        try {
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
        } catch(e) {
            console.log(e);
            res.status(500).send('Internal Server Error. Stop trying to hack this.');
        }
    } else {
        return res.status(400).send("No Key Provided");
    }
};

server
    .disable('x-powered-by')
    .use(checkBrowser)
    .use("/submit/", submitLimiter)
    .use('/submit', checkToken)

    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/main.html'));
    })

    .get('/submissions', (req, res) => {
        client.connect(err => {
            console.log(`err: ${err}`)
            const db = client.db(dbName);
            const collection = db.collection('submissions');
            const options = { projection: { 'vid': 1, _id: 0 } }
            collection.find({ approved: true }, options).toArray((error, videos) => {
                if (error) console.log(`error: ${error}`)
                res.send(videos);
            });
        });
    })

    .get('/tracking', (req, res) =>{
        try {
            let token = jwt.sign({ message: "nice try" },
                process.env.JWT_SECRET,
                {
                    expiresIn: '10s'
                }
            )
            res.status(400).send({ message: 'Could not track user. Adblock detected', code: token });
        } catch(e){
            console.log(e);
            res.status(500).send('Internal Server Error. Unable to track user hA8631JA');
        }
    })

    .post('/submit', (req, res) => {
        const url = req.body.url;
        const ytRegex = /^https?:\/\/(?:www\.)?youtu.?be(?:.com)?\/(?:watch\?v=)?([a-z,A-Z,0-9]+)$/gi
        if (ytRegex.test(url)) {
            const vid = ytRegex.exec(url)[1];
            client.connect(err => {
                console.log(`err: ${err}`)
                const db = client.db(dbName);
                const collection = db.collection('submissions');
                collection.insert({ url, vid, approved: false }, (error, success) => {
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