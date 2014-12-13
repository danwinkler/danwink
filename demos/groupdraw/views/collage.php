<!DOCTYPE html>
<html>
	<head>
		<title>GroupDraw - Collage</title>
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/css/bootstrap.min.css">
	</head>
	<body>
		<div class="container">
			<div style="position: relative">
				<canvas id="canvas" style="position: absolute; width: 600px; height: 600px;"></canvas>
			</div>
		</div>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/js/bootstrap.min.js"></script>
		<script type="text/javascript">
			$(function() {
				var bgc = document.getElementById('canvas');
				bgc.width = 600;
				bgc.height = 600;
				var bg = bgc.getContext('2d');
			
				var bgi = new Image();
				bgi.src = "<?php echo webPath();?>/<? echo $filename; ?>";
				
				bgi.onload = function() { 
					
					//center image
					var ix, iy, iw, ih;
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
					bg.drawImage( bgi, ix, iy, iw, ih );
					
					//draw grid
					bg.strokeStyle = "#000000";
					for( var i = 0; i <= 600; i += 100 )
					{
						bg.beginPath();
						bg.moveTo(0, i);
						bg.lineTo(600, i);
						bg.stroke();
						
						bg.beginPath();
						bg.moveTo(i, 0);
						bg.lineTo(i, 600);
						bg.stroke();
					}
					
					<?php foreach( $cells as $cell ) { ?>
					(function(){
						var x = <?php echo $cell[0]; ?>;
						var y = <?php echo $cell[1]; ?>;
						var image = new Image();
						image.src = "<?php echo webPath();?>/imgupload/<?php echo $id?>."+x+"."+y+".png";
						
						image.onload = function() {
							bg.fillStyle = "#FFFFFF";
							bg.fillRect( x*100, y*100, 100, 100 );
							bg.drawImage( this, x*100, y*100, 100, 100 );
						};
					})();
					<?php } ?>
				};
			});
			
			$( "#canvas" ).click( function(e) {
				var pos = $(this).offset();
				var x = e.pageX - pos.left;
				var y = e.pageY - pos.top;
				
				var gx = Math.floor(x/100);
				var gy = Math.floor(y/100);
				
				window.location.href = "<?php echo webPath();?>/collageEdit/<?php echo $id;?>/"+gx+"-"+gy;
			});
		</script>		<script>		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');		  ga('create', 'UA-42955009-1', 'danwink.com');		  ga('send', 'pageview');		</script>
	</body>
</html>