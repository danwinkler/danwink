<!DOCTYPE html>
<html>
	<head>
		<title>GroupDraw - Collage Edit</title>
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/css/bootstrap.min.css">
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div style="position: relative; height: 400px; width: 400px; float: left;">
					<canvas id="backcanvas" style="position: absolute; width: 400px; height: 400px;"></canvas>
					<canvas id="frontcanvas" style="position: absolute; width: 400px; height: 400px;"></canvas>
				</div>
				<div style="float: left; width: 50px;">
					<div class="colorbut" style="background-color: red; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: orange; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: yellow; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: green; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: blue; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: purple; width: 40px; height: 40px"></div>
					<div class="colorbut" style="background-color: black; width: 40px; height: 40px"></div>
				</div>
				<div style="float: left; width: 50px;">
					<?php for( $i = 1; $i <= 5; $i++ ) { $bs = 2+$i*4; $bo = 20 - $bs/2;?>
					<div class="sizebut" data-size="<?php echo $i; ?>" style="width: 40px; height: 40px">
						<div style="position: relative; top: <?php echo $bo; ?>px; left: <?php echo $bo; ?>px; background-color: black; border-radius: <?php echo $bs/2; ?>px; width: <?php echo $bs; ?>px; height: <?php echo $bs; ?>px"></div>
					</div>
					<?php } ?>
				</div>
				<div style="float: left; width: 50px;">
					<div class="toolbut" data-tool="pen" style="width: 40px; height: 40px">Pen</div>
					<div class="toolbut" data-tool="erase" style="width: 40px; height: 40px">Erase</div>
				</div>
			</div>
			<div class="row" style="">
				<button class="uploadbutton btn btn-success">Upload!</button>
			</div>
		</div>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/js/bootstrap.min.js"></script>
		<script>
			var brushColor = "#000000";
			var brushSize = 1;
			var tool = "pen";
			$(function() {
				var bgc = document.getElementById('backcanvas');
				bgc.width = 400;
				bgc.height = 400;
				var bg = bgc.getContext('2d');
				
				var bfc = document.getElementById('frontcanvas');
				bfc.width = 400;
				bfc.height = 400;
				var fg = bfc.getContext('2d');
			
				var bgi = new Image();
				bgi.src = "<?php echo webPath();?>/<? echo $filename; ?>";
				
				bgi.onload = function() { 
					//center image
					var ix, iy, iw, ih;
					
					var gx = <?php echo $x; ?>;
					var gy = <?php echo $y; ?>;
					
					if( this.width == this.height )
					{
						ix = 0;
						iy = 0;
						iw = 600;
						ih = 600;
					}
					else if( this.width < this.height )
					{
						iy = 0;
						ih = 600;
						
						iw = (600 / this.height) * this.width;
						ix = (600-iw)/2;
					}
					else if( this.height < this.width )
					{
						ix = 0;
						iw = 600;
						
						ih = (600 / this.width) * this.height;
						iy = (600-ih)/2;
					}
					
					var px = (ix-(gx*100))*4;
					var py = (iy-(gy*100))*4;
					bg.drawImage( bgi, px, py, iw*4, ih*4 );
					bg.fillStyle = "rgba( 255, 255, 255, .75 )";
					bg.fillRect( 0, 0, 400, 400 );
					bg.strokeRect( 0, 0, 400, 400 );
				};
				
				var clicking = false;
				var lastX, lastY;

				$('#frontcanvas').bind( "mousedown touchstart", function(e){
					e.preventDefault();
					clicking = true;
					lastX = e.offsetX;
					lastY = e.offsetY;
				
				});

				$(document).bind( "mouseup touchend", function(e){
					e.preventDefault();
					clicking = false;
				})

				$('#frontcanvas').bind( "mousemove touchmove", function(e){
					e.preventDefault();
					if( !clicking ) return;
					
					if( e.originalEvent.touches ) 
					{
						e.pageX = e.originalEvent.touches[0].pageX;
						e.pageY = e.originalEvent.touches[0].pageY;
					}
					
					var pos = $(this).offset();
					var x = e.pageX - pos.left;
					var y = e.pageY - pos.top;
					
					fg.lineCap = 'round';
					
					switch( tool )
					{ 
					case "pen":
						fg.globalCompositeOperation = "source-over";
						fg.strokeStyle = brushColor;
						break;
					case "erase":
						fg.globalCompositeOperation = "destination-out";
						fg.strokeStyle = "rgba(0,0,0,1)";
						break;
					}
					
					fg.beginPath();
					fg.moveTo(lastX, lastY);
					fg.lineTo(x, y);
					fg.lineWidth = brushSize;
					fg.stroke();
					
					lastX = x;
					lastY = y;
				});
				
				$('.colorbut').on( "click touchstart", function(e){
					brushColor = this.style.backgroundColor;
					$('.colorbut').css( "border", "0" );
					$(this).css( "border", "1px solid grey" );
				});
				
				$(".sizebut").on( "click touchstart", function(e){
					brushSize = $(this).data( "size" );
					$('.sizebut').css( "border", "0" );
					$(this).css( "border", "1px solid grey" );
				});
				
				$(".toolbut").on( "click touchstart", function(e){
					tool = $(this).data( "tool" );
					$('.toolbut').css( "border", "0" );
					$(this).css( "border", "1px solid grey" );
				});
				
				$(".uploadbutton").on( "click touchstart", function(e){
					var canvasData = bfc.toDataURL("image/png");
					
					var ajax = new XMLHttpRequest();
					
					ajax.onload = function(e){
						window.location.href = "<?php echo webPath();?>/collage/<?php echo $id;?>";
					};
					
					ajax.open( "POST", '<?php echo webPath(); ?>/collageUpload/<?php echo $id."/".$x."-".$y; ?>', false );
					ajax.setRequestHeader( 'Content-Type', 'application/upload' );
					ajax.send( canvasData );
				});
			});
		</script>		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-42955009-1', 'danwink.com');
		  ga('send', 'pageview');

		</script>
	</body>
</html>