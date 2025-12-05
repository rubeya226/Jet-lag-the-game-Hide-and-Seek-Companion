let templatePath = process.argv[2];
let outputPath = process.argv[3];

if(!templatePath || !outputPath){
    console.log("Err {card-compiler.js} - template or output path not passed");
    return;
}

let path = require("path");
let fs = require("fs");

let templateExt = path.extname(templatePath);
let templateName = path.basename(templatePath, templateExt);

let template = fs.readFileSync(templatePath, "utf-8");

let cardTemplate = JSON.parse(template).cards;

let deck = {
    cards: []
};

for(let i = 0; i < cardTemplate.length; i++){
    if(cardTemplate[i].type == "curse"){
        deck.cards.push(cardTemplate[i]);
        continue;
    }else{
        for(let j = 0; j < cardTemplate[i].numInDeck; j++){
            deck.cards.push(cardTemplate[i]);
        }
    }
}

let output = JSON.stringify(deck, null, 2);
fs.writeFileSync(outputPath, output);