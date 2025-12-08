
var filePath = "/time.json"

function chat(){
    window.location.href = "/chat/hider";
}

document.getElementById("draw-card-btn").addEventListener("click", () => {
    window.location.href = "/hider-draw";
});

var display = document.getElementById('timer-text')

var spent_time = parseInt(localStorage.getItem("time")) || 0
var start_time = parseInt(localStorage.getItem("start_time")) || Date.now()
var timer_interval
var timer_running = localStorage.getItem("timer_run") === "true"
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
        spent_time = parseInt(localStorage.getItem("time"))
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

var card_slot = document.getElementsByClassName("card-slot")
    console.log(card_slot)
    console.log("Number of card slots: " + card_slot.length)

for (let i = 0; i < card_slot.length; i++) {
    card_slot[i].addEventListener("click", () => {
        console.log("Card #:", i, " clicked")
        var hiddenModalBackdrop = document.getElementById("modal-backdrop")
        var hiddenModal = document.getElementById("card-remove-modal")

        hiddenModalBackdrop.classList.remove("hidden")
        hiddenModal.classList.remove("hidden")

        // Bind remove logic
        var removeBtn = document.getElementById("card-remove-btn")

        // Remove previous listeners
        removeBtn.replaceWith(removeBtn.cloneNode(true));
        removeBtn = document.getElementById("card-remove-btn")

        removeBtn.addEventListener("click", async () => {
            var reqURL = "/hider/remove-card/" + i
           
            await fetch(reqURL, {
                method: "POST"
            })
            
            // Remove card from UI immediately
            card_slot[i].remove()
            window.location.href = "/hider" // Refresh to update card indices

            // Close modal
            hiddenModalBackdrop.classList.add("hidden")
            hiddenModal.classList.add("hidden")
        })
    })
}


var closeCardRemoveModal = document.getElementById("close-card-remove-modal");
closeCardRemoveModal.addEventListener("click", () => {
    var hiddenModalBackdrop = document.getElementById("modal-backdrop")
    var hiddenModal = document.getElementById("card-remove-modal")

    hiddenModalBackdrop.classList.add("hidden")
    hiddenModal.classList.add("hidden")
})