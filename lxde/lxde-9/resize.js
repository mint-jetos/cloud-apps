window.onload = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    // Create a query string
    var params = '?width=' + width + '&height=' + height;

    // Send the new resolution to the server http://mint.cloudns.org:9910/vnc.html
    fetch('http://130.61.81.24:9909/screen' + params, {
        method: 'GET',
    });
};
