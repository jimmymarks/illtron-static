// Set up Font Face Observer fonts
const fontTimeOut = 2000;
const fontShrikhand = new FontFaceObserver('Shrikhand');
const fontRaleway = new FontFaceObserver('Raleway');
const fontRalewayBlack = new FontFaceObserver('Raleway', {
  'weight': '900'
});


// Get those fonts
Promise.all ([
  fontShrikhand.load(null, fontTimeOut),
  fontRaleway.load(null, fontTimeOut),
  fontRalewayBlack.load(null, fontTimeOut)
]).then ( function () {
  document.documentElement.className += ' fonts-loaded';
});


// Keep the footer updated without needing a server
const year = new Date().getFullYear();
document.getElementById('year').innerText = year;


// Smooth scrolling on internal links
function smoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(
    function(currentLink) {

      const linkHref = currentLink.getAttribute('href');

      currentLink.addEventListener('click', (event)=> {
        document.querySelector(linkHref).scrollIntoView({
          behavior: 'smooth'
        });
        event.preventDefault();
      }, false);
    }
  );
}

function headerScroll() {
  window.addEventListener('scroll', listener, this, ev, useCapture)
}


smoothScroll();
