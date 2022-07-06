///This project is a basic contact form that collects and sends data to a server to be processed using jQuery.
///The HTML file includes a form, plus links to jQuery, the jQuery validator plugin and your script file.
///There is a little basic CSS at the top of the page for styling purposes.

///IMPORTANT NOTE:
///PHP has to run on a server, so even though the PHP files are included in this project, you won't actually need to use them. They are there for reference.

///To begin, add the first two lines, which will use the jQuery.load() function, to load the PHP file into the <div id=”formdata”>
var formDataUrl = "https://cpe-web-assignments.ucdavis.edu/formprocessing/processor.php";
$("#formdata").load(formDataUrl);

///After you load data from the PHP file, add a line to validate the form. Here, I'm just using the very basic version of the validator plugin for this project.
$("#myForm").validate();

///Next, add an event handler for when the form is submitted. Pass in the special event object and use it to prevent the default behavior.
$("#myForm").submit(function(event) {
    event.preventDefault();
    ///Add an if statement that checks if the form is valid inside the function that runs when the form is submitted.
    if ($("#myForm").valid() == true) {
        var dataString = $(this).serialize();
        /// Using console.log(), test the file and check the console. You should see the data from the form, if you fill it out and click the send button.
        //console.log(dataString);

        ///Finally, inside the if statement, add the call to the jQuery ajax method. 
        /// This method takes an object as an argument. The type of data is POST, the url is the variable that holds the link to the processor.php page.
        /// The data it is sending is dataString, then upon success, run a function that passes in the data form the server. Put that data in the div and clear out the form.

        $.ajax({
            type: "POST",
            url: formDataUrl,
            data: dataString,
            success: function(data) {
                $("#formdata").html(data);
                $("#myForm").clearForm();
            }
        });
    }
});
///Test the form now. If you fill out the form and submit it, it should work.


///The function below goes through the form and resets the values for all the text fields, passwords, emails and urls, and text areas to empty. 
///If you add checkboxes, radio buttons, it's going to set them to false. If you had a select list, it's going to set the index to minus 1. 
//It means nothing is selected, everything gets emptied out. 
$.fn.clearForm = function() {
    return this.each(function() {

        var type = this.type;
        var tag = this.tagName.toLowerCase();

        if (tag == 'form') {
            return $(':input', this).clearForm();
        }
        if (type == 'text' || type == 'password' || type == 'email' || type == 'url' || tag == 'textarea') {
            this.value = '';
        } else if (type == 'checkbox' || type == 'radio') {
            this.checked = false;
        } else if (tag == 'select') {
            this.selectedIndex = -1;
        }
    });
};