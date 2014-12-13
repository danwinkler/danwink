<!DOCTYPE html>
<html>
	<head>
		<title>GroupDraw - New Image</title>
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/css/bootstrap.min.css">
	</head>
	<body>
		<div class="container">
			<div class="row" style="text-align: center">
				<h1>GroupDraw - A collaborative drawing App</h1>
			</div>
			<div class="row">
				<div class="col-6 col-lg-6" style="text-align: center">
					<p>Upload a file to start a new collage</p>
				</div>
				<div class="col-6 col-lg-6">
					<form id="upload" action="<?php echo webPath(); ?>/newImage" enctype="multipart/form-data" method="post">
						<input type="hidden" name="MAX_FILE_SIZE" value="1000000"/>
						<div class="form-group">
							<input id="file" type="file" name="file"/>
						</div>
						<input id="submit" type="submit" name="submit" value="Upload"/> 
					</form>
				</div>
			</div>
			<div class="row" style="text-align: center">
				<h3>OR</h3>
			</div>
			<div class="row" style="text-align: center">
				<a href="<?php echo webPath()?>/random">View/Edit a random collage</a>
			</div>
			<div class="row">
				<h2>Collages!</h2>
				<ul>
					<?php foreach( $collages as $row ) { ?>
						<li><a href="<?php echo webPath() . '/collage/' . $row['id']; ?>"><?php echo $row['name']; ?></a></li>
					<?php } ?>
				</ul>
			</div>
		</div>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0-rc1/js/bootstrap.min.js"></script>		<script>		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');		  ga('create', 'UA-42955009-1', 'danwink.com');		  ga('send', 'pageview');		</script>
	</body>
</html>