<?php
//controls//

/*
 0C/b) F0 00 00 7E 4B <device-number> 0C 08 F7
        All notes/sequences off

 0C/c) F0 00 00 7E 4B <device-number> 0C 09 [<ins>] F7
        Plays the current patch (C-3 with max velocity is played, can be used 
        to test the patch independent of the MIDI channel)

 0F/a) F0 00 00 7E 4B <device number> 0F F7
        Ping (just sends back the same SysEx string + <sids>)
 */
$htm="<textarea class='form-control' placeholder='Sysex in' rows=10 id=inputSyx></textarea>";
$htm.="Midi Output(s)<br />";
$htm.="<select class='form-control' id=midi_outputs></select>";

$btns=[];
$btns[]="<a href=# class='btn btn-default' id=btnPing>ping</a> ";
$btns[]="<a href=# class='btn btn-default' id=btnPlay>play</a> ";
$btns[]="<a href=# class='btn btn-default' id=btnStop>stop</a> ";
$btns[]="<a href=# class='btn btn-default' id=btnReq1>patch dump request</a> ";
$btns[]="<a href=# class='btn btn-default' id=btnReq2>current patch request</a> ";

$box=new LTE\Box;
$box->title("Controls");
$box->icon("fa fa-list");
$box->id("boxControls");
$box->collapsable(true);
$box->body($htm);
$box->footer($btns);
echo $box;
