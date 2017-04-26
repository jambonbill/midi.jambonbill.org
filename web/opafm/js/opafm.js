// jambonbill opafm.js
// http://www.w3.org/TR/webmidi/#examples-of-web-midi-api-usage-in-javascript
$(function(){

	$.onMIDIInit=function(midi) {
        midiAccess = midi;

        var ins=$.midiInputs();
		var out=$.midiOutputs();

        for(var i in ins){
			var a=ins[i];
			var s=document.getElementById("midiInput");
		    var o=document.createElement("option");
		    o.value=a.id;
		    o.text=a.name;
		    s.add(o);
		}

        var detected=false;
		for(var i in out){
			var a=out[i];
			var s=document.getElementById("midiOutput");
		    var o=document.createElement("option");
		    o.value=a.id;
		    o.text=a.name;
		    s.add(o);
            if(/Arduino/.test(a.name)){
                detected=a.id;
            }
		}

        // Try to select the Arduino from the midi out list //
        if(detected){
            $('#midiOutput').val(detected);
        }
        // Auto Forward midi notes to the output

        $('.overlay').hide();
    }

    $.onMIDIReject=function(err) {
        console.error("The MIDI system failed to start.",err);
        alert("The MIDI system failed to start");
    }


    function noteOn(midinote){

        for(var i in _notes)
            if(_notes[i]==midinote)return;//dont play it twice

        //console.info('noteOn(midinote)');
        var chan=+$('select#midiChannel').val();
        var portId=$('select#midiOutput').val();
        var noteOnMessage = [0x90+chan, midinote, 0x7f];    // note on, middle C, full velocity
        var output = midiAccess.outputs.get(portId);
        output.send( noteOnMessage );
        _notes.push(midinote);
    }

    function noteOff(midinote){
        //console.info('noteOff(midinote)');
        var chan=+$('select#midiChannel').val();
        var portId=$('select#midiOutput').val();
        var output = midiAccess.outputs.get(portId);
        output.send( [0x80+chan, midinote, 0x40]);// note off
        var nn=[];//new note buffer
        for(var i in _notes){
            if(_notes[i]!=midinote)nn.push(_notes[i]);
        }
        _notes=nn;
    }

    // Send control change
    var sendMidiCC=function(chan,ccNumber,value)
    {
        if(chan<0||chan>16){
            return false;
        }

        var portId=$('select#midiOutput').val();
        var output=midiAccess.outputs.get(portId);
        if (!output) {
            console.error('!output');
            return false;
        }
        output.send( [0xB0+chan, +ccNumber, +value] );
        console.info('sendMidiCC',+chan,+ccNumber,+value);
        return true;
    }





    // Keyboard //
    var _notes=[];
    var _octave=2;
    $("body").keydown(function(e) {
        //console.log(e.target,e.target.type);
        if (["INPUT","SELECT","TEXTAREA"].indexOf(e.target.nodeName) !== -1){
          if(e.target.type!='range')return;
        }
        var n=$.keyCodeToMidiNote(e.keyCode);
        if(typeof(n)!='number')return;
        noteOn(n+(_octave*12));
    });

    $("body").keyup(function(e) {
        if (["INPUT","SELECT","TEXTAREA"].indexOf(e.target.nodeName) !== -1) {
            if(e.target.type!='range')return;
        }
        var n=$.keyCodeToMidiNote(e.keyCode);
        if(typeof(n)!='number')return;
        noteOff(n+(_octave*12));
    });

	$('button.algorithm').click(function(e){
		//console.log(e.currentTarget.dataset.id);
		selectAlgorithm(e.currentTarget.dataset.id);
	});

	function selectAlgorithm(n){
		console.info('selectAlgorithm(n)',n);
		$("button.algorithm").find("[data-id='"+n+"']").removeClass('active');
		$("button.algorithm").find("[data-id='"+n+"']").addClass('active');
        sendMidiCC(+$('select#midiChannel').val(),8,n);
	}

	$('input').change(function(e){
		var val=e.currentTarget.value;
		//var nam=e.currentTarget.name;
		var CC=e.currentTarget.dataset.cc;
		console.info('CC='+CC,"value="+val);
        sendMidiCC(+$('select#midiChannel').val(),CC,val);
	});

	$('#btnOpen').click(function(){
		console.info('btnOpen');
	});

	$('#btnSave').click(function(){
		console.info('btnSave');
	});

	$('#btnTest').click(function(){
		console.info('btnTest');
	});


	console.info("opafm.js");
});