async function getMessages(){
    console.log("gimme a sec");
    let messageData = await fetch("http://flip3.engr.oregonstate.edu:6327/messagedata");
    let json = await messageData.json();
    return await json.messages;
}

async function displayMessages(role){
    let container = document.getElementsByClassName("messages")[0];

    let messages = await getMessages();
    console.log(messages);
    for(let i = 0; i < messages.length; i++){
        let newM = document.createElement("div");
        newM.classList.add("message");

        newM.textContent = messages[i].content;
        
        if(messages[i].sender == "hider"){
            newM.classList.add("hider");
            if(role == "hider"){
                newM.classList.add("self");
            }else{
                newM.classList.add("opp");
            }
        }else{
            newM.classList.add("seeker");
            if(role == "hider"){
                newM.classList.add("opp");
            }else{
                newM.classList.add("self");
            }
        }



        container.appendChild(newM);
    }

}