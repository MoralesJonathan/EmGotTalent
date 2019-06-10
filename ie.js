const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    document.write("<center><h1>Sorry. IE is not supported at this time. Please download chrome to view this site. <a href='https://www.google.com/chrome'>https://www.google.com/chrome</a> </h1> </center><br/><iframe align='middle' width='100%' height='90%' src='https://www.google.com/chrome'></iframe>")
}
