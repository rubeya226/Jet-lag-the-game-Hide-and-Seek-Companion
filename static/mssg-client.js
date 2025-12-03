let flipNum = 2;

/*
 *******************************************************************************
 * Retrieving Messages
 * Author: Brennan Duman
 *******************************************************************************
 */

async function getMessageChange(){
    let localMssgCount = document.getElementsByClassName("message").length;

    let mssgData = await fetch("http://flip" + flipNum + ".engr.oregonstate.edu:6327/message-change");
    let json = await mssgData.json();
    let mssgCount = json.count;

    if(mssgCount > localMssgCount){
        return true;
    }else{
        return false;
    }
    
}

async function getMessages(){
    let messageData = await fetch("http://flip" + flipNum + ".engr.oregonstate.edu:6327/messages");
    let json = await messageData.json();
    return await json.messages;
}

function getMessageContainer(){
    return document.getElementById("chat-container");
}

function getDisplayedMessagesCount(container){
    return container.getElementsByClassName("message").length;
}

function createMessage(role, container, message){
    let newMssg = document.createElement("div");
    newMssg.classList.add("message");
    newMssg.textContent = message.content;

    if(message.sender == "hider"){
        newMssg.classList.add("hider");
        if(role == "hider"){
            newMssg.classList.add("self");
        }else{
            newMssg.classList.add("opp");
        }
    }else{
        newMssg.classList.add("seeker");
        if(role == "hider"){
            newMssg.classList.add("opp");
        }else{
            newMssg.classList.add("self");
        }
    }

    container.appendChild(newMssg);
}

async function updateMessages(){
    let role = window.role;
    if(await getMessageChange()){
        let mssgs = await getMessages();
        let container = getMessageContainer();
        let displayedMssgCount = getDisplayedMessagesCount(container);

        for(let i = displayedMssgCount; i < mssgs.length; i++){
            createMessage(role, container, mssgs[i]);
        }
    }

    setTimeout(updateMessages, 500);
}

/*
 *******************************************************************************
 * Sending Messages
 * Author: Joe Haney
 *******************************************************************************
 */
const input = document.getElementById("input");
const send_button = document.getElementById("send-button");
const filePath = "http://flip" + flipNum + ".engr.oregonstate.edu:6327/new-message";



function add_message(input){
    console.log('added?');
    console.log(input.value);

    if(!input.value){
        console.log("Can't send a blank message");
        return;
    }

    const newMessage = create_message(input.value, window.role);
    
    fetch(filePath, {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (res){
        if(res.status === 200){
            console.log("New message sent");
        }else{
            alert("Err: An error occured whilst sending message.");
        }
        input.value = "";
    });
}

function create_message(input, role){
    let message = new Object();
    message.sender = role;
    message.content = input;
    return message;
}
