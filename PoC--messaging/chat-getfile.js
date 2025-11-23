
let express = require('express');
let cors = require("cors");
let path = require("path");
let port = process.env.PORT || 6327;
let app = express();

app.use(cors({
  origin: '*'
}));

app.get("/messagedata", function (req, res, next){
    console.log("== GET da data");
    res.status(200).sendFile(__dirname + "/message-history.json");
});

app.listen(port, function (){
    console.log("== listening on " + port);
});