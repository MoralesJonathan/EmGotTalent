let xhr = new XMLHttpRequest();
xhr.open('GET', '/submissions', true);
xhr.send(null);
xhr.onreadystatechange = () => {
    let regex = new RegExp('^2\\d{2}$');
    if (xhr.readyState === 4 && regex.test(xhr.status)) {
        const videos = JSON.parse(xhr.responseText);
        for(videoObj of videos){
            document.querySelector('#gallery .videos').innerHTML += `<div class="col"><iframe type="text/html" width="300" height="200" src="https://www.youtube-nocookie.com/embed/${videoObj.vid}?controls=1&disablekb=1&modestbranding=1&iv_load_policy=3" frameborder="0" allowfullscreen></iframe></div>`
        }
    } else if (!regex.test(xhr.status)) {
        document.querySelector('#gallery .videos').innerHTML = `<div class="col"><p>Sorry, there was a problem trying to load the videos.</p></div>`
    }
};
