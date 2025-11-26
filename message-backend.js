let fs = require("fs");
let express = require("express");
let cors = require("cors");

let port = process.env.PORT || 6327;

let messageAmount;

let app = express();

app.use(cors({
  origin: '*'
}));

function getMessageCount(){
    const mssgs = fs.readFileSync(__dirname + "/message-history.json");
    const messageObj = JSON.parse(mssgs);
    return messageObj.messages.length;
}

app.get("/message-change", function (req, res, next){
    console.log("== GET /message-change");
    let mssgNum = getMessageCount();
    console.log("  -- count = " + mssgNum);
    res.status(200).json({count: mssgNum});
});

app.get("/messages", function (req, res, next){
    console.log("== GET /messages");
    res.status(200).sendFile(__dirname + "/message-history.json");
});

app.listen(port, function (){
    console.log("== listening on " + port);
});