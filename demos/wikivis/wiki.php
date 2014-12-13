<?php
echo file_get_contents( "http://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=500&format=json&titles=" . $_GET['name'] );