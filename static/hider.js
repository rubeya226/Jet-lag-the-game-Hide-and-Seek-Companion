
var filePath = "/time.json"

let runTime = 0;

function chat(){
    window.location.href = "/chat/hider";
}

document.getElementById("draw-card-btn").addEventListener("click", () => {
    window.location.href = "/hider/draw-card";
});

var display = document.getElementById('timer-text')

var spent_time = parseInt(localStorage.getItem("time")) || 0
var start_time = parseInt(localStorage.getItem("start_time")) || Date.now()
var timer_interval
var timer_running = localStorage.getItem("timer_run") === "true"
var timer_done = false
function twoDigitFormat(time){
    if(time < 10){
        return "0" + time;
    }else{
        return time;
    }
}
function time_format(ms){
    let hours = Math.floor(ms/3600000)
    hours = twoDigitFormat(hours);
    let minutes = Math.floor((ms % 3600000)/60000)
    minutes = twoDigitFormat(minutes);
    let seconds = Math.floor(((ms % 3600000)% 60000)/1000)
    seconds = twoDigitFormat(seconds);
    return (
        hours + ":" + minutes + ":" + seconds
    )
}
function timer_start(){
    console.log("timer_start called")
    if(!timer_running){
        timer_running = true
        start_time = Date.now() - spent_time
        localStorage.setItem("start_time", start_time)
        localStorage.setItem("timer_run", true)
        timer_interval = setInterval(timer, 1000)
    }
}
function timer_pause(){
    console.log("timer_pause called")
    if(timer_running){
        timer_running = false
        clearInterval(timer_interval)
        spent_time = Date.now() - start_time;
        localStorage.setItem("time", spent_time)
        localStorage.setItem("timer_run", false)
    }
    
}
function timer_end(){
    console.log("timer_end called")
    timer_pause()
    runTime = localStorage.getItem("time"); //for use in storing time to leaderboard
    console.log("runTime:", runTime);
    showLeaderboardModal(runTime);
    localStorage.setItem("time", 0)
    spent_time = 0
    localStorage.setItem("start_time", Date.now())
    start_time = Date.now()
    console.log("time updated to: "+localStorage.getItem("time"))
    display.textContent = "Hiding Time: 00:00:00"

}
window.onload = () => {
    if (start_time && timer_running) {
        timer_interval = setInterval(timer, 1000)
        spent_time = parseInt(localStorage.getItem("time")) || 0
    }
    display.textContent = "Hiding Time: "+time_format(parseInt(localStorage.getItem("time")))
}
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && timer_running) {
        spent_time = parseInt(localStorage.getItem("time"))
        display.textContent = "Hiding Time: " + time_format(spent_time)
        console.log("timer remembered?")
    }
})
function timer(){
    if(!timer_running) return
    spent_time = Date.now() - start_time
    localStorage.setItem("time", spent_time)
    localStorage.setItem("start_time", start_time)
    localStorage.setItem("timer_run", timer_running)
    console.log("time stored in localStorage")
    display.textContent = "Hiding Time: "+time_format(spent_time)
    console.log("time updated to: "+parseInt(localStorage.getItem("time")))

}

function showLeaderboardModal(time){
    time = time_format(time);
    let modal = document.getElementById("leaderboard-add-modal");
    let timeDisplay = document.getElementById("leaderboard-add-time");
    timeDisplay.textContent = time;
    modal.classList.toggle("hidden", false);
}

function hideLeaderboardModal(){
    let modal = document.getElementById("leaderboard-add-modal");
    modal.classList.toggle("hidden", true);
}

function storeLeaderboardData(){

}