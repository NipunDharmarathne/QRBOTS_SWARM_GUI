$(document).ready(function () {
    FlightIndicator.setOptions({
        assets: "./flight_indicators/img/"
    });
    var heading = new FlightIndicator.Heading({
        containerId: "heading-container",
        onIndicatorReady: function () {
            console.log("Heading Indicator ready!");
        }
    });

    var horizon = new FlightIndicator.Horizon({
        containerId: "horizon-container",
        onIndicatorReady: function () {
            console.log("Horizon Indicator ready!");
        }
    });
 
 

    interval = setInterval(function () {
        var yaw = parseInt(document.getElementById('yaw').textContent, 10);
        heading.update(yaw);

        var roll = parseInt(document.getElementById('roll').textContent, 10);
        var pitch = parseInt(document.getElementById('pitch').textContent, 10);
        horizon.update(pitch, roll);
    }, 40);
});