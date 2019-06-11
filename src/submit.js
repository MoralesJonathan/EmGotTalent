processForm = e => {
    if (e.preventDefault) e.preventDefault();
    const url = e.target[0].value
    const xhr = new XMLHttpRequest();
    const xhr1 = new XMLHttpRequest();
    xhr1.open('GET', '/tracking', true);
    xhr1.send(null);
    xhr1.onreadystatechange = () => {
        const regex500 = new RegExp('^5\\d{2}$');
        if (xhr1.readyState === 4 && !regex500.test(xhr1.status)) {
            const keys = window.apiKeys.keys;
            xhr.open('POST', '/submit', true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify({ url, key: keys[1], cachecode: 200}));
            xhr.onreadystatechange = () => {
                const regex200 = new RegExp('^2\\d{2}$');
                if (xhr.readyState === 4 && regex200.test(xhr.status)) {
                    document.getElementById("confirmationMessage").innerHTML = "You submission was received! Be sure to stay tuned for something awesome!";
                    form.parentNode.removeChild(form);
                } else if (!regex200.test(xhr.status)) {
                    document.getElementById("confirmationMessage").innerHTML = `Sorry, your submission did not go through: ${xhr.responseText}`;
                }
            };
        } else {
            document.getElementById("confirmationMessage").innerHTML = `Sorry, there was an issue sending your submission. Please try again later.`;
        }
    }
    return false;
}

const form = document.getElementById('urlForm');
form.attachEvent ? form.attachEvent("submit", processForm) : form.addEventListener("submit", processForm);