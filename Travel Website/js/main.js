// Start Header Scripting
const header = document.querySelector(".header");
const navBar = document.querySelector(".navbar");
const navBarBtn = document.querySelector(".bar-icon i");

navBarBtn.onclick = () => {
  navBar.classList.toggle("display");
  navBarBtn.classList.toggle("fa-xmark")
}

window.onscroll = () => {
  if(scrollY >= 100) {
    header.classList.add("shadow")
  } else {
    header.classList.remove("shadow")
  }
}

// End Header Scripting
