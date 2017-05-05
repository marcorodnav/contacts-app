(function () {
    
    var app, selectedContact, selectedContactId;

    document.addEventListener('deviceready', function () {  
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {skin: 'flat', transition: 'slide'});
    }, false);

    function onError() {
        alert("Sorry, but there was error!");
    }
    
    // Handles iOS not returning displayName or returning null
    function getName(c) {
    	if(c.name.formatted) return c.name.formatted;
    	if(c.name.givenName && c.name.familyName) return c.name.givenName + " " + c.name.familyName;
    	return "No Name Listed";
    }

    window.getAllContacts = function() {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var fields = ["*"];
        navigator.contacts.find(fields, onContactSuccess, onError, options);
    }

    function onContactSuccess(contacts) {
        var template = kendo.template($("#contacts-template").html());
        var dataSource = new kendo.data.DataSource({ data: contacts });
        dataSource.bind("change", function() {
            $("#contacts-list").html(kendo.render(template, dataSource.view()));
        });
        dataSource.read();
    }

    window.getContactDetails = function(e) {
        selectedContactId = e.view.params.id;
        var options = new ContactFindOptions();
        options.multiple = true;
        var fields = ["*"];
        navigator.contacts.find(fields, onContactDetailSuccess, onError, options);
    }

    function onContactDetailSuccess(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].id == selectedContactId) {
                $("#contact-name").text(getName(contacts[i]));
                if (contacts[i].phoneNumbers) {
                    $("#contact-phone").text(contacts[i].phoneNumbers[0].value);
                } else {
                    $("#contact-phone").text("");
                }
                if (contacts[i].photos && contacts[i].photos.length) {
                    $(".largeProfile").attr("src", contacts[i].photos[0].value);
                } else {
                    $(".largeProfile").attr("src", "styles/blankProfile.png");
                }
                selectedContact = contacts[i];
                break;
            }
        }
    }
}());