var app=require('express')(),
    server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  server.listen(4000);




app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/testsocket.js', function(req, res) {
  res.sendfile(__dirname + '/testsocket.js');
});



var room;
io.sockets.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  // socket.on('create or join', function (room) {
  //   			var numClients = io.sockets.clients(room).length;

  //               console.log('Room ' + room + ' has ' + numClients + ' client(s)');
  //               console.log('Request to create or join room', room);

  //               if (numClients == 0){
  //                       socket.join(room);
  //                       socket.emit('created', room);
  //               } else if (numClients == 1) {
  //                       io.sockets.in(room).emit('join', room); //need to be understand
  //                       socket.join(room);
  //                       socket.emit('joined', room);
  //               } 
  // });
  // socket.on('test',function(test){
  // 	console.log('problem>>>>>>>');
  // 	socket.broadcast.emit('test', test);
  // });
  //  socket.on('offer',function(offer){
  // 	socket.broadcast.emit('offer', offer);
  // });
  //socket.emit('connect','connectiontest');
  socket.on('join',function(val,fn){
    socket.join(val);
    room=val;
    fn('You joined the room:- '+val+' '+'socket id:-'+socket.id);
    socket.broadcast.to(val).emit('join_info_all','New member has joined group');
    //io.sockets.in(val).emit('event_name', data)
  });
 socket.on('message', function(message) {
      console.dir('<<<<<<<<check>>>>>>'+message);
        socket.broadcast.to(room).emit('message', message);
    });
 socket.on('chatmsg',function(msg){
   socket.broadcast.to(room).emit('chatmsg', msg);
 });


});
