<?php

$box=new LTE\Box;
$box->title("File");
$box->icon("fa fa-file-o");
$box->id("boxFile");
$box->collapsable(1);
//$box->collapsed(1);
$box->body('<input type="file" id="loadFromJSON" accept="application/x-midi">');
echo $box;
?>
<script>
$('#loadFromJSON').change(function(evt) {

	//console.log('loadFromJSON.change');
	
	evt.stopPropagation();
	evt.preventDefault();
	
	var file = evt.target.files[0];
	var reader = new FileReader();
	//fetch.overrideMimeType("text/plain; charset=x-user-defined");
	var data = false;
	
	reader.onload = (function(theFile) {
		return function(e) {

			data = e.target.result;
			if (!data){
				console.warn('!data');
				return;	
			}

			var t = data;
			var ff = [];
			var mx = t.length;
			var scc= String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			
			
			midiFile = MidiFile(ff.join(""));
			showTracks();
		}
	})(file);

	//https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
	
	//reader.readAsText(file);
	//reader.readAsDataURL(file);
	reader.readAsBinaryString(file);
});
</script>