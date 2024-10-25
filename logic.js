let clicks = 0;
let intervalId;
let isGameActive = false;
let timer = 10; // Default timer value

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

// Attach event listeners to timer buttons
document.getElementById('timer1').addEventListener('click', function() {
  setTimer(1);
});
document.getElementById('timer5').addEventListener('click', function() {
  setTimer(5);
});
document.getElementById('timer10').addEventListener('click', function() {
  setTimer(10);
});
document.getElementById('timer20').addEventListener('click', function() {
  setTimer(20);
});
document.getElementById('timer50').addEventListener('click', function() {
  setTimer(50);
});

// Attach event listener to the upload image button
document.getElementById('uploadImage').addEventListener('click', triggerImageUpload);

// Attach event listener to the file input
document.getElementById('imageInput').addEventListener('change', handleImage);

// Attach event listener to the glass box
const glassBox = document.getElementById('glassBox');
glassBox.addEventListener('click', breakGlass);
glassBox.addEventListener('touchstart', breakGlass);

// Attach event listener to the close alert button
document.getElementById('closeAlert').addEventListener('click', closeCustomAlert);

function setTimer(seconds) {
  timer = seconds;
  document.getElementById('timerDisplay').textContent = `Timer: ${timer} sec`;
}

// function breakGlass(event) {
//   event.preventDefault(); // Prevent default touch behavior

//   if (!isGameActive) {
//     startGame();
//     document.getElementById('glassBox').innerHTML = '';
//     return;
//   }

//   clicks++;
//   document.getElementById('clickCounter').textContent = `${clicks} clicks`;

//   // Adjust touch event coordinates if necessary
//   let x = event.clientX || (event.touches && event.touches[0].clientX);
//   let y = event.clientY || (event.touches && event.touches[0].clientY);

//   // Create crack
//   const crack = document.createElement('div');
//   crack.innerText = "❌";
//   crack.className = 'crack';
//   crack.style.left = `${x - event.target.offsetLeft}px`;
//   crack.style.top = `${y - event.target.offsetTop}px`;
//   crack.style.width = `${Math.random() * 50 + 20}px`;
//   crack.style.transform = `rotate(${Math.random() * 360}deg)`;
//   crack.style.zIndex = '10';
//   event.target.appendChild(crack);

//   // Create punch emoji
//   const punch = document.createElement('div');
//   punch.textContent = '👊';
//   punch.className = 'punch';
//   punch.style.left = `${x - event.target.offsetLeft}px`;
//   punch.style.top = `${y - event.target.offsetTop}px`;
//   punch.style.zIndex = '11';
//   event.target.appendChild(punch);

//   // Play smash sound using Web Audio API
//   playSmashSound();

//   // Remove punch emoji after animation
//   setTimeout(() => {
//     punch.remove();
//   }, 500);
// }
function breakGlass(event) {
  event.preventDefault();

  if (!isGameActive) {
    startGame();
    document.getElementById('glassBox').innerHTML = '';
    return;
  }

  clicks++;
  document.getElementById('clickCounter').textContent = `${clicks} clicks`;

  // Get the glass box element and its dimensions
  const glassBox = event.target;
  const boxRect = glassBox.getBoundingClientRect();

  // Calculate click position relative to the glass box
  let x = (event.clientX || (event.touches && event.touches[0].clientX)) - boxRect.left;
  let y = (event.clientY || (event.touches && event.touches[0].clientY)) - boxRect.top;

  // Constrain coordinates within the glass box boundaries
  x = Math.max(0, Math.min(x, boxRect.width));
  y = Math.max(0, Math.min(y, boxRect.height));

  // Create crack with constrained coordinates
  const crack = document.createElement('div');
  crack.innerText = "❌";
  crack.className = 'crack';
  crack.style.position = 'absolute';
  crack.style.left = `${x}px`;
  crack.style.top = `${y}px`;
  crack.style.width = `${Math.random() * 50 + 20}px`;
  crack.style.transform = `rotate(${Math.random() * 360}deg)`;
  crack.style.zIndex = '10';
  glassBox.appendChild(crack);

  // Create punch emoji with constrained coordinates
  const punch = document.createElement('div');
  punch.textContent = '👊';
  punch.className = 'punch';
  punch.style.position = 'absolute';
  punch.style.left = `${x}px`;
  punch.style.top = `${y}px`;
  punch.style.zIndex = '11';
  glassBox.appendChild(punch);

  // Play smash sound using Web Audio API
  playSmashSound();

  // Remove punch emoji after animation
  setTimeout(() => {
    punch.remove();
  }, 500);
}

function startGame() {
  clearInterval(intervalId); // Clear any existing interval
  isGameActive = true;
  clicks = 0;
  document.getElementById('clickCounter').textContent = `${clicks} clicks`;

  // Update the timer display
  document.getElementById('timerDisplay').textContent = `Timer: ${timer} sec`;

  intervalId = setInterval(() => {
    timer--;
    document.getElementById('timerDisplay').textContent = `Timer: ${timer} sec`;
    if (timer <= 0) {
      clearInterval(intervalId);
      isGameActive = false;
      showCustomAlert(`Hurray! You clicked ${clicks} times.`);
    }
  }, 1000);
}

function showCustomAlert(message) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('customAlert').style.display = 'block';
  const Congrats = document.getElementById('Congrats');
  if (Congrats) {
    Congrats.play();
  }
}

function closeCustomAlert() {
  document.getElementById('customAlert').style.display = 'none';
  resetGame();
}

function resetGame() {
  timer = 10; // Reset to default value or keep last selected value
  clicks = 0;
  document.getElementById('timerDisplay').textContent = `Timer: ${timer} sec`;
  document.getElementById('clickCounter').textContent = 'Count';
  document.getElementById('glassBox').textContent = 'Click to start';
  isGameActive = false;
  clearInterval(intervalId);
}

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

resetGame();
