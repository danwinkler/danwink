var canvas;
var g;

var peers = [];

var pushPullBorder = 80*80;
var ignoreBorder = 100*100;


var minDistance = Math.pow( 70, 2 );
var basicLinkDistance = 130*130;
var peerLinkDistance = Math.pow( 300, 2 );
var minSubsToPeer = 3;

function begin() {
    canvas = document.getElementById( "canvas" );

    canvas.width = projWidth();
    canvas.height = projHeight();

    g = canvas.getContext( '2d' );

    start();
    setInterval( draw, 1000/30 );
}

function start() {
    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    /*
    for( var i = 0; i < 100; i++ ) {
        peers.push( new Peer() );
    }
    */
    while( addPeer() ) {}

    $("#canvas").focus();

    $("#canvas").mousemove( function(e) {

    });
    $("#canvas").mousedown( function(e) {

    });
    $("#canvas").mouseup( function(e) {

    });
}

function addPeer() {
    attempt:
    for( var i = 0; i < 100; i++ ) {
        var x = Math.random() * (projWidth() - 40) + 20;
        var y = Math.random() * (projHeight() - 40) + 20;

        for( var j in peers ) {
            var peer = peers[j];
            if( Math.pow(peer.x-x, 2) + Math.pow(peer.y-y, 2) < minDistance ) {
                continue attempt;
            }
        }
        peers.push( new Peer( x, y ) );
        return true;
    }
    return false;
}

function draw() {
    g.save();

    if( canvas.width != projWidth() || canvas.height != projHeight() )
    {
        canvas.width = projWidth();
        canvas.height = projHeight();
    }

    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    g.strokeStyle = "#000000";

    for( var i in peers ) {
        peers[i].update();
        peers[i].render();
    }

    g.restore();
}

function Link( a, b, type ) {
    this.a = a;
    this.b = b;
    this.type = type || 'basic';

    this.render = function() {
        switch( this.type ) {
            case 'basic':
                g.strokeStyle = "#FF0000"; break;
            case 'peer':
                g.strokeStyle = "#00FF00"; break;
        }

        canvas_arrow( this.b.x, this.b.y, this.a.x, this.a.y );
    };

    this.break = function() {
        a.links.splice( a.links.indexOf( this ), 1 );
        b.links.splice( b.links.indexOf( this ), 1 );
    };
}

function Peer( x, y ) {
    this.x = x;
    this.y = y;
    this.alive = true;

    this.dx = 0;
    this.dy = 0;

    this.links = [];

    this.update = function() {
        this.repelNeighbors();

        if( Math.random() < .1 )
        {
            for( var i in peers ) {
                var peer = peers[i];
                if( (peer == this) || this.connectedTo( peer ) ) continue;

                var d2 = Math.pow( peer.x - this.x, 2 ) + Math.pow( peer.y - this.y, 2 );

                if( d2 < basicLinkDistance && (!this.hasTop() || !peer.hasTop()) ) {
                    if( this.connect( peer ) ) {
                        break;
                    }
                }

                if( this.links.length >= minSubsToPeer && d2 < peerLinkDistance && this.level() == 1 && peer.level() == 1 ) {
                    this.connectPeer( peer );
                    break;
                }
            }
        }

        for( var i in this.links ) {
            var link = this.links[i];
            var other = link.a == this ? link.b : link.a;
            if( link.type == 'basic' ) {
                if( !this.hasTop() && this.links.length*2 < other.links.length ) {
                    //Swap
                    link.a = other;
                    link.b = this;
                    this.breakPeers();
                    other.breakPeers();
                    break;
                }
            }
        }
    };

    this.repelNeighbors = function() {
        var totalForce = { x: 0, y: 0 };
        for( var i in peers ) {
            var peer = peers[i];
            if( peer == this ) continue;

            var vec = { x: peer.x - this.x, y: peer.y - this.y };
            var d2 = vec.x*vec.x + vec.y*vec.y;
            if( d2 > 100*100 ) continue;
            vec.x *= (1.0 / d2);
            vec.y *= (1.0 / d2);

            if( d2 > 70*70 ) {
                vec.x *= -1; vec.y *= -1;
            }

            if( this.connectedTo( peer ) ) {
                vec.x *= 1.5; vec.y *= 1.5;
            }

            totalForce.x -= vec.x * 110;
            totalForce.y -= vec.y * 110;
        }

        var centerVec = { x: canvas.width*.5 - this.x, y: canvas.height*.5 - this.y };
        var centerVecLen = Math.sqrt( centerVec.x*centerVec.x + centerVec.y*centerVec.y );

        //totalForce.x += (centerVec.x / centerVecLen) * 1;
        //totalForce.y += (centerVec.y / centerVecLen) * 1;

        totalForce.x *= .5; totalForce.y *= .5;

        this.dx += clamp( totalForce.x, -10, 10 );
        this.dy += clamp( totalForce.y, -10, 10 );

        this.dx *= .1;
        this.dy *= .1;

        this.x += this.dx;
        this.y += this.dy;

        this.x = clamp( this.x, 20, canvas.width - 20 );
        this.y = clamp( this.y, 20, canvas.height - 20 );
    };

    this.render = function() {
        g.strokeStyle = this.hasTop() ? "#000000" : "#0000FF";
        //This flooring business keeps the lines aligned to pixels
        g.strokeRect( this.x - 10, this.y - 10, 20, 20 );
        g.strokeText( this.level(), this.x, this.y );
        for( var i in this.links ) {
            var link = this.links[i];
            if( link.a == this ) {
                link.render();
            }
        }
    };

    this.connectedTo = function( target, stack ) {
        if( !stack ) stack = [];
        stack.push( this );
        for( var i in this.links ) {
            var link = this.links[i];
            if( link.type != 'basic' ) continue;
            if( link.a == target || link.b == target ) {
                return true;
            }

            //Recusively search up
            var other = link.a == this ? link.b : link.a;
            if( !stack.some( function(e) { return e == other; } ) && other.connectedTo( target, stack ) ) {
                return true;
            }
        }
        return false;
    };

    this.hasTop = function() {
        for( var i in this.links ) {
            var link = this.links[i];
            if( link.type == 'basic' && link.b == this ) {
                return true;
            }
        }
        return false;
    };

    this.connect = function( other ) {
        var link;

        if( Math.abs( this.level() - other.level() ) >= 2 ) return;

        if( this.hasPeerLinks() || other.hasPeerLinks() ) return;

        if( other.links.length <= this.links.length && !other.hasTop() ) {
            link = new Link( this, other );
        } else if( !this.hasTop() ) {
            link = new Link( other, this );
        }

        if( link ) {
            this.links.push( link );
            other.links.push( link );
        }
        return link;
    };

    this.connectPeer = function( other ) {
        if(!other.links.every(function(l){
            return l.b != other;
        })) {
            return;
        }
        assert( !this.hasTop() )
        assert( !other.hasTop() );
        var link = new Link( this, other, 'peer' );
        this.links.push( link );
        other.links.push( link );
    };

    this.breakPeers = function() {
        var self = this;
        for( var i in this.links ) {
            var link = this.links[i];
            console.log( link.type );

            if( link.type == 'peer' ) {
                link.break();
            }
        }
    };

    this.level = function( stack ) {
        var maxLevel = 0;
        for( var i in this.links )
        {
            var link = this.links[i];
            if( link.type != 'basic' ) continue;
            if( link.b == this ) {
                maxLevel = Math.max( maxLevel, link.a.level() );
            }
        }
        return maxLevel + 1;
    };

    this.hasPeerLinks = function() {
        for( var i in this.links ) {
            if( this.links[i].type == 'peer' ) return true;
        }
        return false;
    }
}

function clamp( num, min, max ) {
    return num <= min ? min : num >= max ? max : num;
}

function assert( v ) {
    if( !v ) {
        throw Error( "ERROR" );
    }
}

function drawLine( x1, y1, x2, y2 )
{
	g.save();
	g.beginPath();
	g.moveTo( x1, y1 );
	g.lineTo( x2, y2 );
	g.stroke();
	g.restore();
}

function canvas_arrow(fromx, fromy, tox, toy){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    g.save();
    g.beginPath();
    g.moveTo(fromx, fromy);
    g.lineTo(tox, toy);
    g.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    g.moveTo(tox, toy);
    g.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    g.stroke();
    g.restore();
}
