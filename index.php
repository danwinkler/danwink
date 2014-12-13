<?php
	$demos = array();
	$demos[] = "dust";
	$demos[] = "treegen";
	$demos[] = "flocking";
	$demos[] = "wikivis";
	//$demos[] = "raytracing"; 

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Daniel Winkler</title>
		<link href="css/main.css" rel="stylesheet" type="text/css">
		<script src="js/jquery-1.7.2.min.js"></script>
		<script src="js/dpages.jquery.js"></script>
		<script>
		$(function() {
			$(".contentframe .demos").dpage( $(".buttons .demos") );
			$(".contentframe .about").dpage( $(".buttons .about") );
			
			<?php foreach( $demos as $demo ) { ?>mouseOverShow( "<?php echo $demo; ?>" );<?php } ?>
		});
		
		function mouseOverShow( name )
		{
			$( "." + name + ".demo" ).mouseenter( function() {
				$(".demoinfo").hide();
				$( "." + name + ".demoinfo" ).fadeIn( 400 );
			} );
			$( "." + name + ".demo").mouseleave( function() {
				$( "." + name + ".demoinfo" ).fadeOut( 400 );
			} );
		}
		</script>
	</head>
	<body>
		<div class="container">
			<div class="innercont">
				<div class="leftcol">
					<div class="buttons">
					<div class="logo">
					<div class="daniel">
					Daniel
					</div>
					<div class="winkler">
					Winkler
					</div>
					</div>
						<div class="demos button">
						Demos
						</div><div class="buttonsep"></div>
						<div class="about button">
						About
						</div><div class="buttonsep"></div>
						<a href="/blog">
						<div class="blog button">
						Blog
						</div>
						</a>
					</div>
				</div>
				<div class="separator">
					<div class="topsep"></div>
					<div class="bottomsep"></div>
				</div>
				<div class="rightcol">
					<div class="contentframe">
						<div class="demos content">
							<h2>Demos</h2>
							<?php foreach( $demos as $demo ) { ?>
							<a href="/demos/<?php echo $demo; ?>">
								<div class="demo <?php echo $demo; ?>">
								<img src="/demos/<?php echo $demo; ?>/thumb.png"></img>
								</div>
							</a>
							<?php } ?>
							<div style="clear: both"></div>
							<div class="demoinfobox">
								<div class="demoinfo wikivis">
								<h2>Wiki Visualization</h2>
								<p>Shows a graphical representation of the links between Wikipedia articles.</p>
								<p>Type in the title of a Wikipedia article and press enter.</p>
								</div>
								<div class="demoinfo flocking">
								<h2>Flocking</h2>
								<p>A basic implementation of flocking, inspired by Craig Reynolds' classic Boids simulation. </p>
								</div>
								<div class="demoinfo treegen">
								<h2>Cherry Blossom</h2>
								<p>Renders a  tree waving in the wind using a recursive tree structure and a particle system.</p>
								</div>
								<div class="demoinfo dust">
								<h2>Dust</h2>
								<p>A simple particle system with mouse controls.</p>
								<p>Wave your mouse to push particles.<br />
									Click and hold to attract particles.<br />
									If you release the mouse and wait, particles will shoot out randomly.</p>
								</div>
							</div>
						</div>
						<div class="about content">
							<h2>About</h2>
							<p>My name is Daniel Winkler.</p>
							
							<p>I am interested in science, programming, and art.</p>
							
							<p>In 2008 I graduated from the Austin Waldorf High School. 
								I deferred enrollment at the University of Texas at Austin for a year, and worked as a programmer at 
								Genetic Art Design, working with a 3D CNC Mill. During this time I saved up enough money to travel across 
								Europe for a month.</p>
								
							<p>In the fall of 2009 I began college as a freshmen at UT majoring in Computer Science.
								In fall of 2010 I worked for Mine-Control creating interactive art for museums. In the spring of 2011 I returned to 
								UT, where I am currently enrolled.</p>
								
							<p>I currently do freelance web development.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-42955009-1', 'danwink.com');
		  ga('send', 'pageview');

		</script>
	</body>
</html>