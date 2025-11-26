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

async function messageChangeTemp(){
    if(await getMessageChange()){
        console.log("aye sir");
    }else{
        console.log("no sir");
    }
}