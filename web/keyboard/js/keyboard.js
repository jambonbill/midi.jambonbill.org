// jambonbill midi.js  - keyboard
// http://www.w3.org/TR/webmidi/#examples-of-web-midi-api-usage-in-javascript

function displayKeyMap()
{
    console.log('displayKeyMap()');
    var htm=[];
    htm.push('<table class="table table-condensed">');
    htm.push('<thead>');
    htm.push('<th>Key</th>');
    htm.push('<th>Note</th>');
    htm.push('<th>Value</th>');
    htm.push('</thead>');
    htm.push('<tbody>');
    for (var i=0;i<kmap.length;i++) {
        if(!kmap[i])continue;
        var n=keyCodeToMidiNote(i);
        htm.push("<tr>")
        htm.push("<td>"+i);
        htm.push("<td>"+notestr[n]);
        htm.push("<td>"+n);
    }
    htm.push('</tbody>');
    htm.push('</table>');
    $('#boxLog .box-body').html(htm.join(''));
}


$(function(){
	
	//var context=null;   // the Web Audio "context" object
	//var midiAccess=null;  // the MIDIAccess object.
	var _midiChannel=0;
	var _portId='';
	
	var _octave=3;
	var _prg=0;//current prg
	var _notes=[];// note buffer (being played)
	var _notestr=['C-','C#','D-','D#','E-','F-','F#','G-','G#','A-','A#','B-'];
	var kmap=[];// Keyboard mapping
	// QWERTY //
	kmap[90]='0';// Z - Octave 1
	kmap[83]=1;// S
	kmap[88]=2;// X
	kmap[68]=3;// D
	kmap[67]=4;// C
	kmap[86]=5;// V
	kmap[71]=6;// G
	kmap[66]=7;// B
	kmap[72]=8;// H
	kmap[78]=9;// N
	kmap[74]=10;// J
	kmap[77]=11;// M
	kmap[188]=12;// <
	kmap[190]=14;// <
	
	kmap[81]=12;// Q - Octave 2
	kmap[50]=13;// 2 - Octave 2
	kmap[87]=14;// W - Octave 2
	kmap[51]=15;// 3 - Octave 2
	kmap[69]=16;// E - Octave 2
	kmap[82]=17;// R - Octave 2
	kmap[53]=18;// 5 - Octave 2
	kmap[84]=19;// T - Octave 2
	kmap[54]=20;// 6 - Octave 2
	kmap[89]=21;// Y - Octave 2
	kmap[55]=22;// 7 - Octave 2
	kmap[85]=23;// U - Octave 2
	kmap[73]=24;// I - Octave 3
	kmap[57]=25;// 9 - Octave 3
	kmap[79]=26;// O - Octave 3
	kmap[48]=27;// 0 - Octave 3
	kmap[80]=28;// P - Octave 3
	kmap[219]=29;//
	kmap[221]=31;//
	
	function keyCodeToMidiNote(keyCode)
	{
		var n=kmap[keyCode];
		if (n) return +n;	
	}



	function setPortId(id){
		
		console.info('setPortId()',id);	    
		_portId=id;
	}


	function prgChange(n,midiChannel){

		if(!n){
			console.warn('!n');
			return;
		}
		
		var output = midiAccess.outputs.get(_portId);
		var msg = [0xc0+midiChannel, n];
		output.send( msg );
		_prg=n;
	}

	function midiNoteToString(n){
	    var note=n%12;
	    var notes=['C-','C#','D-','D#','E-','F-','F#','G-','G#','A-','A#','B-'];
	    var oct=Math.floor(n/12);
	    return notes[note]+oct;
	}

	function noteOn(noteNumber,midiChannel)
	{
		
		if(!_portId){
			console.warn('noteOn() !portId');
			return;
		}
		
		if(!noteNumber){
			console.warn('noteOn() !noteNumber');
			return;	
		}
		
		for(var i=0;i<_notes.length;i++){
			if(_notes[i]==noteNumber){
				//console.warn("Already playing !");
				return;//dont play it twice
			}
		}
		
		console.log('noteOn() '+midiNoteToString(noteNumber), noteNumber, _midiChannel);
		
		var noteOnMessage = [0x90+midiChannel, noteNumber, 0x7f];    // note on, middle C, full velocity
		var output = midiAccess.outputs.get(_portId);
		output.send( noteOnMessage );
		_notes.push(noteNumber);
	}

	
	function noteOff(noteNumber,midiChannel)
	{
		
		if(!_portId){
			console.warn('!_portId');
			return;
		}
		
		if(!_portId||!noteNumber){
			console.warn(!_portId||!noteNumber);
			return;
		}
		
		//console.log('noteOff()',noteNumber,midiChannel);
		
		//var midiChan=+$('#midiChannel').val();
		var output = midiAccess.outputs.get(_portId);
		
		// note off
		output.send( [0x80+midiChannel, noteNumber, 0x40]);

		// remove from the note buffer
		var nn=[];
		for(var i=0;i<_notes.length;i++){
			if(_notes[i]!=noteNumber)nn.push(_notes[i]);
		}
		_notes=nn;
	}
	
	
	/**
	 * Kill all notes on current channel
	 * @return {[type]} [description]
	 */
	function midiPanic(midiChannel)
	{
		console.info('midiPanic()');
		_notes=[];
		for (var i=0;i<128;i++) {
			noteOff(i,+midiChannel);
		}
	}

	 
	
    
    function setOctave(n){
    	_octave=+n;
        console.info("Octave "+_octave);
        $("#octave").val(_octave);
    }

	$("#octave").change(function(e){
		setOctave(+$("#octave").val());
    });


    $('#btnMapping').click(function(){
        displayKeyMap();
    });


    // Keyboard //
	$("body").keydown(function(e) {
		
        if (!_portId) {
            $('#boxLog .box-body').html("<i class='fa fa-warning'></i> Select midi output");
            $('#midi_outputs').focus();
            return;
        }
		
        $('#keyname').val('test');
        $('#keycode').val(e.keyCode);
        
        var htm='Key:'+e.keyCode;
		
		
		if (kmap[e.keyCode]) {
			
			var n=keyCodeToMidiNote(e.keyCode);
			//console.log("n="+n);
			var nid=n%12;
			var oct=Math.floor(n/12);
			var midinote=n+(+_octave*12);
			noteOn(midinote,_midiChannel);

			htm=midiNoteToString(midinote) + " midinote("+midinote+") on channel "+_midiChannel;
            $('#boxLog .box-body').html(htm); 
		
		} else {
			
            if (e.keyCode>=112&&e.keyCode<=115) {//F1234-Keys
                
                console.log("F"+e.keyCode);
                
                setOctave(e.keyCode-111);
                
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            
            switch(e.keyCode){
                
                case 27://ESC
                    midiPanic();
                    break;
                
                default:
                	console.warn("Key:"+e.keyCode+" not mapped !");
                	break;
            }
		}
		
	});


	
    
    function selectMidiChannel(n){
    	_midiChannel=+n;
    	console.info('selectMidiChannel(n)',n);
    	
    }

	
	
    
    function init(){
		
		$("body").keyup(function(e) {
			
			
			var n=keyCodeToMidiNote(e.keyCode);
			noteOff(n+(_octave*12),_midiChannel);
		});
    

		// Midi channel selector //
	    $('ul>li').click(function(e){
	    	$('ul>li').removeClass("active");
	    	$(this).addClass("active");
	    	selectMidiChannel(e.currentTarget.dataset.channel);
	    });

    	$('#btnTest').click(function(){
		
			noteOn(60,_midiChannel);
			setTimeout(function(){
				noteOff(60,_midiChannel);
			},500);
		});
	
		$('#btnMidiPanic').click(function(){
			midiPanic(_midiChannel);
		});
	    
		$('#prgs').change(function(){
			console.info("$('#prgs').change");
			prgChange(+$('#prgs').val(),_midiChannel);
		});
    	
    	console.info('init()');

	    var ops=$.midiOutputs();
		for(var i in ops){
			var o=ops[i];
			var x = document.getElementById("midiOutput");
		    var option = document.createElement("option");
		    option.value = o.id;
		    option.text = o.name;
		    x.add(option);
		}	
		$('select#midiOutput').attr('disabled',false);
		$('select#octave').attr('disabled',false);
		$('select#prgs').attr('disabled',false);
		$('select#midiOutput').change(function(e){
			console.log(e.currentTarget.value);
			setPortId(e.currentTarget.value);
		});
    }
	
	setTimeout(init,500);
    //init();
});
