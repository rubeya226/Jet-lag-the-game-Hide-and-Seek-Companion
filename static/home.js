/*
 * go to the specified page
 */
function goTo(page){
    let url = "/";
    url += page;

    window.location.href = url;
}

/*
 * get the leaderboard
 * Returns {list of obj} - the list of top three times
 */
async function getLeaderboardInfo(){
    let leaderboard = await fetch("/leaderboard");
    console.log("== raw leaderboard", leaderboard);
    leaderboard = await leaderboard.json();
    console.log("== leaderboard json str flavoured", leaderboard);
    return leaderboard;
}

/*
 * populates the displayed leaderboard with the top three times
 */
async function populateLeaderboard(){
    let leaderboard = await getLeaderboardInfo();
    let leaderboardElems = [];
    leaderboardElems[0] = document.getElementsByClassName("first-place")[0];
    leaderboardElems[1] = document.getElementsByClassName("second-place")[0];
    leaderboardElems[2] = document.getElementsByClassName("third-place")[0];

    for(let i = 0; i < 3; i++){
        leaderboardElems[i].textContent = leaderboard[i].name + ": " + leaderboard[i].timeStr;
    }
}