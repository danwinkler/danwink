#!/usr/bin/python3

import argparse
import os
import sys

#Parse command line
parser = argparse.ArgumentParser()
parser.add_argument( "name", help="The name of the new demo." )
args = parser.parse_args()
name = args.name

#Set up folder/file paths
template_folder = os.path.join( "demos", "_template" )
template_js = os.path.join( template_folder, "template.js" )
template_css = os.path.join( template_folder, "template.css" )

html_file = os.path.join( "_demos", args.name + ".html" )
demo_folder = os.path.join( "demos", name )
readme_file = os.path.join( demo_folder, "README.md" )
js_file = os.path.join( demo_folder, name + ".js" )
css_file = os.path.join( demo_folder, name + ".css" )

#Make sure demo doesn't already exist
if any([os.path.isfile(f) for f in [html_file, readme_file, js_file, css_file]]) or os.path.exists( demo_folder ):
    print( "Demo '{}' already exists.".format( name ) )
    sys.exit(0)

#Template for html file
html_template = """---
layout: project
title:  "%s"
categories: projects
description: Add description here.
---

<canvas id="canvas"></canvas>

<script src="%s.js"></script>
<script>
$(function() {
    begin();
});
</script>""" % ( name.capitalize(), name )

#Create demo files and copy contents from template
print( "Creating demo", name )
print( "Writing", html_file )
with open( html_file, 'w' ) as f:
    f.write( html_template )

os.mkdir( demo_folder )

print( "Writing", readme_file )
with open( readme_file, 'w' ) as f:
    f.write( "" )

print( "Writing", js_file )
with open( template_js ) as fin:
    with open( js_file, 'w' ) as fout:
        fout.write( fin.read() )

print( "Writing", css_file )
with open( template_css ) as fin:
    with open( css_file, 'w' ) as fout:
        fout.write( fin.read() )

print( "Finished!" )
