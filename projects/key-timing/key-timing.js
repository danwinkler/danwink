var graph;
var data;

var lastKey = null;
var lastPress;

function begin() {
    data = [];

    for( var i = 0; i < 26; i++ ) {
        for( var j = 0; j < 26; j++ ) {
            data.push( { x: i, y: 0 } );
        }
    }

    graph = new Rickshaw.Graph( {
        element: document.querySelector("#graph"),
        width: $("#graph").width(),
        height: $("#graph").height() - 50,
        renderer: 'scatterplot',
        stroke: true,
        series: [ {
            color: 'steelblue',
            data: data
        } ]
    } );

    graph.render();

    $('#text').bind( 'keydown', function (e) {
        if( e.keyCode >= 65 && e.keyCode <= 90 ) {
            var d = new Date();
            var time = d.getTime();
            var key = e.keyCode - 65;
            if( lastKey != null ) {
                var timeDiff = time - lastPress;
                if( timeDiff < 500 ) {
                    console.log( e );

                    data[lastKey*26+key].y += time-lastPress;
                    graph.render();
                }
            }
            lastKey = key;
            lastPress = time;
        } else {
            lastKey = null;
        }

    });
}
