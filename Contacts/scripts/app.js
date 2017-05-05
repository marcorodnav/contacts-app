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
}());