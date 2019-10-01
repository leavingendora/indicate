var blinkstick = require('blinkstick'),
device = blinkstick.findFirst();

if (device) {
    var finished = false;

    var data = [
        4, 0, 0,
        4, 0, 0,
        4, 0, 0,
        0, 4, 0,
        0, 4, 0,
        0, 4, 0,
        0, 4, 0,
        4, 0, 0,
    ];

    device.setColors(0, data, function(err, data) {
        finished = true;
    });

    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
}



