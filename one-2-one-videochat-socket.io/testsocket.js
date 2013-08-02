// var pc_config = webrtcDetectedBrowser === 'firefox' ?
//   {'iceServers':[{'url':'stun:23.21.150.121'}]} :  {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
var pc_config,RTCPeerConnection;
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");
var remoteVideo2=document.getElementById('remoteVideo2');
callButton.disabled=false;
hangupButton.disabled=true;
hangupButton.onclick=hang;
callButton.onclick=call;
var room=prompt('Enter Room No:-');
var localStream,remoteStream,peerConn,started=false;
var mediaConstraints = {'mandatory': {
  'OfferToReceiveAudio':true,
  'OfferToReceiveVideo':true }};
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 // var  RTCSessionDescription = RTCSessionDescription || webkitRTCSessionDescription || mozRTCSessionDescription;
 // var  RTCIceCandidate = RTCIceCandidate || webkitRTCIceCandidate || mozRTCIceCandidate;
 if(navigator.mozGetUserMedia){
  pc_config ={'iceServers':[{'url':'stun:23.21.150.121'}]};
  RTCPeerConnection=mozRTCPeerConnection;
  RTCSessionDescription=mozRTCSessionDescription;
  RTCIceCandidate=mozRTCIceCandidate;
 }
 else if(navigator.webkitGetUserMedia){
  pc_config ={'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
  RTCPeerConnection=webkitRTCPeerConnection;

 }
 //var room=prompt("Enter room number:-");
 var socket = io.connect('http://192.168.1.5:4000/');//hard coded ip
 var channelReady = false;
//chat part
var msgDisPt=document.getElementById("msgDisPt");
// var clientMsgButton = document.getElementById("clientMsgButton");// chat id
var clientMsgTxt = document.getElementById("clientMsgTxt");
clientMsgTxt.onkeypress=chat; // chat function
function chat(e){
  //For demo testing validation
  if(clientMsgTxt.value!='' && e.keyCode == 13){
     console.dir(socket);
     socket.emit('chatmsg',{'val':clientMsgTxt.value,'soc_id':socket.socket.sessionid}); 
     msgDisPt.innerHTML = msgDisPt.innerHTML + '<span>'+ socket.socket.sessionid +' :&nbsp;'+ clientMsgTxt.value +'</span><br/>';
     clientMsgTxt.value='';
  } 
}
socket.on('chatmsg',function(msg){

msgDisPt.innerHTML = msgDisPt.innerHTML + '<span>'+msg.soc_id+'&nbsp;'+ msg.val +'</span><br/>';
});
//end

socket.on('connect', onChannelOpened);

function onChannelOpened(evt) {
  console.log('connection established');
    channelReady = true;
}

socket.on('join_info_all',function(data){
  console.log(data);
});

if(room){
  socket.emit('join',room,function(data){ //Acknowledgement
    console.log(data);
  });
}

function iceCandidate(evt) {
  console.dir('test'+evt);
    if(evt.candidate){
      console.dir('test1'+evt);
      socket.emit('message', {type: "candidate", label: evt.candidate.sdpMLineIndex,id: evt.candidate.sdpMid,candidate: evt.candidate.candidate});//pass socket id here
    }
   
 //  socket.json.send({type: "candidate", evt.candidate});
  }

 function addStream(evt) {
    console.dir(evt.stream);
   // var rmvideoTest=document.createE
    //remoteVideoSection.innerHTML=;
    remoteVideo.src = window.URL.createObjectURL(evt.stream); //add socket id here
   // remoteVideo2.src = window.URL.createObjectURL(evt.stream);
  }

function createPeerConnection(){
  if(!started && localStream && channelReady ){
      console.log('check');
      started = true;
      peerConn=new RTCPeerConnection(pc_config);
      peerConn.onicecandidate =iceCandidate; 
      peerConn.onaddstream = addStream;
      peerConn.addStream(localStream);//yet to see
      peerConn.createOffer(setLocalAndSendMessage,errorCallback,mediaConstraints);//check
      callButton.disabled=true;
      hangupButton.disabled=false;
  } 
  
}

function call(){
  console.log('test');
  //if(!started)  
    createPeerConnection();
 
  // peerConn.createOffer(setLocalAndSendMessage,errorCallback,mediaConstraints);//check
  // callButton.disabled=true;
  // hangupButton.disabled=false;
}
function hang() {
  console.log('Hanging up.');
  stop();
  socket.emit('message','end');
  hangupButton.disabled=true;
  callButton.disabled=false;
}
function stop(){
  started=false;
  peerConn.close();
  peerConn=null;
}
function setLocalAndSendMessage(sessionDescription) {
  peerConn.setLocalDescription(sessionDescription);
  socket.emit('message',sessionDescription);//how it will execute
}
function errorCallback(evt){
  console.log("error in createoffer".evt);
}

socket.on('message', onMessage);

function onMessage(evt) {
  // if(evt=='got user media'){
  //  createPeerConnection();

  // }
  if (evt.type === 'offer') {
    if (!started) {
      console.log('test');
      createPeerConnection();
      started = true;
    }
    console.log('offer test');
    peerConn.setRemoteDescription(new RTCSessionDescription(evt));
    peerConn.createAnswer(setLocalAndSendMessage,errorCallback,mediaConstraints);
  } else if (evt.type === 'answer' && started) {
    console.log('answer test');
    peerConn.setRemoteDescription(new RTCSessionDescription(evt));//yet to understand
   
  } else if (evt.type === 'candidate' && started) {
    var candidate = new RTCIceCandidate({sdpMLineIndex:evt.label,candidate:evt.candidate});
    peerConn.addIceCandidate(candidate);
  }
  else if (evt === 'end' && started) {
    hang();
  }
}
function gotStream(stream){
  localStream=stream;
  localVideo.src=window.URL.createObjectURL(stream);
  //createPeerConnection();
  //socket.emit('message','got user media');
}
function gotError(evt){

console.log('Error'.evt);
}
navigator.getUserMedia({video:true,audio:true}, gotStream,gotError);

//  if(room!=''){
//    socket.emit('create or join', room);
//  }
//  socket.on('created',function(room){
//    console.log('room created');
//  });
//  socket.on('join', function (room){
//   console.log('Another peer made a request to join room ' + room);
//   console.log('This peer is the initiator of room ' + room + '!');
// });
//  socket.on('joined',function(room){
//    console.log('joined room');
//  });
// function gotError(error) {
//       console.log("navigator.getUserMedia error: ", error);
//     }
//  function gotStream(stream){
//     localVideo.src = window.URL.createObjectURL(stream);
//    localStream = stream;
//    console.log('testttttttYYYy');
//    socket.emit('test','test');
//  }
// socket.on('test',function(data){
//   try {
//     pc = new RTCPeerConnection(pc_config);
//     pc.onicecandidate = handleIceCandidate;
//  console.log('Created RTCPeerConnnection with:\n' +
//       '  config: \'' + JSON.stringify(pc_config) + '\';\n' + '\'.');
//   } catch (e) {
//     console.log('Failed to create PeerConnection, exception: ' + e.message);
//     alert('Cannot create RTCPeerConnection object.');
//       return;
//   }
//   pc.onaddstream = handleRemoteStreamAdded;
//   //pc.onremovestream = handleRemoteStreamRemoved;
//   pc.addStream(localStream);
//   pc.createOffer(setLocalAndSendMessage,null,sdpConstraints);

// });
// function handleIceCandidate(event){
//  var candidate = new RTCIceCandidate({sdpMLineIndex:event.candidate.sdpMLineIndex,candidate:event.candidate.candidate});
//     pc.addIceCandidate(candidate);
// }
// function handleRemoteStreamAdded(event){
//  remoteVideo.src = window.URL.createObjectURL(event.stream);
//  remoteStream = event.stream;
// }
// function setLocalAndSendMessage(sessionDescription) {
//   // Set Opus as the preferred codec in SDP if Opus is present.
//   pc.setLocalDescription(sessionDescription);
//   socket.emit('offer',sessionDescription);
  

// }
// socket.on('offer',function(data){
// pc.setRemoteDescription(new RTCSessionDescription(data));
// pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
// });

// function handleRemoteStreamRemoved(event) {
//   console.log('Remote stream removed. Event: ', event);
// }


 //navigator.getUserMedia({video:true,audio:true}, gotStream,gotError);