const start = document.querySelector(".control-buuton span");
const Username = document.getElementById("username");
const overlay = document.querySelector(".control-buuton");


start.onclick = () => {
    const YourName = prompt("What Is Your Name");

    if(YourName === null || YourName === "") {
        Username.innerHTML = "Unkown";
    } else {
        Username.innerHTML = YourName;
    }

    overlay.remove();
}



const imgContainer = document.querySelector(".img");
const duration = 1000;

const imgs = Array.from(imgContainer.children);

const orderRange = [...Array(imgs.length).keys()];

function Shuffle(array) {
    let current = array.length;
    let temp;
    let random;
    while(current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
}
Shuffle(orderRange);


function flipBlock(element) {
    element.classList.add("is-flipped");

    let allFlippedBlocks = imgs.filter(flippedBlock => flippedBlock.classList.contains("is-flipped"));

    if(allFlippedBlocks.length === 2) {
        StopClicking();
        matchingBlocks(allFlippedBlocks[0] , allFlippedBlocks[1]);
    }
}

function StopClicking() {
    imgContainer.classList.add("no-clicking");

    setTimeout(() => {

        imgContainer.classList.remove("no-clicking");

    } , duration);
}

function matchingBlocks(firstBlock , secondBlock) {

    const tries = document.getElementById("tries");
    if(firstBlock.dataset.img === secondBlock.dataset.img) {

        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");

        firstBlock.classList.add("is-match");
        secondBlock.classList.add("is-match");

        document.getElementById("success").play();
    } else {
        tries.innerHTML = parseInt(tries.innerHTML) + 1;
        setTimeout(() => {
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
        } , duration)

        document.getElementById("fail").play();
    }

}

imgs.forEach((img , index) => {

    img.style.order = orderRange[index];

    img.addEventListener("click" , () => {
        flipBlock(img);
    })

})



