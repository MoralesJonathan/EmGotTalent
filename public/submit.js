processForm = e => {
    if (e.preventDefault) e.preventDefault();
    const url = e.target[0].value
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/submit', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({url}));
    xhr.onreadystatechange = () => {
        const regex = new RegExp('^2\\d{2}$');
        if (xhr.readyState === 4 && regex.test(xhr.status)) {
            document.getElementById("confirmationMessage").innerHTML = "You submission was received! Be sure to stay tuned for something awesome!";
            form.parentNode.removeChild(form);
        } else if (!regex.test(xhr.status)) {
            document.getElementById("confirmationMessage").innerHTML = `Sorry, your submission did not go through: ${xhr.responseText}`;
        }
    };
    return false;
}

const form = document.getElementById('urlForm');
form.attachEvent? form.attachEvent("submit", processForm):form.addEventListener("submit", processForm);