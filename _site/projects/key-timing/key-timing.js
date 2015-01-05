var canvas;
var g;
var data;

var lastKey = null;
var lastPress;

var maxAvg = 1000;
var maxKeyTime = 1000;

function begin() {
    canvas = document.getElementById("canvas");

    canvas.width = $("#canvas").width();
    canvas.height = $("#canvas").height();

    g = canvas.getContext('2d');

    data = [];

    for( var i = 0; i < 26; i++ ) {
        data.push( [] );
        for( var j = 0; j < 26; j++ ) {
            data[i].push( { avg: 0, total: 0, count: 0 } )
        }
    }

    render();

    $('#text').bind( 'keydown', function (e) {
        if( e.keyCode >= 65 && e.keyCode <= 90 ) {
            var d = new Date();
            var time = d.getTime();
            var key = e.keyCode - 65;
            if( lastKey != null ) {
                var timeDiff = time - lastPress;
                if( timeDiff < maxKeyTime ) {
                    data[key][lastKey].count++;
                    data[key][lastKey].total += timeDiff;
                    data[key][lastKey].avg = data[key][lastKey].total / data[key][lastKey].count;

                    //if( data[key][lastKey].avg > maxAvg ) {
                    //    maxAvg = data[key][lastKey].avg;
                    //}
                    render();
                }
            }
            lastKey = key;
            lastPress = time;
        } else {
            lastKey = null;
        }

    });

    $(window).resize( function() {
        canvas.width = $("#canvas").width();
        canvas.height = $("#canvas").height();

        render();
    });
}

function render() {
    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    for( var i = 0; i < 26; i++ ) {
        for( var j = 0; j < 26; j++ ) {
            var val = 0;
            if( data[i][j].count == 0 ) {
                g.fillStyle = "#FFFFFF";
            } else {
                g.fillStyle = "rgb(" + color( 1.0-(data[i][j].avg / 500) )+ ")";
            }
            g.fillRect( i*20 + 20, j*20 + 20, 20, 20 );

            g.strokeStyle = "#000000";
            g.strokeRect( i*20 + 20, j*20 + 20, 20, 20 );

            g.strokeStyle = readColor( g.fillStyle );
            g.strokeText( (val.toFixed( 2 )+'').substring(1), i*20 + 22, j*20 + 32 );
        }
    }
    for( var i = 0; i < 26; i++ ) {
        g.strokeText( String.fromCharCode(i+65), 5, i*20 + 35 );
        g.strokeText( String.fromCharCode(i+65), i*20 + 25, 10 );
    }
}

//Modified from http://stackoverflow.com/a/10941401/356882

function color( value ) {
    var RGB = {R:0,G:0,B:0};

    // y = mx + b
    // m = 4
    // x = value
    // y = RGB._
    if( value < 0 ) {
        RGB.B = .5;
    }
    else if (0 <= value && value <= 1/8) {
        RGB.R = 0;
        RGB.G = 0;
        RGB.B = 4*value + .5; // .5 - 1 // b = 1/2
    } else if (1/8 < value && value <= 3/8) {
        RGB.R = 0;
        RGB.G = 4*value - .5; // 0 - 1 // b = - 1/2
        RGB.B = 1; // small fix
    } else if (3/8 < value && value <= 5/8) {
        RGB.R = 4*value - 1.5; // 0 - 1 // b = - 3/2
        RGB.G = 1;
        RGB.B = -4*value + 2.5; // 1 - 0 // b = 5/2
    } else if (5/8 < value && value <= 7/8) {
        RGB.R = 1;
        RGB.G = -4*value + 3.5; // 1 - 0 // b = 7/2
        RGB.B = 0;
    } else if (7/8 < value && value <= 1) {
        RGB.R = -4*value + 4.5; // 1 - .5 // b = 9/2
        RGB.G = 0;
        RGB.B = 0;
    } else {    // should never happen - value > 1
        RGB.R = .5;
        RGB.G = 0;
        RGB.B = 0;
    }

    // scale for hex conversion
    RGB.R *= 255;
    RGB.G *= 255;
    RGB.B *= 255;

    return Math.floor(RGB.R)+','+Math.floor(RGB.G)+','+Math.floor(RGB.B);
}

function readColor( hexTripletColor ) {
    var color = hexTripletColor;
    color = color.substring(1);
    var r = parseInt(color.substr(0,2),16);
    var g = parseInt(color.substr(2,2),16);
    var b = parseInt(color.substr(4,2),16);

    if( (r+g+b)/3.0 > 127 ) return "#000000";
    return "#FFFFFF";
}
