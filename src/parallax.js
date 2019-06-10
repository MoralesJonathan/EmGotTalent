const scene = document.getElementById('parallax');
const width = Math.max(document.documentElement.clientWidth, window.innerWidth);
let parallaxInstance = window.mobilecheck || width < 1000? null: new Parallax(scene);
