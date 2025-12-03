let fs = require("fs");
let express = require("express");
let cors = require("cors");

let port = process.env.PORT || 6327;

let app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use(express.static("static"));
app.set("view engine", "ejs");

function getMessages(){
    return JSON.parse(fs.readFileSync(__dirname + "/message-history.json"));
}

function getMessageCount(){
    const mssgs = getMessages();
    return mssgs.messages.length;
}

app.get("/message-change", function (req, res, next){
    //console.log("== GET /message-change");
    let mssgNum = getMessageCount();
    //console.log("  -- count = " + mssgNum);
    res.status(200).json({count: mssgNum});
});

app.get("/messages", function (req, res, next){
    console.log("== GET /messages");
    res.status(200).sendFile(__dirname + "/message-history.json");
});

app.get("/chat/:role", function (req, res, next){
    let role = req.params.role.toLowerCase();
    if(role != "seeker" && role != "hider"){
        next();
    }
    //capitalizes the first letter (ex. "hider" -> "Hider")
    role = role.charAt(0).toUpperCase() + role.substring(1, role.length);
    res.render("messaging", {role});
});

app.post("/new-message", function (req, res){
    console.log("== POST /new-message");
    let mssgs = getMessages();
    mssgs.messages.push(req.body);
    fs.writeFileSync(
        "./message-history.json",
        JSON.stringify(mssgs, null, 2)
    );
    res.status(200).send("Message Recieved.");
});

app.listen(port, function (){
    console.log("== listening on " + port);
});