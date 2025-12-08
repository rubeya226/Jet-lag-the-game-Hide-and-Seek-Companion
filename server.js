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

// Global vars for draw cards
var cards = JSON.parse(fs.readFileSync(__dirname + "/cards.json")).cards
var idx_of_cards_drawn = []
var num_of_cards = 0

// Functions for draw cards:
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
 * GET home page
 */
app.get("/", function (req, res, next){
    console.log("== GET /");
    res.render("frame", {
        title: "Jet Lag Hide & Seek",
        scriptFile: "/home.js",
        loadScript: "populateLeaderboard()",
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
app.get("/:hider", function (req, res, next){
    let draw = req.params.hider;

    console.log("Draw param: " + draw)

    if (draw === "hider") {
        console.log("== GET /hider");
        res.render("frame", {
            title: "Jet Lag Hide & Seek - Hider",
            scriptFile: "hider.js",
            loadScript: "",
            templateFile: "hider",
            fileInfo: {
                cards: cards,
                num_of_cards: num_of_cards,
                idx_of_cards_drawn: idx_of_cards_drawn,
            }
        }) 
    } else if (draw === "hider-draw") {
        console.log("== GET /hider-draw");
        // If all the cards are drawn, just contiune 
        if(num_of_cards < 6) {
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
        }

        // Get the num of cards in hand
        num_of_cards = idx_of_cards_drawn.length
        console.log("idx length: " + idx_of_cards_drawn.length)
        console.log("Num of cards drawn: " + num_of_cards)
        console.log("Indices of cards drawn: " + idx_of_cards_drawn)

        res.render("frame", {
            title: "Jet Lag Hide & Seek - Hider",
            scriptFile: "hider.js",
            loadScript: "",
            templateFile: "hider",
            fileInfo: {
                cards: cards,
                num_of_cards: num_of_cards,
                idx_of_cards_drawn: idx_of_cards_drawn, 
            }
        }) 
    } else {
        next();
    }
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
 Saving & retrieving leaderboard
 *******************************************************************************
 */

/*
 * uses selection sort implementation to sort in ascending order
 * Credit: Geeks4Geeks (https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/)
 * Params: times {list of obj w/ time property} - the list of times
 * Returns {list of obj}: the sorted list
 */
function sortTimes(times){
    let n = times.length;

    for(let i = 0; i < n; i++){
        let minIdx = i;

        for(let j = i + 1; j < n; j++){
            if(times[j].time < times[minIdx].time){
                minIdx = j
            }
        }

        let temp = times[i];
        times[i] = times[minIdx];
        times[minIdx] = temp;
    }

    return times;
}

function addNewTime(timeObj){
    let times = JSON.parse(fs.readFileSync(__dirname + "/leaderboard.json"));
    timeObj.time = parseInt(timeObj.time);
    times.push(timeObj);
    times = sortTimes(times);
    fs.writeFileSync(
        "./leaderboard.json", 
        JSON.stringify(times, null, 2)
    );
}

/*
 * POST a new leaderboard time
 * stores new leaderboard time & sorts it
 */
app.post("/new-time", function (req, res){
    console.log("== POST /new-time");
    console.log("  -- " + req.body.name + " - " + req.body.timeStr);
    addNewTime(req.body);
    res.status(200).send("Time Recieved");
});

/*
 * gets the three shortest times from the leaderboard
 * Returns {list of obj} - the top three entries
 */
function getTopThreeTimes(){
    let times = JSON.parse(fs.readFileSync(__dirname + "/leaderboard.json"));
    let topTimes = [];
    for(let i = 0; i < 3; i++){
        topTimes.push(times[i]);
    }

    return topTimes;
}

/*
 * GET the top three leaderboard times
 */
app.get("/leaderboard", function (req, res){
    let times = getTopThreeTimes();
    times = JSON.stringify(times, null, 2);
    console.log(times);
    res.status(200).send(times);
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
    console.log("  -- " + req.body.sender + ": \"" + req.body.content + "\"");
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
/*
 * Drawing Cards
 */
app.post("/hider/draw-card", (req, res) => {
    console.log("== GET /draw-card");

    // If all the cards are drawn, just contiune 
    if(num_of_cards < 6) {
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
    }

    // Get the num of cards in hand
    num_of_cards = idx_of_cards_drawn.length
    console.log("idx length: " + idx_of_cards_drawn.length)
    console.log("Num of cards drawn: " + num_of_cards)
    console.log("Indices of cards drawn: " + idx_of_cards_drawn)

    // Render the card 
    res.render("frame", {
        title: "Jet Lag Hide & Seek - Hider",
        scriptFile: "hider.js",
        loadScript: "",
        templateFile: "hider",
        fileInfo: {
            cards: cards,
            num_of_cards: num_of_cards,
            idx_of_cards_drawn: idx_of_cards_drawn,
        }
    })
});

/*
 * Removing Cards
 */
app.post("/hider/remove-card/:idx", function(req, res, next){
    var idx = Number(req.params.idx)
    console.log("== POST /hider/remove-card/" + idx)
    console.log("idx to remove: ",idx)

    num_of_cards -= 1 
    console.log("Num of cards after removal: " + num_of_cards)

    idx_of_cards_drawn.splice(idx, 1)
    console.log("Indices of cards after removal: " + idx_of_cards_drawn)

    res.status(200).json({ success: true });
})

/*
 * GET the favicon (the little icon in the tab)
 */
app.get("/favicon.ico", function (req, res, next){
    console.log("== GET /favicon.ico");
    res.sendFile(__dirname + "/static/images/favicon.ico");
});

/*
 * 404: No page found
 */
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