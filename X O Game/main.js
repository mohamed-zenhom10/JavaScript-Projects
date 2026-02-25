const title = document.querySelector(".game-title");
let turn = 'x';

let elements = [];


function winner(num1 , num2 , num3) {
  title.innerHTML = `${elements[num1]} Win`;
  document.getElementById(`card${num1}`).classList.add("end");
  document.getElementById(`card${num2}`).classList.add("end");
  document.getElementById(`card${num3}`).classList.add("end");
  setInterval(() => {
    title.innerHTML += ".";
  } , 1000)
  setTimeout(() => {
    location.reload();
  } , 3000)
}

function handleElements() {
  for(let i = 1 ; i < 10 ; i++) {
    elements[i] = document.getElementById(`card${i}`).innerHTML;
  }
  if(elements[1] == elements[2] && elements[2] == elements[3] && elements[1] != "") {
    winner(1 , 2 , 3);
  } else if(elements[4] == elements[5] && elements[5] == elements[6] && elements[4] != "") {
    winner(4 , 5 , 6);
  } else if(elements[7] == elements[8] && elements[8] == elements[9] && elements[7] != "") {
    winner(7 , 8 , 9);
  } else if(elements[1] == elements[4] && elements[4] == elements[7] && elements[1] != "") {
    winner(1 , 4 , 7);
  } else if(elements[2] == elements[5] && elements[5] == elements[8] && elements[2] != "") {
    winner(2 , 5 , 8);
  } else if(elements[3] == elements[6] && elements[6] == elements[9] && elements[4] != "") {
    winner(3 , 6 , 9);
  } else if(elements[1] == elements[5] && elements[5] == elements[9] && elements[1] != "") {
    winner(1 , 5 , 9);
  } else if(elements[3] == elements[5] && elements[5] == elements[7] && elements[3] != "") {
    winner(3 , 5 , 7)
  }
}


function game(id) {
  let card = document.getElementById(id);
  if(turn == 'x' && card.innerHTML == "") {
    title.innerHTML = "O Turn";
    card.innerHTML = 'X';
    turn = 'o';
  } else if(turn == 'o' && card.innerHTML == "") {
    title.innerHTML = "X Turn";
    card.innerHTML = 'O';
    turn = 'x';
  }
  handleElements();
}