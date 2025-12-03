let flipNum = 2;
/*
 * go to the specified page
 */
function goTo(page){
    let url = "http://flip" + flipNum + ".engr.oregonstate.edu:6327/";
    url += page;

    window.location.href = url;
}