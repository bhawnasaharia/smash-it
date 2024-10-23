let clicks = 0;
let intervalId;
let isGameActive = false;

let audioContext;
let smashBuffer;

// Initialize the AudioContext and load the audio buffer
function initAudio() {
  // Create the AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Fetch and decode the audio file
  fetch('table-smash-47690.mp3') // Replace with the actual path to your audio file
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(buffer => {
      smashBuffer = buffer;
    })
    .catch(e => console.error('Error loading audio file:', e));

  // Remove the event listeners after initialization
  document.removeEventListener('touchstart', initAudio);
  document.removeEventListener('click', initAudio);
}

// Play the smash sound using Web Audio API
function playSmashSound() {
  if (!smashBuffer) {
    // Audio buffer not loaded yet
    return;
  }

  const source = audioContext.createBufferSource();
  source.buffer = smashBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Add event listeners to initialize audio on first user interaction
document.addEventListener('touchstart', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });

// Update your event listener to handle both click and touchstart events
const glassBox = document.getElementById('glassBox');
glassBox.addEventListener('click', breakGlass);
glassBox.addEventListener('touchstart', breakGlass);

function breakGlass(event) {
  event.preventDefault(); // Prevent default touch behavior

  if (!isGameActive) {
    startGame();
    document.getElementById('glassBox').innerHTML = '';
    return;
  }

  clicks++;
  document.getElementById('clickCounter').textContent = `${clicks} clicks`;

  // Adjust touch event coordinates if necessary
  let x = event.clientX || event.touches[0].clientX;
  let y = event.clientY || event.touches[0].clientY;

  // Create crack
  const crack = document.createElement('div');
  crack.innerText = "❌";
  crack.className = 'crack';
  crack.style.left = `${x - event.target.offsetLeft}px`;
  crack.style.top = `${y - event.target.offsetTop}px`;
  crack.style.width = `${Math.random() * 50 + 20}px`;
  crack.style.transform = `rotate(${Math.random() * 360}deg)`;
  crack.style.zIndex = '10';
  event.target.appendChild(crack);

  // Create punch emoji
  const punch = document.createElement('div');
  punch.textContent = '👊';
  punch.className = 'punch';
  punch.style.left = `${x - event.target.offsetLeft}px`;
  punch.style.top = `${y - event.target.offsetTop}px`;
  punch.style.zIndex = '11';
  event.target.appendChild(punch);

  // Play smash sound using Web Audio API
  playSmashSound();

  // Remove punch emoji after animation
  setTimeout(() => {
    punch.remove();
  }, 500);
}

function startGame() {
  isGameActive = true;
  clicks = 0;
  document.getElementById('clickCounter').textContent = `${clicks} clicks`;

  intervalId = setInterval(() => {
    timer--;
    document.getElementById('timerDisplay').textContent = `Timer: ${timer}`;
    if (timer === 0) {
      clearInterval(intervalId);
      isGameActive = false;
      showCustomAlert(`Hurray! You clicked ${clicks} times.`);
    }
  }, 1000);
}

// Rest of your code remains the same...


function showCustomAlert(message) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('customAlert').style.display = 'block';
  Congrats.play();
}

function closeCustomAlert() {
  document.getElementById('customAlert').style.display = 'none';
  resetGame();
}

function resetGame() {
  timer = 10;
  clicks = 0;
  document.getElementById('timerDisplay').textContent = 'Timer';
  document.getElementById('clickCounter').textContent = 'Count';
  document.getElementById('glassBox').textContent = 'Click to start';
  document.getElementById('glassBox').innerHTML = 'Click to start';
}

resetGame();


function triggerImageUpload() {
  document.getElementById('imageInput').click();
}

function handleImage(event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var glassBox = document.getElementById('glassBox');
      glassBox.style.backgroundImage = `url(${e.target.result})`;
      glassBox.style.backgroundSize = 'cover';
      glassBox.style.backgroundPosition = 'center';
      glassBox.innerHTML = ''; // Clear any existing content
    };
    reader.readAsDataURL(file);
  }
} 
