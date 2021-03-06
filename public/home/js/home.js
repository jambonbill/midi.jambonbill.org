$(function(){

	'use strict';

	let _midiAccess=null;  // the MIDIAccess object.
	let _midiChannel=0;
	let _midiInputs;
	let _midiOutputs;
	let _midiReady=false;

	if (navigator.requestMIDIAccess){
        navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
    }else{
        console.warn("No MIDI support present in your browser");
    }

    function onMIDIInit(midi) {
        //console.log('onMIDIInit(midi)',midi);
        _midiAccess = midi;

        //var haveAtLeastOneDevice=false;
        //var inputs=_midiAccess.inputs.values();
        //var outputs=_midiAccess.outputs.values();

    	listInputs();
        listOutputs();

        function listInputs(){
            _midiInputs=[];
            let inputs=midi.inputs.values();
            for ( let input = inputs.next(); input && !input.done; input = inputs.next()) {
            	//console.log(input.value);
                _midiInputs.push(input.value);
            }
            return true;
        }

        function listOutputs(){
            _midiOutputs=[];
            let outputs=midi.outputs.values();
            for ( let output = outputs.next(); output && !output.done; output = outputs.next()) {
                _midiOutputs.push(output.value);
            }
            return true;
        }

        if (!_midiInputs.length){
            console.warn("No MIDI input devices present.");
        }else{
            console.info('MIDI ready');
            _midiReady=true;
            displayInputs();
    		displayOutputs();
        }

        midi.onstatechange=function(d){
            if(!_midiReady)return false;
            let p=d.port;
            console.info(p.type, p.name, p.connection);
            //console.log("onstatechange d",d.port);
            listInputs();
            listOutputs();
            displayInputs();
    		displayOutputs();
        };
    }


    function onMIDIReject(err) {
        console.error("MIDI system failed to start.");
    }

    function displayInputs(){
		//console.info('displayInputs()');
		let htm='<table class="table table-sm table-hover" style="cursor:pointer">';
		htm+='<thead>';
		htm+='<th>#</th>';
		htm+='<th>Name</th>';
		//htm+='<th>Manufacturer</th>';
		htm+='<th></th>';
		htm+='</thead>';

		htm+='<tbody>';
		var ins=_midiInputs;
		for(let i in ins){
			var o=ins[i];
			//console.log(o);
			htm+='<tr title="'+o.id+'">';
			htm+='<td><i class="text-muted">'+i;
			htm+='<td>'+o.name;
			htm+=' <i class="text-muted">'+o.manufacturer+'</i>';
			htm+='<td style="text-align:right"><i class="text-muted">'+o.state;
		}
		htm+='</tbody>';

		if(ins.length==0){
			htm='<pre>none</pre>';
		}

		$('#boxInputs .card-body').html(htm);
		$('#boxInputs table').tablesorter();
		$('#boxInputs .overlay').hide();
    }

    function displayOutputs(){
    	//console.info('displayOutputs()');
		let htm='<table class="table table-sm table-hover" style="cursor:pointer">';
		htm+='<thead>';
		htm+='<th>#</th>';
		htm+='<th>Name</th>';
		//htm+='<th>Manufacturer</th>';
		htm+='<th></th>';
		htm+='</thead>';

		htm+='<tbody>';

		for(let i in _midiOutputs){
			let o=_midiOutputs[i];
			//console.log(o);
			htm+='<tr title="'+o.id+'">';
			htm+='<td><i class="text-muted">'+i;
			htm+='<td>'+o.name;
			htm+=' <i class="text-muted">'+o.manufacturer+'</i>';
			htm+='<td style="text-align:right"><i class="text-muted">'+o.state;
		}
		htm+='</tbody>';
		if(_midiOutputs.length==0){
			htm='<pre>none</pre>';
		}
		$('#boxOutputs .card-body').html(htm);
		$('#boxOutputs .overlay').hide();
		$('#boxOutputs table').tablesorter();
    }


    window.refresh=function(){
    	displayInputs();
    	displayOutputs();
    };

    console.log('home.js', _midiAccess);
});