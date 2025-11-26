async function getMessageChange(){
    let localMssgCount = document.getElementsByClassName("message").length;

    let mssgData = await fetch("http://flip4.engr.oregonstate.edu:6327/message-change");
    let json = await mssgData.json();
    let mssgCount = json.count;

    if(mssgCount > localMssgCount){
        return true;
    }else{
        console.log("err");
        return false;
    }
    
}

async function updateMessages(){
    if(await getMessageChange()){
        //getMessages()
        //getOldMessages()
        //for(let i = oldMssgs.length; i < mssgs.length; i++){
        //  createMessage(mssgs[i]);
        //}
    }
}