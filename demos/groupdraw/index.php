<?php

function webPath()
{
	return "http://danwink.com" . folderPath();
}

function folderPath()
{
	return "/demos/groupdraw";
}

include_once "epi/Epi.php";
Epi::setPath( 'base', 'epi' );
Epi::setPath( 'view', 'views' );
Epi::init( 'route', 'database', 'template' );
EpiDatabase::employ('mysql','phyloaco_groupdraw','localhost','phyloaco_groupdr','SQ($&Xp={}2k');

getRoute()->get( '/', array( 'MainController', 'homePage' ) );
getRoute()->get( '/random', array( 'MainController', 'random' ) );
getRoute()->post( '/newImage', array( 'MainController', 'newImage' ) );
getRoute()->get( '/collage/(\d+)', array( 'MainController', 'collage' ) );
getRoute()->get( '/collageEdit/(\d+)/(\d+)-(\d+)', array( 'MainController', 'collageEdit' ) );
getRoute()->post( '/collageUpload/(\d+)/(\d+)-(\d+)', array( 'MainController', 'collageUpload' ) );
getRoute()->run();

class MainController
{
	static public function homePage()
	{
		$params = array();
		$params["collages"] = getDatabase()->all('SELECT * FROM collages');
		getTemplate()->display( 'home.php', $params );
	}
	
	static public function random()
	{
		$manyRows = getDatabase()->all('SELECT id FROM collages');
		getRoute()->redirect( folderPath() . '/collage/'.$manyRows[array_rand( $manyRows )]['id'] );
	}
	
	static public function newImage()
	{
		$now = time();
	
		if( !isset( $_POST['submit'] ) ) { getRoute()->redirect( folderPath() ); }
		if( $_FILES[$fieldname]['error'] != 0 ) { getRoute()->redirect( folderPath() ); }
		if( !@is_uploaded_file($_FILES['file']['tmp_name']) ) { getRoute()->redirect( folderPath() ); } 
		if( !@getimagesize($_FILES['file']['tmp_name']) ) { getRoute()->redirect( folderPath() ); }
		
		chdir( 'imgupload' );
		
		$nameondisk = $now . '-' . $_FILES['file']['name'];
		
		if( !@move_uploaded_file( $_FILES['file']['tmp_name'], $nameondisk ) ) { getRoute()->redirect( folderPath() ); }
		
		$dim = getimagesize( $nameondisk );
		
		getDatabase()->execute('INSERT INTO collages (name, time, width, height) VALUES (:name, :time, :width, :height)', 
								array(':name' => $nameondisk, ':time' => $now, ':width' => $dim[0], ':height' => $dim[1]));
		
		$row = getDatabase()->one( 'SELECT * FROM collages WHERE name=:name', array( ':name' => $nameondisk ) );
		
		getRoute()->redirect( folderPath() . '/collage/'.$row['id'] );
	}
	
	static public function collage( $id )
	{
		$params = array();
		
		$row = getDatabase()->one( 'SELECT * FROM collages WHERE id=:id', array( ':id' => $id ) );
		
		$params['filename'] = 'imgupload/' . $row['name'];
		$params['id'] = $id;
		
		$params['cells'] = array();
		
		for( $xx = 0; $xx < 6; $xx++ ) 
		{ 
			for( $yy = 0; $yy < 6; $yy++ ) 
			{ 
				if( file_exists( "imgupload/".$id.".".$xx.".".$yy.".png" ) ) 
				{
					array_push( $params['cells'], array( $xx, $yy ) );
				}
			}
		}
		
		getTemplate()->display( 'collage.php', $params );
	}
	
	static public function collageEdit( $id, $x, $y )
	{
		$name = $id . "." . $x . "." . $y . ".png";
		if( file_exists( 'imgupload/' . $name ) )
		{
			getRoute()->redirect( folderPath() . '/collage/'.$id );
		}
	
		$params = array();
		
		$row = getDatabase()->one( 'SELECT * FROM collages WHERE id=:id', array( ':id' => $id ) );
		
		$params['filename'] = 'imgupload/' . $row['name'];
		$params['id'] = $id;
		$params['x'] = $x;
		$params['y'] = $y;
		
		getTemplate()->display( 'collageEdit.php', $params );
	}
	
	static public function collageUpload( $id, $x, $y )
	{
		$name = $id . "." . $x . "." . $y . ".png";
		if( file_exists( 'imgupload/' . $name ) ) return;
		
		$initialData = file_get_contents('php://input');
		$filteredData=substr($initialData, strpos($initialData, ",")+1);

		// Need to decode before saving since the data we received is already base64 encoded
		$decodedData=base64_decode($filteredData);
		
		$fp = fopen( 'imgupload/' . $name, 'wb' );
		fwrite( $fp, $decodedData );
		fclose( $fp );
	}
}