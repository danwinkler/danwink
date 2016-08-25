var $_GET = {};
var maxDepth = 2;

var pages = {};

var c;
var canvas;

var tdata;

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

String.prototype.startsWith = function(needle)
{
    return(this.indexOf(needle) == 0);
};

function update()
{
	var c = window.c;
	c.fillStyle = "#000000";
	c.fillRect( 0, 0, canvas.width, canvas.height );
	for( var i in pages )
	{
		var page = pages[i];
		page.update();
	}
	for( var i in pages )
	{
		var page = pages[i];
		page.drawLines( c );
	}
	for( var i in pages )
	{
		var page = pages[i];
		page.drawText( c );
	}
}

function beginVis()
{
	canvas = document.getElementById("canvas");
	c = canvas.getContext("2d");
	canvas.width  = projWidth();
	canvas.height = projHeight();
	var pagename = $_GET[ "pagename" ];
	if( pagename )
	{
		getWiki( pagename, 0 );

		setInterval( update, 1000 / 30 );
	}
	else
	{
		$(".helpbox").show();
	}

	$("#canvas").click( function( e ) {
        var px = e.pageX - $("#canvas").offset().left;
        console.log( px + " " + e.pageX );
		for( var i in pages )
		{
			var page = pages[i];
			if( px > page.x - page.textSize/2 && px < page.x + page.textSize/2 && e.pageY > page.y - 10 && e.pageY < page.y + 10 )
			{
				getWiki( page.name, 0 );
			}
		}
	});
}

function countLinks( page ) {
    var num = 0;
    for( var i in page.links ) {
        var p = pages[page.links[i]];
        if( p ) {
            num++;
        }
    }

    for( var i in pages )
    {
        var p = pages[i];
        for( var j in p.links ) {
            var op = pages[p.links[j]];
            if( op == page && page.links.indexOf( i ) == -1 ) {
                num++;
            }
        }
    }
    return num;
}

$(".clear-button").click(function(){
    var newpages = {};
    for( var i in pages )
    {
        var page = pages[i];
        if( countLinks( page ) > 1 ) {
            newpages[i] = page;
        }
    }
    pages = newpages;
});

function getWiki( page, depth )
{
	if( depth == maxDepth ) return;
	$.ajax({
		url: "https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=500&format=json&titles=" + page,
		dataType: 'jsonp',
		success: function( data ) {
			tdata = data;
			if( !window.pages[page] )
				window.pages[page] = new Page( page, window.canvas.width*Math.random(), window.canvas.height*Math.random() );
			var pagest = data['query']['pages'];
			var links;
			for( var i in pagest )
			{
				links = pagest[i]['links'];
				break;
			}
			for( var i in links )
			{
				window.pages[page].links.push( links[i]['title'] );
			}
			for( var i in links )
			{
				var title = links[i]['title'];
				if( title.startsWith( "Wikipedia:" ) ) continue;
				if( title.startsWith( "Category:" ) ) continue;
				if( title.startsWith( "File:" ) ) continue;
				if( title.startsWith( "Template:" ) ) continue;
				if( title.startsWith( "Help:" ) ) continue;
				getWiki( title, depth+1 );
			}
		}
	});
}

function Page( name, x, y ) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	var cr = Math.floor(Math.random()*255);
	var cg = Math.floor(Math.random()*255);
	var cb = Math.floor(Math.random()*255);
	this.color = 'rgb( ' + cr + ', ' + cg + ', ' + cb + ' )';
	this.tcolor = (cr+cg+cb) > 255 ? "#000000" : "#FFFFFF";
	this.links = [];
	this.textSize;
	this.update = function() {
		for( var i = 0; i < this.links.length; i++ )
		{
			var other = pages[this.links[i]];
			if( other )
			{
				var cx = (other.x - this.x);
				var cy = (other.y - this.y);
				var len = Math.sqrt( cx*cx + cy*cy ) - 300;

				var mx = (cx * len) * .000001;
				var my = (cy * len) * .000001;
				if( len > .1 )
				{
					this.dx += mx;
					this.dy += my;
					other.dx -= mx;
					other.dy -= my;
				}
			}
		}

		for( var i in pages )
		{
			var other = pages[i];
			if( other )
			{
				var cx = (other.x - this.x);
				var cy = (other.y - this.y);
				var len = Math.sqrt( cx*cx + cy*cy ) ;

				var mx = (cx / (len*len)) * .1;
				var my = (cy / (len*len)) * .1;
				if( len > .1 )
				{
					this.dx -= mx;
					this.dy -= my;
					other.dx += mx;
					other.dy += my;
				}
			}
		}
		this.x += this.dx;
		this.y += this.dy;
		this.dx *= .9;
		this.dy *= .9;

		if( this.x < 10 )
			this.x = 10;
		if( this.x > canvas.width-10 )
			this.x = canvas.width-10;
		if( this.y < 10 )
			this.y = 10;
		if( this.y > canvas.height-10 )
			this.y = canvas.height-10;
	};
	this.drawText = function( c ) {
		if( !this.textSize )
			this.textSize = c.measureText( this.name ).width;
		var textSize = this.textSize;
		c.fillStyle = this.color;
		fillOval( this.x - textSize/2 - 5, this.y - 15, textSize + 10, 30 );
		c.fillStyle = this.tcolor;
		c.fillText( this.name, this.x - textSize/2, this.y + 3 );
	};
	this.drawLines = function( c ) {
		c.strokeStyle = this.color;
		c.lineWidth = 2;
		for( var i = 0; i < this.links.length; i++ )
		{
			if( pages[this.links[i]] )
			{
				var lx = pages[this.links[i]].x - this.x;
				var ly = pages[this.links[i]].y - this.y;
				var len = Math.sqrt( lx*lx + ly*ly );
				lx /= len;
				ly /= len;
				lx *= 2;
				ly *= 2;

				drawLine( this.x + ly, this.y - lx, pages[this.links[i]].x + ly, pages[this.links[i]].y - lx );
			}
		}
	};
}

function drawLine( x1, y1, x2, y2 )
{
	c.save();
	c.beginPath();
	c.moveTo( x1, y1 );
	c.lineTo( x2, y2 );
	c.stroke();
	c.restore();
}

function ellipse(aX, aY, aWidth, aHeight)
{
	c.save();
	var hB = (aWidth / 2) * .5522848,
		vB = (aHeight / 2) * .5522848,
		eX = aX + aWidth,
		eY = aY + aHeight,
		mX = aX + aWidth / 2,
		mY = aY + aHeight / 2;
	c.moveTo(aX, mY);
	c.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
	c.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
	c.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
	c.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
	c.closePath();
	c.restore();
}
function fillOval(aX, aY, aWidth, aHeight)
{
	c.beginPath();
	ellipse(aX, aY, aWidth, aHeight);
	c.fill();
}

function drawOval(aX, aY, aWidth, aHeight)
{
	c.beginPath();
	ellipse(aX, aY, aWidth, aHeight);
	c.stroke();
}
