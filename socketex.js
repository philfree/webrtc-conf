var app = require('http').Server()
  , io = require('socket.io').listen(app);
  app.listen(4000);

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
socket.emit('connect','connectiontest');
 socket.on('message', function(message) {
      console.dir('<<<<<<<<check>>>>>>'+message);
        socket.broadcast.emit('message', message);
    });
 socket.on('chatmsg',function(msg){
   socket.broadcast.emit('chatmsg', msg);
 });


});
