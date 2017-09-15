// Try to use full screen on browser
window.scrollTo(0,1);

/*
    Loading/saving => notes/drawings
*/
$("#presentation").on("load", function () {

    // User clicks on "next" button on slideshow
    document.getElementById("presentation").contentWindow.document.getElementById("next").addEventListener("click", saveLoadNotes);
    // User clicks on "prev" button on slideshow
    document.getElementById("presentation").contentWindow.document.getElementById("previous").addEventListener("click", saveLoadNotes);
    // User changes presentation slide
    document.getElementById("presentation").contentWindow.document.getElementById("pageNumber").addEventListener("change", saveLoadNotes);

    function saveLoadNotes() {
        // Hide the canvas
        $(".my-drawing").hide();

        // Silly, but we need to wait for the iframe to change current (new) slide
        setTimeout(function() {
            var oldPageNr = $("#presentation").attr("data-old-page-nr");
            var page = document.getElementById("presentation").contentWindow.document.getElementById("pageNumber").value;
            saveNotes(oldPageNr);
            loadNotes(page);
            $("#presentation").attr("data-old-page-nr", page);
        }, 50);
    }

    function saveNotes(page) {
        // Fetching drawings from localStorage, or creating a new object for this purpose
        if (localStorage.getItem("drawings") !== null) {
            var drawings = JSON.parse(localStorage.getItem("drawings"));
        } else {
            var drawings = {};
        }

        // Fetching notes from localStorage, or creating a new object for this purpose
        if (localStorage.getItem("notes") !== null) {
            var notes = JSON.parse(localStorage.getItem("notes"));
        } else {
            var notes = {};
        }

        // Get drawings
        drawings[page]  = lc.getSnapshot(['shapes', 'colors']);
        // Get notes
        notes[page]  = tinymce.activeEditor.getContent();

        // Save the drawings/notes
        localStorage.setItem("drawings", JSON.stringify(drawings));
        localStorage.setItem("notes", JSON.stringify(notes));

        savedNotification();
    }

    function loadNotes(page) {
        // Reset the drawing area and the comments textbox
        lc.clear();
        tinymce.activeEditor.setContent("");

        // If there's a drawing for this slide => draw it!
        if (localStorage.getItem("drawings") !== null) {
            var drawings = JSON.parse(localStorage.getItem("drawings"));
            lc.loadSnapshot(drawings[page]);
            $(".my-drawing").fadeIn(250);
        }

        // If there's notes for this slide => comment it!
        if (localStorage.getItem("notes") !== null) {
            var notes = JSON.parse(localStorage.getItem("notes"));
            if (notes[page] !== undefined) {
                tinymce.activeEditor.setContent(notes[page]);
            }
        }
    }

    // Silly, but we need to wait for the drawing object to get ready!
    setTimeout(function() {
        loadNotes(1);
    }, 1000);

    // For safty reasons, save the work every fifth second
    setInterval(function() {
        var page = document.getElementById("presentation").contentWindow.document.getElementById("pageNumber").value;
        saveNotes(page);
    }, 5000);

    /*
        Just a toast that data is saved
    */
    function savedNotification() {
        $("#saved").fadeIn(250).delay(1000).fadeOut(250);
    }

});

/*
    Modal - about the web app
*/
var fadeTime = 250;
$("#about-btn").on("click", function () {
    $("#about-modal").fadeIn(fadeTime);
    $("#modal-background").fadeIn(fadeTime);
})

$(".modal .close, #modal-background").on("click", function () {
    $("#about-modal").fadeOut(fadeTime);
    $("#modal-background").fadeOut(fadeTime);
});
