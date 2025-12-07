let fs = require("fs");
let express = require("express");
let cors = require("cors");

let port = process.env.PORT || 6327;

let app = express();

//this is required to allow for fetch() to work. It does not follow web safety
//  standards, but this was the simplest solution considering our URLs are not
//  set (can be flip1, flip2, etc.)
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use(express.static("static"));
app.set("view engine", "ejs");

/*
 * gets object with the most recent copy of the message history
 * Returns {obj} - object with list of messages
 */
function getMessages(){
    return JSON.parse(fs.readFileSync(__dirname + "/message-history.json"));
}

/*
 * gets the number of messages stored server-side
 * Returns {int} - number of stored messages
 */
function getMessageCount(){
    const mssgs = getMessages();
    return mssgs.messages.length;
}

/*
 * GET home page
 */
app.get("/", function (req, res, next){
    console.log("== GET /");
    res.render("frame", {
        title: "Jet Lag Hide & Seek",
        scriptFile: "/home.js",
        loadScript: "",
        templateFile: "home",
        fileInfo: {}
    });
});

/*
 * GET rules page
 */
app.get("/rules", function (req, res, next){
    console.log("== GET /rules");
    res.render("frame", {
        title: "Jet Lag Hide & Seek - Rules",
        scriptFile: "",
        loadScript: "",
        templateFile: "rules",
        fileInfo: {}
    })
});

/*
 * GET hider page
 */
app.get("/hider", function (req, res, next){
    console.log("== GET /hider");
    res.render("frame", {
        title: "Jet Lag Hide & Seek - Hider",
        scriptFile: "hider.js",
        loadScript: "",
        templateFile: "hider",
        fileInfo: {}
    })
});

/*
 * GET chat page
 * Param: role - either "seeker" or "hider"
 */
app.get("/chat/:role", function (req, res, next){
    let role = req.params.role.toLowerCase();
    //due to templatization, styles and script try to pull from /chat instead of /static when loading chat page
    if(role == "style.css" || role == "mssg-client.js"){
        res.status(200).sendFile(__dirname + "/static/" + role);
        return;
    }
    
    if(role != "seeker" && role != "hider"){
        next();
    }
    console.log("== GET /chat/" + role);
    //capitalizes the first letter (ex. "hider" -> "Hider")
    role = role.charAt(0).toUpperCase() + role.substring(1, role.length);

    res.render("frame", {
        title:"Jet Lag Hide & Seek - Chat",
        scriptFile: "mssg-client.js",
        loadScript: "initialLoad('" + role.toLowerCase() + "')",
        templateFile: "messaging",
        fileInfo: {role}
    });
});

/*
 *******************************************************************************
 Sending & recieving messages
 *******************************************************************************
 */

/*
 * POST a new message
 * stores new messages on the server for everyone to access
 */
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

/*
 * GET the number of server-side messages
 * used to see if there's a discrepency between server and client (aka if a new
 *   message has been sent)
 */
app.get("/message-change", function (req, res, next){
    //console.log("== GET /message-change");
    let mssgNum = getMessageCount();
    //console.log("  -- count = " + mssgNum);
    res.status(200).json({count: mssgNum});
});

/*
 * GET messages
 * send all messages to client
 */
app.get("/messages", function (req, res, next){
    console.log("== GET /messages");
    res.status(200).sendFile(__dirname + "/message-history.json");
});


/*
 *******************************************************************************
 Drawing Cards
 *******************************************************************************
 */

// .cards so that we get the array inside the JSON object
var cards = JSON.parse(fs.readFileSync(__dirname + "/cards.json")).cards
var idx_of_cards_drawn = []
var num_of_cards = 0

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function isCardAlreadyDrawn(idx) {
    for (let i = 0; i < idx_of_cards_drawn.length; i++) {
        if(idx == idx_of_cards_drawn[i]){
            return true
        }
    }
    return false
}

/*
 * Drawing Cards
 */
app.get("/draw-card", (req, res) => {
    console.log("== GET /draw-card");

    // Generate a random index for the card
    var idx = getRandomInt(0, cards.length - 1)

    // If num of cards is 0, just add the card
    if(num_of_cards == 0) {
        idx_of_cards_drawn.push(idx)
    } else { // Else, check if card is already drawn
        while (isCardAlreadyDrawn(idx)) {
            idx = getRandomInt(0, cards.length - 1)
        }
        idx_of_cards_drawn.push(idx)
    }

    // Get the num of cards in hand
    num_of_cards = idx_of_cards_drawn.length
    console.log("idx length: " + idx_of_cards_drawn.length)
    console.log("Num of cards drawn: " + num_of_cards)
    console.log("Indices of cards drawn: " + idx_of_cards_drawn)

    // Render the card 
    res.render("cardDraw", {
        cards: cards,
        num_of_cards: num_of_cards,
        idx_of_cards_drawn: idx_of_cards_drawn
    }) 
});

app.get("/favicon.ico", function (req, res, next){
    console.log("== GET /favicon.ico");
    res.sendFile(__dirname + "/static/images/favicon.ico");
});

app.get("*splat", function (req, res){
    console.log("== GET", req.originalUrl);
    console.log("   ~~ Error: 404");
    res.render("frame", {
        title: "Jet Lag Hide & Seek - 404",
        scriptFile: "",
        loadScript: "",
        templateFile: "404",
        fileInfo: {}
    });
});

app.listen(port, function (){
    console.log("== listening on " + port);
});

//clearing the message history upon server stop (when server stopped via Ctrl C)
//pulled from script generated by Copilot

process.on("SIGINT", () =>{
    console.log("\n\n\n~~ Interrupt Signal (^C) recieved");

    let emptyMessages = {
        messages: []
    };

    fs.writeFileSync(
        "./message-history.json", 
        JSON.stringify(emptyMessages, null, 2)
    );

    console.log("~~ ./message-history.json cleared.");
    process.exit();
});