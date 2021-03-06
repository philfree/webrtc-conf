var videos = [];
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;

function getNumPerRow() {
  var len = videos.length;
  var biggest;

  // Ensure length is even for better division.
  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}

function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i = 0, len = videos.length; i < len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }
}

function setWH(video, i) {
  var perRow = getNumPerRow();
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 260) / perColumn);
  video.width = width;
  video.height = height;
  video.style.position = "absolute";
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";
  // var smallSideWidth=parseInt($('#videos').css('width').slice(0,-2));
  // var height=Math.floor(smallSideWidth*0.25*0.75);
  // var width=Math.floor(smallSideWidth*0.25);
  //console.log('test:-'+width+'height:-'+height);  
  //video.style.maxWidth='100%';
  //video.style.width = width;
  // video.style.height = 'auto';
  // video.style.position = "";
  // video.style.top='';
  //
  // video.style.left = '';
  // video.style.display = 'block';
 // video.style.right = '2px';
 // video.style.top = Math.floor(i* height)+ 2 + "px";
//video.setAttribute('style','max-width:90%;height:auto;display:block;');

}

function cloneVideo(domId, socketId) {
  var video = document.getElementById(domId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId;
  document.getElementById('videos').appendChild(clone);
  //document.getElementById('smallScreenVideos').appendChild(clone);
  videos.push(clone);
  return clone;
}

function removeVideo(socketId) {  
  var video = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(video), 1);
    video.parentNode.removeChild(video);
    //console.log(video.src.toString());
    // if(video.src.toString()===document.getElementById('remote-large').src.toString()){ //need to be change the condition

    //   $('#remote-large').attr('src',$('#you').attr('src'));
    // }
      //subdivideVideos();
  }
}
//Message Chat
// function addToChat(msg, color) {
//   var messages = document.getElementById('messages');
//   msg = sanitize(msg);
//   if(color) {
//     msg = '<span style="color: ' + color + '; padding-left: 15px">' + msg + '</span>';
//   } else {
//     msg = '<strong style="padding-left: 15px">' + msg + '</strong>';
//   }
//   messages.innerHTML = messages.innerHTML + msg + '<br>';
//   messages.scrollTop = 10000;
// }

// function sanitize(msg) {
//   return msg.replace(/</g, '&lt;');
// }

//check afterwards
// function initFullScreen() {
//   var button = document.getElementById("fullscreen");
//   button.addEventListener('click', function(event) {
//     var elem = document.getElementById("videos");
//     //show full screen
//     elem.webkitRequestFullScreen();
//   });
// }

function initNewRoom() {
  var button = document.getElementById("newRoom");

  button.addEventListener('click', function(event) {
    newRoomLogic();
    
    
  });
}
function newRoomLogic(){

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }

    window.location.hash = randomstring;
    location.reload();
}

//chat

// var websocketChat = {
//   send: function(message) {
//     rtc._socket.send(message);
//   },
//   recv: function(message) {
//     return message;
//   },
//   event: 'receive_chat_msg'
// };

// var dataChannelChat = {
//   send: function(message) {
//     for(var connection in rtc.dataChannels) {
//       var channel = rtc.dataChannels[connection];
//       channel.send(message);
//     }
//   },
//   recv: function(channel, message) {
//     return JSON.parse(message).data;
//   },
//   event: 'data stream data'
// };

// function initChat() {
//   var chat;

//   if(rtc.dataChannelSupport) {
//     console.log('initializing data channel chat');
//     chat = dataChannelChat;
//   } else {
//     console.log('initializing websocket chat');
//     chat = websocketChat;
//   }

//   var input = document.getElementById("chatinput");
//   var toggleHideShow = document.getElementById("hideShowMessages");
//   var room = window.location.hash.slice(1);
//   var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

//   toggleHideShow.addEventListener('click', function() {
//     var element = document.getElementById("messages");

//     if(element.style.display === "block") {
//       element.style.display = "none";
//     }
//     else {
//       element.style.display = "block";
//     }

//   });

//   input.addEventListener('keydown', function(event) {
//     var key = event.which || event.keyCode;
//     if(key === 13) {
//       chat.send(JSON.stringify({
//         "eventName": "chat_msg",
//         "data": {
//           "messages": input.value,
//           "room": room,
//           "color": color
//         }
//       }));
//       addToChat(input.value);
//       input.value = "";
//     }
//   }, false);
//   rtc.on(chat.event, function() {
//     var data = chat.recv.apply(this, arguments);
//     console.log(data.color);
//     addToChat(data.messages, data.color.toString(16));
//   });
// }
//end

function init() {
  if(PeerConnection) {
    rtc.createStream({
      "video": {"mandatory": {}, "optional": []},
      "audio": true
    }, function(stream) {
      var you=document.getElementById('you');
        
        //var dim=Math.floor(window.innerHeight/4); 
        // you.style.maxWidth = '90%';
        // you.style.height = 'auto';
        you.src = URL.createObjectURL(stream);
        you.muted=true;
        you.play();
       // largeVideo(you); //To avoid noise
      //videos.push(document.getElementById('you'));
      //rtc.attachStream(stream, 'you');
      //subdivideVideos();
    });
  } else {
    alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
  }
  //Has to be changed
   if(!window.location.hash){
     newRoomLogic();
  }

  var room = window.location.hash.slice(1);

  $('#roomInfo span.room').append(room);
  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
    var clone = cloneVideo('you', socketId);
    document.getElementById(clone.id).setAttribute("class", "remote");
    rtc.attachStream(stream, clone.id);
    subdivideVideos();
   // largeVideo(clone); //To avoid noice

    // document.querySelectorAll('#smallScreenVideos .remote').onclick=function(){
    //   console.log('remote onclick');
    //   if(document.querySelector('#largeScreenVideo .remote')){
    //     var remoteLargeVideo=document.querySelector('#largeScreenVideo .remote');
    //     document.getElementById('smallScreenVideos').appendChild(remoteLargeVideo);
    //     videos.push(remoteLargeVideo);
    //     remoteLargeVideo.parentNode.removeChild(remoteLargeVideo);
    //   }
    //   var video = this;
    //     if(video) {
    //       videos.splice(videos.indexOf(video), 1);
    //       video.parentNode.removeChild(video);
    //       video.style.position='';
    //       video.style.top='';
    //       video.width='';
    //       video.height='';
    //       video.style.width='74%';
    //       video.style.height='100%';
    //       document.getElementById('largeScreenVideo').appendChild(video);
    //       video.play();
    //     }
    //  subdivideVideos();
          
    // };
    // $('#smallScreenVideos video[id^="remote"]').click(function(e){
     
    //   if($('#largeScreenVideo video[id^="remote"]').length){
    //     var remoteLargeVideo=$('#largeScreenVideo video[id^="remote"]');

    //     $('#smallScreenVideos').append(remoteLargeVideo);
        
    //     videos.push(remoteLargeVideo);
    //     $(remoteLargeVideo).parent().remove(remoteLargeVideo);
    //   }
    //   alert(this.id);
    //   var video = this;
    //     if(video) {
    //       videos.splice(videos.indexOf(video), 1);
          
    //       $(video).css({'position':'','top':'','width':'74%','height':'100%'});
         
    //       $(video).attr({'width':'','height':''});

    //       $('#largeScreenVideo').append(video);
          
          
    //       $(video).get(0).play();
    //       $(this).remove();
    //     }
    //  subdivideVideos();    
    // });
  // $('#smallScreenVideos video[id^="remote"]').click(function(){
  //     console.log('remote onclick');
  //     largeVideo(this);
  //     });
  });
  rtc.on('disconnect stream', function(data) {
    console.log('remove ' + data);
    removeVideo(data);
  });
 // initFullScreen();
  initNewRoom();
  //initChat();
}

//   $(document).ready(function(){

//   $('.remote').on('click',function(){
//     alert('tes');
//     // var large=document.getElementById('remote-large');
//     // large.src=this.src;
//     // large.style.display='block';
//     // this.style.visibility='hidden';
//   });
// });

//Displaying large video onclick
// $('#you').click(function(){
//   largeVideo(this);
// });
// function largeVideo(current){
//       $('#remote-large').attr('src',$(current).attr('src'));
//       $('#remote-large').css({'display':'block','max-width':'95%','height':'auto','border':'0.4em solid #eeeeee'});
// }
//end

window.onresize = function(event) {
  subdivideVideos();
};