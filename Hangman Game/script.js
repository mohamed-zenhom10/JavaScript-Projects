// Letters

const letters = "abcdefghijklmnopqrstuvwxyz";

// Array Of Letters

let lettersArray = Array.from(letters);

// Select Letters Container

let lettersContainer = document.querySelector(".letters");

// Generate Letters

lettersArray.forEach(letter => {

  // Create Span

  let span = document.createElement("span");

  // Create Text Node

  let theLetter = document.createTextNode(letter);

  // Append The Letter To Span

  span.appendChild(theLetter);

  // Add Class To Span

  span.className = "letter-box";

  // Append The Span To The Letters Container

  lettersContainer.appendChild(span);

})

// Object Of Words + Categories

const data = {
  programming: ["JavaScript", "Python", "C++", "React", "NodeJs" , "php" , "mysql"],
  movies: ["Inception", "The Matrix", "Interstellar", "The Godfather", "Avengers"],
  people: ["Elon Musk", "Albert Einstein", "Ada Lovelace", "Nelson Mandela", "Marie Curie"],
  countries: ["Egypt", "USA", "Germany", "Japan", "Brazil" , "UK" , "France" , "Iraq"]
};

// Get Random Propery

let allKeys = Object.keys(data);

let randomPropertyNumber = Math.floor(Math.random() * allKeys.length);

let randomPropertyName = allKeys[randomPropertyNumber];

let randomPropertyValue = data[randomPropertyName];

let randomValueNumber = Math.floor(Math.random() * randomPropertyValue.length);

let randomValueValue = randomPropertyValue[randomValueNumber];

// Set Category Info

document.querySelector(".game-info .category span").innerHTML = randomPropertyName;

// Select Letters Guess Container

let letterGuessContainer = document.querySelector(".letters-guess");

// Convert The Choosen Word  To Array

let lettersAndSpace = Array.from(randomValueValue);

// Create Sapans Depend On Word

lettersAndSpace.forEach(letter => {

  // Create Empty Span

  let emptySpan = document.createElement("span");

  // If Letter Is Space

  if (letter === " ") {

    emptySpan.className = "has-space";

  }

  // Append Spans To Guess Container

  letterGuessContainer.appendChild(emptySpan);

});

let guessSpans = document.querySelectorAll(".letters-guess span");

// Set Wrong Attempts 

let wrongTries = 0;

let TheDraw = document.querySelector(".hangman-draw");


// Handle Clicking On Letters

document.addEventListener("click" , (event) => {
  
  // Set Status
  let theStatus = false;

  if(event.target.className === "letter-box") {

    event.target.classList.add("clicked");

    let theLetter = event.target.innerHTML.toLowerCase();

    let theChoosenWord = Array.from(randomValueValue.toLowerCase());

    theChoosenWord.forEach((wordLetter , wordIndex) => {

      if(theLetter == wordLetter) {

        theStatus = true;

        guessSpans.forEach((span , spanIndex) => {

          if(wordIndex === spanIndex) {

            span.innerHTML = wordLetter;

          }

        })

      }

    })

    if(theStatus !== true) {

      wrongTries++;

      TheDraw.classList.add(`wrong-${wrongTries}`);

      if(wrongTries === 8) {

        endGame();

        lettersContainer.classList.add("finished");

      }
      
    }

  }

})

function endGame() {

  let popup = document.createElement("div");

  let text = document.createTextNode(`Game Over The  Word Is ${randomValueValue}`);

  popup.append(text);

  popup.className = "end";

  document.body.appendChild(popup);

}