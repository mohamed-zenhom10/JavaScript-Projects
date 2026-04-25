const navbar = document.querySelector(".navbar");
const togglerButton = document.getElementById("toggler-btn");

togglerButton.onclick = () => {
  navbar.classList.toggle("display");
}