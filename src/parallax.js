const scene = document.getElementById('parallax');
const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
let parallaxInstance = window.mobilecheck || width < 1000 ? null : new Parallax(scene);
const centerParallaxElements = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let offset = 0;
    const parallax = document.getElementById('parallax');
    const parallaxHeight = parallax.clientHeight;
    const pinkTitle = document.getElementsByClassName('pinkTitle')[0];
    if (windowWidth < 900) {
        parallax.style.top = (windowHeight/2) - ((parallaxHeight/2)+30);
    } else {
        parallax.style.top = 0;
    }
    if (windowWidth < 700) {
        pinkTitle.style.marginTop = ((windowWidth/100) * -15)+104; 
    } else {
        pinkTitle.style.marginTop = 0;
    }
};
window.addEventListener("resize",centerParallaxElements);
centerParallaxElements();


window.addEventListener('load',function(){
        document.querySelector('html').style.overflowY = 'scroll';
        setTimeout(function(){document.querySelector('body').classList.add("loaded");}, 1000);
  });
  
