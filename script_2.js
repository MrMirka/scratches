const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

// Load the top image
const topImage = new Image();
topImage.src = 'front.jpg'; // Replace with the path to your top image

topImage.onload = function() {
    // Draw the top image on the canvas
    ctx.drawImage(topImage, 0, 0, canvas.width, canvas.height);

    // Set up event listeners for mouse and touch events
    canvas.addEventListener('mousemove', handleScratch);
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('touchmove', handleScratch);
    canvas.addEventListener('touchstart', startScratching);
    canvas.addEventListener('touchend', stopScratching);
};

// Load the scratch texture
const scratchTexture = new Image();
scratchTexture.src = 'mask.png'; // Replace with the path to your scratch texture

let isScratching = false;
let lastX, lastY;

function startScratching(event) {
    isScratching = true;
    const rect = canvas.getBoundingClientRect();
    lastX = (event.clientX || event.touches[0].clientX) - rect.left;
    lastY = (event.clientY || event.touches[0].clientY) - rect.top;
}

function stopScratching() {
    isScratching = false;
    checkCompletion();
}

function handleScratch(event) {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    // Calculate distance and angle
    const distance = Math.hypot(x - lastX, y - lastY);
    const angle = Math.atan2(y - lastY, x - lastX);

    // Draw the texture along the line
    for (let i = 0; i < distance; i += scratchTexture.width / 4) { // Adjust the step size as needed
        const offsetX = Math.cos(angle) * i;
        const offsetY = Math.sin(angle) * i;
        ctx.drawImage(scratchTexture, x - offsetX - scratchTexture.width / 2, y - offsetY - scratchTexture.height / 2);
    }

    lastX = x;
    lastY = y;
}

function checkCompletion() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 0) {
            count++;
        }
    }

    const percentage = (count / (canvas.width * canvas.height)) * 100;

    if (percentage < 65) { // Adjust the percentage as needed
        onScratchComplete();
    }
}

function onScratchComplete() {
    alert('Scratch card is fully revealed!');
    // Add any other actions you want to perform when the scratch is complete
}
