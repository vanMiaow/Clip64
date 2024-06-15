
const box = document.getElementById("box");

// prevent drag selected text
box.addEventListener("dragstart", (event) => {
    event.preventDefault();
});

// reset text when clicked
box.addEventListener("click", (event) => {
    event.preventDefault();
    event.target.innerText = "drop or paste";
});

// process pasted content
box.addEventListener("paste", (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.items[0];
    if (pasted.type.startsWith("image/")) {
        event.target.innerText = "pasted";
        const file = pasted.getAsFile();
        convert(file);
    } else {
        event.target.innerText = "not image";
    }
});

// set text when drag enter
box.addEventListener("dragenter", (event) => {
    event.preventDefault();
    event.target.innerText = "drop it";
});

// reset text when drag leave
box.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.target.innerText = "drop or paste";
});

// allow drop when drag over
box.addEventListener("dragover", (event) => {
    event.preventDefault();
});

// process dropped content
box.addEventListener("drop", (event) => {
    event.preventDefault();
    const dropped = event.dataTransfer.items[0];
    if (dropped.type.startsWith("image/")) {
        event.target.innerText = "dropped";
        const file = dropped.getAsFile();
        convert(file);
    } else {
        event.target.innerText = "not image";
    }
});

// convert image to base64, then paste to clipboard
function convert(file) {
    // read file as base64
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        // load base64 to image
        const image = new Image();
        image.addEventListener("load", () => {
            // resize if image too large
            const MAX_WIDTH  = 1920;
            const MAX_HEIGHT = 1080;
            let width  = image.width;
            let height = image.height;
            if (width > height) {
                if (width   > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width   = MAX_WIDTH;
                }
            } else {
                if (height  > MAX_HEIGHT) {
                    width  *= MAX_HEIGHT / height;
                    height  = MAX_HEIGHT;
                }
            }
            // create resized canvas
            const canvas = document.createElement("canvas");
            canvas.width  = width;
            canvas.height = height;
            // draw resized image
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, width, height);
            // convert resized image to base64
            const base64 = canvas.toDataURL("image/png");
            // write resized base64 to clipboard
            navigator.clipboard.writeText(base64);
        });
        image.src = event.target.result;
    });
    reader.readAsDataURL(file);
}
