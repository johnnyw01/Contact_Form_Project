//This project is a basic contact form that collects and sends data to a server to be processed using Asynchronous JavaScript functions/methods.
//The main differences bewteen this version and the jQuery version is that I've added a class="data" to the main form as well as code that clears out the form that stuff after its been submitted, as well as omitted the jQuery libary and plug-ins, and, have added regular expression variables for the name, email, and url fields of the form. 
//The bulk of the notes focus on the async function sendData() at the bottom of the form 

(function() {

    "use strict";

    const formProcessorUrl = "https://cpe-web-assignments.ucdavis.edu/formprocessing/processor.php";
    const contactForm = document.getElementById('myForm');
    contactForm.addEventListener('submit', validateForm);

    // The actual form validation function. Kicks off the ajax submission at the bottom.	
    function validateForm(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const url = document.getElementById('url').value;
        const comments = document.getElementById('comments').value;

        const reName = /^[a-zA-Z]+(([\'\- ][a-zA-Z])?[a-zA-Z]*)*$/;
        const reEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const reUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        const allLabels = document.querySelectorAll('label');
        allLabels.forEach(eachLabel => {
            eachLabel.style.color = "black";
        });

        let errors = 0;

        if (!reName.test(name)) {
            document.getElementById('name-label').style.color = "red";
            errors++;
        } else if (!reEmail.test(email)) {
            document.getElementById('email-label').style.color = "red";
            errors++;
        } else if (url !== '' && !reUrl.test(url)) {
            document.getElementById('url-label').style.color = "red";
            errors++;
        } else if (comments == "") {
            document.getElementById('comments-label').style.color = "red";
            errors++;
        } else if (errors === 0) {
            /// This function only runs if there are zero errors.
            sendData();
        }
    }

    async function sendData() {
        // send data and get a response...
        ///The FormData API does a similar thing that the serialized method does that I used in jQuery version of this project; 
        //It's going to get the form and taking the data from that form using the FormData API to serialize it and stick it inside of variable data.
        const data = new FormData(contactForm);

        /// Next, make the variable fetchPromise by using the await operator and the Fetch API to get the formProcessorUrl.
        /// The second parameter inside the fetch method uses an object that's going to send the data.
        /// I'm sending it by the HTTP POST method and what I'm sending is the data that's inside the body of the form. 
        const fetchPromise = await fetch(formProcessorUrl, { method: "POST", body: data });

        //The next two lines take the text from the processor.php file, which in this case is just our data again, and stick it into the formdata div.
        //I'm using the text method here because this particular file is returning text.
        //Get that text using our await keyword, put it into this variable content and then added to the page. 
        //Change that inner HTML to whatever that content is.
        const content = await fetchPromise.text();
        document.getElementById("formdata").innerHTML = content;

        //Now we need to clear out the form data. The last two lines simply get the form fields and clear them out. This should work. Test it out!

        ///The variable fields is going to go in and get all of those fields that have the class="data" on "myForm" by using the querySelectorAll method.
        //This turns all the collected fields into an array, which can be looped through.
        const fields = document.querySelectorAll(".data");

        /// I'm using the forEach method to loop through the fields array to clear out the data in each field
        fields.forEach(eachField => {
            eachField.value = "";
        });
    }

}());