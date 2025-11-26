let fs = require("fs");
let express = require("express");
let cors = require("cors");

let port = process.env.PORT || 6327;

let messageAmount;

let app = express();

/*
 * Whitelist origins code from user "eyecatchUp" on stackoverflow
 * https://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains
 */
const corsWhitelist = new Set([
    "https://flip1.engr.oregonstate.edu",
    "https://flip2.engr.oregonstate.edu",
    "https://flip3.engr.oregonstate.edu",
    "https://flip4.engr.oregonstate.edu"
]);

app.use((req, res, next) => {
    if (corsWhitelist.has(req.headers.origin)) {
        res.set({
            'Access-Control-Allow-Origin', req.headers.origin,
            'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'
        });
    }
    next();
});

/*
 * End Whitelist origins code
 */

function getMessageCount(){
    const mssgs = fs.readFileSync(__dirname + "/message-history.json");
    const messageObj = JSON.parse(mssgs);
    return messageObj.messages.length;
}

app.get("/message-change", function (req, res, next){
    console.log("== /message-change");
    let mssgNum = getMessageCount();
    console.log("  -- count = " + mssgNum);
    res.status(200).json({count: mssgNum});
});

app.listen(port, function (){
    console.log("== listening on " + port);
});