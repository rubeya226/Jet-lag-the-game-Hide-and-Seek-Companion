let flipNum = 2;

function chat(){
    window.location.href = "http://flip" + flipNum + ".engr.oregonstate.edu:6327/chat/hider";
}
var display = document.getElementById('timer-text')
var spent_time = 0
var start_time
var timer_interval
var timer_running = false
var timer_done = false
function time_format(ms){
    const hours = Math.floor(ms/3600000)
    const minutes = Math.floor((ms % 3600000)/60000)
    const seconds = Math.floor(((ms % 3600000)% 60000)/1000)
    return (
        String(hours).padStart(2, '0') +':'+ String(minutes).padStart(2, '0')+':'+ String(seconds).padStart(2, '0')
    )
}
function timer_start(){
    console.log("timer_start called")
    if(!timer_running){
        timer_running = true
        start_time = Date.now() - spent_time
        timer_interval = setInterval(timer, 1000)
    }
}
function timer_pause(){
    console.log("timer_pause called")
    if(timer_running){
        timer_running = false
        clearInterval(timer_interval)
        spent_time = Date.now() - start_time;

    }
    
}
function timer_end(){
    console.log("timer_end called")
    if(timer_running){
        timer_running = false
        clearInterval(timer_interval)
        spent_time = Date.now() - start_time;

    }
}

function timer(){
    spent_time = Date.now() - start_time
    display.textContent = "Hiding Time: "+time_format(spent_time)
    console.log("time updated to: "+time_format(spent_time))
}