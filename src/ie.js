const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
let ie = false;
if (msie > 0) {
    // IE 10 or older => return version number
    ie = true;
}
const trident = ua.indexOf('Trident/');
if (trident > 0) {
    // IE 11 => return version number
    ie = true;
}
var edge = ua.indexOf('Edge/');
if (edge > 0) {
    ie = true;
}
if(ie){
    document.write("<center><h1>Sorry. IE is not supported at this time. Please download chrome to view this site. <a href='https://www.google.com/chrome'>https://www.google.com/chrome</a> </h1> </center><br/><iframe align='middle' width='100%' height='90%' src='https://www.google.com/chrome'></iframe>")
}