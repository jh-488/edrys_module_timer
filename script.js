const timerContainer = document.querySelector(".timer_container");
const feedbackContainer = document.querySelector(".feedback");
const feedbackMessage = document.getElementById("feedback_message");
const startBtn = document.getElementById("start");
const tryAgainBtn = document.getElementById("try_again_btn");
const timerCircle = document.querySelector(".timer-circle");
const circumference = parseFloat(getComputedStyle(timerCircle).getPropertyValue("stroke-dasharray"));


let timerStart = 1;

Edrys.onReady(() => {
  console.log("Module Timer is loaded!");

  countdownElement.textContent = Edrys.module.config.timer ? `${Edrys.module.config.timer}:00` : "--:--";

  //timerStart = Edrys.module.config.timer ? Edrys.module.config.timer : 5;
});

// Create a countdown timer
let time;
let timerInterval;

const countdownElement = document.querySelector(".countdown");

const updateCountdown = () => {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  countdownElement.textContent = `${minutes}:${seconds}`;

  // Calculate the percentage of time remaining
  const percentage = (time / (timerStart * 60)) * 100;
  const dashOffset = circumference * (1 - (percentage / 100));

  // Update the stroke dash offset to animate the circle
  timerCircle.style.strokeDashoffset = dashOffset;

  // Change the color of the timer circle if remaining time is under 20%
  if (percentage < 20) {
    timerCircle.style.stroke = "#ea3943"; 
  } else {
    timerCircle.style.stroke = "#4ca2ff";
  }

  if (time < 0) {
    clearInterval(timerInterval);
    time = timerStart * 60;
    updateCountdown();
    Edrys.sendMessage("timer-ended", "Timer ended!");
    startBtn.disabled = false;

    feedbackContainer.classList.add("red-bg");
    setFeedbackMessage("Time's up! Challenge failed!");

    return;
  }

  time--;
};

const stopTimer = () => {
  clearInterval(timerInterval);
  time = timerStart * 60;
  updateCountdown();
  startBtn.disabled = false;
};

// Handle the timer start
const startTimer = () => {
  startBtn.disabled = true;
  time = timerStart * 60;
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
  Edrys.sendMessage("timer-started", "Timer started!");
};

const tryAgain = () => {
  feedbackContainer.classList.add("hidden");
  timerContainer.classList.remove("hidden");

  Edrys.sendMessage("timer-ended", "Timer ended!");
};

startBtn.addEventListener("click", startTimer);
tryAgainBtn.addEventListener("click", tryAgain);

// Set the feedback message and show the feedback container
const setFeedbackMessage = (message) => {
  feedbackMessage.textContent = message;
  timerContainer.classList.add("hidden");
  feedbackContainer.classList.remove("hidden");
};

// Handle received messages from the code editor module
Edrys.onMessage(({ from, subject, body, module }) => {
  if (subject === "challenge-solved") {
    // Calculate the time needed to solve the challenge
    elapsedTimeInSeconds = timerStart * 60 - time;
    const minutes = Math.floor(elapsedTimeInSeconds / 60);
    const seconds = elapsedTimeInSeconds % 60;

    stopTimer();

    feedbackContainer.classList.add("green-bg");
    setFeedbackMessage(
      minutes > 0
        ? `Congrats! Challenge solved in ${minutes} minutes and ${seconds} seconds!`
        : `Congrats! Challenge solved in ${seconds} seconds!`
    );
  }
}, (promiscuous = true));
