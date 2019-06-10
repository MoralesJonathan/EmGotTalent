hamburger = () => {
    const x = document.getElementById("hamburger");
    x.className += x.className === "rightMenu" ? " responsive" : "rightMenu"
}