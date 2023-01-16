// Create the canvas element
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
document.body.appendChild(canvas);

// Get the canvas context
const ctx = canvas.getContext('2d');

// Set the initial score
let score = 0;
let scoreTime = new Date()
const startTime = new Date();

// Create the green box object
const greenBox = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 50,
    height: 50,
    color: 'green',
    zIndex: 0
};

// Create an array to store the randomly colored boxes
const boxes = [];

// Function to create a new randomly colored box
// The box shouldn't start off the canvas
function createBox() {
    const box = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        xVelocity: Math.random() * 2 - 1,
        yVelocity: Math.random() * 2 - 1
    };

    // Make sure the box isn't off the canvas
    if (box.x + box.width > canvas.width) {
        box.x = canvas.width - box.width;
    }
    if (box.y + box.height > canvas.height) {
        box.y = canvas.height - box.height;
    }

    boxes.push(box);
}

// Create some initial boxes
for (let i = 0; i < 10; i++) {
    createBox();
}

// Function to draw the boxes on the canvas
// The green box should be drawn after the nth box where n is the zIndex
function drawBoxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxes.forEach((box, index) => {
        if (index === greenBox.zIndex) {
            ctx.fillStyle = greenBox.color;
            ctx.fillRect(greenBox.x, greenBox.y, greenBox.width, greenBox.height);
        }
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    })
}

// Function to update the position of the boxes
function updateBoxes() {
    boxes.forEach((box) => {
        box.x += box.xVelocity;
        box.y += box.yVelocity;

        // Check for collision with edges of canvas
        if (box.x + box.width > canvas.width || box.x < 0) {
            box.xVelocity = -box.xVelocity;
        }
        if (box.y + box.height > canvas.height || box.y < 0) {
            box.yVelocity = -box.yVelocity;
        }
    });
}

// Event listener to handle clicks on the canvas
canvas.addEventListener('click', (event) => {
    // Check if the click was on the green box
    if (event.clientX > greenBox.x && event.clientX < greenBox.x + greenBox.width &&
        event.clientY > greenBox.y && event.clientY < greenBox.y + greenBox.height) {
        score++;
        scoreTime = new Date();
        greenBox.x = Math.random() * canvas.width;
        greenBox.y = Math.random() * canvas.height;
        if (greenBox.x + greenBox.width > canvas.width) {
            greenBox.x = canvas.width - greenBox.width;
        }
        if (greenBox.y + greenBox.height > canvas.height) {
            greenBox.y = canvas.height - greenBox.height;
        }
        // Create boxes equal to the score
        for (let i = 0; i < score; i++) {
            createBox();
        }
        // Set the zIndex to be a random number in the last 10% of the boxes array
        greenBox.zIndex = Math.floor(Math.random() * (boxes.length * 0.1) + boxes.length * 0.9);
    }
});

let scoreX = 10;
let scoreY = 50;
let scoreXVelocity = 1;
let scoreYVelocity = 1;

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, scoreX, scoreY);
    scoreX += scoreXVelocity;
    scoreY += scoreYVelocity;
    if (scoreX + 100 > canvas.width || scoreX < 0) {
        scoreXVelocity = -scoreXVelocity;
    }
    if (scoreY + 30 > canvas.height || scoreY < 0) {
        scoreYVelocity = -scoreYVelocity;
    }    
}

function animate() {
    updateBoxes();
    drawBoxes();
    drawScore();
    requestAnimationFrame(animate);
}

// Function main loop
function start() {
    // Make sure the green box isn't off the canvas
    if (greenBox.x + greenBox.width > canvas.width) {
        greenBox.x = canvas.width - greenBox.width;
    }
    if (greenBox.y + greenBox.height > canvas.height) {
        greenBox.y = canvas.height - greenBox.height;
    }
    animate();
}