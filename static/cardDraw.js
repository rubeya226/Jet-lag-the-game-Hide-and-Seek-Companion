// When button is clicked, go to draw card page
document.getElementById("draw-card-btn").addEventListener("click", () => {
    window.location.href = "/hider/draw-card";
});

document.getElementById("back-from-cards").addEventListener("click", () => {
    window.location.href = "/hider";
});

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

