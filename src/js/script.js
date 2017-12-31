let fontTimeOut = 2000;

let fontShrikhand = new FontFaceObserver("Shrikhand");

let fontRaleway = new FontFaceObserver("Raleway");

let fontRalewayBlack = new FontFaceObserver("Raleway", {
  "weight": "900"
});

Promise.all ([
  fontShrikhand.load(null, fontTimeOut),
  fontRaleway.load(null, fontTimeOut),
  fontRalewayBlack.load(null, fontTimeOut)
]).then ( function () {
  document.documentElement.className += " fonts-loaded";
});

const year = new Date().getFullYear();
document.getElementById("year").innerText = year;

document.querySelector('.panel--process').scrollIntoView({
  behavior: 'smooth'
});




function scrollTo(clickOn, thenScrollTo) {
  document.querySelector(clickOn).addEventListener("click", function( event ) {
    document.querySelector(thenScrollTo).scrollIntoView({
      behavior: 'smooth'
    });
    event.preventDefault;
  }, false);
}


scrollTo("#tellme", "#more");
