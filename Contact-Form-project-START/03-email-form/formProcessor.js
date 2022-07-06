(function() {

    "use strict";

    const emailFormProcessor = 'https://cpe-web-assignments.ucdavis.edu/formprocessing/emailprocessor.php';
    const contactForm = document.getElementById('contactform');
    contactForm.addEventListener('submit', validateForm);
    const feedBackMessage = [
        '<div class="error"><h3>Ooops!</h3><p>The name field is reqired, that\'s how I know who you are. Please fix that and try again!</p></div>',
        '<div class="error"><h3>Ooops!</h3><p>You forgot to give me a valid email address. Please fix that and try again!</p></div>',
        '<div class="error"><h3>Ooops!</h3><p>Somehow you forgot to type in your comment. Please type in your comment and try again!</p></div>',
        '<div class="success"><h3>Thanks!</h3><p>Your thoughts have been sent, and I look forward to reading them.</p></div>',
        '<div class="preloader"><div class="loading-dot"></div></div>'
    ];

    function validateForm(event) {
        event.preventDefault();

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const commentField = document.getElementById('comment');

        const reName = /^[a-zA-Z]+(([\'\- ][a-zA-Z])?[a-zA-Z]*)*$/;
        const reEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        let errors = 0;

        if (!reName.test(nameField.value)) {
            displayMessage(nameField, feedBackMessage[0]);
            errors++;
        } else if (!reEmail.test(emailField.value)) {
            displayMessage(emailField, feedBackMessage[1]);
            errors++;
        } else if (commentField.value == "") {
            displayMessage(commentField, feedBackMessage[2]);
            errors++;
        } else if (errors === 0) {
            sendData();
        }
    }

    function displayMessage(field, message) {
        document.getElementById('message').className = "show-message";
        document.getElementById('message').innerHTML = message;
        setTimeout(function() {
            document.getElementById("message").classList.add("fadeOutElement");
            setTimeout(function() {
                if (field != "success") {
                    document.getElementById("message").className = "hide-message";
                    document.getElementById(field.id).focus(); //The focus method puts the cursor back into the field via field.id.
                } else {
                    document.getElementById("message").className = "hide-message";
                    document.getElementById('name').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('comment').value = "";

                }
            }, 1000);
        }, 5000);

    }

    function sendData() {
        document.getElementById("message").className = "show-message";
        document.getElementById("message").innerHTML = feedBackMessage[4];
        setTimeout(async function() {
            const formdata = new FormData(contactForm);
            const fetchPromise = await fetch(emailFormProcessor, { method: "POST", body: formdata });
            const data = await fetchPromise.json();
            console.log(data.result); // You can console.log out that string and you should get “success” in the console log.
            if (data.result == "success") {
                displayMessage("success", feedBackMessage[3]);
            }
        }, 2000);
    }

}());