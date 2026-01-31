const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

const time = document.querySelector(".time");

let interval;
let timeLeft = 1500;

function updateTime() {

  let minutes = Math.floor(timeLeft / 60);
  let seconds = Math.floor(timeLeft % 60);

  let timeFormate = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  time.innerHTML = timeFormate;

}

updateTime();

function startTimer () {
  interval = setInterval(() => {
    timeLeft--;
    updateTime();
    if(timeLeft == 0) {
      clearInterval(interval);
      alert("Time's UP!");
      timeLeft = 1500;
      updateTime();
    }
  } , 1000)
}

function stopTimer () {
  clearInterval(interval);
}

function resetTimer () {
  clearInterval(interval);
  timeLeft = 1500;
  updateTime();
}

start.addEventListener("click" , startTimer);
stop.addEventListener("click" , stopTimer);
reset.addEventListener("click" , resetTimer);