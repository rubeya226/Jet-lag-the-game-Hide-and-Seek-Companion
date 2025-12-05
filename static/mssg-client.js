/*
 * stores the role in window & starts recursively checking for new messages
 * Parameter: role {string} - either "hider" or "seeker"
 */
function initialLoad(role){
    role = role.toLowerCase();
    window.role = window.role || role; 
    updateMessages();
    scrollToBottom();
}

/*
 * handles going back to the previous page
 */
function back(){
    window.location.href = "/" + window.role;
}

/*
 *******************************************************************************
 * Retrieving Messages
 * Author: Brennan Duman
 *******************************************************************************
 */

/*
 * checks if new messages are available on the server
 * Return {bool}:
 *     true - there's new messages
 *     false - there's no new messages
 */
async function getMessageChange(){
    let localMssgCount = document.getElementsByClassName("message").length;

    let mssgData = await fetch("/message-change");
    let json = await mssgData.json();
    let mssgCount = json.count;

    if(mssgCount > localMssgCount){
        return true;
    }else{
        return false;
    }
}

/*
 * gets messages from the server
 * Returns {list}: list of messages
 */
async function getMessages(){
    let messageData = await fetch("/messages");
    let json = await messageData.json();
    return await json.messages;
}

/*
 * gets the parent element that all of the displayed messages reside in
 * Returns {DOM Element} - the parent element for messages
 */
function getMessageContainer(){
    return document.getElementById("chat-container");
}

/*
 * scrolls the messages view to the most recent message on page load
 * NOTE: Does not currently "function" (ba-da tsh)
 */
function scrollToBottom(){
    let container = getMessageContainer();
    //console.log("this is being called");
    container.scrollTop = container.scrollHeight;
}

/*
 * gets the number of messages stored client side
 * Param: container {DOM Element} - the parent element for messages
 * Returns {int} - the number of messages
 */
function getDisplayedMessagesCount(container){
    return container.getElementsByClassName("message").length;
}

/*
 * creates a message element and displays it
 * Params:
 *                                role {str} - must be "hider" or "seeker"
 *                   container {DOM Element} - the parent element for messages
 *     message {sender {str}, content {str}} - the message to display
 */
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

/*
 * checks to see if new messages have been sent, and if so display them
 */
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
    //recursively calls self -- results in a check every half-second
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
const filePath = "/new-message";

/*
 * sends a message to central server
 * Param: input {DOM Text Input Element} - the text field for users to type mssgs
 */
function add_message(input){
    console.log('added?');
    console.log(input.value);

    if(!input.value){
        console.log("Can't send a blank message");
        return;
    }

    const newMessage = create_message(input.value, window.role);
    
    //sends HTTP POST with new message
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

/*
 * creates a new message obj
 * Params:
 *     input {str} - the content of the message to be sent
 *      role {str} - the sender of the message. Must be "hider" or "seeker".
 * Returns {obj}: the message to be sent
 */
function create_message(input, role){
    let message = new Object();
    message.sender = role;
    message.content = input;
    return message;
}
