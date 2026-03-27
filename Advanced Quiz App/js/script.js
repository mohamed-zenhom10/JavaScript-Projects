// Select Elements 
const selectCategories = document.querySelector(".select-category");
const categoreis = document.getElementById("categories");
const quizContainer = document.querySelector(".container");
const questionTitle = document.querySelector(".question-title");
const questionAnswers = document.querySelector(".question-answers");
const submitBtn = document.getElementById("submit-answer");
const bullets = document.querySelector(".bullets");
const countdown = document.querySelector(".countdown");
const quizCategory = document.querySelector(".quiz-category span");
const QNumber = document.querySelector(".questions-number span");
const result = document.querySelector(".result");

// Variables 
let currentIndex = 0;
let totalDegree = 0;
let countdownInterval;


// Functions 

function getQuestions(category) {

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200) {

      let questions = JSON.parse(this.responseText);
      let questionsCount = questions.length;

      QNumber.innerHTML = questionsCount;
      createBullets(questionsCount);

      addQuestions(questions[currentIndex] , questionsCount);
      countDown(10 , questionsCount);

      submitBtn.onclick = () => {

        let correctAnswer = questions[currentIndex].correct_answer;

        checkRightAnswer(correctAnswer);
        questionTitle.innerHTML = "";
        questionAnswers.innerHTML = "";
        currentIndex++;
        addQuestions(questions[currentIndex] , questionsCount);
        handleBullets();
        clearInterval(countdownInterval);
        countDown(10 , questionsCount);
        showResult(questionsCount);

      }

    }

  }

  request.open("GET" , `../assets/${category}.json`);
  request.send();

}

categoreis.addEventListener("change" , () => {
  quizContainer.classList.add("display")
  result.classList.remove("display");
  setUp();
  let value = categoreis.value;
  getQuestions(value);
  quizCategory.innerHTML = value;
  quizCategory.style.textTransform = "capitalize";
})

function createBullets(Qnumber) {
  for(let i = 0 ; i < Qnumber ; i++) {
    let span = document.createElement("span");
    if(i == 0) {
      span.className = "active";
    }
    bullets.appendChild(span);
  }
}

function addQuestions(questions , Qnumber) {
  if(currentIndex < Qnumber) {

    let questionTitleContainer = document.createElement("h2");
    let question_title = document.createTextNode(questions.question_title);
    questionTitleContainer.appendChild(question_title);
    questionTitle.appendChild(questionTitleContainer);

    for(let i = 1 ; i <= 4 ; i++) {
      let answer_div = document.createElement("div");
      answer_div.className = "answer";
      answer_div.id = `answer_${i}`;

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.name = "answer";
      radioInput.dataset.answer = questions[`answer_${i}`];

      if(i == 1) {
        radioInput.checked = true;
      }

      let answerLabel = document.createElement("label");
      answerLabel.htmlFor = `answer_${i}`;
      let answerText = document.createTextNode(questions[`answer_${i}`]);
      answerLabel.appendChild(answerText);

      answer_div.appendChild(radioInput);
      answer_div.appendChild(answerLabel);

      questionAnswers.appendChild(answer_div);
    }
    
  }
}

function handleBullets() {
  let spans = Array.from(document.querySelectorAll(".bullets span"));
  spans.forEach((span , index) => {
    if(index == currentIndex) {
      span.className = "active";
    }
  })
}

function countDown(duration , count) {
  if(currentIndex < count) {
    let minutes , seconds;
    countdownInterval = setInterval(() => {
      
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdown.innerHTML = `${minutes}:${seconds}`;

      if(--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }

    } , 1000)
  }
}

function checkRightAnswer(r_answer) {
  let choosen_answer;
  let answers = document.getElementsByName("answer");
  for(let i = 0 ; i < answers.length ; i++) {
    if(answers[i].checked) {
      choosen_answer = answers[i].dataset.answer;
    }
  }
  if(choosen_answer === r_answer) {
    totalDegree++;
  }
}

function showResult(count) {
  if(currentIndex == count) {
    questionTitle.classList.remove("display");
    questionAnswers.classList.remove("display");
    submitBtn.classList.remove("display");
    bullets.classList.remove("display");
    countdown.classList.remove("display");
    result.classList.add("display");
    let theClass;
    let theMsg;
    if(totalDegree < 4) {
      theClass = "bad";
      theMsg = "Your Degree Is Very Bad";
    } else if (totalDegree < 8) {
      theClass = "good";
      theMsg = "Your Degree Is Good";
    } else {
      theClass = "very-good";
      theMsg = "Your Degree Is Very Good";
    }
    let res = `Your Degree Is ${totalDegree} / ${currentIndex} <span class="${theClass}">${theMsg}</span>`;
    result.innerHTML = res;
    selectCategories.classList.remove("stop");
  }
}

function setUp() {
  questionTitle.classList.add("display");
  questionAnswers.classList.add("display");
  submitBtn.classList.add("display");
  bullets.classList.add("display");
  countdown.classList.add("display");
  selectCategories.classList.add("stop");
  bullets.innerHTML = "";
  quizCategory.innerHTML = "";
  QNumber.innerHTML = "";
  questionTitle.innerHTML = "";
  questionAnswers.innerHTML = "";
  result.innerHTML = "";
  totalDegree = 0;
  currentIndex = 0;
}