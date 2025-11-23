let express = require("express");

let port = process.evn.PORT || 6327;
let app = express();

app.set("view engine", "ejs");

let messageData = require("./message-history.json");

app.get("/message:role", function (req, res, next){
    let role = req.params.role.toLowerCase();
    if(role != "hider" && role != "seeker"){
        next();
    }

    let messages = messageData.messages;
    
});