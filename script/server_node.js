/**
 * Created by Fábio on 15-07-2014.
 */
/**
 * Created by Fábio on 07-07-2014.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.send("hello");
});

io.on('connection', function(socket){
    console.log('new user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('message', function(msg){
        console.log('message: ' + msg);
        socket.broadcast.emit('message', msg);
		
    });
});

http.listen(3333, function(){
    console.log('listening on *:3333');
});