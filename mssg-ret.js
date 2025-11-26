const flipNum = 4;

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
    return document.getElementsByClassName("messages")[0];
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

function temp(){
    updateMessages("hider");
}

async function updateMessages(role){
    if(await getMessageChange()){
        let mssgs = await getMessages();
        let container = getMessageContainer();
        let displayedMssgCount = getDisplayedMessagesCount(container);

        for(let i = displayedMssgCount; i < mssgs.length; i++){
            createMessage(role, container, mssgs[i]);
        }
    }

    setTimeout(temp, 500);
}
