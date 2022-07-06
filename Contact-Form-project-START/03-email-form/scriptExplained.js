//This final, and more complete version of the contact form is very similar to the Async/Await version of the form previously created but with a few changes.
//It includes a new variable called "feedBackMessage" that accesses a newly added <div that has the class="error" to display different feed back messeages of the user does not fill out a field on the form properly, as well as a <div class="success" that sends a thank you message and a '<div class="preloader that loads the animation for when the script is running. 
//The feedBackMessage is an array that will be accessing to show the correct message. 
//The displayMessage function is going to run inside of the validateForm function where we pass in the field that we're checking and the the message that we want to display if it fails.

(function() {

    "use strict";

    const emailFormProcessor = 'https://cpe-web-assignments.ucdavis.edu/formprocessing/emailprocessor.php';
    const contactForm = document.getElementById('contactform');
    contactForm.addEventListener('submit', validateForm);

    //Messages to be put in the message element when there is an error or success...
    //The last element in this array loads the preloader css. Looks really cool...
    const feedBackMessage = [
        '<div class="error"><h3>Ooops!</h3><p>The name field is reqired, that\'s how I know who you are. Please fix that and try again!</p></div>',
        '<div class="error"><h3>Ooops!</h3><p>You forgot to give me a valid email address. Please fix that and try again!</p></div>',
        '<div class="error"><h3>Ooops!</h3><p>Somehow you forgot to type in your comment. Please type in your comment and try again!</p></div>',
        '<div class="success"><h3>Thanks!</h3><p>Your thoughts have been sent, and I look forward to reading them.</p></div>',
        '<div class="preloader"><div class="loading-dot"></div></div>'
    ];

    // The actual form validation function. Kicks off the asynchronous submission at the bottom.	
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

    // The function that does the form validation is already created, but this version is doing some nicer interface effects if there are errors or if it is successful. 
    function displayMessage(field, message) {
        // puts messages in the DOM
        //If someone puts bad data into a field, or leaves it blank, this function runs. The validateForm function above passes in the offending field and a message from the message array at the top of the page.
        //Set the message div to class “show-message” (located in the CSS file), and put the correct message in that div. Then wait two seconds before we continue.
        document.getElementById('message').className = "show-message";
        document.getElementById('message').innerHTML = message;
        setTimeout(function() {
            //This puts the correct error/success message on the screen for the specified amount of time and then fades it off the screen.
            //After 5 seconds, add the class “fadeOutElement” to the message div. This will fade the message out over 1 seconds (fadeOutElement located in the CSS file).
            document.getElementById("message").classList.add("fadeOutElement");
            setTimeout(function() {
                //I want to check to see if it's not the word "success". If field (the value that's passed in there) is not equal to "success", then it must be an error and I'm going to handle that.
                if (field != "success") {
                    //After that, hide the message (put it back to it's original state).
                    document.getElementById("message").className = "hide-message";
                    //Finally, place the cursor back into the field that was not filled in properly.
                    document.getElementById(field.id).focus(); //The focus method puts the cursor back into the field via field.id.
                } else {
                    // Set the class back to "hide-message" and empty out each of the form fields.
                    document.getElementById("message").className = "hide-message";
                    document.getElementById('name').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('comment').value = "";

                }
            }, 1000);
        }, 5000);

    }

    function sendData() {
        // This function sends the data asynchronously.
        //This function is only a little different from the async/await form version.
        //First, we'll show the message by setting the class to show message and add the feedback message. Then do an asynchronous function to send and get the data
        document.getElementById("message").className = "show-message";
        document.getElementById("message").innerHTML = feedBackMessage[4]; ///feedBackMessage[4] is a a div Inside of a div that creates that animation, go look at the spinner CSS file to see how it actually works if you want to.
        setTimeout(async function() {
            //Now I do the same tasks I did in the previous async/await version. Get the form data, send it to the PHP file. The only difference is that this time, that file is returning a JSON string.
            const formdata = new FormData(contactForm);
            const fetchPromise = await fetch(emailFormProcessor, { method: "POST", body: formdata });
            const data = await fetchPromise.json();
            console.log(data.result); // You can console.log out that string and you should get “success” in the console log.
            //What I'm looking for is for this data.result to be the value of success rather than fail. 
            //I'm just going to put an if statement in here. If data.result is the same as success, I'm going to run the display function, pass in success instead of a field name, and then I'm going to pass in feedback message 3.
            if (data.result == "success") {
                displayMessage("success", feedBackMessage[3]);
            }
        }, 2000); //I want to wait at least two seconds. I want the spinner to be on the screen for at least two seconds .
    }

}());