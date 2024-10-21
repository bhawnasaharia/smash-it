let timer = 10;
let clicks = 0;
let intervalId;
let isGameActive = false;
const smashSound = document.getElementById('smashSound');

function setTimer(seconds) {
  timer = seconds;
  document.getElementById('timerDisplay').textContent = `Timer: ${timer}`;
}

function breakGlass(event) {
  if (!isGameActive) {
    startGame();
    document.getElementById('glassBox').innerHTML = '';
    return;
  }

  clicks++;
  document.getElementById('clickCounter').textContent = `${clicks} clicks`;

  // Create crack
  const crack = document.createElement('div');
  crack.innerText = "❌";
  crack.className = 'crack';
  crack.style.left = `${event.clientX - event.target.offsetLeft}px`;
  crack.style.top = `${event.clientY - event.target.offsetTop}px`;
  crack.style.width = `${Math.random() * 50 + 20}px`;
  crack.style.transform = `rotate(${Math.random() * 360}deg)`;
  crack.style.zIndex = '10'; // Add this line
  event.target.appendChild(crack); 33

  // Create punch emoji
  const punch = document.createElement('div');
  punch.textContent = '👊';
  punch.className = 'punch';
  punch.style.left = `${event.clientX - event.target.offsetLeft}px`;
  punch.style.top = `${event.clientY - event.target.offsetTop}px`;
  punch.style.zIndex = '11'; // Add this line
  event.target.appendChild(punch);

  // Play smash sound
  smashSound.currentTime = 0;
  smashSound.play();

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
